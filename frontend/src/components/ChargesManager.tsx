import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import type { Charge, Client, CreateChargeDto } from '../types';

export const ChargesManager: React.FC = () => {
    const [charges, setCharges] = useState<Charge[]>([]);
    const [clients, setClients] = useState<Client[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [selectedPix, setSelectedPix] = useState<string | null>(null);

    const [formData, setFormData] = useState<CreateChargeDto>({
        clientId: '',
        amount: 0,
        description: '',
        dueDate: new Date().toISOString().split('T')[0],
    });

    // Carrega clientes e cobrancas cadastradas no backend .NET 8
    const loadData = async () => {
        try {
            setLoading(true);
            const [chargesRes, clientsRes] = await Promise.all([
                api.get<Charge[]>('/charges'),
                api.get<Client[]>('/clients'),
            ]);
            setCharges(chargesRes.data);
            setClients(clientsRes.data);
            if (clientsRes.data.length > 0 && !formData.clientId) {
                setFormData((prev) => ({ ...prev, clientId: clientsRes.data[0].id }));
            }
        } catch (error) {
            console.error('Erro ao carregar dados de cobrancas:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    // Submete a geracao de nova cobranca via API
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await api.post<Charge>('/charges/generate', {
                ...formData,
                amount: Number(formData.amount),
                dueDate: new Date(formData.dueDate).toISOString(),
            });

            // Exibe a chave Pix gerada pelo MockPaymentService
            setSelectedPix(response.data.pixQrCode);
            setFormData({
                clientId: clients[0]?.id || '',
                amount: 0,
                description: '',
                dueDate: new Date().toISOString().split('T')[0],
            });
            await loadData();
        } catch (error) {
            console.error('Erro ao gerar cobranca:', error);
        }
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
            <h2>Geracao de Cobrancas (Pix / Boleto)</h2>

            {/* Formulario de Emissao */}
            <form onSubmit={handleSubmit} style={{ marginBottom: '30px', display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '400px' }}>
                <label>
                    Cliente:
                    <select
                        value={formData.clientId}
                        onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
                        style={{ width: '100%', padding: '8px', marginTop: '4px' }}
                        required
                    >
                        <option value="">Selecione um cliente</option>
                        {clients.map((client) => (
                            <option key={client.id} value={client.id}>
                                {client.name} ({client.document})
                            </option>
                        ))}
                    </select>
                </label>

                <label>
                    Valor (R$):
                    <input
                        type="number"
                        step="0.01"
                        value={formData.amount}
                        onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
                        style={{ width: '100%', padding: '8px', marginTop: '4px' }}
                        required
                    />
                </label>

                <label>
                    Descricao:
                    <input
                        type="text"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        style={{ width: '100%', padding: '8px', marginTop: '4px' }}
                        required
                    />
                </label>

                <label>
                    Data de Vencimento:
                    <input
                        type="date"
                        value={formData.dueDate}
                        onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                        style={{ width: '100%', padding: '8px', marginTop: '4px' }}
                        required
                    />
                </label>

                <button type="submit" style={{ padding: '10px', background: '#0066cc', color: '#fff', border: 'none', cursor: 'pointer' }}>
                    Gerar Cobranca Pix
                </button>
            </form>

            {/* Exibicao do Pix Copia e Cola gerado */}
            {selectedPix && (
                <div style={{ background: '#e6fffa', border: '1px solid #38b2ac', padding: '15px', marginBottom: '20px', borderRadius: '4px' }}>
                    <h3>Pix Gerado com Sucesso!</h3>
                    <p><strong>Codigo Pix Copia e Cola:</strong></p>
                    <textarea readOnly value={selectedPix} style={{ width: '100%', height: '60px' }} />
                    <button onClick={() => setSelectedPix(null)} style={{ marginTop: '10px' }}>Fechar</button>
                </div>
            )}

            {/* Tabela de Historico de Cobrancas */}
            <h3>Historico de Cobrancas</h3>
            {loading ? (
                <p>Carregando cobrancas...</p>
            ) : (
                <table border={1} cellPadding={8} cellSpacing={0} style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ background: '#f2f2f2' }}>
                            <th>ID Externo</th>
                            <th>Valor</th>
                            <th>Descricao</th>
                            <th>Vencimento</th>
                            <th>Status</th>
                            <th>Acoes</th>
                        </tr>
                    </thead>
                    <tbody>
                        {charges.map((charge) => (
                            <tr key={charge.id}>
                                <td><small>{charge.externalId}</small></td>
                                <td>R$ {charge.amount.toFixed(2)}</td>
                                <td>{charge.description}</td>
                                <td>{new Date(charge.dueDate).toLocaleDateString()}</td>
                                <td>{charge.status === 1 ? 'Pendente' : 'Pago'}</td>
                                <td>
                                    <button onClick={() => setSelectedPix(charge.pixQrCode)}>Ver Pix</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};