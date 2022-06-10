import NextAuth from 'next-auth'
import GithubProvider from 'next-auth/providers/github'
import CredentialsProvider from 'next-auth/providers/credentials'
import jwt from 'jsonwebtoken';

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
      async authorize(credentials, req) {
        console.log('crdentials', credentials)
        // VALIDA CONTRA BD

        return null
      },
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
  ],
})



// CALLBACKS
jwt: {
  // secret: process.env.JWT_SECRET_SEED
}

callbacks: {
  
  
}