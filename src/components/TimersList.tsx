import { useTimers } from '../services/apiTimers'
import { TimerButton } from './TimerButton'
import { groupByDay } from '../features/groupByDay'

import TotalMinutes from './TotalMinutes'
import TotalDaysMinutes from './TotalDaysMinutes'
import Timer from './Timer'
import Spinner from './Spinner'

export function TimersList() {
  const { data: timers, isLoading, error } = useTimers()

  if (isLoading) return <Spinner />
  if (error)
    return <p className="message message--error">Ошибка: {error.message}</p>

  const hasTimers = timers && timers.length > 0
  const grouped = hasTimers ? groupByDay(timers) : {}
  const entries = Object.entries(grouped).sort(
    ([a], [b]) => new Date(a).getTime() - new Date(b).getTime()
  )
  const lastKey = entries[entries.length - 1]?.[0]

  return (
    <div className="timers-list">
      {!hasTimers && <p className="message">Нет таймеров</p>}

      {hasTimers &&
        entries.map(([day, dayTimers]) => (
          <Timer key={day} day={day} dayTimers={dayTimers} lastKey={lastKey}>
            <TotalMinutes timers={dayTimers} />
          </Timer>
        ))}

      <TimerButton />

      {hasTimers && <TotalDaysMinutes timers={timers} />}
    </div>
  )
}
