export function format(value: number): string {
    return Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(value ? value : 0)
}