using backend.Domain.Entities;

namespace backend.Domain.Interfaces
{
    // Contrato para simulacao e integracao de gateways de pagamento
    public interface IPaymentService
    {
        Task<Charge> CreateChargeAsync(Guid clientId, decimal amount, string description, DateTime dueDate);
    }
}