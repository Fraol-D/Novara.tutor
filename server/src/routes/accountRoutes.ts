import { Router } from 'express';
import {
  getSetupStatus,
  selectAccountType,
  updateLocationContact,
  updateProfilePicture,
} from '../controllers/accountController.js';
import { requireAuth } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const accountRouter = Router();

accountRouter.use(requireAuth);

accountRouter.get('/setup', asyncHandler(getSetupStatus));
accountRouter.patch('/setup/location', asyncHandler(updateLocationContact));
accountRouter.patch('/setup/profile-picture', asyncHandler(updateProfilePicture));
accountRouter.patch('/setup/role', asyncHandler(selectAccountType));

export default accountRouter;
