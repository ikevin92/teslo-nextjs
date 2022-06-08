import { FC, useReducer, useEffect } from 'react'
import axios, { AxiosError } from 'axios'
import Cookies from 'js-cookie'
import { tesloApi } from '../../api'
import { IUser } from '../../interfaces'
import { AuthContext, authReducer } from './'

export interface AuthState {
  isLoggedIn: boolean
  user?: IUser
}

const AUTH_INITIAL_STATE: AuthState = {
  isLoggedIn: false,
  user: undefined,
}

interface AuthProviderProps {
  children: JSX.Element | JSX.Element[]
}

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, AUTH_INITIAL_STATE)

  useEffect(() => {
    checkToken()
  }, [])

  const checkToken = async () => {
    try {
      const { data } = await tesloApi.get('/user/validate-token')
      const { token, user } = data
      Cookies.set('token', token)
      dispatch({ type: '[Auth] - Login', payload: user })
    } catch (error) {
      Cookies.remove('token')
    }
  }

  const loginUser = async (
    email: string,
    password: string
  ): Promise<boolean> => {
    try {
      const { data } = await tesloApi.post('/user/login', { email, password })
      const { token, user } = data
      Cookies.set('token', token)
      dispatch({ type: '[Auth] - Login', payload: user })
      return true
    } catch (error) {
      console.log(error)
      return false
    }
  }

  const registerUser = async (
    name: string,
    email: string,
    password: string
  ): Promise<{ hasError: boolean; message?: string }> => {
    try {
      const { data } = await tesloApi.post('/user/register', {
        name,
        email,
        password,
      })
      const { token, user } = data
      Cookies.set('token', token)
      dispatch({ type: '[Auth] - Login', payload: user })
      // return true
      return {
        hasError: false,
      }
    } catch (err) {
      console.warn(err)
      if (axios.isAxiosError(err)) {
        const error = err as AxiosError
        return {
          hasError: true,
          message: error.message,
        }
      }
      return {
        hasError: true,
        message: 'No se pudo crear el usuario - intente de nuevo',
      }
    }
  }

  return (
    <AuthContext.Provider
      value={{
        ...state,
        // Methos
        loginUser,
        registerUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

//https://codesandbox.io/s/mj0dq?file=/src/App.tsx:635-646
