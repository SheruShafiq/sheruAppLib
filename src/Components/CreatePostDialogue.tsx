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
import { createPost, patchUser } from "../APICalls";
import { TextGlitchEffect } from "./TextGlitchEffect";
import { useSnackbar } from "notistack";
import { Category, errorProps } from "../../dataTypeDefinitions";
import SaveIcon from "@mui/icons-material/Save";
import IOSLoader from "./IOSLoader";

function CreatePostDialogue({
  isOpen,
  setOpen,
  onPostCreated,
  userData,
  categories,
  callerIdentifier,
}) {
  const { enqueueSnackbar } = useSnackbar();
  const [creatingPost, setCreatingPost] = useState(false);
  const [title, setTitle] = useState("");
  const [resource, setResource] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const handleClose = () => {
    setOpen(false);
  };
  const userID: string = userData?.id;
  const handleSubmit = (event) => {
    setCreatingPost(true);
    event.preventDefault();

    createPost({
      title,
      resource,
      authorID: userID,
      categoryID: category,
      description,
      onSuccess: (data) => {
        if (onPostCreated) {
          patchUser({
            userID: userData.id!,
            field: "posts",
            newValue: [...userData.posts, data.id],
            onSuccess: () => {
              if (callerIdentifier === "postPage") {
                onPostCreated(data.id);
                setCreatingPost(false);
              } else {
                onPostCreated();
              }
              enqueueSnackbar("Post created successfully!", {
                variant: "success",
              });
            },
            onError: (error) => {
              const err: errorProps = {
                id: "failed to add post to user",
                userFreindlyMessage:
                  "An error occurred while creating the post.",
                errorMessage:
                  error instanceof Error ? error.message : "Unknown error",
                error:
                  error instanceof Error ? error : new Error("Unknown error"),
              };
              enqueueSnackbar({ variant: "error", ...err });
              setCreatingPost(false);
            },
          });
        }
        handleClose();
      },

      onError: (error) => {
        const err: errorProps = {
          id: "failed to create post",
          userFreindlyMessage: "An error occurred while creating the post.",
          errorMessage:
            error instanceof Error ? error.message : "Unknown error",
          error: error instanceof Error ? error : new Error("Unknown error"),
        };
        enqueueSnackbar({ variant: "error", ...err });
        setCreatingPost(false);
      },
    });
  };

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
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
            className={"createPostTitle"}
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
            {categories.map((cat: Category) => (
              <MenuItem key={cat.id} value={cat.id}>
                {cat.name}
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
          color="secondary"
          className="secondaryButtonHoverStyles"
          sx={{ mb: creatingPost ? "-3px" : "0px" }}
          startIcon={creatingPost ? <IOSLoader /> : <SaveIcon />}
        >
          <TextGlitchEffect
            text="Create"
            speed={40}
            letterCase="lowercase"
            className={"createPostButton"}
          />
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default CreatePostDialogue;
