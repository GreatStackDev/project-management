import 'dotenv/config'
import { defineConfig } from 'prisma/config'

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  // The CLI (db push / migrate / studio) needs the direct, unpooled connection.
  // process.env, not env(): env() throws when the var is missing, which breaks `prisma generate` on Vercel builds
  datasource: {
    url: process.env.DIRECT_URL,
  },
})
