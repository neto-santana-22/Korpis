using backend.Domain.Entities;

namespace backend.Domain.Interfaces;

// Interface com os metodos de contrato para manipulacao da entidade Charge
public interface IChargeRepository
{
    // Lista todas as cobrancas com os dados do cliente associado
    Task<IEnumerable<Charge>> GetAllAsync();

    // Busca uma cobranca especifica pelo ID
    Task<Charge?> GetByIdAsync(Guid id);

    // Lista todas as cobrancas vinculadas a um cliente especifico
    Task<IEnumerable<Charge>> GetByClientIdAsync(Guid clientId);

    // Insere uma nova cobranca no banco
    Task AddAsync(Charge charge);

    // Atualiza os dados de uma cobranca
    Task UpdateAsync(Charge charge);

    // Remove uma cobranca pelo ID
    Task DeleteAsync(Guid id);
}