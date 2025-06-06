import { useState } from 'react'
import { Pagination } from 'antd'

import { useTimers } from '../services/apiTimers'
import { TimerButton } from './TimerButton'
import { groupByDay } from '../features/groupByDay'

import TotalMinutes from './TotalMinutes'
import TotalDaysMinutes from './TotalDaysMinutes'
import Timer from './Timer'
import Spinner from './Spinner'

const PAGE_SIZE = 3

export function TimersList() {
  const { data: timers, isLoading, error } = useTimers()
  const [currentPage, setCurrentPage] = useState(1)

  if (isLoading) return <Spinner />
  if (error)
    return <p className="message message--error">Ошибка: {error.message}</p>

  const hasTimers = timers && timers.length > 0
  const grouped = hasTimers ? groupByDay(timers) : {}
  const entries = Object.entries(grouped).sort(
    ([a], [b]) => new Date(b).getTime() - new Date(a).getTime() // Сначала последние
  )

  const totalPages = Math.ceil(entries.length / PAGE_SIZE)
  const paginatedEntries = entries.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  )

  const lastKey = entries[0]?.[0] // самый последний день

  return (
    <div className="timers-list">
      {!hasTimers && <p className="message">Нет таймеров</p>}
      {hasTimers && <TotalDaysMinutes timers={timers} />}

      <TimerButton />

      {hasTimers &&
        paginatedEntries.map(([day, dayTimers]) => (
          <Timer key={day} day={day} dayTimers={dayTimers} lastKey={lastKey}>
            <TotalMinutes timers={dayTimers} />
          </Timer>
        ))}

      {totalPages > 1 && (
        <div className='pagination'>
          <Pagination
            simple
            current={currentPage}
            pageSize={PAGE_SIZE}
            total={entries.length}
            onChange={(page) => setCurrentPage(page)}
          />
        </div>
      )}
    </div>
  )
}
