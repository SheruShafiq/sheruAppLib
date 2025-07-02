import React, { useState, useEffect } from "react";
import { 
  Dialog, 
  DialogTitle, 
  DialogContent,
  DialogActions,
  Button,
  Slider,
  Typography,
  FormControlLabel,
  Switch,
  Box
} from "@mui/material";

interface WorkerConfigProps {
  open: boolean;
  onClose: () => void;
}
  const maxWorkers = Math.min(navigator.hardwareConcurrency * 2 || 8, 16);

export default function WorkerConfig({ open, onClose }: WorkerConfigProps) {
  const [workerCount, setWorkerCount] = useState(
   Math.min(maxWorkers / 3, 4)
  );
  const [autoDownload, setAutoDownload] = useState(
    localStorage.getItem("badge.autoDownload") === "true"
  );
  

  const handleSave = () => {
    localStorage.setItem("badge.workers", workerCount.toString());
    localStorage.setItem("badge.autoDownload", autoDownload.toString());
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Worker Configuration</DialogTitle>
      <DialogContent>
        <Box sx={{ minWidth: 300, mt: 2 }}>
          <Typography id="worker-slider" gutterBottom>
            Number of PDF Workers: {workerCount}
          </Typography>
          <Slider
            value={workerCount}
            onChange={(_, value) => setWorkerCount(value as number)}
            aria-labelledby="worker-slider"
            valueLabelDisplay="auto"
            step={1}
            marks
            min={1}
            max={maxWorkers}
          />
          
          <Typography variant="caption" color="text.secondary">
            Your device has {navigator.hardwareConcurrency} CPU cores.
            Using too many workers may slow down your device.
          </Typography>
          
          <Box sx={{ mt: 3 }}>
            <FormControlLabel
              control={
                <Switch 
                  checked={autoDownload}
                  onChange={(e) => setAutoDownload(e.target.checked)}
                />
              }
              label="Auto-download PDF when ready"
            />
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained">Save</Button>
      </DialogActions>
    </Dialog>
  );
}
