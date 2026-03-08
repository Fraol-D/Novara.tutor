import type { PackagePlan, ReportType, Weekday } from '@prisma/client';
import type { Request, Response } from 'express';
import { prisma } from '../config/prisma.js';

const parseWeekday = (value: unknown): Weekday | null => {
  const weekdays: Weekday[] = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];
  return weekdays.includes(value as Weekday) ? (value as Weekday) : null;
};

const parsePackage = (value: unknown): PackagePlan | null => {
  if (value === 'GROW' || value === 'THRIVE' || value === 'EXCEL') {
    return value;
  }
  return null;
};

const parseReportType = (value: unknown): ReportType | null => {
  if (value === 'MASTERY' || value === 'PREREQUISITE') {
    return value;
  }
  return null;
};

const parseDate = (value: unknown): Date | null => {
  if (!value || typeof value !== 'string') {
    return null;
  }
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const getParent = async (req: Request) => {
  const userId = req.user?.userId;
  if (!userId) {
    return null;
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user || user.role !== 'PARENT') {
    return null;
  }

  return user;
};

export const getParentDashboard = async (req: Request, res: Response) => {
  const parent = await getParent(req);
  if (!parent) {
    return res.status(403).json({ message: 'Only parent accounts can access this route' });
  }

  const children = await prisma.parentChild.findMany({
    where: { parentId: parent.id },
    include: {
      timeSlots: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  return res.status(200).json({
    parent: {
      id: parent.id,
      fullName: `${parent.firstName} ${parent.lastName}`,
      email: parent.email,
    },
    children,
  });
};

export const listChildren = async (req: Request, res: Response) => {
  const parent = await getParent(req);
  if (!parent) {
    return res.status(403).json({ message: 'Only parent accounts can access this route' });
  }

  const children = await prisma.parentChild.findMany({
    where: { parentId: parent.id },
    include: { timeSlots: true },
    orderBy: { createdAt: 'desc' },
  });

  return res.status(200).json(children);
};

export const createChild = async (req: Request, res: Response) => {
  const parent = await getParent(req);
  if (!parent) {
    return res.status(403).json({ message: 'Only parent accounts can access this route' });
  }

  const {
    firstName,
    lastName,
    dateOfBirth,
    grade,
    country,
    state,
    schoolInUsa,
    packagePlan,
    profilePictureUrl,
    notes,
    timeSlots,
  } = req.body;

  if (!firstName || !lastName) {
    return res.status(400).json({ message: 'Child first name and last name are required' });
  }

  const selectedPackage = parsePackage(packagePlan);

  const created = await prisma.parentChild.create({
    data: {
      parentId: parent.id,
      firstName,
      lastName,
      dateOfBirth: parseDate(dateOfBirth),
      grade: grade || null,
      country: country || null,
      state: state || null,
      schoolInUsa: typeof schoolInUsa === 'boolean' ? schoolInUsa : null,
      packagePlan: selectedPackage,
      profilePictureUrl: profilePictureUrl || null,
      notes: notes || null,
      timeSlots: {
        create: Array.isArray(timeSlots)
          ? timeSlots
              .map((slot) => ({
                day: parseWeekday(slot.day),
                startTime: slot.startTime,
                endTime: slot.endTime,
                timezone: slot.timezone || 'Local',
              }))
              .filter((slot): slot is { day: Weekday; startTime: string; endTime: string; timezone: string } =>
                Boolean(slot.day && slot.startTime && slot.endTime)
              )
          : [],
      },
    },
    include: {
      timeSlots: true,
    },
  });

  return res.status(201).json(created);
};

export const updateChild = async (req: Request, res: Response) => {
  const parent = await getParent(req);
  if (!parent) {
    return res.status(403).json({ message: 'Only parent accounts can access this route' });
  }

  const childId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const existing = await prisma.parentChild.findFirst({
    where: { id: childId, parentId: parent.id },
  });

  if (!existing) {
    return res.status(404).json({ message: 'Child not found' });
  }

  const {
    firstName,
    lastName,
    dateOfBirth,
    grade,
    country,
    state,
    schoolInUsa,
    packagePlan,
    profilePictureUrl,
    notes,
  } = req.body;

  const updated = await prisma.parentChild.update({
    where: { id: childId },
    data: {
      firstName: firstName ?? existing.firstName,
      lastName: lastName ?? existing.lastName,
      dateOfBirth: dateOfBirth === undefined ? existing.dateOfBirth : parseDate(dateOfBirth),
      grade: grade ?? existing.grade,
      country: country ?? existing.country,
      state: state ?? existing.state,
      schoolInUsa: typeof schoolInUsa === 'boolean' ? schoolInUsa : existing.schoolInUsa,
      packagePlan: packagePlan === undefined ? existing.packagePlan : parsePackage(packagePlan),
      profilePictureUrl: profilePictureUrl ?? existing.profilePictureUrl,
      notes: notes ?? existing.notes,
    },
    include: {
      timeSlots: true,
    },
  });

  return res.status(200).json(updated);
};

export const replaceChildTimeSlots = async (req: Request, res: Response) => {
  const parent = await getParent(req);
  if (!parent) {
    return res.status(403).json({ message: 'Only parent accounts can access this route' });
  }

  const childId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const existing = await prisma.parentChild.findFirst({ where: { id: childId, parentId: parent.id } });
  if (!existing) {
    return res.status(404).json({ message: 'Child not found' });
  }

  const slots = Array.isArray(req.body.slots)
    ? (req.body.slots as Array<{ day: Weekday; startTime: string; endTime: string; timezone?: string }>)
    : [];

  await prisma.$transaction(async (tx) => {
    await tx.childTimeSlot.deleteMany({ where: { childId } });

    const normalized = slots
      .map((slot: { day: Weekday; startTime: string; endTime: string; timezone?: string }) => ({
        day: parseWeekday(slot.day),
        startTime: slot.startTime,
        endTime: slot.endTime,
        timezone: slot.timezone || 'Local',
      }))
      .filter((slot: { day: Weekday | null; startTime: string; endTime: string; timezone: string }): slot is { day: Weekday; startTime: string; endTime: string; timezone: string } =>
        Boolean(slot.day && slot.startTime && slot.endTime)
      );

    if (normalized.length > 0) {
      await tx.childTimeSlot.createMany({
        data: normalized.map((slot: { day: Weekday; startTime: string; endTime: string; timezone: string }) => ({
          childId,
          day: slot.day,
          startTime: slot.startTime,
          endTime: slot.endTime,
          timezone: slot.timezone,
        })),
      });
    }
  });

  const child = await prisma.parentChild.findUnique({
    where: { id: childId },
    include: { timeSlots: true },
  });

  return res.status(200).json(child);
};

export const getAcademicGps = async (req: Request, res: Response) => {
  const parent = await getParent(req);
  if (!parent) {
    return res.status(403).json({ message: 'Only parent accounts can access this route' });
  }

  const childId = typeof req.query.childId === 'string' ? req.query.childId : undefined;
  const subject = typeof req.query.subject === 'string' ? req.query.subject : 'General';

  if (!childId) {
    return res.status(200).json({
      child: null,
      customSyllabus: [],
      academicRoadmap: [],
      message: 'Select a child to view syllabus and roadmap',
    });
  }

  const child = await prisma.parentChild.findFirst({
    where: { id: childId, parentId: parent.id },
    include: {
      syllabusEntries: {
        where: { subject },
      },
      roadmapEntries: {
        where: { subject },
      },
    },
  });

  if (!child) {
    return res.status(404).json({ message: 'Child not found' });
  }

  return res.status(200).json({
    child,
    customSyllabus: child.syllabusEntries,
    academicRoadmap: child.roadmapEntries,
  });
};

export const getAssessmentReports = async (req: Request, res: Response) => {
  const parent = await getParent(req);
  if (!parent) {
    return res.status(403).json({ message: 'Only parent accounts can access this route' });
  }

  const childId = typeof req.query.childId === 'string' ? req.query.childId : undefined;
  const subject = typeof req.query.subject === 'string' ? req.query.subject : undefined;
  const type = parseReportType(req.query.type);

  const reports = await prisma.assessmentReport.findMany({
    where: {
      parentId: parent.id,
      ...(childId ? { childId } : {}),
      ...(subject ? { subject } : {}),
      ...(type ? { type } : {}),
    },
    include: {
      child: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
        },
      },
    },
    orderBy: { publishedAt: 'desc' },
  });

  return res.status(200).json(reports);
};
