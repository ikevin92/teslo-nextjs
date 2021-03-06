import { Typography } from '@mui/material'
import type { NextPage } from 'next'
import { useSession } from 'next-auth/react'
import { ShopLayout } from '../components/layouts'
// import { initialData } from '../database/products'
import { ProductList } from '../components/products/'
import { FullScreenLoading } from '../components/ui'
import { useProducts } from '../hooks'

const HomePage: NextPage = () => {

  const session = useSession()
  // console.log(session);
  const { products, isLoading } = useProducts('/products')

  return (
    <ShopLayout
      title={'Teslo-Shop - Home'}
      pageDescription={'Encuentra los mejores productos de Teslo aqui'}
    >
      <Typography variant='h1' component='h1'>
        Tienda
      </Typography>
      <Typography variant='h2' component='h2' sx={{ mb: 1 }}>
        Todos los productos
      </Typography>
      {isLoading ? <FullScreenLoading /> : <ProductList products={products} />}
    </ShopLayout>
  )
}

export default HomePage


