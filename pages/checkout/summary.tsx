import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  Link,
  Typography
} from '@mui/material'
import Cookies from 'js-cookie'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import { useContext, useEffect, useState } from 'react'
import { CartList, OrderSummary } from '../../components/cart'
import { ShopLayout } from '../../components/layouts/ShopLayout'
import { CartContext } from '../../context'
import { countries } from '../../utils'

const SummaryPage = () => {
  const router = useRouter()

  const { shippingAddress, numberOfItems, createOrder } =
    useContext(CartContext)

  const [isPosting, setIsPosting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  // validacion que tenga los datos para el summary
  useEffect(() => {
    if (!Cookies.get('firstName')) {
      router.push('/checkout/address')
    }
  }, [router])

  const onCreateOrder = async () => {
    setIsPosting(true)
    const { hasError, message } = await createOrder()

    if (hasError) {
      setIsPosting(true)
      setErrorMessage(message)
      return
    }

    // redireccion al detalle de la orden
    router.replace(`/orders/${message}`)
  }

  if (!shippingAddress) {
    return <></>
  }

  const {
    firstName,
    lastName,
    address,
    address2 = '',
    city,
    country,
    phone,
    zip,
  } = shippingAddress

  return (
    <ShopLayout title='Resumen de Orden' pageDescription='Resumen de la orden'>
      <Typography variant='h1' component='h1'>
        Resumen de la orden
      </Typography>

      <Grid container>
        <Grid item xs={12} sm={7}>
          <CartList />
        </Grid>
        <Grid item xs={12} sm={5}>
          <Card className='summary-card'>
            <CardContent>
              <Typography variant='h2'>
                Resumen ({numberOfItems} producto{numberOfItems > 1 && 's'})
              </Typography>
              <Divider sx={{ my: 1 }} />

              <Box display={'flex'} justifyContent='space-between'>
                <Typography variant='subtitle1'>
                  Dirección de entrega
                </Typography>
                <NextLink href={'/checkout/address'} passHref>
                  <Link underline='always'>Editar</Link>
                </NextLink>
              </Box>

              <Typography>
                {firstName} {lastName}
              </Typography>
              <Typography>
                {address} {address2 && `, ${address2}`}
              </Typography>
              <Typography>
                {city}, {zip}
              </Typography>
              <Typography>
                {countries.find((c) => c.code === country)?.name}
              </Typography>
              <Typography>{phone}</Typography>

              <Divider sx={{ my: 1 }} />

              <Box display={'flex'} justifyContent='end'>
                <NextLink href={'/cart'} passHref>
                  <Link underline='always'>Editar</Link>
                </NextLink>
              </Box>

              <OrderSummary />

              <Box sx={{ mt: 3 }} display='flex' flexDirection={'column'}>
                <Button
                  disabled={isPosting}
                  onClick={onCreateOrder}
                  color='secondary'
                  className='circular-btn'
                  fullWidth
                >
                  Confirmar Orden
                </Button>

                <Chip
                  color='error'
                  label={errorMessage}
                  sx={{ display: errorMessage ? 'flex' : 'none', mt: 2 }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </ShopLayout>
  )
}

export default SummaryPage
