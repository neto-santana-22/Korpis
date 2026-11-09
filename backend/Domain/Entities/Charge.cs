namespace backend.Domain.Entities
{
    // Entidade Charge mapeada pelo Entity Framework Core
    public class Charge
    {
        public Guid Id { get; set; }
        public Guid ClientId { get; set; }
        public Client Client { get; set; } = null!;
        public decimal Amount { get; set; }
        public string Description { get; set; } = string.Empty;
        public DateTime DueDate { get; set; }
        public ChargeStatus Status { get; set; } = ChargeStatus.Pending;
        public string ExternalId { get; set; } = string.Empty;
        public string PixQrCode { get; set; } = string.Empty;
        public string PaymentUrl { get; set; } = string.Empty;
        public DateTime? PaidAt { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}