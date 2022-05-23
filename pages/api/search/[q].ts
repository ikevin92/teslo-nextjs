import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '../../../database'
import { IProduct } from '../../../interfaces'
import Product from '../../../models/Product'

type Data = { message: string } | IProduct[]

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  switch (req.method) {
    case 'GET':
      return searchProduct(req, res)

    default:
      return res.status(405).json({ message: 'Method not allowed' })
  }
}

const searchProduct = async (
  req: NextApiRequest,
  res: NextApiResponse<Data>
) => {
  let { q = '' } = req.query

  if (q.length === 0) {
    return res
      .status(400)
      .json({ message: 'Debe especificar un query de busqueda' })
  }

  q = q.toString().toLowerCase()
  await db.connect()
  const products = await Product.find({
    $text: { $search: q },
  })
    .select('title images price inStock slug')
    .lean()
  await db.disconnect()

  return res.status(200).json(products)
}
