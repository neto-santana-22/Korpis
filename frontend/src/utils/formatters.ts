// Converte centavos ou numeros para exibicao formatada em Reais (R$)
export const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(value);
};

// Mascara de digitacao em tempo real para o input de valor (ex: "15050" -> "R$ 150,50")
export const maskCurrencyInput = (value: string): string => {
    const onlyDigits = value.replace(/\D/g, '');
    if (!onlyDigits) return '';
    const numericValue = Number(onlyDigits) / 100;
    return formatCurrency(numericValue);
};

// Converte a string formatada ("R$ 150,50") em numero decimal puro para a API (150.50)
export const parseCurrencyToNumber = (formattedValue: string): number => {
    const onlyDigits = formattedValue.replace(/\D/g, '');
    if (!onlyDigits) return 0;
    return Number(onlyDigits) / 100;
};