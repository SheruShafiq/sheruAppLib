import { useState, forwardRef, useCallback } from "react";
import { useSnackbar, SnackbarContent } from "notistack";
import Collapse from "@mui/material/Collapse";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import React from "react";


export type ReportCompleteProps = {
  id: string;
  userFreindlyMessage: string;
  errorMessage: string;
  error: Error;
};

const CustomErrorSnackBar = forwardRef<HTMLDivElement, ReportCompleteProps>(({ id, ...props }, ref) => {
  const { userFreindlyMessage, error } = props;
  const { closeSnackbar } = useSnackbar();
  const [expanded, setExpanded] = useState(false);

  const handleExpandClick = useCallback(() => {
    setExpanded((oldExpanded) => !oldExpanded);
  }, []);

  const handleDismiss = useCallback(() => {
    closeSnackbar(id);
  }, [id, closeSnackbar]);

  // Highlight helper for stack trace lines
  const highlightLine = (line) => {
    // Matches lines like: "at functionName (fileName:line:column)"
    const regex = /at\s+([^\s]+)\s+\(([^)]+)\)/;
    const match = line.match(regex);
    if (match) {
      const prefix = line.substring(0, match.index);
      return (
        <>
          {prefix}at{" "}
          <span style={{ color: "secondary.main", fontWeight: "bold" }}>
            {match[1]}
          </span>{" "}
          (<span style={{ color: "grey" }}>{match[2]}</span>)
        </>
      );
    }
    return line;
  };

  return (
    <SnackbarContent ref={ref}>
      <Alert
        variant="outlined"
        severity="error"
        sx={{
          alignItems: "center",
          border: "1px solid #ffffff1f",
          width: expanded ? "500px" : "410px", // dynamic width based on expanded state
          transition: "width 0.5s ease",
          overflow: "hidden",
        }}
      >
        <Stack
          direction="row"
          gap={1}
          alignItems="center"
          justifyContent={"space-between"}
          pb={expanded ? 1 : 0}
        >
          <Typography>{userFreindlyMessage}</Typography>
          <Stack direction="row" alignItems="center">
            <IconButton
              aria-label="Show more"
              size="small"
              onClick={handleExpandClick}
            >
              <ExpandMoreIcon />
            </IconButton>
            <IconButton size="small" onClick={handleDismiss}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Stack>
        </Stack>

        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <Stack
            bgcolor={"#ffffff0d"}
            p={1}
            gap={0.5}
            borderRadius={1}
            alignItems={"flex-start"}
            textOverflow={"ellipsis"}
          >
            {error.stack &&
              (() => {
                const lines = error.stack?.split("\n");
                return (
                  <>
                    <Typography
                      variant="subtitle1"
                      sx={{
                        fontWeight: "bold",
                        color: "secondary.main",
                        whiteSpace: "pre-wrap",
                      }}
                    >
                      {error.message}
                    </Typography>
                    {lines.length > 1 && (
                      <Stack
                        pl={2}
                        borderLeft="2px solid rgba(255,255,255,0.2)"
                        gap={0.5}
                        sx={{
                          overflowX: "auto",
                          maxHeight: "200px",
                          fontFamily: "monospace",
                          "&::-webkit-scrollbar": { display: "none" },
                          msOverflowStyle: "none",
                          scrollbarWidth: "none",
                        }}
                      >
                        {lines.slice(1).map((line, index) => (
                          <Typography
                            key={index}
                            variant="body2"
                            sx={{
                              whiteSpace: "pre-wrap",
                              wordBreak: "break-all",
                            }}
                          >
                            {highlightLine(line)}
                          </Typography>
                        ))}
                      </Stack>
                    )}
                  </>
                );
              })()}
          </Stack>
        </Collapse>
      </Alert>
    </SnackbarContent>
  );
});

export default CustomErrorSnackBar;
