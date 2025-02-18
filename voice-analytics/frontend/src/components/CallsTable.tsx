import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Button,
} from '@mui/material';
import { PlayArrow as PlayIcon, Article as TranscriptIcon, Close as CloseIcon } from '@mui/icons-material';
import { useState, useEffect, useRef } from 'react';

interface CallData {
  call_id: string;
  receivedAt: string;
  duration: number;
  user_sentiment: string;
  call_summary: string;
  recording_url: string;
  full_transcript: string;
  type: string;
  cost: number;
  call_status: string;
  disconnection_reason: string;
  end_to_end_latency: number;
}

interface CallsTableProps {
  viewMode: 'total' | 'percentage' | 'cost';
  pricePerMinute: number;
}

const CallsTable = ({ viewMode, pricePerMinute }: CallsTableProps) => {
  const [calls, setCalls] = useState<CallData[]>([]);
  const [selectedCall, setSelectedCall] = useState<CallData | null>(null);
  const [showTranscript, setShowTranscript] = useState(false);
  const [showPlayer, setShowPlayer] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Fetch calls from the backend
    fetch(`http://localhost:3001/api/calls?pricePerMinute=${pricePerMinute}`)
      .then(res => res.json())
      .then(data => setCalls(data))
      .catch(err => console.error('Error fetching calls:', err));
  }, [pricePerMinute]);

  const handlePlayRecording = async (call: CallData) => {
    if (!call.recording_url) {
      setError('No recording URL available for this call');
      setShowPlayer(true);
      return;
    }

    setIsLoading(true);
    setError('');
    setShowPlayer(true);

    try {
      // Check if the URL is accessible
      const response = await fetch(call.recording_url, { method: 'HEAD' });
      if (!response.ok) {
        throw new Error(`Failed to access recording: ${response.statusText}`);
      }

      // Set the audio source
      if (audioRef.current) {
        audioRef.current.src = call.recording_url;
        await audioRef.current.play();
      }
    } catch (err) {
      console.error('Error playing recording:', err);
      setError(`Failed to play recording: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClosePlayer = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setShowPlayer(false);
    setError('');
  };

  const handleViewTranscript = (call: CallData) => {
    setSelectedCall(call);
    setShowTranscript(true);
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Time</TableCell>
              <TableCell>Call Duration</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Cost</TableCell>
              <TableCell>Call ID</TableCell>
              <TableCell>Disconnection Reason</TableCell>
              <TableCell>Call Status</TableCell>
              <TableCell>User Sentiment</TableCell>
              <TableCell>From</TableCell>
              <TableCell>To</TableCell>
              <TableCell>Call Successful</TableCell>
              <TableCell>End to End Latency</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {calls.map((call) => (
              <TableRow key={call.call_id}>
                <TableCell>{new Date(call.receivedAt).toLocaleTimeString()}</TableCell>
                <TableCell>{formatDuration(call.duration)}</TableCell>
                <TableCell>{call.type || 'web_call'}</TableCell>
                <TableCell>${call.cost?.toFixed(3) || '0.000'}</TableCell>
                <TableCell>{call.call_id}</TableCell>
                <TableCell>{call.disconnection_reason || 'user hangup'}</TableCell>
                <TableCell>{call.call_status || 'ended'}</TableCell>
                <TableCell>{call.user_sentiment || 'Neutral'}</TableCell>
                <TableCell>-</TableCell>
                <TableCell>-</TableCell>
                <TableCell style={{ color: 'red' }}>Unsuccessful</TableCell>
                <TableCell>{call.end_to_end_latency || '2474ms'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={showTranscript}
        onClose={() => setShowTranscript(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Call Transcript</DialogTitle>
        <DialogContent>
          <Typography variant="body1" style={{ whiteSpace: 'pre-wrap' }}>
            {selectedCall?.full_transcript}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowTranscript(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={showPlayer}
        onClose={handleClosePlayer}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Call Recording
          <IconButton
            aria-label="close"
            onClick={handleClosePlayer}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {isLoading ? (
            <Box display="flex" justifyContent="center" p={3}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>
          ) : (
            <Box sx={{ width: '100%', mt: 2 }}>
              <audio ref={audioRef} controls style={{ width: '100%' }}>
                Your browser does not support the audio element.
              </audio>
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CallsTable; 