import { Router } from 'express';
import {
  archiveStudent,
  createStudent,
  getStudentById,
  listStudents,
  updateStudent,
} from '../controllers/studentController.js';
import { requireAuth } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const studentRouter = Router();

studentRouter.use(requireAuth);

studentRouter.get('/', asyncHandler(listStudents));
studentRouter.get('/:id', asyncHandler(getStudentById));
studentRouter.post('/', asyncHandler(createStudent));
studentRouter.put('/:id', asyncHandler(updateStudent));
studentRouter.delete('/:id', asyncHandler(archiveStudent));

export default studentRouter;
