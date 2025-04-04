import React from "react";
import { SnackbarContent } from "notistack";
import { Alert } from "@mui/material";

const CustomSnackbar = React.forwardRef((props, ref) => {
  const { severity, variant, login, handleLogin, ...rest } = props;

  return (
    <SnackbarContent ref={ref} {...rest}>
      <Alert
        severity={severity}
        variant={variant}
        action={
          login && (
            <button onClick={handleLogin} style={{ marginLeft: "8px" }}>
              Log In
            </button>
          )
        }
      >
        {props.message}
      </Alert>
    </SnackbarContent>
  );
});

export default CustomSnackbar;
