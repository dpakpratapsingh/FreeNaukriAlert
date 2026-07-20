const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const app = express();
const PORT = process.env.PORT || 5000;

// Security and utility middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Core Route
app.get('/health', (req, res) => {
  res.json({
    status: 'active',
    message: 'Free Naukri Alert Engine is running.',
    timestamp: new Date().toISOString()
  });
});

const authRoutes = require('./routes/auth');
const assessmentRoutes = require('./routes/assessment');

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/assessment', assessmentRoutes);

app.listen(PORT, () => {
  console.log(`🚀 [FreeNaukriAlert] Backend Engine listening on port ${PORT}`);
});
