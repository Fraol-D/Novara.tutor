import { Router } from 'express';
import accountRouter from './accountRoutes.js';
import authRouter from './authRoutes.js';
import parentRouter from './parentRoutes.js';
import tutorOnboardingRouter from './tutorOnboardingRoutes.js';

const apiRouter = Router();

apiRouter.get('/health', (_req, res) => {
  res.status(200).json({ ok: true });
});

apiRouter.use('/auth', authRouter);
apiRouter.use('/account', accountRouter);
apiRouter.use('/parent', parentRouter);
apiRouter.use('/tutor-onboarding', tutorOnboardingRouter);

export default apiRouter;
