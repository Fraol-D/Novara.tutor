import type { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { prisma } from '../config/prisma.js';
import { signAccessToken } from '../utils/jwt.js';

export const register = async (req: Request, res: Response) => {
  const { email, password, fullName } = req.body;

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
      fullName,
      passwordHash,
    },
  });

  const accessToken = signAccessToken({ userId: user.id, email: user.email });

  return res.status(201).json({
    user: {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
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

  const accessToken = signAccessToken({ userId: user.id, email: user.email });

  return res.status(200).json({
    user: {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
    },
    accessToken,
  });
};
