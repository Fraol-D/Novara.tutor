import { Router } from 'express';
import {
  createChild,
  getAcademicGps,
  getAssessmentReports,
  getParentDashboard,
  listChildren,
  replaceChildTimeSlots,
  updateChild,
} from '../controllers/parentController.js';
import { requireAuth } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const parentRouter = Router();

parentRouter.use(requireAuth);

parentRouter.get('/dashboard', asyncHandler(getParentDashboard));
parentRouter.get('/children', asyncHandler(listChildren));
parentRouter.post('/children', asyncHandler(createChild));
parentRouter.put('/children/:id', asyncHandler(updateChild));
parentRouter.put('/children/:id/time-slots', asyncHandler(replaceChildTimeSlots));
parentRouter.get('/academic-gps', asyncHandler(getAcademicGps));
parentRouter.get('/assessment-reports', asyncHandler(getAssessmentReports));

export default parentRouter;
