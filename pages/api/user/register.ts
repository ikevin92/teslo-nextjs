import type { NextApiRequest, NextApiResponse } from 'next'
import bcrypt from 'bcryptjs'
import { jwt, validations } from '../../../utils'
import { db } from '../../../database'
import { User } from '../../../models'

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
    case 'POST':
      return registerUser(req, res)

    default:
      res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

const registerUser = async (
  req: NextApiRequest,
  res: NextApiResponse<Data>
) => {
  const {
    email = '',
    password = '',
    name = '',
  } = req.body as { email: string; password: string; name: string }

  if (password.length < 6) {
    return res
      .status(400)
      .json({ message: 'La contraseña debe tener minimo 6 caracteres' })
  }

  if (name.length < 2) {
    return res
      .status(400)
      .json({ message: 'El nombre debe tener minimo 2 caracteres' })
  }

  if (!validations.isValidEmail(email)) {
    return res.status(400).json({ message: 'El correo no parece ser válido' })
  }

  await db.connect()
  const user = await User.findOne({ email })

  if (user) {
    return res.status(400).json({ message: 'Ese correo ya esta registrado' })
  }

  const newUser = new User({
    email: email.toLocaleLowerCase(),
    password: bcrypt.hashSync(password),
    role: 'client',
    name: name.toLocaleLowerCase(),
  })

  try {
    await newUser.save({ validateBeforeSave: true })
    await db.disconnect()
  } catch (error) {
    console.log(error)
    await db.disconnect()
    return res.status(500).json({ message: 'Error al registrar usuario' })
  }

  const { _id, role } = newUser

  const token = jwt.signToken(_id.toString(), email)!

  return res.status(200).json({
    token,
    user: { role, name, email },
  })
}
