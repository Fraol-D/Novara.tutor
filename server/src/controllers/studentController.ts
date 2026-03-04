import type { Request, Response } from 'express';
import { prisma } from '../config/prisma.js';

export const listStudents = async (_req: Request, res: Response) => {
  const students = await prisma.student.findMany({
    where: { isArchived: false },
    orderBy: { createdAt: 'desc' },
  });

  return res.status(200).json(students);
};

export const getStudentById = async (req: Request, res: Response) => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

  const student = await prisma.student.findUnique({
    where: { id },
  });

  if (!student || student.isArchived) {
    return res.status(404).json({ message: 'Student not found' });
  }

  return res.status(200).json(student);
};

export const createStudent = async (req: Request, res: Response) => {
  const {
    fullName,
    grade,
    parentName,
    parentPhone,
    monthlyFee,
    status = 'active',
    subjects = [],
  } = req.body;

  const student = await prisma.student.create({
    data: {
      fullName,
      grade,
      parentName,
      parentPhone,
      monthlyFee,
      status,
      subjects,
    },
  });

  return res.status(201).json(student);
};

export const updateStudent = async (req: Request, res: Response) => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

  const existing = await prisma.student.findUnique({ where: { id } });
  if (!existing || existing.isArchived) {
    return res.status(404).json({ message: 'Student not found' });
  }

  const {
    fullName,
    grade,
    parentName,
    parentPhone,
    monthlyFee,
    status,
    subjects,
  } = req.body;

  const student = await prisma.student.update({
    where: { id },
    data: {
      fullName,
      grade,
      parentName,
      parentPhone,
      monthlyFee,
      status,
      ...(subjects ? { subjects } : {}),
    },
  });

  return res.status(200).json(student);
};

export const archiveStudent = async (req: Request, res: Response) => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

  const existing = await prisma.student.findUnique({ where: { id } });
  if (!existing || existing.isArchived) {
    return res.status(404).json({ message: 'Student not found' });
  }

  await prisma.student.update({
    where: { id },
    data: {
      isArchived: true,
      status: 'inactive',
    },
  });

  return res.status(204).send();
};
