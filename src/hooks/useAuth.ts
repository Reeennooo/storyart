import { useAppSelector } from '.'
import { useMemo } from 'react'
import { selectAuth } from '@/redux/slices/authSlice'

// Хук позволяющий получить данные текущего юзера
// Внутрь AppSelector передаём ф-ю возвращающую состояние auth-user.
export const useAuth = () => {
  const authState = useAppSelector(selectAuth)
  return useMemo(() => authState, [authState])
}
