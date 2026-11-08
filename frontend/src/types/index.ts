// Enum de status da cobranca mapeado exatamente com os valores do C#
export const ChargeStatus = {
    Pending: 1,
    Paid: 2,
    Canceled: 3,
    Overdue: 4,
} as const;

export type ChargeStatus = typeof ChargeStatus[keyof typeof ChargeStatus];

// Modelo correspondente a entidade Charge do backend .NET
export interface Charge {
    id: string;
    amount: number;
    description: string;
    dueDate: string;
    status: ChargeStatus;
    externalId: string;
    pixQrCode: string;
    paymentUrl: string;
    createdAt: string;
    paidAt?: string | null;
    clientId: string;
}

// Modelo correspondente a entidade Client do backend .NET
export interface Client {
    id: string;
    name: string;
    document: string;
    email: string;
    phone: string;
    createdAt: string;
    charges?: Charge[];
}

// DTO para envio de dados ao gerar nova cobranca
export interface CreateChargeDto {
    clientId: string;
    amount: number;
    description: string;
    dueDate: string;
}