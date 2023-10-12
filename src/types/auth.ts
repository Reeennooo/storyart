export interface IUser {
  created_at: string | null
  email: string
  id: number
  name: string
  surname?: string
  avatar: string | null
  is_verified: boolean
  registered: 'site' | 'google' | 'facebook' | ''
}

export interface IUserData extends IUser {
  api_token: string
}

export interface IRegisterRequest {
  name: string
  email: string
  password: string
}

export interface ILoginRequest {
  email: string
  password: string
}
