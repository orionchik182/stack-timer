// Форматирует дату: 2025-05-13 → 13-05-2025
export function formatDay(dateStr: string) {
  const [year, month, day] = dateStr.split('-')
  return `${day}-${month}-${year}`
}
