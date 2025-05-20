import React from "react";
import { Box, Stack, Typography, Button, LinearProgress } from "@mui/material";

function WorkerProgressDisplay({ workerStatuses, activeWorkers, isExporting, exportFinished, setShowWorkerStatus }) {
  return (
    <Box sx={{ mt: 2, width: '100%', maxWidth: '600px' }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
        <Typography variant="subtitle2">
          {activeWorkers > 0 
            ? `Worker Status: ${activeWorkers} active workers` 
            : isExporting 
              ? "Initializing workers..."
              : "Export complete"}
        </Typography>
        {exportFinished && (
          <Button 
            size="small" 
            onClick={() => setShowWorkerStatus(false)} 
            variant="outlined"
            sx={{ fontSize: '0.7rem' }}
          >
            Hide Details
          </Button>
        )}
      </Stack>
      {workerStatuses.length === 0 ? (
        <Box sx={{ p: 2, textAlign: 'center' }}>
          {isExporting ? (
            <LinearProgress variant="indeterminate" />
          ) : (
            <Typography variant="body2">No active workers</Typography>
          )}
        </Box>
      ) : (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 1 }}>
          {workerStatuses.map((worker) => (
            <Box 
              key={worker.id}
              sx={{
                border: '1px solid',
                borderColor: worker.completed ? 'success.main' : worker.active ? 'primary.main' : 'error.main',
                borderRadius: 1,
                p: 1,
                minWidth: '100px',
                position: 'relative',
                backgroundColor: 'background.paper'
              }}
            >
              <Typography variant="caption" display="block">
                Worker {worker.id + 1}
              </Typography>
              <Typography variant="caption" display="block">
                {worker.imageCount} images
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={worker.progress} 
                sx={{ 
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: 'grey.300',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: worker.completed ? 'success.main' : 'primary.main'
                  }
                }} 
              />
              <Typography variant="caption" display="block" align="right">
                {worker.progress}%
              </Typography>
              <Typography variant="caption" display="block">
                Status: {worker.completed ? "Complete" : worker.active ? "Active" : "Error"}
              </Typography>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
}

export default WorkerProgressDisplay;
