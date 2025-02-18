import { Request, Response } from 'express';
import Campaign from '../models/Campaign';
import Call from '../models/Call';
import logger from '../utils/logger';

// Create new campaign
export const createCampaign = async (req: Request, res: Response) => {
  try {
    const campaign = new Campaign(req.body);
    await campaign.save();
    
    res.status(201).json(campaign);
  } catch (error) {
    logger.error('Error creating campaign:', error);
    res.status(500).json({
      message: 'Error creating campaign',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Get all campaigns with filters
export const getCampaigns = async (req: Request, res: Response) => {
  try {
    const { status, search } = req.query;
    
    const query: any = {};
    
    if (status) {
      query.status = status;
    }
    
    if (search) {
      query.$text = { $search: search as string };
    }
    
    const campaigns = await Campaign.find(query).sort({ start_date: -1 });
    
    res.json(campaigns);
  } catch (error) {
    logger.error('Error fetching campaigns:', error);
    res.status(500).json({
      message: 'Error fetching campaigns',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Get campaign by ID with detailed metrics
export const getCampaignById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const campaign = await Campaign.findById(id);
    
    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }
    
    // Get campaign metrics
    const metrics = await Call.aggregate([
      {
        $match: { campaign_id: id }
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
    
    res.json({
      campaign,
      metrics: metrics[0] || {
        totalCalls: 0,
        answeredCalls: 0,
        appointments: 0,
        totalMinutes: 0,
        totalCost: 0,
        positiveCallsCount: 0
      }
    });
  } catch (error) {
    logger.error('Error fetching campaign:', error);
    res.status(500).json({
      message: 'Error fetching campaign',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Update campaign
export const updateCampaign = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const campaign = await Campaign.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }
    
    res.json(campaign);
  } catch (error) {
    logger.error('Error updating campaign:', error);
    res.status(500).json({
      message: 'Error updating campaign',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Delete campaign
export const deleteCampaign = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const campaign = await Campaign.findByIdAndDelete(id);
    
    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }
    
    res.json({ message: 'Campaign deleted successfully' });
  } catch (error) {
    logger.error('Error deleting campaign:', error);
    res.status(500).json({
      message: 'Error deleting campaign',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Get campaign performance metrics over time
export const getCampaignPerformance = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { startDate, endDate } = req.query;
    
    const query: any = {
      campaign_id: id
    };
    
    if (startDate && endDate) {
      query.timestamp = {
        $gte: new Date(startDate as string),
        $lte: new Date(endDate as string)
      };
    }
    
    const performance = await Call.aggregate([
      {
        $match: query
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
    
    res.json(performance);
  } catch (error) {
    logger.error('Error fetching campaign performance:', error);
    res.status(500).json({
      message: 'Error fetching campaign performance',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}; 