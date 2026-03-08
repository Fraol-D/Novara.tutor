import type { Request, Response } from 'express';
import type { UserRole } from '@prisma/client';
import { prisma } from '../config/prisma.js';

const resolveRole = (role: unknown): UserRole | null => {
  if (role === 'PARENT' || role === 'TUTOR') {
    return role;
  }
  return null;
};

const findAuthUser = async (req: Request) => {
  const userId = req.user?.userId;
  if (!userId) {
    return null;
  }

  return prisma.user.findUnique({
    where: { id: userId },
    include: {
      tutorApplication: {
        select: {
          id: true,
          status: true,
          currentStep: true,
        },
      },
    },
  });
};

export const getSetupStatus = async (req: Request, res: Response) => {
  const user = await findAuthUser(req);

  if (!user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  return res.status(200).json({
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    role: user.role,
    country: user.country,
    state: user.state,
    phone: user.phone,
    profilePictureUrl: user.profilePictureUrl,
    setupStep: user.setupStep,
    setupCompleted: user.setupCompleted,
    tutorApplication: user.tutorApplication,
  });
};

export const updateLocationContact = async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const { country, state, phone } = req.body;

  if (!country || !phone) {
    return res.status(400).json({ message: 'Country and phone are required' });
  }

  const updated = await prisma.user.update({
    where: { id: userId },
    data: {
      country,
      state: state ?? null,
      phone,
      setupStep: {
        set: 2,
      },
    },
  });

  return res.status(200).json({
    country: updated.country,
    state: updated.state,
    phone: updated.phone,
    setupStep: updated.setupStep,
  });
};

export const updateProfilePicture = async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const { profilePictureUrl } = req.body;

  const updated = await prisma.user.update({
    where: { id: userId },
    data: {
      profilePictureUrl: profilePictureUrl || null,
      setupStep: {
        set: 3,
      },
    },
  });

  return res.status(200).json({
    profilePictureUrl: updated.profilePictureUrl,
    setupStep: updated.setupStep,
  });
};

export const selectAccountType = async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const role = resolveRole(req.body.role);
  if (!role) {
    return res.status(400).json({ message: 'Role must be PARENT or TUTOR' });
  }

  const user = await prisma.user.update({
    where: { id: userId },
    data: {
      role,
      setupStep: 3,
      setupCompleted: true,
    },
  });

  if (role === 'TUTOR') {
    await prisma.tutorApplication.upsert({
      where: { userId },
      create: { userId, currentStep: 1 },
      update: {},
    });
  }

  return res.status(200).json({
    role: user.role,
    setupCompleted: user.setupCompleted,
    setupStep: user.setupStep,
  });
};
