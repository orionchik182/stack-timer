import { getDuration } from '../features/getDuration'

type Timer = {
  timerStart: string
  timerEnd: string
}

export default function TotalMinutes({ timers }: { timers: Timer[] }) {
  const totalMinutes = timers.reduce((sum, t) => {
    if (t.timerStart && t.timerEnd) {
      return sum + getDuration(t.timerStart, t.timerEnd)
    }
    return sum
  }, 0)

  const totalHours = Math.floor(totalMinutes / 60)
  const totalMins = totalMinutes % 60

  return (
    <div className="total-minutes">
      Суммарное время: {totalHours} ч {totalMins} мин
    </div>
  )
}
