using backend.Domain.Entities;
using backend.Domain.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ClientsController : ControllerBase
{
    private readonly IClientRepository _clientRepository;

    // Injecao de dependencia da interface do repositorio
    public ClientsController(IClientRepository clientRepository)
    {
        _clientRepository = clientRepository;
    }

    // GET: api/clients - Listar todos os clientes
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var clients = await _clientRepository.GetAllAsync();
        return Ok(clients);
    }

    // GET: api/clients/{id} - Buscar cliente por ID
    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var client = await _clientRepository.GetByIdAsync(id);
        if (client == null)
            return NotFound(new { message = "Cliente nao encontrado." });

        return Ok(client);
    }

    // POST: api/clients - Cadastrar novo cliente
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] Client client)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        await _clientRepository.AddAsync(client);
        return CreatedAtAction(nameof(GetById), new { id = client.Id }, client);
    }

    // PUT: api/clients/{id} - Atualizar cliente existente
    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] Client client)
    {
        if (id != client.Id)
            return BadRequest(new { message = "O ID informado no caminho diverge do ID da entidade." });

        var existingClient = await _clientRepository.GetByIdAsync(id);
        if (existingClient == null)
            return NotFound(new { message = "Cliente nao encontrado." });

        await _clientRepository.UpdateAsync(client);
        return NoContent();
    }

    // DELETE: api/clients/{id} - Remover cliente
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var existingClient = await _clientRepository.GetByIdAsync(id);
        if (existingClient == null)
            return NotFound(new { message = "Cliente nao encontrado." });

        await _clientRepository.DeleteAsync(id);
        return NoContent();
    }
}