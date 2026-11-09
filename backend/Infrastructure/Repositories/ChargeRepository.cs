using backend.Domain.Entities;
using backend.Domain.Interfaces;
using backend.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace backend.Infrastructure.Repositories
{
    // Implementacao do repositorio de cobrancas com Entity Framework Core
    public class ChargeRepository : IChargeRepository
    {
        private readonly AppDbContext _context;

        public ChargeRepository(AppDbContext context)
        {
            _context = context;
        }

        // Busca todas as cobrancas incluindo os dados do cliente associado
        public async Task<IEnumerable<Charge>> GetAllAsync()
        {
            return await _context.Charges
                .Include(c => c.Client)
                .ToListAsync();
        }

        // Busca uma cobranca especifica pelo seu ID unico
        public async Task<Charge?> GetByIdAsync(Guid id)
        {
            return await _context.Charges
                .Include(c => c.Client)
                .FirstOrDefaultAsync(c => c.Id == id);
        }

        // Adiciona e persiste uma nova cobranca no PostgreSQL
        public async Task AddAsync(Charge charge)
        {
            await _context.Charges.AddAsync(charge);
            await _context.SaveChangesAsync();
        }

        // Atualiza os dados de uma cobranca existente
        public async Task UpdateAsync(Charge charge)
        {
            _context.Charges.Update(charge);
            await _context.SaveChangesAsync();
        }
    }
}