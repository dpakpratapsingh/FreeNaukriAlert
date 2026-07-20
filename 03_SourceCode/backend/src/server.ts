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

// Enterprise Routes
app.use('/api/auth', authRoutes);
app.use('/api/assessment', assessmentRoutes);

// Health Check
app.get('/', (req, res) => {
  res.json({ status: 'Online', engine: 'FreeNaukriAlert Enterprise API' });
});

app.listen(PORT, () => {
  console.log(`[FreeNaukriAlert] Enterprise Engine active on port ${PORT}`);
});
