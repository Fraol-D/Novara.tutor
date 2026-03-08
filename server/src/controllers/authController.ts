import type { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { prisma } from '../config/prisma.js';
import { signAccessToken } from '../utils/jwt.js';

export const register = async (req: Request, res: Response) => {
  const { email, password, firstName, lastName } = req.body;

  if (!email || !password || !firstName || !lastName) {
    return res.status(400).json({ message: 'Email, password, first name and last name are required' });
  }

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return res.status(409).json({ message: 'Email is already registered' });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      firstName,
      lastName,
      passwordHash,
    },
  });

  const accessToken = signAccessToken({ userId: user.id, email: user.email, role: user.role ?? null });

  return res.status(201).json({
    user: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      fullName: `${user.firstName} ${user.lastName}`,
      role: user.role,
      setupCompleted: user.setupCompleted,
      setupStep: user.setupStep,
    },
    accessToken,
  });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const passwordMatches = await bcrypt.compare(password, user.passwordHash);
  if (!passwordMatches) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const accessToken = signAccessToken({ userId: user.id, email: user.email, role: user.role ?? null });

  return res.status(200).json({
    user: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      fullName: `${user.firstName} ${user.lastName}`,
      role: user.role,
      country: user.country,
      state: user.state,
      phone: user.phone,
      profilePictureUrl: user.profilePictureUrl,
      setupCompleted: user.setupCompleted,
      setupStep: user.setupStep,
    },
    accessToken,
  });
};

export const me = async (req: Request, res: Response) => {
  if (!req.user?.userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const user = await prisma.user.findUnique({
    where: { id: req.user.userId },
    include: {
      tutorApplication: {
        select: {
          status: true,
          currentStep: true,
        },
      },
    },
  });

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  return res.status(200).json({
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    fullName: `${user.firstName} ${user.lastName}`,
    role: user.role,
    country: user.country,
    state: user.state,
    phone: user.phone,
    profilePictureUrl: user.profilePictureUrl,
    setupCompleted: user.setupCompleted,
    setupStep: user.setupStep,
    tutorApplication: user.tutorApplication,
  });
};
