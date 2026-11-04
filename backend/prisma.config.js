import 'dotenv/config'
import { defineConfig, env } from 'prisma/config'

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  // The CLI (db push / migrate / studio) needs the direct, unpooled connection
  datasource: {
    url: env('DIRECT_URL'),
  },
})
