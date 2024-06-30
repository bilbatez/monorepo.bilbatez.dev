export function addMonth(date: Date, month: number): Date {
    const newDate = new Date(date)
    newDate.setMonth(newDate.getMonth() + month)
    return newDate
}

export function format(date: Date): string {
    return date.toLocaleDateString('id-ID', {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
    })
}