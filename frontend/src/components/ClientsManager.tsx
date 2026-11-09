import React, { useState, useEffect, useMemo } from 'react';
import { api } from '../services/api';
import type { Client, CreateClientDto } from '../types';

export const ClientsManager: React.FC = () => {
    const [clients, setClients] = useState<Client[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    // Estado do Campo de Busca (Nome ou CPF/CNPJ)
    const [searchTerm, setSearchTerm] = useState<string>('');

    // Estado do Formulário de Cadastro
    const [formData, setFormData] = useState<CreateClientDto>({
        name: '',
        document: '',
        email: '',
        phone: '',
    });

    // Carrega lista de clientes
    const loadClients = async () => {
        try {
            setLoading(true);
            const response = await api.get<Client[]>('/clients');
            setClients(response.data);
        } catch (error) {
            console.error('Erro ao carregar clientes:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadClients();
    }, []);

    // Trata submissão do formulário
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/clients', formData);
            setFormData({ name: '', document: '', email: '', phone: '' });
            await loadClients();
        } catch (error) {
            console.error('Erro ao cadastrar cliente:', error);
        }
    };

    // Filtra clientes por nome ou documento em tempo real
    const filteredClients = useMemo(() => {
        const term = searchTerm.trim().toLowerCase();
        if (!term) return clients;

        return clients.filter(
            (client) =>
                client.name.toLowerCase().includes(term) ||
                client.document.toLowerCase().includes(term)
        );
    }, [clients, searchTerm]);

    return (
        <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
            <h2>Gestão de Clientes</h2>

            {/* Formulário de Cadastro */}
            <form onSubmit={handleSubmit} style={{ marginBottom: '30px', display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '400px' }}>
                <h3>Novo Cliente</h3>
                <input
                    type="text"
                    placeholder="Nome completo"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    style={{ padding: '8px' }}
                />
                <input
                    type="text"
                    placeholder="CPF ou CNPJ"
                    value={formData.document}
                    onChange={(e) => setFormData({ ...formData, document: e.target.value })}
                    required
                    style={{ padding: '8px' }}
                />
                <input
                    type="email"
                    placeholder="E-mail"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    style={{ padding: '8px' }}
                />
                <input
                    type="text"
                    placeholder="Telefone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                    style={{ padding: '8px' }}
                />
                <button type="submit" style={{ padding: '10px', background: '#28a745', color: '#fff', border: 'none', cursor: 'pointer' }}>
                    Cadastrar Cliente
                </button>
            </form>

            {/* Cabeçalho da Lista e Input de Busca */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <h3 style={{ margin: 0 }}>Clientes Cadastrados</h3>

                <input
                    type="text"
                    placeholder="Buscar por Nome ou CPF/CNPJ..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ padding: '6px 12px', width: '260px' }}
                />
            </div>

            {/* Tabela de Clientes */}
            {loading ? (
                <p>Carregando clientes...</p>
            ) : (
                <table border={1} cellPadding={8} cellSpacing={0} style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ background: '#f2f2f2' }}>
                            <th>Nome</th>
                            <th>CPF / CNPJ</th>
                            <th>E-mail</th>
                            <th>Telefone</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredClients.length === 0 ? (
                            <tr>
                                <td colSpan={4} style={{ textAlign: 'center', color: '#666' }}>Nenhum cliente encontrado.</td>
                            </tr>
                        ) : (
                            filteredClients.map((client) => (
                                <tr key={client.id}>
                                    <td>{client.name}</td>
                                    <td>{client.document}</td>
                                    <td>{client.email}</td>
                                    <td>{client.phone}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            )}
        </div>
    );
};