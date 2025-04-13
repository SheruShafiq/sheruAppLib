import { Button, Stack, TextField } from "@mui/material";
import React, { useState, useEffect } from "react";
import {
  fetchPostById,
  generateCommentsChain,
  createComment,
  patchUser,
  patchPost,
} from "../APICalls";
import { useParams } from "react-router-dom";
import { useSnackbar } from "notistack";
import PostPreview from "../Components/PostPreview";
import Header from "../Components/Header";
import Divider from "@mui/material/Divider";
import PostPreviewSkeletonLoader from "../SkeletonLoaders/PostPreviewSkeletonLoader";
import Fade from "@mui/material/Fade";
import { TextGlitchEffect } from "../Components/TextGlitchEffect";
import { Post, Comment, errorProps } from "../../dataTypeDefinitions";
import CommentBlock from "../Components/CommentBlock";
import { useNavigate } from "react-router-dom";
import Footer from "../Components/Footer";
import IOSLoader from "../Components/IOSLoader";
import SendIcon from "@mui/icons-material/Send";

function PostPage({
  isLoggedIn,
  userData,
  setOpen,
  setIsLoggedIn,
  categories,
  refreshUserData,
}) {
  const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState(false);
  const [post, setPost] = useState<Post>();
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const { enqueueSnackbar } = useSnackbar();
  const [commentsChain, setCommentsChain] = useState<any>(undefined);
  const navigate = useNavigate();
  function fetchCurrentPostData(id: string) {
    fetchPostById({
      id: id!,
      onSuccess: (data) => {
        setPost(data);

        setLoading(false);
      },
      onError: (error) => {
        setLoading(false);
        const err: errorProps = {
          id: "failed to get post data",
          userFreindlyMessage: "Something went wrong when getting post data",
          errorMessage:
            error instanceof Error ? error.message : "Unknown error",
          error: error instanceof Error ? error : new Error("Unknown error"),
        };
        enqueueSnackbar({ variant: "error", ...err });
      },
    });
  }

  useEffect(() => {
    if (userData?.id) {
      refreshUserData(userData.id!);
    }
    fetchCurrentPostData(id!);
  }, [id]);

  // New effect to generate full comments chain after post is fetched
  useEffect(() => {
    if (post && post.comments && post.comments.length > 0) {
      generateCommentsChain(post.comments.map(String))
        .then((chain) => setCommentsChain(chain))
        .catch((err) => console.error(err));
    }
  }, [post]);

  function refreshData(id: string) {
    fetchCurrentPostData(id);
    refreshUserData(userData.id!);
  }
  const [creatingComment, setcreatingComment] = useState(false);

  async function handleCommentCreate() {
    console.log(newComment);
    if (newComment.length < 1) {
      enqueueSnackbar({
        variant: "warning",
        message: "Comment cannot be empty",
      });
      return;
    }
    setcreatingComment(true);
    createComment(
      userData.id!,
      post?.id!,
      newComment,
      (comment) => {
        setCommentsChain((prev) => {
          if (prev) {
            return [...prev, comment];
          }
          return [comment];
        });
        patchUser({
          userID: userData.id!,
          field: "comments",
          newValue: [...(userData.comments || []), comment.id],
          onSuccess: (user) => {
            patchPost(
              post?.id!,
              "comments",
              [...(post?.comments || []), comment.id],
              (post) => {
                refreshData(post.id!);
                setcreatingComment(false);
              },
              (error) => {
                const err: errorProps = {
                  id: "failed to add comment to post",
                  userFreindlyMessage:
                    "Something went wrong when creating comment",
                  errorMessage:
                    error instanceof Error ? error.message : "Unknown error",
                  error:
                    error instanceof Error ? error : new Error("Unknown error"),
                };
                enqueueSnackbar({ variant: "error", ...err });
                setcreatingComment(false);
              }
            );
          },
          onError: (error) => {
            const err: errorProps = {
              id: "failed to create comment in user",
              userFreindlyMessage: "Something went wrong when creating comment",
              errorMessage:
                error instanceof Error ? error.message : "Unknown error",
              error:
                error instanceof Error ? error : new Error("Unknown error"),
            };
            enqueueSnackbar({ variant: "error", ...err });
            setcreatingComment(false);
          },
        });
        enqueueSnackbar({
          variant: "success",
          message: "Comment created successfully",
        });
      },
      (error) => {
        const err: errorProps = {
          id: "failed to create comment",
          userFreindlyMessage: "Something went wrong when creating comment",
          errorMessage:
            error instanceof Error ? error.message : "Unknown error",
          error: error instanceof Error ? error : new Error("Unknown error"),
        };
        enqueueSnackbar({ variant: "error", ...err });
        setcreatingComment(false);
      }
    );
  }

  console.log("commentsChain", commentsChain);

  return (
    <Stack width={"100%"} minHeight={"100vh"} height={"100%"}>
      <Header
        isLoggedIn={isLoggedIn}
        userData={userData}
        setIsLoggedIn={setIsLoggedIn}
        setIsCreatePostModalOpen={setIsCreatePostModalOpen}
        categories={categories}
        isOpen={isCreatePostModalOpen}
        setOpen={setOpen}
        callerIdentifier={"postPage"}
        onPostCreated={(id: string) => {
          navigate(`/posts/${id}`);
        }}
      />
      <Divider
        sx={{
          borderColor: "white",
        }}
      />
      <Stack px={2} maxWidth={"600px"}>
        <Fade in={!loading} timeout={1000}>
          <Stack
            sx={{
              display: loading ? "none" : "flex",
            }}
          >
            <PostPreview
              categories={categories}
              pageVariant={true}
              isPostAuthoredByCurrentUser={userData?.posts
                ?.map(Number)
                .includes(Number(post?.id))}
              isLoggedIn={isLoggedIn}
              fetchPosts={() => {
                refreshData(post?.id || "");
              }}
              title={post?.title || ""}
              resource={post?.resource || ""}
              description={post?.description || ""}
              upvotes={post?.upvotes || 0}
              downvotes={post?.downvotes || 0}
              reports={post?.reports || 0}
              categoryID={post?.categoryID || ""}
              commentsCount={post?.comments.length || 0}
              id={post?.id || ""}
              dateCreated={post?.dateCreated || ""}
              upvotedByCurrentUser={userData?.upvotedPosts
                .map(String)
                .includes(String(post?.id || ""))}
              downvotedByCurrentUser={userData?.downVotedPosts
                .map(String)
                .includes(String(post?.id || ""))}
              reportedByCurrentUser={userData?.reportedPosts
                .map(String)
                .includes(String(post?.id || ""))}
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
          <TextGlitchEffect
            text={`${post?.comments.length || 0} Comments`}
            speed={60}
            letterCase="lowercase"
            className="postPageCommentsTitle"
            type="alphanumeric"
          />
          <Stack gap={2} width={"100%"}>
            <TextField
              label={
                !isLoggedIn ? "You need to login to comment" : "Add a comment"
              }
              multiline
              placeholder="Like for one good luck, ignore for chinchin en kintama torture"
              disabled={!isLoggedIn}
              variant="standard"
              onChange={(e) => {
                setNewComment(e.target.value);
              }}
              fullWidth
            />
            <Button
              onClick={() => {
                handleCommentCreate();
              }}
              disabled={!isLoggedIn || creatingComment || newComment.length < 1}
              color="secondary"
              className="secondaryButtonHoverStyles"
              sx={{ mb: creatingComment ? "-3px" : "0px" }}
              variant="outlined"
              size="small"
            >
              {creatingComment ? <IOSLoader /> : <SendIcon />}
            </Button>
          </Stack>

          {commentsChain &&
            commentsChain.length > 0 &&
            commentsChain.map((comment, index) => (
              <CommentBlock
                key={comment.id}
                dateCreated={comment.dateCreated}
                userName={comment.authorName}
                commentContents={comment.text}
                replies={comment.replies}
                imageURL={comment.imageURL}
                amIaReply={false}
                depth={index}
              />
            ))}
        </Stack>
      </Stack>
      <Footer />
    </Stack>
  );
}

export default PostPage;
