import { FC, useReducer } from 'react'
import { ICartProduct } from '../../interfaces'
import { CartContext, cartReducer } from './'

export interface CartState {
  cart: ICartProduct[]
}

const CART_INITIAL_STATE: CartState = {
  cart: [],
}

interface CartProviderProps {
  children: JSX.Element | JSX.Element[]
}

export const CartProvider: FC<CartProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, CART_INITIAL_STATE)

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

  return (
    <CartContext.Provider
      value={{
        ...state,
        //Methods
        addProductToCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}
