import { useNavigate } from 'react-router'
import Spinner from './Spinner'
import { useEffect } from 'react'
import type { OnlyChildren } from '../types/props.types'
import { useUser } from '../hooks/useUser'

export default function ProtectedRoute({ children }: OnlyChildren) {
  const navigate = useNavigate()
  // 1. Load the authenticated user
  const { isLoading, isError, isAuthenticated, fetchStatus } = useUser()
  console.log(isLoading, isAuthenticated, fetchStatus)

  // 2. If there is No authenticated user, redirect to the /login
  useEffect(() => {
    if (!isLoading && isError) {
      navigate('/login')
    }
  }, [isLoading, isError, navigate])

  // 3. While loading, show a spinner
  if (isLoading) return <Spinner />

  // 4. If there IS a user, render the app
  if (isAuthenticated) return children
}
