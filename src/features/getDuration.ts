export function getDuration(start: string, end: string): number {
  const clean = (time: string) => time.replace(/\u202f|\u00a0/g, '').trim()

  const today = new Date().toISOString().split('T')[0] // YYYY-MM-DD

  const startDate = new Date(`${today}T${clean(start)}`)
  const endDate = new Date(`${today}T${clean(end)}`)

  const diffMs = endDate.getTime() - startDate.getTime()
  return Math.round(diffMs / 60000)
}
