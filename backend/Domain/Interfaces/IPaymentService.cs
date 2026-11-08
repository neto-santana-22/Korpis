using backend.Domain.DTOs;
using backend.Domain.Entities;

namespace backend.Domain.Interfaces;

// Interface que estabelece o contrato para integracao com gateways de pagamento
public interface IPaymentService
{
    // Processa a emissao de cobranca e retorna a entidade Charge populada com dados de pagamento
    Task<Charge> GeneratePaymentAsync(Client client, CreateChargeDto dto);
}