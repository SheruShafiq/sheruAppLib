import { Alert, Typography, Box } from "@mui/material";
import React, { useState, useEffect } from "react";
import { fetchPostById } from "../APICalls";
import { useParams } from "react-router-dom";
import { useSnackbar } from "notistack";

function Post() {
  const { enqueueSnackbar } = useSnackbar();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();

  const fetchPost = async () => {
    const response = await fetchPostById(id);
    setPost(response.data);
    console.log(post);
  };
  useEffect(() => {
    fetchPost();
  }, [id]);
  useEffect(() => {
    if (post) {
      setLoading(false);
    }
  }, [post]);

  if (loading) {
    return <Typography>Loading...</Typography>;
  }
  if (!post) {
    return <Typography>No post found</Typography>;
  }
  const { title, resource, description } = post;

  return (
    <Box>
      <Typography>{title}</Typography>
      <Typography>{resource}</Typography>
      <Typography>{description}</Typography>
    </Box>
  );
}

export default Post;
