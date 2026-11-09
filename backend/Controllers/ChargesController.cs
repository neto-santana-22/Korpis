using backend.Domain.Entities;
using backend.Domain.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ChargesController : ControllerBase
    {
        private readonly IChargeRepository _chargeRepository;
        private readonly IPaymentService _paymentService;

        public ChargesController(IChargeRepository chargeRepository, IPaymentService paymentService)
        {
            _chargeRepository = chargeRepository;
            _paymentService = paymentService;
        }

        // Retorna o historico completo de cobrancas
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var charges = await _chargeRepository.GetAllAsync();
            return Ok(charges);
        }

        // Retorna os detalhes de uma cobranca especifica por ID
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var charge = await _chargeRepository.GetByIdAsync(id);
            if (charge == null)
            {
                return NotFound(new { message = "Cobranca nao encontrada." });
            }
            return Ok(charge);
        }

        // Gera uma nova cobranca chamando o MockPaymentService e salva no Postgres
        [HttpPost("generate")]
        public async Task<IActionResult> Generate([FromBody] CreateChargeRequest request)
        {
            if (request == null || request.Amount <= 0)
            {
                return BadRequest(new { message = "Dados invalidos para geracao da cobranca." });
            }

            var charge = await _paymentService.CreateChargeAsync(
                request.ClientId,
                request.Amount,
                request.Description,
                request.DueDate
            );

            await _chargeRepository.AddAsync(charge);

            return CreatedAtAction(nameof(GetById), new { id = charge.Id }, charge);
        }

        // Endpoint de simulacao de Webhook / confirmacao de pagamento (baixa)
        [HttpPost("{id}/pay")]
        public async Task<IActionResult> PayCharge(Guid id)
        {
            var charge = await _chargeRepository.GetByIdAsync(id);
            if (charge == null)
            {
                return NotFound(new { message = "Cobranca nao encontrada." });
            }

            charge.Status = ChargeStatus.Paid;
            charge.PaidAt = DateTime.UtcNow;

            await _chargeRepository.UpdateAsync(charge);

            return Ok(charge);
        }

        // Endpoint para cancelar uma cobranca pendente
        [HttpPost("{id}/cancel")]
        public async Task<IActionResult> CancelCharge(Guid id)
        {
            var charge = await _chargeRepository.GetByIdAsync(id);
            if (charge == null)
            {
                return NotFound(new { message = "Cobranca nao encontrada." });
            }

            if (charge.Status == ChargeStatus.Paid)
            {
                return BadRequest(new { message = "Nao e possivel cancelar uma cobranca ja paga." });
            }

            charge.Status = ChargeStatus.Canceled;
            await _chargeRepository.UpdateAsync(charge);

            return Ok(charge);
        }
    }

    // DTO para requisicao de criacao de cobranca
    public class CreateChargeRequest
    {
        public Guid ClientId { get; set; }
        public decimal Amount { get; set; }
        public string Description { get; set; } = string.Empty;
        public DateTime DueDate { get; set; }
    }
}