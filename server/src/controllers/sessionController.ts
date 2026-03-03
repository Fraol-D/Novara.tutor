import type { Request, Response } from 'express'
import { prisma } from '../config/prisma.js'

export const listSessions = async (_req: Request, res: Response) => {
  const sessions = await prisma.session.findMany({
    include: {
      student: {
        select: {
          id: true,
          fullName: true,
        },
      },
    },
    orderBy: {
      date: 'desc',
    },
  })

  return res.status(200).json(sessions)
}

export const createSession = async (req: Request, res: Response) => {
  const { studentId, tutorId, subject, date, attended = false } = req.body

  const session = await prisma.session.create({
    data: {
      studentId,
      tutorId: tutorId || null,
      subject,
      date: new Date(date),
      attended,
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

  return res.status(201).json(session)
}
