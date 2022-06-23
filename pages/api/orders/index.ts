import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import { db } from '../../../database'
import { IOrder } from '../../../interfaces'
import { Order } from '../../../models'
import Product from '../../../models/Product'

type Data =
  | {
      message: string
    }
  | IOrder

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  switch (req.method) {
    case 'POST':
      return createOrder(req, res)

    default:
      return res.status(405).json({ message: 'Method Not Allowed' })
  }
}

const createOrder = async (req: NextApiRequest, res: NextApiResponse) => {
  const { orderItems, total } = req.body as IOrder

  // verificar que tengamos un usuario
  const session: any = await getSession({ req })
  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  // crear un arreglo con los productos que la persona quiere comprar
  const productsIds = orderItems.map((product: any) => product._id)
  await db.connect()
  const dbProducts = await Product.find({ _id: { $in: productsIds } })

  try {
    const subTotal = orderItems.reduce((prev, current) => {
      const currentPrice = dbProducts.find((p) => p.id === current._id)!.price

      if (!currentPrice) {
        throw new Error('Verificar el carrito de nuevo, producto no existe')
      }

      return currentPrice * current.quantity + prev
    }, 0)

    const taxRate = Number(process.env.NEXT_PUBLIC_TAX_RATE || 0)
    const backendTotal = subTotal * (taxRate + 1)

    if (backendTotal !== total) {
      throw new Error('El total no coincide con el calculado')
    }

    // todo bien hasta este punto
    const userId = session.user._id
    const newOrder = new Order({ ...req.body, isPaid: false, user: userId })
    newOrder.total = Math.round(newOrder.total * 100) / 100 // dos decimales
    await newOrder.save()
    await db.disconnect()

    return res.status(201).json(newOrder)
  } catch (error: any) {
    await db.disconnect()
    console.log(error)

    return res
      .status(400)
      .json({ message: error.message || 'Revise logs del servidor' })
  }
}
