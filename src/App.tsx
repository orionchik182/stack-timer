import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { TimersList } from './components/TimersList'


function App() {
  return (
    <main className='main'>
      <h1 className="h1">Study timers</h1>
      
      <TimersList />
      <ReactQueryDevtools initialIsOpen={false} />
    </main>
  )
}

export default App
