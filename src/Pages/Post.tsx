import { Button, Stack, TextField } from "@mui/material";
import React, { useState, useEffect, useMemo, useLayoutEffect } from "react";
import {
  fetchPostById,
  generateCommentsChain,
  createComment,
  patchUser,
  patchPost,
  patchComment,
  fetchUserById,
} from "../APICalls";
import { useParams } from "react-router-dom";
import { useSnackbar } from "notistack";
import PostPreview from "@components/PostPreview";
import SauceLayout from "../Layouts/SauceLayout";
import Divider from "@mui/material/Divider";
import PostPreviewSkeletonLoader from "../SkeletonLoaders/PostPreviewSkeletonLoader";
import Fade from "@mui/material/Fade";
import { TextGlitchEffect } from "@components/TextGlitchEffect";
import { Post, Comment, errorProps, User } from "../../dataTypeDefinitions";
import CommentBlock from "@components/CommentBlock";
import { useNavigate } from "react-router-dom";
import IOSLoader from "@components/IOSLoader";
import SendIcon from "@mui/icons-material/Send";
import CommentSkeletonLoader from "../SkeletonLoaders/CommentSkeletonLoader";
import { useMaximumRenderableSkeletonComments } from "@hooks/useMaximumRenderableSkeletonComments";
import UserProfilePage from "./UserProfilePage";
import UserStats from "@components/UserStats";
import { GIFs } from "@assets/GIFs";

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
  const [generatingCommentsChain, setGeneratingCommentsChain] = useState(false);
  const navigate = useNavigate();
  const randomGIFIndex = useMemo(
    () => Math.floor(Math.random() * Math.min(GIFs.length, 200)),
    []
  );
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
          userFriendlyMessage: "Something went wrong when getting post data",
          errorMessage:
            error instanceof Error ? error.message : "Unknown error",
          error: error instanceof Error ? error : new Error("Unknown error"),
        };
        enqueueSnackbar({ variant: "error", ...err });
      },
    });
  }
  const [authorData, setAuthorData] = useState<User | null>(null);
  useEffect(() => {
    if (!post?.authorID) return;
    fetchUserById(
      post?.authorID,
      (userData) => {
        setAuthorData(userData);
      },
      (error: any) => {
        const err: errorProps = {
          id: "fetching author data Error",
          userFriendlyMessage:
            "An error occurred while fetching post's author data.",
          errorMessage:
            error instanceof Error ? error.message : "Unknown error",
          error: error instanceof Error ? error : new Error("Unknown error"),
        };
        enqueueSnackbar({ variant: "error", ...err });
      }
    );
  }, [post?.authorID]);
  const history = useNavigate();
  useEffect(() => {
    if (userData?.id) {
      refreshUserData(userData.id!);
    }
    fetchCurrentPostData(id!);
  }, [id]);

  useEffect(() => {
    if (post && post.comments && post.comments.length > 0) {
      setGeneratingCommentsChain(true);
      generateCommentsChain(post.comments.map(String))
        .then((chain) => {
          setCommentsChain(chain);
          setGeneratingCommentsChain(false);
        })
        .catch((err: unknown) => {
          console.error(err);
          setGeneratingCommentsChain(false);
        });
    }
  }, [post]);

  function refreshData(id: string) {
    fetchCurrentPostData(id);
    refreshUserData(userData.id!);
  }
  const [creatingComment, setcreatingComment] = useState(false);

  async function handleCommentCreate({ reply, comment, replies }) {
    if (!reply && !comment && !replies) {
      setcreatingComment(true);
    }
    createComment(
      userData.id!,
      post?.id!,
      reply ? comment : newComment,
      (comment) => {
        patchUser({
          userID: userData.id!,
          field: "comments",
          newValue: [...(userData.comments || []), comment.id],
          onSuccess: (user) => {
            if (reply) {
              patchComment(
                reply,
                "replies",
                [...replies.map((r) => r.id), comment.id],
                (comment) => {
                  refreshData(post?.id!);
                  setcreatingComment(false);
                },
                (error) => {
                  const err: errorProps = {
                    id: "failed to add comment to post",
                    userFriendlyMessage:
                      "Something went wrong when creating comment",
                    errorMessage:
                      error instanceof Error ? error.message : "Unknown error",
                    error:
                      error instanceof Error
                        ? error
                        : new Error("Unknown error"),
                  };
                  enqueueSnackbar({ variant: "error", ...err });
                  setcreatingComment(false);
                }
              );
            } else
              patchPost(
                post?.id!,
                "comments",
                [...(post?.comments || []), comment.id],
                (post) => {
                  refreshData(post.id!);
                  setcreatingComment(false);
                  setNewComment("");
                },
                (error) => {
                  const err: errorProps = {
                    id: "failed to add comment to post",
                    userFriendlyMessage:
                      "Something went wrong when creating comment",
                    errorMessage:
                      error instanceof Error ? error.message : "Unknown error",
                    error:
                      error instanceof Error
                        ? error
                        : new Error("Unknown error"),
                  };
                  enqueueSnackbar({ variant: "error", ...err });
                  setcreatingComment(false);
                }
              );
          },
          onError: (error) => {
            const err: errorProps = {
              id: "failed to create comment in user",
              userFriendlyMessage: "Something went wrong when creating comment",
              errorMessage:
                error instanceof Error ? error.message : "Unknown error",
              error:
                error instanceof Error ? error : new Error("Unknown error"),
            };
            enqueueSnackbar({ variant: "error", ...err });
            setcreatingComment(false);
          },
        });
      },
      (error) => {
        const err: errorProps = {
          id: "failed to create comment",
          userFriendlyMessage: "Something went wrong when creating comment",
          errorMessage:
            error instanceof Error ? error.message : "Unknown error",
          error: error instanceof Error ? error : new Error("Unknown error"),
        };
        enqueueSnackbar({ variant: "error", ...err });
        setcreatingComment(false);
      }
    );
  }
  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 700);

  useLayoutEffect(() => {
    const handleResize = () => {
      const isNowDesktop = window.innerWidth > 700;
      if (isNowDesktop !== isDesktop) {
        setIsDesktop(isNowDesktop);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [isDesktop]);
  return (
    <SauceLayout
      callerIdentifier="postPage"
      isLoggedIn={isLoggedIn}
      userData={userData}
      setOpen={setOpen}
      setIsLoggedIn={setIsLoggedIn}
      categories={categories}
      onPostCreated={(id: string) => navigate(`/posts/${id}`)}
    >
      <Divider sx={{ borderColor: "white" }} />

      <Stack
        mt={2}
        pb={4}
        px={2}
        direction="row"
        width="100%"
        maxWidth="1200px"
        mx="auto"
        height={"100%"}
        gap={8}
      >
        <Stack flexGrow={1}>
          <Fade in={!loading} timeout={1000}>
            <Stack
              sx={{
                display: loading ? "none" : "flex",
              }}
              className="postPageCommentsTitle"
            >
              <PostPreview
                randomGIFIndex={randomGIFIndex}
                authorData={authorData}
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
              type="ALPHA_NUMERIC"
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
                value={newComment}
                fullWidth
              />
              <Button
                onClick={() => {
                  handleCommentCreate({
                    reply: false,
                    comment: false,
                    replies: false,
                  });
                }}
                disabled={
                  !isLoggedIn || creatingComment || newComment.length < 1
                }
                color="secondary"
                className="secondaryButtonHoverStyles"
                variant="outlined"
                size="small"
              >
                {creatingComment ? <IOSLoader /> : <SendIcon />}
              </Button>
            </Stack>
            <Fade in={!generatingCommentsChain} timeout={1000}>
              <Stack
                gap={1}
                sx={{
                  display: generatingCommentsChain ? "none" : "flex",
                }}
              >
                {commentsChain &&
                  commentsChain.length > 0 &&
                  commentsChain
                    .reverse()
                    .map((comment, index) => (
                      <CommentBlock
                        authorID={comment.authorID}
                        handleCommentCreate={handleCommentCreate}
                        id={comment.id}
                        userData={userData}
                        key={comment.id}
                        dateCreated={comment.dateCreated}
                        userName={comment.authorName}
                        commentContents={comment.text}
                        replies={comment.replies}
                        imageURL={comment.imageURL}
                        amIaReply={false}
                        depth={0}
                        isLoggedIn={isLoggedIn}
                        likedByCurrentUser={
                          userData?.likedComments
                            .map(String)
                            .includes(String(comment.id)) || false
                        }
                        dislikedByCurrentUser={
                          userData?.dislikedComments
                            .map(String)
                            .includes(String(comment.id)) || false
                        }
                        likes={comment.likes}
                        dislikes={comment.dislikes}
                        setGeneratingCommentsChain={setGeneratingCommentsChain}
                        userPageVariant={false}
                        postID={comment.postID}
                      />
                    ))}
              </Stack>
            </Fade>
            <Fade in={generatingCommentsChain} timeout={1000}>
              <Stack
                gap={2}
                sx={{
                  display: generatingCommentsChain ? "flex" : "none",
                }}
              >
                {post?.comments.length &&
                  [...Array(post?.comments.length)].map((_, index) => (
                    <CommentSkeletonLoader key={index} />
                  ))}
                {post?.comments.length === null && <CommentSkeletonLoader />}
                {post?.comments.length === 0 && (
                  <Stack
                    width={"100%"}
                    justifyContent={"center"}
                    alignItems={"center"}
                  >
                    <TextGlitchEffect
                      text={`No comments yet`}
                      speed={60}
                      letterCase="lowercase"
                      type="ALPHA_NUMERIC"
                      className={"no Comments Found"}
                    />
                  </Stack>
                )}
              </Stack>
            </Fade>
          </Stack>
        </Stack>
        {isDesktop && (
          <UserStats
            userData={authorData}
            isLoggedIn={isLoggedIn}
            randomGIFIndex={randomGIFIndex}
            pageVariant={true}
          />
        )}
      </Stack>
    </SauceLayout>
  );
}

export default PostPage;
