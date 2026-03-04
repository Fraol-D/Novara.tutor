import { Router } from 'express'
import { createPayment, listPayments, updatePaymentStatus } from '../controllers/paymentController.js'
import { requireAuth } from '../middleware/auth.js'
import { asyncHandler } from '../utils/asyncHandler.js'

const paymentRouter = Router()

paymentRouter.use(requireAuth)
paymentRouter.get('/', asyncHandler(listPayments))
paymentRouter.post('/', asyncHandler(createPayment))
paymentRouter.patch('/:id/status', asyncHandler(updatePaymentStatus))

export default paymentRouter
