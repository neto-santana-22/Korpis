namespace backend.Domain.DTOs;

// DTO utilizado para receber os dados necessarios na criacao de uma nova cobranca
public class CreateChargeDto
{
    // Identificador unico do cliente no sistema
    public Guid ClientId { get; set; }

    // Valor da cobranca a ser gerada
    public decimal Amount { get; set; }

    // Descricao ou motivo do pagamento
    public string Description { get; set; } = string.Empty;

    // Data de vencimento do titulo/Pix
    public DateTime DueDate { get; set; }
}