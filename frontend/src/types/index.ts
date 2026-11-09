// Entidade de Cliente
export interface Client {
    id: string;
    name: string;
    document: string;
    email: string;
    phone: string;
    createdAt: string;
}

// DTO para criacao de Cliente
export interface CreateClientDto {
    name: string;
    document: string;
    email: string;
    phone: string;
}

// Status de Cobranca (Enum do backend)
export const ChargeStatus = {
    Pending: 1,
    Paid: 2,
    Canceled: 3,
    Overdue: 4,
} as const;

export type ChargeStatusType = typeof ChargeStatus[keyof typeof ChargeStatus];

// Entidade de Cobranca
export interface Charge {
    id: string;
    clientId: string;
    client?: Client;
    amount: number;
    description: string;
    dueDate: string;
    status: ChargeStatusType;
    externalId: string;
    pixQrCode: string;
    paymentUrl: string;
    paidAt?: string;
    createdAt: string;
}

// DTO para geracao de Cobranca
export interface CreateChargeDto {
    clientId: string;
    amount: number;
    description: string;
    dueDate: string;
}

// DTO de metricas consolidadas do Dashboard
export interface DashboardMetrics {
    totalClients: number;
    totalCharges: number;
    totalReceivedAmount: number;
    totalPendingAmount: number;
}