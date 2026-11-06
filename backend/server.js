import 'dotenv/config'
import express from 'express';
import cors from 'cors'
import {clerkMiddleware} from '@clerk/express'
import { serve } from 'inngest/express'
import { inngest, functions } from './inngest/index.js'

export const app = express();
app.use(express.json())
app.use(cors())
app.use(clerkMiddleware())

app.get('/' , (req,res)=> res.send('server is live'));
app.use('/api/inngest', serve({ client: inngest, functions }))

const PORT = process.env.PORT || 5000

app.listen(PORT , ()=> console.log('server is ruuning in port'))
