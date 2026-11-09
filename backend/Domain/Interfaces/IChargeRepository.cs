using backend.Domain.Entities;

namespace backend.Domain.Interfaces
{
    // Interface de repositorio para manipulacao de cobrancas
    public interface IChargeRepository
    {
        Task<IEnumerable<Charge>> GetAllAsync();
        Task<Charge?> GetByIdAsync(Guid id);
        Task AddAsync(Charge charge);
        Task UpdateAsync(Charge charge);
    }
}