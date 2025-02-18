import express from 'express';
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'Agent routes' });
});

export default router; 