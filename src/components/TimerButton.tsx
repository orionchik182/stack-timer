import { useState, useEffect, useRef } from 'react'
import { useAddTimer, useStopTimer } from '../services/apiTimers'
import { formatTime } from '../features/formatTime'
import supabase from '../services/supabase'

const STORAGE_KEY = 'activeTimer'

function calculateEndTime(start: string, elapsed: number) {
  const [sh, sm] = start.split(':').map(Number)
  const total = sh * 3600 + sm * 60 + elapsed
  const hours = Math.floor(total / 3600) % 24
  const minutes = Math.floor((total % 3600) / 60)
  return `${hours.toString().padStart(2, '0')}:${minutes
    .toString()
    .padStart(2, '0')}`
}

export function TimerButton() {
  const [isRunning, setIsRunning] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [currentId, setCurrentId] = useState<number | null>(null)
  const [startTime, setStartTime] = useState<string | null>(null)

  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const [message, setMessage] = useState<string | null>(null)

  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const messageRef = useRef<NodeJS.Timeout | null>(null)

  const addTimer = useAddTimer()
  const stopTimer = useStopTimer()

  const handlePauseToggle = () => {
    if (isPaused) {
      startInterval(elapsedSeconds)
      setIsPaused(false)
    } else {
      if (timerRef.current) clearInterval(timerRef.current)
      setIsPaused(true)
    }
  }

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
        setStartTime(now)

        setIsRunning(true)
        setIsPaused(false)
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
    const endTime = startTime ? calculateEndTime(startTime, elapsedSeconds) : now

    if (elapsedSeconds < 60) {
      // ❌ Удаляем созданный ранее таймер
      if (currentId) {
        await supabase.from('timers').delete().eq('id', currentId)
      }

      setIsRunning(false)
      setIsPaused(false)
      setElapsedSeconds(0)
      setCurrentId(null)
      setStartTime(null)
      if (timerRef.current) clearInterval(timerRef.current)
      localStorage.removeItem(STORAGE_KEY)
      showMessage('⛔ Меньше минуты не сохраняем:)')
      return
    }

    if (currentId) {
      stopTimer.mutate(
        { id: currentId, endTime: endTime },
        {
          onSuccess: () => {
            setIsRunning(false)
            setIsPaused(false)
            setElapsedSeconds(0)
            setCurrentId(null)
            setStartTime(null)
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
      const { id, timestamp, startTime: savedStart } = JSON.parse(saved)
      const diffSeconds = Math.floor((Date.now() - timestamp) / 1000)

      setCurrentId(id)
      setStartTime(savedStart)

      setIsRunning(true)
      setIsPaused(false)
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
        {isRunning && (
          <button
            onClick={handlePauseToggle}
            className={`btn btn--main btn--pause${isPaused ? ' btn--paused' : ''}`}
          >
            II
          </button>
        )}
      </div>

      {message && <div className="message">{message}</div>}
    </div>
  )
}
