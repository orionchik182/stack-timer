import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import supabase from './supabase'


export function useTimers() {
  return useQuery({
    queryKey: ['timers'],
    queryFn: async () => {
      const { data, error } = await supabase.from('timers').select('*')

      if (error) throw new Error(error.message)
      return data
    },
  })
}

export function useAddTimer() {
  return useMutation({
    mutationFn: async (startTime: string) => {
      const day = new Date().toLocaleDateString('sv-SE') // YYYY-MM-DD
      const { data, error } = await supabase
        .from('timers')
        .insert([{ timerStart: startTime, day }])
        .select()
      if (error) throw new Error(error.message)
      return data?.[0] // возвращаем созданную строку
    },
  })
}

export function useStopTimer() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      id,
      endTime,
      
    }: {
      id: number
      endTime: string
      
    }) => {
      

      const { error } = await supabase
        .from('timers')
        .update({ timerEnd: endTime })
        .eq('id', id)

      if (error) throw new Error(error.message)
      return 'saved'
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['timers'] })
    },
  })
}

export function useDailyTimers() {
  const today = new Date().toISOString().split('T')[0]

  return useQuery({
    queryKey: ['timers', today],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('timers')
        .select('*')
        .eq('day', today)

      if (error) throw new Error(error.message)
      return data
    },
  })
}

export function useDeleteTimer() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: number) => {
      const { error } = await supabase.from('timers').delete().eq('id', id)

      if (error) throw new Error(error.message)
    },
    onSuccess: () => {
      // Обновить список таймеров после удаления
      queryClient.invalidateQueries({ queryKey: ['timers'] })
    },
  })
}
