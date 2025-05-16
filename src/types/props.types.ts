import type { ReactNode } from 'react'
import type { Timer } from './timer.types'

export interface TimerProps {
  day: string
  dayTimers: Timer[]
  children: ReactNode
  lastKey?: string
}
