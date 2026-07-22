import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import authRoutes from './routes/auth';
import assessmentRoutes from './routes/assessment';

const app = express();
const PORT = process.env.PORT || 5000;

// Security & Logging Middlewares
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

import adminRoutes from './routes/admin';
import papersRoutes from './routes/papers';
import jobsRoutes from './routes/jobs';
import notificationsRoutes from './routes/notifications';

// ... (middlewares)

// Enterprise Routes
app.use('/api/auth', authRoutes);
app.use('/api/assessment', assessmentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/papers', papersRoutes);
app.use('/api/jobs', jobsRoutes);
app.use('/api/notifications', notificationsRoutes);

// Health Check
app.get('/', (req, res) => {
  res.json({ status: 'Online', engine: 'FreeNaukriAlert Enterprise API' });
});

app.listen(PORT, () => {
  console.log(`[FreeNaukriAlert] Enterprise Engine active on port ${PORT}`);
});
