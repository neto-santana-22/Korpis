using backend.Domain.Entities;
using backend.Domain.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ChargesController : ControllerBase
{
    private readonly IChargeRepository _chargeRepository;
    private readonly IClientRepository _clientRepository;

    public ChargesController(IChargeRepository chargeRepository, IClientRepository clientRepository)
    {
        _chargeRepository = chargeRepository;
        _clientRepository = clientRepository;
    }

    // GET: api/charges - Listar todas as cobrancas
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var charges = await _chargeRepository.GetAllAsync();
        return Ok(charges);
    }

    // GET: api/charges/{id} - Buscar cobranca por ID
    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var charge = await _chargeRepository.GetByIdAsync(id);
        if (charge == null)
            return NotFound(new { message = "Cobranca nao encontrada." });

        return Ok(charge);
    }

    // GET: api/charges/client/{clientId} - Listar cobrancas de um cliente
    [HttpGet("client/{clientId:guid}")]
    public async Task<IActionResult> GetByClientId(Guid clientId)
    {
        var charges = await _chargeRepository.GetByClientIdAsync(clientId);
        return Ok(charges);
    }

    // POST: api/charges - Criar nova cobranca
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] Charge charge)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        // Valida se o cliente informado realmente existe antes de vincular a cobranca
        var clientExists = await _clientRepository.GetByIdAsync(charge.ClientId);
        if (clientExists == null)
            return BadRequest(new { message = "O Cliente informado para a cobranca nao existe." });

        await _chargeRepository.AddAsync(charge);
        return CreatedAtAction(nameof(GetById), new { id = charge.Id }, charge);
    }

    // PUT: api/charges/{id} - Atualizar dados ou status da cobranca
    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] Charge charge)
    {
        if (id != charge.Id)
            return BadRequest(new { message = "O ID informado no caminho diverge do ID da entidade." });

        var existingCharge = await _chargeRepository.GetByIdAsync(id);
        if (existingCharge == null)
            return NotFound(new { message = "Cobranca nao encontrada." });

        await _chargeRepository.UpdateAsync(charge);
        return NoContent();
    }

    // DELETE: api/charges/{id} - Remover cobranca
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var existingCharge = await _chargeRepository.GetByIdAsync(id);
        if (existingCharge == null)
            return NotFound(new { message = "Cobranca nao encontrada." });

        await _chargeRepository.DeleteAsync(id);
        return NoContent();
    }
}