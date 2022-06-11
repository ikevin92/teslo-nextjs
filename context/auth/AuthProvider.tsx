import axios, { AxiosError } from 'axios'
import Cookies from 'js-cookie'
import { signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { FC, useEffect, useReducer } from 'react'
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
  const { data, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'authenticated') {
      console.log(data.user)
      dispatch({ type: '[Auth] - Login', payload: data.user as IUser })
    }
  }, [status, data])

  // useEffect(() => {
  //   checkToken()
  // }, [])

  const checkToken = async () => {
    if (!Cookies.get('token')) return

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

  const logout = () => {
    Cookies.remove('cart')
    Cookies.remove('firstName')
    Cookies.remove('lastName')
    Cookies.remove('address')
    Cookies.remove('address2')
    Cookies.remove('zip')
    Cookies.remove('city')
    Cookies.remove('country')
    Cookies.remove('phone')
    dispatch({ type: '[Auth] - Logout' })
    signOut()
    // router.reload()
    // Cookies.remove('token')
  }

  return (
    <AuthContext.Provider
      value={{
        ...state,
        // Methos
        loginUser,
        registerUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

//https://codesandbox.io/s/mj0dq?file=/src/App.tsx:635-646
