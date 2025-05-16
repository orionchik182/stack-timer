export function getDuration(start: string, end: string): number {
  const today = new Date().toISOString().split('T')[0]
  const startDate = new Date(`${today} ${start}`)
  const endDate = new Date(`${today} ${end}`)

  const diffMs = endDate.getTime() - startDate.getTime()
  return Math.round(diffMs / 60000)
}
