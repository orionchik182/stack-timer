import { useEffect, useState } from 'react'
import { formatDay } from '../features/formatDay'
import { getDuration } from '../features/getDuration'
import { useDeleteTimer } from '../services/apiTimers'
import type { TimerProps } from '../types/props.types'

export default function Timer({ day, dayTimers, children }: TimerProps) {
  const deleteTimer = useDeleteTimer()

  const [modalId, setModalId] = useState<number | null>(null)

  const handleConfirmDelete = () => {
    if (modalId !== null) {
      deleteTimer.mutate(modalId)
      setModalId(null)
    }
  }

  useEffect(() => {
    if (modalId !== null) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [modalId])

  return (
    <div className="timer-table">
      <h3 className="h3">📅 ==== {formatDay(day)} ====</h3>
      <ul className="timer-table__list">
        {[...dayTimers]
          .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
          .map((t) => {
            const duration =
              t.timerStart && t.timerEnd
                ? getDuration(t.timerStart, t.timerEnd)
                : null

            return (
              <li key={t.id} className="timer-table__item">
                <span className="timer-table__item text">
                  ⏱ {t.timerStart} — {t.timerEnd || '...'}
                  {duration !== null && ` = ${duration} мин`}
                </span>
                <button
                  onClick={() => setModalId(t.id)}
                  className="btn btn--delete"
                >
                  Удалить
                </button>
              </li>
            )
          })}
      </ul>

      {modalId !== null && (
        <div
          className="modal-overlay"
          onClick={() => setModalId(null)}
        >
          <div
            className="modal"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="modal__text">Вы точно хотите удалить таймер?</p>
            <div className="modal__buttons">
              <button className="btn" onClick={() => setModalId(null)}>
                Отмена
              </button>
              <button className="btn btn--delete" onClick={handleConfirmDelete}>
                Удалить
              </button>
            </div>
          </div>
        </div>
      )}

      {children}
    </div>
  )
}
