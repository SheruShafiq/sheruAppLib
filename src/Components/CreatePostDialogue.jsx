import * as React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import { useState } from "react";
import { postPost, updateUser } from "../APICalls";
import { TextGlitchEffect } from "./TextGlitchEffect";
import { useSnackbar } from "notistack";

function CreatePostDialogue({ isOpen, setOpen, onPostCreated, userData }) {
  const { enqueueSnackbar } = useSnackbar();
  const [title, setTitle] = useState("");
  const [resource, setResource] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");

  // Hardcoded categories for user to pick from
  const categories = ["tv-shows", "movies", "music", "sports", "news"];

  const handleClose = () => {
    setOpen(false);
  };
  const userID = userData?.id;
  const handleSubmit = (event) => {
    event.preventDefault();
    const newPost = {
      title,
      resource,
      author: userID,
      description,
      category,
      upvotes: 0,
      downvotes: 0,
      reports: 0,
      comments: [],
    };
    postPost(
      newPost,
      (data) => {
        if (onPostCreated) {
          updateUser(
            userID,
            { ...userData, posts: [...userData.posts, data.id] },
            onPostCreated(),
            enqueueSnackbar("Post created successfully!", {
              variant: "success",
            }),
            (error) => {
              enqueueSnackbar(error.message, { variant: "error" });
            }
          );
        }
        handleClose();
      },
      (error) => {
        enqueueSnackbar(error.message, { variant: "error" });
      }
    );
  };

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      sx={{
        "& .MuiDialog-paper": {
          maxWidth: "40vw",
          width: "100%",
          minWidth: "280px",
        },
      }}
      slotProps={{
        paper: {
          component: "form",
          onSubmit: handleSubmit,
        },
      }}
    >
      <DialogTitle>
        <div>
          <TextGlitchEffect
            text="Create Post"
            speed={40}
            letterCase="lowercase"
            includeSpecialChars
          />
        </div>
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          Enter the details for your new post.
        </DialogContentText>
        <TextField
          autoFocus
          required
          margin="dense"
          label="Title"
          type="text"
          fullWidth
          variant="standard"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <TextField
          required
          margin="dense"
          label="Resource URL"
          type="url"
          fullWidth
          variant="standard"
          value={resource}
          onChange={(e) => setResource(e.target.value)}
        />
        <TextField
          required
          margin="dense"
          label="Description"
          type="text"
          fullWidth
          variant="standard"
          multiline
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <FormControl fullWidth margin="dense" variant="standard" required>
          <InputLabel>Category</InputLabel>
          <Select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            label="Category"
          >
            {categories.map((cat) => (
              <MenuItem key={cat} value={cat}>
                {cat}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button
          disabled={!title || !resource || !description || !category}
          type="submit"
        >
          <TextGlitchEffect
            text="Create"
            speed={40}
            letterCase="lowercase"
            includeSpecialChars
          />
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default CreatePostDialogue;
