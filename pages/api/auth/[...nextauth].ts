import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GithubProvider from 'next-auth/providers/github'
import { dbUsers } from '../../../database'

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    // ...add more providers here
    CredentialsProvider({
      name: 'Custom Login',
      credentials: {
        email: {
          label: 'Correo:',
          type: 'email',
          placeholder: 'tucorreo@google.com',
        },
        password: {
          label: 'Contraseña:',
          type: 'password',
          placeholder: 'Contraseña',
        },
      },
      async authorize(credentials) {
        console.log({ credentials })
        // return { name: 'Juan', correo: 'juan@google.com', role: 'admin' }

        // VALIDA CONTRA BD
        return await dbUsers.checkUserEmailPassword(
          credentials!.email,
          credentials!.password
        )
      },
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
  ],

  // Custom Pages
  pages: {
    signIn: '/auth/login',
    newUser: '/auth/register',
  },

  // CALLBACKS
  jwt: {
    // secret: process.env.JWT_SECRET_SEED, // deprecated
  },

  // duracion de la sesion
  session: {
    maxAge: 2592000, /// 30d
    strategy: 'jwt',
    updateAge: 86400, // cada día
  },

  callbacks: {
    async jwt({ token, account, user }) {
      // console.log({ token, account, user })

      if (account) {
        token.accessToken = account.access_token

        switch (account.type) {
          case 'oauth':
            // crear usuario o verificar si existe
            token.user = await dbUsers.oAuthToDbUser(
              user?.email || '',
              user?.name || ''
            )
            break
          case 'credentials':
            token.user = user
            break
        }
      }
      return token
    },
    async session({ session, token, user }) {
      // console.log({ token, session, user })

      session.accessToken = token.accessToken
      session.user = token.user as any

      return session
    },
  },
})
