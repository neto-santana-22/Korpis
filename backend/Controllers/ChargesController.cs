using backend.Domain.DTOs;
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
    private readonly IPaymentService _paymentService;

    // Injecao de dependencia dos repositorios e do servico de pagamentos
    public ChargesController(
        IChargeRepository chargeRepository,
        IClientRepository clientRepository,
        IPaymentService paymentService)
    {
        _chargeRepository = chargeRepository;
        _clientRepository = clientRepository;
        _paymentService = paymentService;
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

    // POST: api/charges/generate - Gerar nova cobranca com integracao Pix/Boleto
    [HttpPost("generate")]
    public async Task<IActionResult> GeneratePayment([FromBody] CreateChargeDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        // Valida a existencia do cliente
        var client = await _clientRepository.GetByIdAsync(dto.ClientId);
        if (client == null)
            return BadRequest(new { message = "O Cliente informado para a cobranca nao existe." });

        // Chama o servico de pagamento para gerar o QR Code Pix e dados externos
        var charge = await _paymentService.GeneratePaymentAsync(client, dto);

        // Persiste a nova cobranca no banco de dados PostgreSQL
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