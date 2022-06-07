import {
  Box,
  Button,
  Grid,
  Link,
  TextField,
  Typography,
  Chip,
} from '@mui/material'
import { useForm } from 'react-hook-form'
import { AuthLayout } from '../../components/layouts'
import NextLink from 'next/link'
import { validations } from '../../utils'
import { tesloApi } from '../../api'
import { ErrorOutline } from '@mui/icons-material'
import { useState } from 'react'

type FormData = {
  email: string
  password: string
}

const LoginPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>()

  const [showError, setShowError] = useState<boolean>(false)

  const onLoginUser = async ({ email, password }: FormData) => {
    setShowError(false)
    try {
      const { data } = await tesloApi.post('/user/login', { email, password })
      const { token, user } = data
      console.log({ token, user })
    } catch (error) {
      console.log(error)
      setShowError(true)
      setTimeout(() => {
        setShowError(false)
      }, 3000)
    }
    // TODO: navegar a la pantalla que el usuario estaba
  }

  return (
    <AuthLayout title='Ingresar'>
      <form onSubmit={handleSubmit(onLoginUser)} noValidate>
        <Box sx={{ width: 350, padding: '10px 20px' }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant='h1' component={'h1'}>
                Iniciar Sesion
              </Typography>
              <Chip
                label='No reconocemos ese usuario/contraseña'
                color='error'
                icon={<ErrorOutline />}
                className='fadeIn'
                sx={{ display: showError ? 'flex' : 'none' }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                type={'email'}
                label='Correo'
                variant='filled'
                fullWidth
                {...register('email', {
                  required: 'Este campo es requerido',
                  // pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                  validate: validations.isEmail,
                })}
                error={!!errors.email}
                helperText={errors.email?.message}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label='Contraseña'
                type='password'
                variant='filled'
                fullWidth
                {...register('password', {
                  required: 'Este campo es requerido',
                  minLength: {
                    value: 6,
                    message: 'La contraseña debe tener al menos 6 caracteres',
                  },
                })}
                error={!!errors.password}
                helperText={errors.password?.message}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                type='submit'
                color='secondary'
                className='circular-btn'
                size='large'
                fullWidth
              >
                Ingresa
              </Button>
            </Grid>
            <Grid item xs={12} display='flex' justifyContent={'end'}>
              <NextLink href={'/auth/register'} passHref>
                <Link underline='always'>No tienes cuenta?</Link>
              </NextLink>
            </Grid>
          </Grid>
        </Box>
      </form>
    </AuthLayout>
  )
}
export default LoginPage
