import 'dotenv/config'
import express from 'express';
import cors from 'cors'
import {clerkMiddleware} from '@clerk/express'
import { serve } from 'inngest/express'
import { inngest, functions } from './inngest/index.js'

const app = express();
app.use(express.json())
app.use(cors())
app.use(clerkMiddleware())

app.get('/' , (req,res)=> res.send('server is live'));
app.use('/api/inngest', serve({ client: inngest, functions }))

const PORT = process.env.PORT || 5000

// Vercel runs the default export itself, so only open a port when running locally
if (!process.env.VERCEL) {
    app.listen(PORT , ()=> console.log('server is ruuning in port'))
}

export default app
