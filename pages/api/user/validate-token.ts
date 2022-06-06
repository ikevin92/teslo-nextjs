import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '../../../database'
import { User } from '../../../models'
import bcrypt from 'bcryptjs'
import { jwt } from '../../../utils'

type Data =
  | {
      message: string
    }
  | {
      token: string
      user: {
        email: string
        name: string
        role: string
      }
    }

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  switch (req.method) {
    case 'GET':
      return checkJWT(req, res)

    default:
      res.status(405).json({ message: `Method ${req.method} Not Allowed` })
  }
}

const checkJWT = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const { token = '' } = req.cookies // depende de donde quiera si del header o de las cookies

  let userId = ''

  try {
    userId = await jwt.isValidToken(token)
  } catch (error) {
    return res
      .status(401)
      .json({ message: 'Token de autorizacion no es valido' })
  }

  await db.connect()
  const user = await User.findById(userId).lean() // await db.disconnect()
  await db.disconnect()

  if (!user) {
    return res.status(400).json({ message: 'No existe usuario en la bd' })
  }

  const { _id, email, name, role } = user

  return res.status(200).json({
    token: jwt.signToken(_id.toString(), email)!,
    user: { role, name, email },
  })
}
