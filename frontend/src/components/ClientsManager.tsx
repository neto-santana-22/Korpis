import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import type { Client } from '../types';

export const ClientsManager: React.FC = () => {
    const [clients, setClients] = useState<Client[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [formData, setFormData] = useState({
        name: '',
        document: '',
        email: '',
        phone: '',
    });

    // Busca a lista de clientes no backend .NET 8
    const fetchClients = async () => {
        try {
            setLoading(true);
            const response = await api.get<Client[]>('/clients');
            setClients(response.data);
        } catch (error) {
            console.error('Erro ao buscar clientes:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchClients();
    }, []);

    // Trata a submissao do formulario de novo cliente
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/clients', formData);
            setFormData({ name: '', document: '', email: '', phone: '' });
            await fetchClients();
        } catch (error) {
            console.error('Erro ao cadastrar cliente:', error);
        }
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
            <h2>Gestao de Clientes</h2>

            {/* Formulario de Cadastro */}
            <form onSubmit={handleSubmit} style={{ marginBottom: '30px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <input
                    type="text"
                    placeholder="Nome"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                />
                <input
                    type="text"
                    placeholder="CPF/CNPJ"
                    value={formData.document}
                    onChange={(e) => setFormData({ ...formData, document: e.target.value })}
                    required
                />
                <input
                    type="email"
                    placeholder="E-mail"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                />
                <input
                    type="text"
                    placeholder="Telefone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                />
                <button type="submit">Cadastrar Cliente</button>
            </form>

            {/* Tabela de Listagem */}
            {loading ? (
                <p>Carregando clientes...</p>
            ) : (
                <table border={1} cellPadding={8} cellSpacing={0} style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ background: '#f2f2f2' }}>
                            <th>Nome</th>
                            <th>CPF/CNPJ</th>
                            <th>E-mail</th>
                            <th>Telefone</th>
                            <th>ID</th>
                        </tr>
                    </thead>
                    <tbody>
                        {clients.map((client) => (
                            <tr key={client.id}>
                                <td>{client.name}</td>
                                <td>{client.document}</td>
                                <td>{client.email}</td>
                                <td>{client.phone}</td>
                                <td><small>{client.id}</small></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};