import { useState, useContext } from 'react'
import {
  Box,
  Button,
  Grid,
  Link,
  TextField,
  Typography,
  Chip,
} from '@mui/material'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form'
import { ErrorOutline } from '@mui/icons-material'
import { AuthLayout } from '../../components/layouts'
import { validations } from '../../utils'
import { AuthContext } from '../../context'

type FormData = {
  email: string
  password: string
}

const LoginPage = () => {
  const router = useRouter()

  const { loginUser } = useContext(AuthContext)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>()

  const [showError, setShowError] = useState<boolean>(false)

  const onLoginUser = async ({ email, password }: FormData) => {
    setShowError(false)

    const isValidLogin = await loginUser(email, password)

    if (!isValidLogin) {
      setShowError(true)
      setTimeout(() => {
        setShowError(false)
      }, 3000)
    }

    // TODO: navegar a la pantalla que el usuario estaba
    const destination = router.query.p?.toString() || '/'
    router.replace(destination)
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
              <NextLink
                href={
                  router.query.p
                    ? `/auth/register?p=/${router.query.p}`
                    : '/auth/register'
                }
                passHref
              >
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
