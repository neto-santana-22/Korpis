using backend.Domain.Entities;
using backend.Domain.Interfaces;
using backend.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace backend.Infrastructure.Repositories;

// Implementacao concreta do repositorio de clientes utilizando Entity Framework Core
public class ClientRepository : IClientRepository
{
    private readonly AppDbContext _context;

    // Injecao de dependencia do contexto de banco de dados
    public ClientRepository(AppDbContext context)
    {
        _context = context;
    }

    // Consulta todos os clientes incluindo a lista de cobrancas associadas
    public async Task<IEnumerable<Client>> GetAllAsync()
    {
        return await _context.Clients
            .Include(c => c.Charges)
            .AsNoTracking()
            .ToListAsync();
    }

    // Busca um cliente especifico pelo ID primario
    public async Task<Client?> GetByIdAsync(Guid id)
    {
        return await _context.Clients
            .Include(c => c.Charges)
            .FirstOrDefaultAsync(c => c.Id == id);
    }

    // Insere o registro de cliente na memoria do DbContext
    public async Task AddAsync(Client client)
    {
        await _context.Clients.AddAsync(client);
        await _context.SaveChangesAsync();
    }

    // Persiste as alteracoes de um cliente ja existente
    public async Task UpdateAsync(Client client)
    {
        _context.Clients.Update(client);
        await _context.SaveChangesAsync();
    }

    // Localiza e remove a entidade Client do banco de dados
    public async Task DeleteAsync(Guid id)
    {
        var client = await GetByIdAsync(id);
        if (client != null)
        {
            _context.Clients.Remove(client);
            await _context.SaveChangesAsync();
        }
    }
}