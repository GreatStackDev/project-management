// Load env here too: ESM evaluates imports first, so this module may run before server.js loads dotenv
import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { PrismaNeon } from '@prisma/adapter-neon'

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL })

export const prisma = new PrismaClient({ adapter })
