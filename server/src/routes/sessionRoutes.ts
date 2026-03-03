import { Router } from 'express'
import { createSession, listSessions } from '../controllers/sessionController.js'
import { requireAuth } from '../middleware/auth.js'
import { asyncHandler } from '../utils/asyncHandler.js'

const sessionRouter = Router()

sessionRouter.use(requireAuth)
sessionRouter.get('/', asyncHandler(listSessions))
sessionRouter.post('/', asyncHandler(createSession))

export default sessionRouter
