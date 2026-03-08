import type { ProficiencyLevel, Weekday } from '@prisma/client';
import type { Request, Response } from 'express';
import { prisma } from '../config/prisma.js';

const parseProficiency = (value: unknown): ProficiencyLevel | null => {
  if (value === 'NATIVE' || value === 'FLUENT' || value === 'COMFORTABLE') {
    return value;
  }
  return null;
};

const parseWeekday = (value: unknown): Weekday | null => {
  const weekdays: Weekday[] = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];
  return weekdays.includes(value as Weekday) ? (value as Weekday) : null;
};

const parseDate = (value: unknown): Date | null => {
  if (!value || typeof value !== 'string') {
    return null;
  }
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

const getApplication = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      tutorApplication: {
        include: {
          languageSkills: {
            include: {
              demoVideo: true,
            },
            orderBy: { createdAt: 'asc' },
          },
          educationEntries: { orderBy: { createdAt: 'asc' } },
          experienceEntries: { orderBy: { createdAt: 'asc' } },
          availabilitySlots: { orderBy: { createdAt: 'asc' } },
          languageDemoVideos: { orderBy: { createdAt: 'asc' } },
        },
      },
    },
  });

  if (!user) {
    return null;
  }

  if (user.role !== 'TUTOR') {
    return { user, application: null };
  }

  const application =
    user.tutorApplication ??
    (await prisma.tutorApplication.create({
      data: { userId: user.id },
      include: {
        languageSkills: { include: { demoVideo: true }, orderBy: { createdAt: 'asc' } },
        educationEntries: { orderBy: { createdAt: 'asc' } },
        experienceEntries: { orderBy: { createdAt: 'asc' } },
        availabilitySlots: { orderBy: { createdAt: 'asc' } },
        languageDemoVideos: { orderBy: { createdAt: 'asc' } },
      },
    }));

  return { user, application };
};

export const getTutorOnboarding = async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const data = await getApplication(userId);
  if (!data) {
    return res.status(404).json({ message: 'User not found' });
  }

  if (!data.application) {
    return res.status(403).json({ message: 'Only tutor accounts can access onboarding' });
  }

  return res.status(200).json(data.application);
};

export const saveLanguageSkills = async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const payload = req.body.languages as Array<{ language: string; proficiency: ProficiencyLevel }> | undefined;

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (!payload || payload.length === 0) {
    return res.status(400).json({ message: 'At least one language is required' });
  }

  const data = await getApplication(userId);
  if (!data?.application) {
    return res.status(403).json({ message: 'Only tutor accounts can save language skills' });
  }

  const normalized = payload
    .map((item) => ({ language: item.language?.trim(), proficiency: parseProficiency(item.proficiency) }))
    .filter((item) => item.language && item.proficiency) as Array<{ language: string; proficiency: ProficiencyLevel }>;

  if (normalized.length === 0) {
    return res.status(400).json({ message: 'Invalid language payload' });
  }

  await prisma.$transaction(async (tx) => {
    await tx.languageDemoVideo.deleteMany({ where: { applicationId: data.application!.id } });
    await tx.languageSkill.deleteMany({ where: { applicationId: data.application!.id } });
    await tx.languageSkill.createMany({
      data: normalized.map((item) => ({
        applicationId: data.application!.id,
        language: item.language,
        proficiency: item.proficiency,
      })),
    });
    await tx.tutorApplication.update({ where: { id: data.application!.id }, data: { currentStep: 1 } });
  });

  const updated = await getApplication(userId);
  return res.status(200).json(updated?.application);
};

export const saveEducationHistory = async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const entries = req.body.entries as Array<{
    type: 'HIGH_SCHOOL' | 'COLLEGE' | 'OTHER_CERTIFICATION';
    institutionName: string;
    studyArea?: string;
    startDate?: string;
    endDate?: string;
    completedYear?: number;
    graduated?: boolean;
    transcriptUrl?: string;
    certificateUrl?: string;
  }> | undefined;

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const data = await getApplication(userId);
  if (!data?.application) {
    return res.status(403).json({ message: 'Only tutor accounts can save education history' });
  }

  await prisma.$transaction(async (tx) => {
    await tx.educationEntry.deleteMany({ where: { applicationId: data.application!.id } });

    if (entries && entries.length > 0) {
      await tx.educationEntry.createMany({
        data: entries.map((entry) => ({
          applicationId: data.application!.id,
          type: entry.type,
          institutionName: entry.institutionName,
          studyArea: entry.studyArea || null,
          startDate: parseDate(entry.startDate),
          endDate: parseDate(entry.endDate),
          completedYear: entry.completedYear ?? null,
          graduated: Boolean(entry.graduated),
          transcriptUrl: entry.transcriptUrl || null,
          certificateUrl: entry.certificateUrl || null,
        })),
      });
    }

    await tx.tutorApplication.update({ where: { id: data.application!.id }, data: { currentStep: 2 } });
  });

  const updated = await getApplication(userId);
  return res.status(200).json(updated?.application);
};

