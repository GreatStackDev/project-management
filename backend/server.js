import 'dotenv/config'
import express from 'express';
import cors from 'cors'
import {clerkMiddleware} from '@clerk/express'
import { serve } from 'inngest/express'
import { inngest } from './shared/inngest/client.js'
import { functions } from './modules/index.js'
import { router as workspacesRouter } from './modules/workspaces/index.js'
import { router as projectsRouter } from './modules/projects/index.js'
import { router as tasksRouter } from './modules/tasks/index.js'
import { router as commentsRouter } from './modules/comments/index.js'
import { errorHandler } from './shared/middleware/error-handler.js'

const app = express();
app.use(express.json())
// Only our frontend may call the API from a browser; set FRONTEND_URL to the deployed URL in production
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173' }))
app.use(clerkMiddleware())

app.get('/' , (req,res)=> res.send('server is live'));
app.use('/api/inngest', serve({ client: inngest, functions }))
app.use('/api/workspaces', workspacesRouter)
app.use('/api/projects', projectsRouter)
// Comments live under a task's URL but belong to the comments module
app.use('/api/tasks/:taskId/comments', commentsRouter)
app.use('/api/tasks', tasksRouter)

// Must come after every route so it catches their errors
app.use(errorHandler)

const PORT = process.env.PORT || 5000

// Vercel runs the default export itself, so only open a port when running locally
if (!process.env.VERCEL) {
    app.listen(PORT , ()=> console.log('server is ruuning in port'))
}

export default app
