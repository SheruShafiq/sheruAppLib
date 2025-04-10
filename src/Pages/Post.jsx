import { Alert, Typography, Box, Stack, Switch } from "@mui/material";
import React, { useState, useEffect } from "react";
import {
  fetchPostById,
  getCommentByID,
  fetchUserById,
  updateUser,
  addComment,
  updatePost,
} from "../APICalls";
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
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import SendIcon from "@mui/icons-material/Send";
import { useGlitch } from "react-powerglitch";
const gipyAPIKey = import.meta.env.REACT_APP_GIPHY_API_KEY;
const tenorAPIKey = import.meta.env.REACT_APP_TENOR_API_KEY;

function Post({ isLoggedIn, userData, setOpen, setIsLoggedIn }) {
  const [newComment, setNewComment] = useState("");
  const [parentComments, setParentComments] = useState([]);
  const [relevantCommentIDs, setRelevantCommentIDs] = useState([]);
  const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState(false);
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isCommenting, setIsCommenting] = useState(false);
  const { id } = useParams();
  const { enqueueSnackbar } = useSnackbar();
  const glitch = useGlitch({
    timing: {
      iterations: 1,
      easing: "ease-in-out",
      duration: 1000,
    },
    glitchTimeSpan: {
      start: 0,
      end: 0.5,
    },
    playMode: "click",
  });
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
  // Modify fetchCommentChain function for infinite nested replies
  const fetchCommentChain = async (commentId) => {
    // Fetch comment data
    const data = await new Promise((resolve, reject) => {
      getCommentByID(
        commentId,
        (data) => resolve(data),
        (error) => reject(error)
      );
    });
    // Fetch user display name
    const user = await new Promise((resolve, reject) => {
      fetchUserById(data.userID, resolve, reject);
    });
    data.displayName = user.displayName;
    // Fetch random gif for comment (temporarily empty)
    data.imageURL = ""; // TODO: temporary till I figure out GIPHY API
    // Recursive call: fetch the entire chain of replies if any
    if (data.replies && data.replies.length) {
      data.replies = await Promise.all(
        data.replies.map((replyId) => fetchCommentChain(replyId))
      );
      setIsCommenting(false);
    } else {
      data.replies = [];
    }
    return data;
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
  const now = new Date().toISOString();
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

        <Divider
          sx={{
            borderColor: "white",
          }}
        />
        <Stack mt={2} gap={2}>
          <Stack>
            <TextGlitchEffect
              text={"Comments"}
              speed={60}
              letterCase="lowercase"
              className="postPageCommentsTitle"
              type="alphanumeric"
            />
            <Stack gap={1}>
              <TextField
                disabled={!isLoggedIn || isCommenting}
                id="newComment"
                placeholder={
                  isLoggedIn ? "Add new comment" : "Login to comment"
                }
                multiline
                maxRows={4}
                variant="standard"
                onBlur={(e) => {
                  setNewComment(e.target.value);
                }}
              />
              <Button
                loading={isCommenting || loading}
                color="info"
                variant="outlined"
                size="small"
                ref={glitch.ref}
                onClick={(e) => {
                  e.preventDefault();
                  setIsCommenting(true);
                  addComment(
                    userData?.id,
                    newComment,

                    (comment) => {
                      setRelevantCommentIDs((prev) => [...prev, comment.id]);
                      setNewComment("");
                      fetchParentComments();
                      updateUser(
                        userData?.id,
                        {
                          id: userData?.id,
                          username: userData?.username,
                          password: userData?.password,
                          displayName: userData?.displayName,
                          posts: [...(userData?.posts || []), post?.id],
                          likedPosts: [...(userData?.likedPosts || [])],
                          dislikedPosts: [...(userData?.dislikedPosts || [])],
                          reportedPosts: [...(userData?.reportedPosts || [])],
                          comments: [
                            ...(userData?.likedComments || []),
                            comment.id,
                          ],
                          dateCreated: userData?.dateCreated,
                          dateModified: now,
                          dateDeleted: "",
                        },
                        () => {
                          updatePost(
                            id,
                            {
                              id: post?.id,
                              title: post?.title,
                              resource: post?.resource,
                              author: userData?.id,
                              description: post?.description,
                              upvotes: post?.upvotes,
                              downvotes: post?.downvotes,
                              reports: post?.reports,
                              category: post?.category,
                              comments: [...(post?.comments || []), comment.id],
                              dateCreated: post?.dateCreated,
                              dateModified: now,
                              dateDeleted: "",
                            },
                            () => {
                              enqueueSnackbar("Comment added successfully", {
                                variant: "success",
                              });
                            },
                            (error) => {
                              enqueueSnackbar(error.message, {
                                variant: "error",
                              });
                            }
                          );
                        },
                        (error) => {
                          enqueueSnackbar(error.message, {
                            variant: "error",
                          });
                        }
                      );
                    },
                    (error) => {
                      enqueueSnackbar(error.message, {
                        variant: "error",
                      });
                    }
                  );
                }}
              >
                <TextGlitchEffect
                  text={"Send"}
                  speed={60}
                  letterCase="lowercase"
                  className="createCommentButton"
                  type="alphanumeric"
                />
              </Button>
            </Stack>
          </Stack>
          {parentComments &&
            parentComments.length > 0 &&
            parentComments.map((comment, index) => (
              <CommentBlock
                key={index}
                commentID={comment?.id}
                dateCreated={comment?.dateCreated}
                userName={comment?.displayName}
                commentContents={comment?.text}
                replies={comment?.replies}
                imageURL={comment?.imageURL}
                likes={comment?.likes}
                isLoggedIn={isLoggedIn}
                userData={userData}
                likedByCurrentUser={userData?.likedComments
                  ?.map(Number)
                  .includes(Number(comment?.id))}
              />
            ))}
        </Stack>
      </Stack>
    </Stack>
  );
}

export default Post;
