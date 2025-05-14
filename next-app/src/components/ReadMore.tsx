"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@mui/material";

interface ReadMoreProps {
  children: React.ReactNode;
  maxHeight?: number;
  threshold?: number;
}

function ReadMore({
  children,
  maxHeight = 100,
  threshold = 20,
}: ReadMoreProps) {
  const [expanded, setExpanded] = useState(false);
  const [shouldShowButton, setShouldShowButton] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      const contentHeight = contentRef.current.scrollHeight;
      setShouldShowButton(contentHeight > maxHeight + threshold);
    }
  }, [children, maxHeight, threshold]);

  return (
    <div>
      <div
        ref={contentRef}
        style={{
          overflow: "hidden",
          maxHeight: expanded ? "none" : `${maxHeight}px`,
          transition: "max-height 0.3s ease",
        }}
      >
        {children}
      </div>

      {shouldShowButton && (
        <Button
          size="small"
          onClick={() => setExpanded(!expanded)}
          sx={{
            mt: 1,
            p: 0,
            fontSize: "0.8rem",
            color: "primary.main",
            "&:hover": {
              backgroundColor: "transparent",
              textDecoration: "underline",
            },
          }}
        >
          {expanded ? "Show less" : "Read more"}
        </Button>
      )}
    </div>
  );
}

export default ReadMore;
