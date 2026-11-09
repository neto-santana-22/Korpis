using backend.Domain.Entities;
using backend.Domain.Interfaces;

namespace backend.Infrastructure.Services
{
    // Servico de mock para gerar cobrancas Pix/Boleto sem depender de gateways reais em dev
    public class MockPaymentService : IPaymentService
    {
        public Task<Charge> CreateChargeAsync(Guid clientId, decimal amount, string description, DateTime dueDate)
        {
            var externalId = $"PAY-{Guid.NewGuid().ToString()[..8].ToUpper()}";
            var pixCode = $"00020126580014BR.GOV.BCB.PIX0136{Guid.NewGuid()}5204000053039865405{amount:F2}5802BR5913KORPIS PAY6009SAO PAULO62070503***6304E2CA";

            var charge = new Charge
            {
                Id = Guid.NewGuid(),
                ClientId = clientId,
                Amount = amount,
                Description = description,
                DueDate = dueDate,
                Status = ChargeStatus.Pending,
                ExternalId = externalId,
                PixQrCode = pixCode,
                PaymentUrl = $"https://checkout.korpis.local/pay/{externalId}",
                CreatedAt = DateTime.UtcNow
            };

            return Task.FromResult(charge);
        }
    }
}