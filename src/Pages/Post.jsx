import { Alert, Typography, Box, Stack, Switch } from "@mui/material";
import React, { useState, useEffect } from "react";
import { fetchPostById, getCommentByID, fetchUserById } from "../APICalls";
import { useParams } from "react-router-dom";
import { useSnackbar } from "notistack";
import PostPreview from "../Components/PostPreview";
import Header from "../Components/Header";
import CreatePostDialogue from "../Components/CreatePostDialogue";
import Divider from "@mui/material/Divider";
import PostPreviewSkeletonLoader from "../SkeletonLoaders/PostPreviewSkeletonLoader";
import Fade from "@mui/material/Fade";
import CommentBlock from "../Components/CommentBlock";
import { TextGlitchEffect } from "../Components/TextGlitchEffect";
const gipyAPIKey = import.meta.env.REACT_APP_GIPHY_API_KEY;
const tenorAPIKey = import.meta.env.REACT_APP_TENOR_API_KEY;

function Post({ isLoggedIn, userData, setOpen, setIsLoggedIn }) {
  const [parentComments, setParentComments] = useState([]);
  const [relevantCommentIDs, setRelevantCommentIDs] = useState([]);
  const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState(false);
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    fetchPostById(
      id,
      (data) => {
        setPost(data);
        setLoading(false);
        setRelevantCommentIDs(data?.comments);
      },
      (error) => {
        setLoading(false);
        enqueueSnackbar(`Error fetching post ${error}`, { variant: "error" });
      }
    );
  }, [id, enqueueSnackbar]);
  async function fetchImage() {
    const response = await fetch(
      `https://api.giphy.com/v1/gifs/random?api_key=${gipyAPIKey}&tag=cyberpunkProfilePicture&rating=g`
    );
    const data = await response.json();
    if (response.ok) {
      return data.data.images.original.url;
    } else {
      fetchImageFromTenor();
    }
  }
  async function fetchImageFromTenor() {
    const response = await fetch(
      `
https://api.tenor.com/v1/random?key=${tenorAPIKey}&q=cyberpunk&limit=1`
    );
    const data = await response.json();
    if (response.ok) {
      return data.results[0].media[0].gif.url;
    } else {
      enqueueSnackbar(`Error fetching image: ${data.message}`, {
        variant: "error",
      });
    }
  }
  // New recursive function to fetch a comment, its entire reply chain, and attach user display name.
  const fetchCommentChain = async (commentId) => {
    return new Promise((resolve, reject) => {
      getCommentByID(
        commentId,
        async (data) => {
          try {
            // Fetch user display name based on userID.
            const user = await new Promise((resolveUser, rejectUser) => {
              fetchUserById(data.userID, resolveUser, rejectUser);
            });
            data.displayName = user.displayName;
            // Fetch random gif for comment
            // data.imageURL = await fetchImage();
            data.imageURL = ""; //TODO: temporary till I figure out GIPHY API

            if (data.replies && data.replies.length) {
              const nestedReplies = await Promise.all(
                data.replies.map((replyId) => fetchCommentChain(replyId))
              );
              data.replies = nestedReplies;
            } else {
              data.replies = [];
            }
            resolve(data);
          } catch (err) {
            reject(err);
          }
        },
        (error) => reject(error)
      );
    });
  };

  const fetchParentComments = async () => {
    try {
      const comments = await Promise.all(
        relevantCommentIDs.map((commentId) => fetchCommentChain(commentId))
      );
      setParentComments(comments);
    } catch (error) {
      enqueueSnackbar(`Error fetching comments: ${error.message}`, {
        variant: "error",
      });
    }
  };

  useEffect(() => {
    if (relevantCommentIDs.length > 0) {
      fetchParentComments();
    }
  }, [relevantCommentIDs]);

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
      <Stack maxWidth={"600px"}>
        <Fade in={!loading} timeout={1000}>
          <Stack
            sx={{
              display: loading ? "none" : "flex",
            }}
          >
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
        </Fade>
        <Fade in={loading} timeout={1000}>
          <Stack
            sx={{
              display: loading ? "flex" : "none",
            }}
          >
            <PostPreviewSkeletonLoader pageVariant={true} />
          </Stack>
        </Fade>
      </Stack>

      <Divider
        sx={{
          borderColor: "white",
        }}
      />
      <Stack mt={2} gap={2}>
        <TextGlitchEffect
          text={"Comments"}
          speed={60}
          letterCase="lowercase"
          className="postPageCommentsTitle"
          type="alphanumeric"
        />
        {parentComments &&
          parentComments.length > 0 &&
          parentComments.map((comment, index) => (
            <CommentBlock
              key={index}
              dateCreated={comment?.dateCreated}
              userName={comment?.displayName}
              commentContents={comment?.text}
              replies={comment?.replies}
              imageURL={comment?.imageURL}
            />
          ))}
      </Stack>
    </Stack>
  );
}

export default Post;
