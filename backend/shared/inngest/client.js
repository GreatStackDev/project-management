// Load env here too: ESM evaluates imports first, and the client reads INNGEST_DEV / signing keys on creation
import 'dotenv/config'
import { Inngest } from 'inngest'

export const inngest = new Inngest({ id: 'alkham-backend' })
