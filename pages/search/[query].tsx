import type { NextPage, GetServerSideProps } from 'next'
import { Box, Typography } from '@mui/material'
import { ShopLayout } from '../../components/layouts'
// import { initialData } from '../../database/products'
import { ProductList } from '../../components/products/'
import { dbProducts } from '../../database'
import { IProduct } from '../../interfaces/products'
import AddresPage from '../checkout/address'

interface Props {
  foundProducts: boolean
  products: IProduct[]
  query: string
}

const SearchPage: NextPage<Props> = ({ products, foundProducts, query }) => {
  // const { products, isLoading } = useProducts('/products/')

  return (
    <ShopLayout
      title={'Teslo-Shop - Search'}
      pageDescription={'Encuentra los mejores productos de Teslo aqui'}
    >
      <Typography variant='h1' component='h1'>
        Buscar productos
      </Typography>
      {foundProducts ? (
        <Typography variant='h2' sx={{ mb: 1 }} textTransform={'capitalize'}>
          Termino: {query}
        </Typography>
      ) : (
        <Box display={'flex'}>
          <Typography variant='h2' component='h2' sx={{ mb: 1 }}>
            No encontramos ningun producto
          </Typography>
          <Typography
            variant='h2'
            sx={{ ml: 1 }}
            color='secondary'
            textTransform={'capitalize'}
          >
            {query}
          </Typography>
        </Box>
      )}
      <ProductList products={products} />
    </ShopLayout>
  )
}

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const { query = '' } = params as {
    query: string
  }

  if (query.length === 0) {
    return {
      redirect: {
        destination: '/',
        permanent: true,
      },
    }
  }

  let products = await dbProducts.getProductsByTerm(query)
  const foundProducts = products.length > 0

  //Retornar otros productos sino encuentra nada con el query
  if (!foundProducts) {
    // products = await dbProducts.getAllProducts();
    products = await dbProducts.getProductsByTerm('shirt')
  }

  return {
    props: {
      foundProducts,
      products,
      query,
    },
  }
}

export default SearchPage
