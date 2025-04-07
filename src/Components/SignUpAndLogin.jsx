import * as React from "react";
import { Button, Collapse, Fade, Typography } from "@mui/material";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useState } from "react";
import { loginUser, signUpUser } from "../APICalls";
import { useGlitch } from "react-powerglitch";
import { TextGlitchEffect } from "./TextGlitchEffect";

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
  const glitch = useGlitch({
    timing: {
      iterations: 1,
      easing: "ease-in-out",
    },
    playMode: "click",
  });

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
      <DialogTitle>
        <div key={`TextGlitchEffect-dialog-${mode}`}>
          <TextGlitchEffect
            text={mode === "login" ? "Login" : "Signup"}
            speed={40}
            letterCase="lowercase"
            includeSpecialChars
          />
        </div>
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          <span
            style={{
              width: "400px",
              display: "flex",
              alignItems: "center",
            }}
            ref={glitch?.ref}
          >
            {mode === "login" ? (
              <>
                <img
                  src="/noBitches.png"
                  alt="emoji"
                  style={{
                    width: "40px",
                    height: "40px",
                    marginRight: "2px",
                  }}
                />
                No account?
                <Button
                  variant="text"
                  onClick={() => setMode("signup")}
                  sx={{
                    textTransform: "none",
                    ml: "4px",
                    fontWeight: "bold",
                  }}
                >
                  Signup
                </Button>
              </>
            ) : (
              <>
                Been already browsing sauce?{" "}
                <Button
                  variant="text"
                  onClick={() => setMode("login")}
                  sx={{
                    textTransform: "none",
                    ml: "4px",
                    fontWeight: "bold",
                  }}
                >
                  Login
                </Button>
              </>
            )}
          </span>
        </DialogContentText>
        <TextField
          autoFocus
          required
          margin="dense"
          name="username"
          label="Username"
          type="text"
          autoComplete="username"
          fullWidth
          variant="standard"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <Collapse in={mode === "signup"} unmountOnExit>
          <Fade in={mode === "signup"}>
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
          </Fade>
        </Collapse>
        <TextField
          required
          margin="dense"
          name="password"
          label="Password"
          type="password"
          fullWidth
          variant="standard"
          autoComplete="current-password"
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
          <TextGlitchEffect
            text={mode === "login" ? "Login" : "Signup"}
            speed={40}
            letterCase="lowercase"
            includeSpecialChars
          />
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default SignUpAndLogin;
