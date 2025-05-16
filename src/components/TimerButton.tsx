import { useState, useEffect, useRef } from 'react'
import { useAddTimer, useStopTimer } from '../services/apiTimers'
import { formatTime } from '../features/formatTime'
import supabase from '../services/supabase'

const STORAGE_KEY = 'activeTimer'

export function TimerButton() {
  const [isRunning, setIsRunning] = useState(false)
  const [currentId, setCurrentId] = useState<number | null>(null)

  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const [message, setMessage] = useState<string | null>(null)

  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const messageRef = useRef<NodeJS.Timeout | null>(null)

  const addTimer = useAddTimer()
  const stopTimer = useStopTimer()

  const startInterval = (initialSeconds = 0) => {
    setElapsedSeconds(initialSeconds)
    timerRef.current = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1)
    }, 1000)
  }

  const showMessage = (text: string) => {
    setMessage(text)
    if (messageRef.current) clearTimeout(messageRef.current)
    messageRef.current = setTimeout(() => {
      setMessage(null)
    }, 3000)
  }

  const handleStart = () => {
    const now = new Date().toTimeString().slice(0, 5)

    addTimer.mutate(now, {
      onSuccess: (newTimer) => {
        setCurrentId(newTimer.id)

        setIsRunning(true)
        startInterval(0)

        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({
            id: newTimer.id,
            startTime: now,
            timestamp: Date.now(),
          })
        )
      },
    })
  }

  const handleStop = async () => {
    const now = new Date().toTimeString().slice(0, 5)

    if (elapsedSeconds < 60) {
      // ❌ Удаляем созданный ранее таймер
      if (currentId) {
        await supabase.from('timers').delete().eq('id', currentId)
      }

      setIsRunning(false)
      setElapsedSeconds(0)
      setCurrentId(null)
      if (timerRef.current) clearInterval(timerRef.current)
      localStorage.removeItem(STORAGE_KEY)
      showMessage('⛔ Меньше минуты не сохраняем:)')
      return
    }

    if (currentId) {
      stopTimer.mutate(
        { id: currentId, endTime: now },
        {
          onSuccess: () => {
            setIsRunning(false)
            setElapsedSeconds(0)
            setCurrentId(null)
            if (timerRef.current) clearInterval(timerRef.current)
            localStorage.removeItem(STORAGE_KEY)
            showMessage('✅ Таймер успешно сохранён')
          },
        }
      )
    }
  }

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      const { id, timestamp } = JSON.parse(saved)
      const diffSeconds = Math.floor((Date.now() - timestamp) / 1000)

      setCurrentId(id)

      setIsRunning(true)
      startInterval(diffSeconds)
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
      if (messageRef.current) clearTimeout(messageRef.current)
    }
  }, [])

  return (
    <div className="timer-start">
      <div className="timer-start__controls">
        <button
          onClick={isRunning ? handleStop : handleStart}
          className="btn btn--main"
        >
          {isRunning ? 'Стоп' : 'Старт'}
        </button>
        <span className="tik-tak">{formatTime(elapsedSeconds)}</span>
      </div>

      {message && <div className="message">{message}</div>}
    </div>
  )
}
