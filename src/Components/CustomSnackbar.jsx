import React from "react";
import { forwardRef } from "react";
import { Alert, Typography } from "@mui/material";

const CustomSnackbar = forwardRef((props, ref) => {
  return (
    <Alert
      variant="outlined"
      ref={ref}
      severity="error"
      sx={{
        color: "white",
        alignItems: "center",
      }}
    >
      <Typography>{props.message}</Typography>
    </Alert>
  );
});

export default CustomSnackbar;
