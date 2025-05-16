import { Calendar as AntCalendar } from 'antd'
import type { CalendarMode } from 'antd'
import type { Dayjs } from 'dayjs'

import { useTimers } from '../services/apiTimers'

const Calendar: React.FC = () => {
  const { data: timers } = useTimers()

  // Все уникальные дни из таймеров
  const allowedDates = (timers || [])
    .map((t) => t.day)
    .filter(Boolean) // убрать null/undefined
    .filter((v, i, a) => a.indexOf(v) === i) // уникальные

  const onPanelChange = (value: Dayjs, mode: CalendarMode) => {
    console.log(value.format('YYYY-MM-DD'), mode)
  }

  // Деактивируем все даты кроме нужных
  const disabledDate = (current: Dayjs) => {
    const formatted = current.format('YYYY-MM-DD')
    return !allowedDates.includes(formatted)
  }

  return (
    <div className="custom-calendar-wrapper custom-calendar">
      <AntCalendar
        fullscreen={false}
        onPanelChange={onPanelChange}
        disabledDate={disabledDate}
      />
    </div>
  )
}

export default Calendar
