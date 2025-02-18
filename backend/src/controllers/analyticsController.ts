import { Request, Response } from 'express';
import Call from '../models/Call';
import logger from '../utils/logger';

interface DateRange {
  startDate?: Date;
  endDate?: Date;
}

interface FilterOptions extends DateRange {
  campaign_id?: string;
  agent_id?: string;
  user_sentiment?: string;
  duration_range?: {
    min: number;
    max: number;
  };
}

// Get aggregated metrics for the dashboard
export const getMetrics = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate, campaign_id, agent_id } = req.query;
    
    const query: FilterOptions = {};
    
    if (startDate && endDate) {
      query.startDate = new Date(startDate as string);
      query.endDate = new Date(endDate as string);
    }
    
    if (campaign_id) query.campaign_id = campaign_id as string;
    if (agent_id) query.agent_id = agent_id as string;

    const metrics = await Call.aggregate([
      {
        $match: {
          ...(query.startDate && query.endDate ? {
            timestamp: {
              $gte: query.startDate,
              $lte: query.endDate
            }
          } : {}),
          ...(query.campaign_id ? { campaign_id: query.campaign_id } : {}),
          ...(query.agent_id ? { agent_id: query.agent_id } : {})
        }
      },
      {
        $group: {
          _id: null,
          totalCalls: { $sum: 1 },
          answeredCalls: {
            $sum: {
              $cond: [{ $eq: ["$call_completion", true] }, 1, 0]
            }
          },
          appointments: {
            $sum: {
              $cond: [{ $eq: ["$appointment_scheduled", true] }, 1, 0]
            }
          },
          totalMinutes: { $sum: "$call_duration_minutes" },
          totalCost: { $sum: "$total_cost" },
          positiveCallsCount: {
            $sum: {
              $cond: [{ $eq: ["$user_sentiment", "Positive"] }, 1, 0]
            }
          }
        }
      }
    ]);

    res.json(metrics[0] || {
      totalCalls: 0,
      answeredCalls: 0,
      appointments: 0,
      totalMinutes: 0,
      totalCost: 0,
      positiveCallsCount: 0
    });
  } catch (error) {
    logger.error('Error fetching metrics:', error);
    res.status(500).json({
      message: 'Error fetching metrics',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Get daily metrics for charts
export const getDailyMetrics = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate, campaign_id, agent_id } = req.query;
    
    const query: FilterOptions = {};
    
    if (startDate && endDate) {
      query.startDate = new Date(startDate as string);
      query.endDate = new Date(endDate as string);
    }
    
    if (campaign_id) query.campaign_id = campaign_id as string;
    if (agent_id) query.agent_id = agent_id as string;

    const dailyMetrics = await Call.aggregate([
      {
        $match: {
          ...(query.startDate && query.endDate ? {
            timestamp: {
              $gte: query.startDate,
              $lte: query.endDate
            }
          } : {}),
          ...(query.campaign_id ? { campaign_id: query.campaign_id } : {}),
          ...(query.agent_id ? { agent_id: query.agent_id } : {})
        }
      },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } }
          },
          totalCalls: { $sum: 1 },
          answeredCalls: {
            $sum: {
              $cond: [{ $eq: ["$call_completion", true] }, 1, 0]
            }
          },
          appointments: {
            $sum: {
              $cond: [{ $eq: ["$appointment_scheduled", true] }, 1, 0]
            }
          },
          totalMinutes: { $sum: "$call_duration_minutes" },
          totalCost: { $sum: "$total_cost" }
        }
      },
      {
        $sort: { "_id.date": 1 }
      }
    ]);

    res.json(dailyMetrics);
  } catch (error) {
    logger.error('Error fetching daily metrics:', error);
    res.status(500).json({
      message: 'Error fetching daily metrics',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Get agent performance metrics
export const getAgentMetrics = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate, campaign_id } = req.query;
    
    const query: FilterOptions = {};
    
    if (startDate && endDate) {
      query.startDate = new Date(startDate as string);
      query.endDate = new Date(endDate as string);
    }
    
    if (campaign_id) query.campaign_id = campaign_id as string;

    const agentMetrics = await Call.aggregate([
      {
        $match: {
          ...(query.startDate && query.endDate ? {
            timestamp: {
              $gte: query.startDate,
              $lte: query.endDate
            }
          } : {}),
          ...(query.campaign_id ? { campaign_id: query.campaign_id } : {}),
          agent_id: { $exists: true }
        }
      },
      {
        $group: {
          _id: "$agent_id",
          totalCalls: { $sum: 1 },
          answeredCalls: {
            $sum: {
              $cond: [{ $eq: ["$call_completion", true] }, 1, 0]
            }
          },
          appointments: {
            $sum: {
              $cond: [{ $eq: ["$appointment_scheduled", true] }, 1, 0]
            }
          },
          totalMinutes: { $sum: "$call_duration_minutes" },
          totalCost: { $sum: "$total_cost" },
          positiveCallsCount: {
            $sum: {
              $cond: [{ $eq: ["$user_sentiment", "Positive"] }, 1, 0]
            }
          }
        }
      },
      {
        $project: {
          agent_id: "$_id",
          totalCalls: 1,
          answeredCalls: 1,
          appointments: 1,
          totalMinutes: 1,
          totalCost: 1,
          positiveCallsCount: 1,
          successRate: {
            $multiply: [
              { $divide: ["$appointments", "$totalCalls"] },
              100
            ]
          }
        }
      },
      {
        $sort: { successRate: -1 }
      }
    ]);

    res.json(agentMetrics);
  } catch (error) {
    logger.error('Error fetching agent metrics:', error);
    res.status(500).json({
      message: 'Error fetching agent metrics',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Get real-time metrics (last hour)
export const getRealTimeMetrics = async (req: Request, res: Response) => {
  try {
    const lastHour = new Date(Date.now() - 60 * 60 * 1000);

    const realTimeMetrics = await Call.aggregate([
      {
        $match: {
          timestamp: { $gte: lastHour }
        }
      },
      {
        $group: {
          _id: {
            minute: {
              $dateToString: {
                format: "%Y-%m-%d %H:%M",
                date: "$timestamp"
              }
            }
          },
          totalCalls: { $sum: 1 },
          answeredCalls: {
            $sum: {
              $cond: [{ $eq: ["$call_completion", true] }, 1, 0]
            }
          },
          appointments: {
            $sum: {
              $cond: [{ $eq: ["$appointment_scheduled", true] }, 1, 0]
            }
          }
        }
      },
      {
        $sort: { "_id.minute": 1 }
      }
    ]);

    res.json(realTimeMetrics);
  } catch (error) {
    logger.error('Error fetching real-time metrics:', error);
    res.status(500).json({
      message: 'Error fetching real-time metrics',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}; 