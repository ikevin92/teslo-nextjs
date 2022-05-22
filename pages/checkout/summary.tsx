import NextLink from 'next/link'
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Grid,
  Link,
  Typography,
} from '@mui/material'
import { CartList, OrderSumary } from '../../components/cart'
import { ShopLayout } from '../../components/layouts/ShopLayout'

const SummaryPage = () => {
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
              <Typography variant='h2'>Resumen (3 productos)</Typography>
              <Divider sx={{ my: 1 }} />

              <Box display={'flex'} justifyContent='space-between'>
                <Typography variant='subtitle1'>
                  Dirección de entrega
                </Typography>
                <NextLink href={'/checkout/address'} passHref>
                  <Link underline='always'>Editar</Link>
                </NextLink>
              </Box>

              <Typography>Kevin Echeverri</Typography>
              <Typography>Calle 60</Typography>
              <Typography>Villa del prado</Typography>
              <Typography>Colombia</Typography>
              <Typography>+57 3402003434</Typography>

              <Divider sx={{ my: 1 }} />

              <Box display={'flex'} justifyContent='end'>
                <NextLink href={'/cart'} passHref>
                  <Link underline='always'>Editar</Link>
                </NextLink>
              </Box>

              <OrderSumary />

              <Box sx={{ mt: 3 }}>
                <Button color='secondary' className='circular-btn' fullWidth>
                  Confirmar Orden
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </ShopLayout>
  )
}

export default SummaryPage
