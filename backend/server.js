import express from 'express';
import 'dotenv/config'
import cors from 'cors'

const app = express();
app.use(express.json())
app.use(cors())

app.get('/' , (req,res)=> res.send('server is live'));

const PORT = process.env.PORT || 5000

app.listen(PORT , ()=> console.log('server is ruuning in port'))