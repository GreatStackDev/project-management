import 'dotenv/config'
import express from 'express';
import cors from 'cors'
import {clerkMiddleware} from '@clerk/express'

const app = express();
app.use(express.json())
app.use(cors())
app.use(clerkMiddleware())

app.get('/' , (req,res)=> res.send('server is live'));

const PORT = process.env.PORT || 5000

app.listen(PORT , ()=> console.log('server is ruuning in port'))