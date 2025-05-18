import type { ReactNode } from 'react'
import type { Timer } from './timer.types'

export interface TimerProps {
  day: string
  dayTimers: Timer[]
  children: ReactNode
  lastKey?: string
}

export interface OnlyChildren {
  children: ReactNode
}

export interface Login {
  email: string
  password: string
}
