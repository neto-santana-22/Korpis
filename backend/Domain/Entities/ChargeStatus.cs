namespace backend.Domain.Entities
{
    // Enum oficial de status de cobranca mapeado no PostgreSQL
    public enum ChargeStatus
    {
        Pending = 1,
        Paid = 2,
        Canceled = 3,
        Overdue = 4
    }
}