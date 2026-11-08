using backend.Domain.Entities;
using backend.Domain.Interfaces;
using backend.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace backend.Infrastructure.Repositories;

// Implementacao concreta do repositorio de cobrancas utilizando Entity Framework Core
public class ChargeRepository : IChargeRepository
{
    private readonly AppDbContext _context;

    public ChargeRepository(AppDbContext context)
    {
        _context = context;
    }

    // Retorna todas as cobrancas incluindo a entidade Client vinculada
    public async Task<IEnumerable<Charge>> GetAllAsync()
    {
        return await _context.Charges
            .Include(c => c.Client)
            .AsNoTracking()
            .ToListAsync();
    }

    // Busca uma cobranca especifica pelo ID primario incluindo dados do cliente
    public async Task<Charge?> GetByIdAsync(Guid id)
    {
        return await _context.Charges
            .Include(c => c.Client)
            .FirstOrDefaultAsync(c => c.Id == id);
    }

    // Retorna a lista de cobrancas de um determinado cliente
    public async Task<IEnumerable<Charge>> GetByClientIdAsync(Guid clientId)
    {
        return await _context.Charges
            .Where(c => c.ClientId == clientId)
            .AsNoTracking()
            .ToListAsync();
    }

    // Adiciona a cobranca ao DbContext e salva no PostgreSQL
    public async Task AddAsync(Charge charge)
    {
        await _context.Charges.AddAsync(charge);
        await _context.SaveChangesAsync();
    }

    // Persiste as alteracoes de status, valor ou datas da cobranca
    public async Task UpdateAsync(Charge charge)
    {
        _context.Charges.Update(charge);
        await _context.SaveChangesAsync();
    }

    // Remove o registro da cobranca do banco
    public async Task DeleteAsync(Guid id)
    {
        var charge = await GetByIdAsync(id);
        if (charge != null)
        {
            _context.Charges.Remove(charge);
            await _context.SaveChangesAsync();
        }
    }
}