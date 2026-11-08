using backend.Domain.Entities;

namespace backend.Domain.Interfaces;

// Interface que define os metodos de contrato para manipulacao de dados da entidade Client
public interface IClientRepository
{
    // Retorna todos os clientes cadastrados
    Task<IEnumerable<Client>> GetAllAsync();

    // Busca um cliente pelo ID
    Task<Client?> GetByIdAsync(Guid id);

    // Adiciona um novo cliente no banco
    Task AddAsync(Client client);

    // Atualiza os dados de um cliente existente
    Task UpdateAsync(Client client);

    // Remove um cliente do banco
    Task DeleteAsync(Guid id);
}