import { Router } from 'express';
import {
  getTutorOnboarding,
  saveAvailability,
  saveDemoVideos,
  saveEducationHistory,
  saveExperience,
  saveLanguageSkills,
  submitApplication,
} from '../controllers/tutorOnboardingController.js';
import { requireAuth } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const tutorOnboardingRouter = Router();

tutorOnboardingRouter.use(requireAuth);

tutorOnboardingRouter.get('/', asyncHandler(getTutorOnboarding));
tutorOnboardingRouter.put('/languages', asyncHandler(saveLanguageSkills));
tutorOnboardingRouter.put('/education', asyncHandler(saveEducationHistory));
tutorOnboardingRouter.put('/experience', asyncHandler(saveExperience));
tutorOnboardingRouter.put('/availability', asyncHandler(saveAvailability));
tutorOnboardingRouter.put('/videos', asyncHandler(saveDemoVideos));
tutorOnboardingRouter.post('/submit', asyncHandler(submitApplication));

export default tutorOnboardingRouter;
