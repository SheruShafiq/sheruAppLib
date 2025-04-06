import * as React from "react";
import { Button } from "@mui/material";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useState } from "react";
import { loginUser, signUpUser } from "../APICalls";

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
          "& .MuiDialog-paper": { minWidth: "40vw" },
        }}
        slotProps={{
          paper: {
            component: "form",
            onSubmit: (event) => {
              event.preventDefault();
              const formData = new FormData(event.currentTarget);
              const username = formData.get("username");
              const password = formData.get("password");

              if (mode === "login") {
                loginUser(
                  { username, password },
                  (user) => {
                    document.cookie = `userID=${user.id}; path=/;`;
                    setIsLoggedIn(true);
                    handleClose();
                  },
                  (error) => {
                    alert(error.message);
                  }
                );
              } else {
                signUpUser(
                  { username, password },
                  (user) => {
                    alert("Signup successful! Please log in.");
                    setMode("login");
                  },
                  (error) => {
                    alert(error.message);
                  }
                );
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
              sx={{ textTransform: "none" }}
            >
              {mode === "login" ? "Signup" : "Login"}
            </Button>
          </DialogContentText>
          <TextField
            autoFocus
            required
            margin="dense"
            name="username"
            label="Username"
            type="text"
            fullWidth
            variant="standard"
          />
          <TextField
            required
            margin="dense"
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
