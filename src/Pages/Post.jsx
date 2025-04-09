import { Alert, Typography, Box, Stack } from "@mui/material";
import React, { useState, useEffect } from "react";
import { fetchPostById, getCommentByID } from "../APICalls";
import { useParams } from "react-router-dom";
import { useSnackbar } from "notistack";
import PostPreview from "../Components/PostPreview";
import Header from "../Components/Header";
import CreatePostDialogue from "../Components/CreatePostDialogue";
import Divider from "@mui/material/Divider";
import PostPreviewSkeletonLoader from "../SkeletonLoaders/PostPreviewSkeletonLoader";

function Post({ isLoggedIn, userData, setOpen, setIsLoggedIn }) {
  const { enqueueSnackbar } = useSnackbar();
  const [parentComments, setParentComments] = useState([]);
  const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState(false);
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  useEffect(() => {
    fetchPostById(
      id,
      (data) => {
        setPost(data);
        setLoading(false);
      },
      (error) => {
        setLoading(false);
        enqueueSnackbar(`Error fetching post ${error}`, { variant: "error" });
      }
    );
  }, [id, enqueueSnackbar]);
  let relevantCommentIDs = [];
  if (post) {
    relevantCommentIDs = post.comments ? post.comments : []; // Array of comment IDs
  }

  useEffect(() => {
    if (!relevantCommentIDs || relevantCommentIDs.length === 0) {
      const fetchParentComments = async () => {
        try {
          const comments = await Promise.all(
            relevantCommentIDs.map(
              (commentId) =>
                new Promise((resolve, reject) => {
                  getCommentByID(
                    commentId,
                    (data) => resolve(data),
                    (error) => reject(error)
                  );
                })
            )
          );
          setParentComments(comments);
        } catch (error) {
          enqueueSnackbar(`Error fetching comments: ${error.message}`, {
            variant: "error",
          });
        }
      };

      fetchParentComments();
    }
  }, [relevantCommentIDs]);

  if (loading) {
    return <Typography>Loading...</Typography>;
  }
  if (!post) {
    return <Typography>No post found</Typography>;
  }
  const fetchPostsHandeled = () => {
    fetchPostById(
      id,
      (data) => {
        setPost(data);
        setLoading(false);
      },
      (error) => {
        setLoading(false);
        enqueueSnackbar(`Error fetching post ${error}`, { variant: "error" });
      }
    );
  };

  return (
    <Stack px={2} width={"100%"}>
      <Header
        isLoggedIn={isLoggedIn}
        userData={userData}
        setOpen={setOpen}
        setIsLoggedIn={setIsLoggedIn}
        setIsCreatePostModalOpen={setIsCreatePostModalOpen}
      />
      <CreatePostDialogue
        isOpen={isCreatePostModalOpen}
        setOpen={setIsCreatePostModalOpen}
        onPostCreated={fetchPostsHandeled}
        userData={userData}
      />
      <Divider
        sx={{
          borderColor: "white",
        }}
      />
      <Stack maxWidth={"75vw"}>
        <PostPreview
          pageVariant={true}
          isPostAuthoredByCurrentUser={userData?.posts
            ?.map(Number)
            .includes(Number(post?.id))}
          isLoggedIn={isLoggedIn}
          fetchPosts={fetchPostsHandeled}
          title={post?.title}
          resource={post?.resource}
          description={post?.description}
          upvotes={post?.upvotes}
          downvotes={post?.downvotes}
          reports={post?.reports}
          category={post?.category}
          commentsCount={post?.comments.length}
          id={post?.id}
          deteCreated={post?.dateCreated}
          upvotedByCurrentUser={userData?.likedPosts
            ?.map(Number)
            .includes(Number(post?.id))}
          downvotedByCurrentUser={userData?.dislikedPosts
            ?.map(Number)
            .includes(Number(post?.id))}
          reportedByCurrentUser={userData?.reportedPosts
            ?.map(Number)
            .includes(Number(post?.id))}
          userData={userData}
        />
      </Stack>
    </Stack>
  );
}

export default Post;
