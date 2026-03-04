import { Router } from 'express';
import authRouter from './authRoutes.js';
import paymentRouter from './paymentRoutes.js';
import sessionRouter from './sessionRoutes.js';
import studentRouter from './studentRoutes.js';

const apiRouter = Router();

apiRouter.get('/health', (_req, res) => {
  res.status(200).json({ ok: true });
});

apiRouter.use('/auth', authRouter);
apiRouter.use('/students', studentRouter);
apiRouter.use('/sessions', sessionRouter);
apiRouter.use('/payments', paymentRouter);

export default apiRouter;
