using backend.Domain.DTOs;
using backend.Domain.Entities;
using backend.Domain.Enums;
using backend.Domain.Interfaces;

namespace backend.Infrastructure.Services;

// Servico simulado para geracao de dados de pagamento (Pix/Boleto) sem custo em APIs terceiras
public class MockPaymentService : IPaymentService
{
    public Task<Charge> GeneratePaymentAsync(Client client, CreateChargeDto dto)
    {
        // Instancia a cobranca preenchendo os dados de QR Code e URL de pagamento simulados
        var charge = new Charge
        {
            Id = Guid.NewGuid(),
            ClientId = client.Id,
            Amount = dto.Amount,
            Description = dto.Description,
            DueDate = dto.DueDate,
            Status = ChargeStatus.Pending,
            ExternalId = $"PAY_{Guid.NewGuid().ToString()[..8].ToUpper()}",
            PixQrCode = "00020126580014BR.GOV.BCB.PIX0136123e4567-e89b-12d3-a456-426614174000520400005303986540510.005802BR5913Korpis Pay6008Sao Paulo62070503***6304E2CA",
            PaymentUrl = "https://sandbox.paymentgateway.com/pay/12345",
            CreatedAt = DateTime.UtcNow
        };

        return Task.FromResult(charge);
    }
}