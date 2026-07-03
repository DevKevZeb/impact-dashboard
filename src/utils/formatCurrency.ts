export function formatCurrency(amount: number, code: string): string {
    return `${amount.toFixed(2)} ${code}`;
}
