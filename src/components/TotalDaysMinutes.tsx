import { getDuration } from '../features/getDuration'

type Timer = {
  timerStart: string | null
  timerEnd: string | null
}

export default function TotalDaysMinutes({ timers }: { timers: Timer[] }) {
  const totalMinutes = timers.reduce((sum, t) => {
    if (t.timerStart && t.timerEnd) {
      return sum + getDuration(t.timerStart, t.timerEnd)
    }
    return sum
  }, 0)

  const hours = Math.floor(totalMinutes / 60)
  const mins = totalMinutes % 60

  return (
    <div className="total-days-minutes">
      Общая сумма времени за все дни: {hours} ч {mins} мин
    </div>
  )
}
