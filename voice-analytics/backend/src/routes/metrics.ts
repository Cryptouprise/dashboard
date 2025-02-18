import { Router } from 'express';
import { CallData } from '../models/CallData';
import logger from '../utils/logger';

const router = Router();

interface Metrics {
  totalCalls: number;
  totalMinutes: number;
  answeredCalls: number;
  noAnswers: number;
  didNotConnect: number;
  transfers: number;
  appointments: number;
  totalSpent: number;
}

interface PerformanceData {
  date: string;
  calls: number;
  answers: number;
  appointments: number;
  totalSpent: number;
}

// Get all metrics with cost calculations
router.get('/metrics', async (req, res) => {
  try {
    const pricePerMinute = parseFloat(req.query.pricePerMinute as string) || 0.07;
    const fromDate = req.query.from ? new Date(req.query.from as string) : new Date(0);
    const toDate = req.query.to ? new Date(req.query.to as string) : new Date();
    const agent = req.query.agent as string;

    const query: any = {
      receivedAt: { $gte: fromDate, $lte: toDate }
    };
    if (agent) {
      query.agent_id = agent;
    }

    const calls = await CallData.find(query);
    
    const metrics = calls.reduce((acc: Metrics, call) => {
      const durationMinutes = call.duration / 60;
      const callCost = durationMinutes * pricePerMinute;
      
      return {
        totalCalls: acc.totalCalls + 1,
        totalMinutes: acc.totalMinutes + durationMinutes,
        answeredCalls: acc.answeredCalls + (call.answered ? 1 : 0),
        noAnswers: acc.noAnswers + (!call.answered ? 1 : 0),
        didNotConnect: acc.didNotConnect + (call.status === 'failed' ? 1 : 0),
        transfers: acc.transfers + (call.transferred ? 1 : 0),
        appointments: acc.appointments + (call.appointment_scheduled ? 1 : 0),
        totalSpent: acc.totalSpent + callCost
      };
    }, {
      totalCalls: 0,
      totalMinutes: 0,
      answeredCalls: 0,
      noAnswers: 0,
      didNotConnect: 0,
      transfers: 0,
      appointments: 0,
      totalSpent: 0
    });

    res.json(metrics);
  } catch (error) {
    logger.error('Error fetching metrics:', error);
    res.status(500).json({ error: 'Failed to fetch metrics' });
  }
});

// Get performance metrics over time
router.get('/metrics/performance', async (req, res) => {
  try {
    const pricePerMinute = parseFloat(req.query.pricePerMinute as string) || 0.07;
    const days = 7; // Last 7 days of data

    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const calls = await CallData.find({
      receivedAt: { $gte: startDate, $lte: endDate }
    });

    const performanceData = calls.reduce((acc: Record<string, PerformanceData>, call) => {
      const date = new Date(call.receivedAt).toLocaleDateString();
      if (!acc[date]) {
        acc[date] = {
          date,
          calls: 0,
          answers: 0,
          appointments: 0,
          totalSpent: 0
        };
      }

      const durationMinutes = call.duration / 60;
      const callCost = durationMinutes * pricePerMinute;

      acc[date].calls++;
      if (call.answered) acc[date].answers++;
      if (call.appointment_scheduled) acc[date].appointments++;
      acc[date].totalSpent += callCost;

      return acc;
    }, {});

    const sortedData = Object.values(performanceData).sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    res.json(sortedData);
  } catch (error) {
    logger.error('Error fetching performance metrics:', error);
    res.status(500).json({ error: 'Failed to fetch performance metrics' });
  }
});

// Get all calls with cost calculations
router.get('/calls', async (req, res) => {
  try {
    const pricePerMinute = parseFloat(req.query.pricePerMinute as string) || 0.07;
    const calls = await CallData.find().sort({ receivedAt: -1 }).limit(50);

    const callsWithCost = calls.map(call => {
      const durationMinutes = call.duration / 60;
      const callCost = durationMinutes * pricePerMinute;
      
      return {
        ...call.toJSON(),
        cost: callCost
      };
    });

    res.json(callsWithCost);
  } catch (error) {
    logger.error('Error fetching calls:', error);
    res.status(500).json({ error: 'Failed to fetch calls' });
  }
});

export default router; 