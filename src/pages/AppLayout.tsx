import { Outlet } from 'react-router'
import { useLogout } from '../hooks/useLogout'
import { IoLogOutOutline } from '@react-icons/all-files/io5/IoLogOutOutline'

export default function AppLayout() {
  const { logout } = useLogout()

  return (
    <main className="main">
      <button className="btn--logout" onClick={() => logout()}>
        <IoLogOutOutline />
      </button>
      <h1 className="h1">Study timers</h1>

      <Outlet />
    </main>
  )
}
