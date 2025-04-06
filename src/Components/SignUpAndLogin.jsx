import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useState } from "react";

function SignUpAndLogin({ isOpen, setOpen, setIsLoggedIn }) {
  const handleClose = () => {
    setOpen(false);
  };

  const [mode, setMode] = useState("login");
  return (
    <>
      <Dialog
        open={isOpen}
        onClose={handleClose}
        sx={{
          "& .MuiDialog-paper": {
            minWidth: "40vw",
          },
        }}
        slotProps={{
          paper: {
            component: "form",
            onSubmit: (event) => {
              event.preventDefault();
              const formData = new FormData(event.currentTarget);
              const email = formData.get("email");
              const password = formData.get("password");
              if (mode === "login") {
                fetch("/api/login", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({ email, password }),
                })
                  .then((response) => response.json())
                  .then((data) => {
                    if (data.success) {
                      setIsLoggedIn(true);
                      handleClose();
                    } else {
                      alert(data.message);
                    }
                  });
              } else {
                fetch("/api/signup", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({ email, password }),
                })
                  .then((response) => response.json())
                  .then((data) => {
                    if (data.success) {
                      alert("Signup successful! Please log in.");
                      setMode("login");
                    } else {
                      alert(data.message);
                    }
                  });
              }
            },
          },
        }}
      >
        <DialogTitle>{mode === "login" ? "Login" : "Signup"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {mode === "login"
              ? "No account?"
              : "Enter your username and password below:"}
            <Button
              variant="text"
              onClick={() => setMode(mode === "login" ? "signup" : "login")}
              sx={{
                textTransform: "none",
              }}
            >
              {mode === "login" ? "Signup" : "Login"}
            </Button>
          </DialogContentText>
          <TextField
            autoFocus
            required
            margin="dense"
            id="name"
            name="email"
            label="Email Address"
            type="email"
            fullWidth
            variant="standard"
          />
          <TextField
            required
            margin="dense"
            id="password"
            name="password"
            label="Password"
            type="password"
            fullWidth
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit">{mode === "login" ? "Login" : "Signup"}</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default SignUpAndLogin;
