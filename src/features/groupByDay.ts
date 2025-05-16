import type { Timer } from "../types/timer.types"


// Группировка таймеров по дню
export function groupByDay(timers: Timer[]) {
  const groups: Record<string, Timer[]> = {}
  for (const timer of timers) {
    if (!groups[timer.day]) groups[timer.day] = []
    groups[timer.day].push(timer)
  }
  return groups
}
