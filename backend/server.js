const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const topicsRouter = require('./routes/topics');
const peopleRouter = require('./routes/people');
const truthsRouter = require('./routes/truths');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api/topics', topicsRouter);
app.use('/api/people', peopleRouter);
app.use('/api/truths', truthsRouter);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Ice Breaker API is running!' });
});

// Serve frontend in production
const frontendDist = path.join(__dirname, '..', 'frontend', 'dist');
app.use(express.static(frontendDist));
app.get('*', (req, res) => {
  res.sendFile(path.join(frontendDist, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Ice Breaker API running on http://localhost:${PORT}`);
});
