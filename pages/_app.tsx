import { CssBaseline, ThemeProvider } from '@mui/material'
import { SessionProvider } from 'next-auth/react'
import type { AppProps } from 'next/app'
import { SWRConfig } from 'swr'
import { CartProvider, UiProvider } from '../context'
import { AuthProvider } from '../context/auth/AuthProvider'
import '../styles/globals.css'
import { lightTheme } from '../themes'


function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider>
      <SWRConfig
        value={{
          // refreshInterval: 500,
          fetcher: (resource, init) =>
            fetch(resource, init).then((res) => res.json()),
        }}
      >
        <AuthProvider>
          <CartProvider>
            <UiProvider>
              <ThemeProvider theme={lightTheme}>
                <CssBaseline />
                <Component {...pageProps} />
              </ThemeProvider>
            </UiProvider>
          </CartProvider>
        </AuthProvider>
      </SWRConfig>
    </SessionProvider>
  )
}

export default MyApp
