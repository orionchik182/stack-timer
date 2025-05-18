import type { Login } from '../types/props.types'
import supabase from './supabase'

export async function login({ email, password }: Login) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  if (error) {
    throw new Error(error.message)
  }
  return data
}

export async function getCurrentUser() {
  const { data: session } = await supabase.auth.getSession()
  if (!session.session) throw new Error("Not authenticated")

  const { data, error } = await supabase.auth.getUser()

  

  if (error) throw new Error(error.message)

  return data?.user
}

export async function logout() {
  const { error } = await supabase.auth.signOut()
  if (error) throw new Error(error.message)
}
