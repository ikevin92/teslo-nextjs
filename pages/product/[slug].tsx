import { useState } from 'react'
import { NextPage, GetStaticPaths, GetStaticProps } from 'next'
import { Box, Button, Chip, Grid, Typography } from '@mui/material'
import { ShopLayout } from '../../components/layouts/ShopLayout'
// import { initialData } from '../../database/products'
import { ProductSlideShow, SizeSelector } from '../../components/products'
import { ItemCounter } from '../../components/ui'
import { ICartProduct, IProduct, ISize } from '../../interfaces'
import { dbProducts } from '../../database'

interface Props {
  product: IProduct
}

const ProductPage: NextPage<Props> = ({ product }) => {
  const [tempCartProduct, setTempCartProduct] = useState<ICartProduct>({
    _id: product._id,
    image: product.images[0],
    price: product.price,
    size: undefined,
    slug: product.slug,
    title: product.title,
    gender: product.gender,
    quantity: 1,
  })

  const selectedSize = (size: ISize) => {
    setTempCartProduct((currentProduct) => ({
      ...currentProduct,
      size,
    }))
  }

  return (
    <ShopLayout title={product.title} pageDescription={product.description}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={7}>
          {/* slideshow */}
          <ProductSlideShow images={product.images} />
        </Grid>
        <Grid item xs={12} sm={5}>
          <Box display='flex' flexDirection='column'>
            {/* titulos */}
            <Typography variant='h1' component='h1'>
              {product.title}
            </Typography>

            <Typography variant='subtitle1' component='h2'>
              {`$${product.price}`}
            </Typography>

            {/* cantidad y talla*/}
            <Box sx={{ my: 2 }}>
              <Typography variant='subtitle2'>Cantidad</Typography>
              <ItemCounter />
              <SizeSelector
                selectedSize={tempCartProduct.size}
                sizes={product.sizes}
                onSelectedSize={(size) => selectedSize(size)}
              />
            </Box>

            {/* agregar al carrito */}
            {product.inStock > 0 ? (
              <Button color='secondary' className='circular-btn'>
                {tempCartProduct.size
                  ? 'Agregar al carrito'
                  : 'Seleccione una talla'}
              </Button>
            ) : (
              <Chip
                label='No hay disponibles'
                color='error'
                variant='outlined'
              />
            )}
            <Box sx={{ mt: 3 }}>
              <Typography variant='subtitle2'>Descripción</Typography>
              <Typography variant='body2'>{product.description}</Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ShopLayout>
  )
}

// getStaticPaths..
// You should use getStaticPaths if you’re statically pre-rendering pages that use dynamic routes

export const getStaticPaths: GetStaticPaths = async (ctx) => {
  const productSlugs = await dbProducts.getAllProductSlugs()

  return {
    paths: productSlugs.map(({ slug }) => ({
      params: {
        slug,
      },
    })),
    fallback: 'blocking',
  }
}

// getStaticProps..
// You should use getStaticProps when:
//- The data required to render the page is available at build time ahead of a user’s request.
//- The data comes from a headless CMS.
//- The data can be publicly cached (not user-specific).
//- The page must be pre-rendered (for SEO) and be very fast — getStaticProps generates HTML and JSON files, both of which can be cached by a CDN for performance.

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug = '' } = params as { slug: string }
  const product = await dbProducts.getProductBySlug(slug)

  if (!product) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  return {
    props: {
      product,
    },
    revalidate: 60 * 60 * 24,
  }
}

export default ProductPage

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time

/** no usar esto SSR */
// export const getServerSideProps: GetServerSideProps = async ({ params }) => {
//   const { slug = '' } = params as { slug: string }
//   const product = await dbProducts.getProductBySlug(slug)

//   if (!product) {
//     return {
//       redirect: {
//         destination: '/',
//         permanent: false,
//       },
//     }
//   }

//   return {
//     props: {
//       product,
//     },
//   }
// }
