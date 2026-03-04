import app from './app.js';
import { env } from './config/env.js';

app.listen(env.PORT, () => {
  console.log(`TutorFlow API running on port ${env.PORT}`);
});
