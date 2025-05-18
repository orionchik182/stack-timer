import { useQuery } from '@tanstack/react-query'
import { getCurrentUser } from '../services/apiAuth'

export function useUser() {
  const {
    isLoading,
    isError,
    data: user,
    fetchStatus,
  } = useQuery({
    queryKey: ['user'],
    queryFn: getCurrentUser,
    retry: false,
  })

  return {
    isLoading,
    user,
    isError,
    isAuthenticated: Boolean(user?.role === 'authenticated'),
    fetchStatus,
  }
}
