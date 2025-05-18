import { useMutation, useQueryClient } from '@tanstack/react-query'

import { login as loginApi } from '../services/apiAuth'
import { useNavigate } from 'react-router'
import type { Login } from '../types/props.types'

export function useLogin() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const { mutate: login, isPending: isLoading } = useMutation({
    mutationFn: ({ email, password }: Login) => loginApi({ email, password }),
    onSuccess: (user) => {
      queryClient.setQueryData(['user'], user.user)
      navigate('/', { replace: true })
    },
    onError: (err) => {
      console.log('Error', err)
    },
  })
  return { login, isLoading }
}