export const saveExperience = async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const entries = req.body.entries as Array<{
    type: 'TEACHING' | 'WORK';
    organizationName: string;
    title: string;
    description?: string;
    startDate?: string;
    endDate?: string;
    currentlyWorking?: boolean;
  }> | undefined;

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const data = await getApplication(userId);
  if (!data?.application) {
    return res.status(403).json({ message: 'Only tutor accounts can save experience' });
  }

  await prisma.$transaction(async (tx) => {
    await tx.experienceEntry.deleteMany({ where: { applicationId: data.application!.id } });

    if (entries && entries.length > 0) {
      await tx.experienceEntry.createMany({
        data: entries.map((entry) => ({
          applicationId: data.application!.id,
          type: entry.type,
          organizationName: entry.organizationName,
          title: entry.title,
          description: entry.description || null,
          startDate: parseDate(entry.startDate),
          endDate: parseDate(entry.endDate),
          currentlyWorking: Boolean(entry.currentlyWorking),
        })),
      });
    }

    await tx.tutorApplication.update({ where: { id: data.application!.id }, data: { currentStep: 3 } });
  });

  const updated = await getApplication(userId);
  return res.status(200).json(updated?.application);
};

export const saveAvailability = async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const slots = req.body.slots as Array<{
    day: Weekday;
    startTime: string;
    endTime: string;
    timezone?: string;
    totalHours?: number;
  }> | undefined;

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const data = await getApplication(userId);
  if (!data?.application) {
    return res.status(403).json({ message: 'Only tutor accounts can save availability' });
  }

  await prisma.$transaction(async (tx) => {
    await tx.tutorAvailability.deleteMany({ where: { applicationId: data.application!.id } });

    if (slots && slots.length > 0) {
      const normalized = slots
        .map((slot) => ({
          day: parseWeekday(slot.day),
          startTime: slot.startTime,
          endTime: slot.endTime,
          timezone: slot.timezone || 'Local',
          totalHours: slot.totalHours,
        }))
        .filter((slot) => slot.day && slot.startTime && slot.endTime) as Array<{
          day: Weekday;
          startTime: string;
          endTime: string;
          timezone: string;
          totalHours?: number;
        }>;

      if (normalized.length > 0) {
        await tx.tutorAvailability.createMany({
          data: normalized.map((slot) => ({
            applicationId: data.application!.id,
            day: slot.day,
            startTime: slot.startTime,
            endTime: slot.endTime,
            timezone: slot.timezone,
            totalHours: slot.totalHours,
          })),
        });
      }
    }

    await tx.tutorApplication.update({ where: { id: data.application!.id }, data: { currentStep: 4 } });
  });

  const updated = await getApplication(userId);
  return res.status(200).json(updated?.application);
};

export const saveDemoVideos = async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const videos = req.body.videos as Array<{ language: string; url: string }> | undefined;

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const data = await getApplication(userId);
  if (!data?.application) {
    return res.status(403).json({ message: 'Only tutor accounts can save demo videos' });
  }

  const skillMap = new Map(data.application.languageSkills.map((skill) => [skill.language.toLowerCase(), skill.id]));
  const normalized = (videos ?? [])
    .map((video) => ({
      languageSkillId: skillMap.get(video.language.toLowerCase()),
      url: video.url?.trim(),
    }))
    .filter((video): video is { languageSkillId: string; url: string } => Boolean(video.languageSkillId && video.url));

  await prisma.$transaction(async (tx) => {
    await tx.languageDemoVideo.deleteMany({ where: { applicationId: data.application!.id } });

    if (normalized.length > 0) {
      await tx.languageDemoVideo.createMany({
        data: normalized.map((video) => ({
          applicationId: data.application!.id,
          languageSkillId: video.languageSkillId,
          url: video.url,
        })),
      });
    }

    await tx.tutorApplication.update({ where: { id: data.application!.id }, data: { currentStep: 5 } });
  });

  const updated = await getApplication(userId);
  return res.status(200).json(updated?.application);
};

export const submitApplication = async (req: Request, res: Response) => {
  const userId = req.user?.userId;

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const data = await getApplication(userId);
  if (!data?.application) {
    return res.status(403).json({ message: 'Only tutor accounts can submit applications' });
  }

  if (data.application.languageSkills.length === 0) {
    return res.status(400).json({ message: 'Add at least one language before submitting' });
  }

  if (data.application.languageDemoVideos.length < data.application.languageSkills.length) {
    return res.status(400).json({ message: 'A demo video is required for each language' });
  }

  const submitted = await prisma.tutorApplication.update({
    where: { id: data.application.id },
    data: {
      status: 'SUBMITTED',
      currentStep: 6,
      submittedAt: new Date(),
    },
    include: {
      languageSkills: {
        include: { demoVideo: true },
      },
      educationEntries: true,
      experienceEntries: true,
      availabilitySlots: true,
      languageDemoVideos: true,
    },
  });

  return res.status(200).json(submitted);
};
