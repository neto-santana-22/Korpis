using backend.Domain.Enums;

namespace backend.Domain.Entities;

public class Charge
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public decimal Amount { get; set; }
    public string Description { get; set; } = string.Empty;
    public DateTime DueDate { get; set; }
    public ChargeStatus Status { get; set; } = ChargeStatus.Pending;

    public string? ExternalId { get; set; }
    public string? PixQrCode { get; set; }
    public string? PaymentUrl { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? PaidAt { get; set; }

    public Guid ClientId { get; set; }
    public Client Client { get; set; } = null!;
}