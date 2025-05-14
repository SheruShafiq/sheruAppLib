"use client";

import React, { useEffect, useState } from "react";
import {
  Stack,
  Divider,
  Typography,
  CircularProgress,
  Button,
} from "@mui/material";
import { useAuth } from "@/components/AuthProvider";
import SauceLayout from "@/components/SauceLayout";
import { fetchCategories, fetchPostById } from "@/lib/api";
import { useSnackbar } from "notistack";
import { Post, Category } from "@/lib/definitions";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useRouter } from "next/navigation";

interface PostDetailClientPageProps {
  postId: string;
}

export default function PostDetailClientPage({
  postId,
}: PostDetailClientPageProps) {
  const [loginDialogue, setLoginDialogue] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const { isLoggedIn, userData, setIsLoggedIn, refreshUserData } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories(
      (categoriesData) => {
        setCategories(categoriesData);
      },
      (error) => {
        console.error("Error fetching categories:", error);
        enqueueSnackbar({
          variant: "error",
          message: "Failed to fetch categories",
        });
      }
    );
  }, [enqueueSnackbar]);

  // Fetch post details
  useEffect(() => {
    if (!postId) return;

    setLoading(true);
    fetchPostById({
      id: postId,
      onSuccess: (postData) => {
        setPost(postData);
        setLoading(false);
      },
      onError: (error) => {
        enqueueSnackbar({
          variant: "error",
          message: "Failed to fetch post details",
        });
        setLoading(false);
      },
    });
  }, [postId, enqueueSnackbar]);

  return (
    <SauceLayout
      isLoggedIn={isLoggedIn}
      userData={userData}
      setOpen={setLoginDialogue}
      setIsLoggedIn={setIsLoggedIn}
      categories={categories}
      callerIdentifier="postDetail"
    >
      <Stack height={"100%"} minHeight={"100vh"} gap={2} pb={2}>
        <Divider sx={{ borderColor: "white" }} />
        <Stack
          px={2}
          maxWidth={"1200px"}
          alignSelf={"center"}
          width={"100%"}
          gap={2}
        >
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => router.back()}
            sx={{ alignSelf: "flex-start", mb: 2 }}
          >
            Back to posts
          </Button>

          {loading ? (
            <Stack alignItems="center" justifyContent="center" py={8}>
              <CircularProgress />
              <Typography mt={2}>Loading post...</Typography>
            </Stack>
          ) : post ? (
            <Stack spacing={3}>
              <Typography variant="h4">{post.title}</Typography>
              <Typography variant="body1">
                This is a placeholder for the full post view. In a complete
                implementation, this would show the full post content, comments
                section, and other interactive elements.
              </Typography>
              <Typography variant="body2">Post ID: {post.id}</Typography>
            </Stack>
          ) : (
            <Stack alignItems="center" justifyContent="center" py={8}>
              <Typography variant="h6">Post not found</Typography>
              <Typography variant="body2" color="text.secondary">
                The post may have been removed or doesn't exist
              </Typography>
            </Stack>
          )}
        </Stack>
      </Stack>
    </SauceLayout>
  );
}
