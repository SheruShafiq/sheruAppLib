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

function SignUpAndLogin({
  isOpen,
  setOpen,
  setIsLoggedIn,
  setUserID,
  setUserData,
}) {
  const [mode, setMode] = useState("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (mode === "login") {
      loginUser(
        { username, password },
        (user) => {
          document.cookie = `userID=${user.id}; path=/;`;
          setUserID(user.id);
          setUserData(user);
          setIsLoggedIn(true);
          handleClose();
        },
        (error) => {
          alert(error.message);
        }
      );
    } else {
      signUpUser(
        { username, password, displayName },
        (user) => {
          alert("Signup successful! Please log in.");
          setMode("login");
        },
        (error) => {
          alert(error.message);
        }
      );
    }
  };

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
            onSubmit: handleSubmit,
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
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          {mode === "signup" && (
            <TextField
              required
              margin="dense"
              name="displayName"
              label="Display Name"
              type="text"
              fullWidth
              variant="standard"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
            />
          )}
          <TextField
            required
            margin="dense"
            name="password"
            label="Password"
            type="password"
            fullWidth
            variant="standard"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            disabled={
              mode === "login"
                ? !username || !password
                : !username || !password || !displayName
            }
            type="submit"
          >
            {mode === "login" ? "Login" : "Signup"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default SignUpAndLogin;
