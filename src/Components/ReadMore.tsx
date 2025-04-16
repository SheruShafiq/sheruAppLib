import React, { useState } from "react";
import { Button, Stack, Typography, Collapse } from "@mui/material";

interface ReadMoreProps {
  text: string;
  maxLength: number;
}

const ReadMore: React.FC<ReadMoreProps> = ({ text, maxLength }) => {
  const [expanded, setExpanded] = useState(false);

  // If text is short, render normally
  if (text?.length <= maxLength) {
    return (
      <Typography variant="body1" component="div">
        {text}
      </Typography>
    );
  }

  const firstPart = text?.slice(0, maxLength);
  const remainingPart = text?.slice(maxLength);

  return (
    <Stack direction={"row"} sx={{ transition: "all 0.3s ease-in-out" }}>
      <Typography
        variant="body1"
        component="div"
        width={"100%"}
        sx={{
          wordBreak: "break-word",
          overflowWrap: "break-word",
          WebkitHyphens: "auto",
          hyphens: "auto",
        }}
      >
        {firstPart}
        <Collapse in={expanded} timeout="auto" unmountOnExit component="div">
          {remainingPart}
        </Collapse>{" "}
        <Button
          onClick={() => setExpanded((prev) => !prev)}
          variant="text"
          color="primary"
        >
          {expanded ? "Read Less" : "Read More"}
        </Button>
      </Typography>
    </Stack>
  );
};

export default ReadMore;
