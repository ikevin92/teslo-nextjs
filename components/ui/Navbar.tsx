import { useContext } from 'react'
import NextLink from 'next/link'
import {
  AppBar,
  Badge,
  Box,
  Button,
  IconButton,
  Link,
  Toolbar,
  Typography,
} from '@mui/material'
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined'
import { ShoppingCartOutlined } from '@mui/icons-material'
import { useRouter } from 'next/router'
import { UiContext } from '../../context'

export const Navbar = () => {
  const { asPath } = useRouter()
  const { toggleSideMenu } = useContext(UiContext)

  return (
    <AppBar>
      <Toolbar>
        <NextLink href='/' passHref>
          <Link display={'flex'} alignItems='center'>
            <Typography variant='h6'>Teslo |</Typography>
            <Typography
              sx={{
                ml: 0.5,
              }}
            >
              Shop
            </Typography>
          </Link>
        </NextLink>

        <Box flex={1} />

        {/* todo flex */}
        <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
          <NextLink href={'/category/men'} passHref>
            <Link>
              <Button color={asPath.includes('category/men') ? 'primary' : 'info'}>
                Hombres
              </Button>
            </Link>
          </NextLink>
          <NextLink href={'/category/women'} passHref>
            <Link>
              <Button color={asPath.includes('category/women') ? 'primary' : 'info'}>
                Mujeres
              </Button>
            </Link>
          </NextLink>
          <NextLink href={'/category/kid'} passHref>
            <Link>
              <Button color={asPath.includes('category/kid') ? 'primary' : 'info'}>
                Niños
              </Button>
            </Link>
          </NextLink>
        </Box>

        {/* todo flex */}
        <Box flex={1} />

        <IconButton>
          <SearchOutlinedIcon />
        </IconButton>

        <NextLink href='/cart' passHref>
          <Link>
            <IconButton>
              <Badge badgeContent={2} color='secondary'>
                <ShoppingCartOutlined />
              </Badge>
            </IconButton>
          </Link>
        </NextLink>

        <Button onClick={toggleSideMenu}>
        Menu</Button>
      </Toolbar>
    </AppBar>
  )
}
