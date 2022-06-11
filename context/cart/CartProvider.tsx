import { FC, useReducer, useEffect, useRef } from 'react'
import Cookie from 'js-cookie'
import { ICartProduct, ShippingAddress } from '../../interfaces'
import { CartContext, cartReducer } from './'

export interface CartState {
  isLoaded: boolean
  cart: ICartProduct[]
  numberOfItems: number
  subTotal: number
  tax: number
  total: number
  shippingAddress?: ShippingAddress
}

const CART_INITIAL_STATE: CartState = {
  isLoaded: false,
  cart: [],
  numberOfItems: 0,
  subTotal: 0,
  tax: 0,
  total: 0,
  shippingAddress: undefined,
}

interface CartProviderProps {
  children: JSX.Element | JSX.Element[]
}

export const CartProvider: FC<CartProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, CART_INITIAL_STATE)

  const isCartReloading = useRef(true)

  // * Load cart from cookie
  useEffect(() => {
    try {
      const cookieProducts = Cookie.get('cart')
        ? JSON.parse(Cookie.get('cart')!)
        : []

      dispatch({
        type: '[Cart] - LoadCart from cookies | storage',
        payload: cookieProducts,
      })
    } catch (error) {
      dispatch({
        type: '[Cart] - LoadCart from cookies | storage',
        payload: [],
      })
    }
  }, [])

  useEffect(() => {
    if (Cookie.get('firstName')) {
      const shippingAddress: ShippingAddress = {
        firstName: Cookie.get('firstName') || '',
        lastName: Cookie.get('lastName') || '',
        address: Cookie.get('address') || '',
        address2: Cookie.get('address2') || '',
        zip: Cookie.get('zip') || '',
        city: Cookie.get('city') || '',
        country: Cookie.get('country') || '',
        phone: Cookie.get('phone') || '',
      }
      dispatch({
        type: '[Cart] - LoadAddress from Cookies',
        payload: shippingAddress,
      })
    }
  }, [])

  // * Se envia la info del carrito cada vez que se actualice el state
  useEffect(() => {
    if (isCartReloading.current) {
      isCartReloading.current = false
    } else {
      Cookie.set('cart', JSON.stringify(state.cart))
    }
  }, [state.cart])

  //* actualizamos la orden cuando exitan cambios en el carrito
  useEffect(() => {
    const numberOfItems = state.cart.reduce(
      (prev, current) => current.quantity + prev,
      0
    )
    const subTotal = state.cart.reduce(
      (prev, current) => current.price * current.quantity + prev,
      0
    )
    const taxRate = Number(process.env.NEXT_PUBLIC_TAX_RATE || 0)

    const orderSummary = {
      numberOfItems,
      subTotal,
      tax: subTotal * taxRate,
      total: subTotal * (taxRate + 1),
    }

    dispatch({
      type: '[Cart] - Update order summary',
      payload: orderSummary,
    })
  }, [state.cart])

  const addProductToCart = (product: ICartProduct) => {
    // ! Nivel 1
    // dispatch({ type: '[Cart] - Add Product', payload: product })

    // ! Nivel 2
    // const productInCart = state.cart.filter(
    //   (p) => p._id !== product._id && p.size !== product.size
    // )
    // dispatch({
    //   type: '[Cart] - Add Product',
    //   payload: [...productInCart, product],
    // })

    // ! Nivel Final
    const productInCart = state.cart.some((p) => p._id === product._id)

    const productInCartButDifferentSize = state.cart.some(
      (p) => p._id === product._id && p.size === product.size
    )

    if (!productInCart || !productInCartButDifferentSize)
      return dispatch({
        type: '[Cart] - Update products in cart',
        payload: [...state.cart, product],
      })

    // Acumular
    const updatedProducts = state.cart.map((p) => {
      if (p._id !== product._id) return p
      if (p.size !== product.size) return p

      // actualizar la cantidad
      p.quantity += product.quantity

      return p
    })

    dispatch({
      type: '[Cart] - Update products in cart',
      payload: updatedProducts,
    })
  }

  const updateCartQuantity = (product: ICartProduct) => {
    dispatch({ type: '[Cart] - Change cart quantity', payload: product })
  }

  const removeCartProduct = (product: ICartProduct) => {
    dispatch({ type: '[Cart] - Remove product in cart', payload: product })
  }

  const updateAddress = (address: ShippingAddress) => {
    Cookie.set('firstName', address.firstName)
    Cookie.set('lastName', address.lastName)
    Cookie.set('address', address.address)
    Cookie.set('address2', address.address2 || '')
    Cookie.set('zip', address.zip)
    Cookie.set('city', address.city)
    Cookie.set('country', address.country)
    Cookie.set('phone', address.phone)

    dispatch({ type: '[Cart] - Update Address', payload: address })
  }

  return (
    <CartContext.Provider
      value={{
        ...state,
        // Methods
        addProductToCart,
        removeCartProduct,
        updateCartQuantity,
        updateAddress,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}
