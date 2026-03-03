import type { Request, Response } from 'express'
import { prisma } from '../config/prisma.js'

export const listPayments = async (_req: Request, res: Response) => {
  const payments = await prisma.payment.findMany({
    include: {
      student: {
        select: {
          id: true,
          fullName: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  return res.status(200).json(payments)
}

export const createPayment = async (req: Request, res: Response) => {
  const { studentId, month, amount, status = 'unpaid' } = req.body

  const payment = await prisma.payment.create({
    data: {
      studentId,
      month,
      amount,
      status,
      paidAt: status === 'paid' ? new Date() : null,
    },
    include: {
      student: {
        select: {
          id: true,
          fullName: true,
        },
      },
    },
  })

  return res.status(201).json(payment)
}

export const updatePaymentStatus = async (req: Request, res: Response) => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id
  const { status } = req.body as { status: 'paid' | 'unpaid' }

  const payment = await prisma.payment.update({
    where: { id },
    data: {
      status,
      paidAt: status === 'paid' ? new Date() : null,
    },
    include: {
      student: {
        select: {
          id: true,
          fullName: true,
        },
      },
    },
  })

  return res.status(200).json(payment)
}
