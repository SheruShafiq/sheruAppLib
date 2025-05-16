import React, { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import {
  Stack,
  Divider,
  ToggleButtonGroup,
  ToggleButton,
  Fade,
  Button,
} from "@mui/material";
import {
  fetchUserById,
  getPostByID,
  getPostsByIds,
  getCommentsByIDs,
  createComment,
  patchUser,
} from "../APICalls";
import { GIFs } from "../assets/GIFs";
import { errorProps, Comment, User, Post } from "../../dataTypeDefinitions";
import { enqueueSnackbar } from "notistack";
import UserStats from "../Components/UserStats";
import PostPreview from "../Components/PostPreview";
import CommentBlock from "../Components/CommentBlock";
import PostPreviewSkeletonLoader from "../SkeletonLoaders/PostPreviewSkeletonLoader";
import CommentSkeletonLoader from "../SkeletonLoaders/CommentSkeletonLoader";
import SauceLayout from "../Layouts/SauceLayout";

function buildCommentTree(
  flatComments: Comment[]
): (Comment & { replies: any[] })[] {
  const lookup = new Map<string, Comment & { replies: any[] }>();
  flatComments.forEach((c) => {
    if (c.id) lookup.set(c.id, { ...c, replies: [] });
  });
  const childIds = new Set<string>();
  flatComments.forEach((c) => {
    const id = c.id;
    if (c.replies && id) {
      c.replies.forEach((replyId) => {
        childIds.add(replyId);
        const parent = lookup.get(id);
        const child = lookup.get(replyId);
        if (parent && child) parent.replies.push(child);
      });
    }
  });
  const roots: (Comment & { replies: any[] })[] = [];
  lookup.forEach((node, id) => {
    if (!childIds.has(id)) roots.push(node);
  });
  return roots;
}

function UserProfilePage({
  isLoggedIn,
  loggedInUserData,
  setOpen,
  setIsLoggedIn,
  categories,
  refreshUserData,
}) {
  const { id } = useParams();
  const [userData, setUserData] = useState<User>(
    isLoggedIn ? ({} as User) : loggedInUserData
  );
  const [activeDataTab, setActiveDataTab] = useState("posts");
  const [posts, setPosts] = useState<Post[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentsChain, setCommentsChain] = useState<any[]>([]);
  const [generatingCommentsChain, setGeneratingCommentsChain] = useState(false);
  const [creatingComment, setCreatingComment] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [fetchedData, setFetchedData] = useState<Record<string, any>>({});

  const randomGIFIndex = useMemo(
    () => Math.floor(Math.random() * Math.min(GIFs.length, 200)),
    []
  );

  const handleChange = (
    _event: React.MouseEvent<HTMLElement>,
    newTab: string
  ) => {
    if (newTab !== activeDataTab) setActiveDataTab(newTab);
  };

  useEffect(() => {
    if (!id) return;
    fetchUserById(
      id,
      (user) => setUserData(user),
      (error) => {
        const err: errorProps = {
          id: "fetching user data Error",
          userFriendlyMessage: "An error occurred while fetching user data.",
          errorMessage:
            error instanceof Error ? error.message : "Unknown error",
          error: error instanceof Error ? error : new Error("Unknown error"),
        };
        enqueueSnackbar({ variant: "error", ...err });
      }
    );
  }, [id]);

  useEffect(() => {
    if (!id || !activeDataTab) return;

    const key = activeDataTab as keyof User;
    const ids = userData?.[key];

    if (!ids || !Array.isArray(ids)) return;

    const cached = fetchedData[activeDataTab];
    if (cached) {
      if (
        ["comments", "likedComments", "dislikedComments"].includes(
          activeDataTab
        )
      ) {
        setComments(cached);
      } else {
        setPosts(cached);
      }
      return;
    }

    const fetchData = async () => {
      if (
        ["comments", "likedComments", "dislikedComments"].includes(
          activeDataTab
        )
      ) {
        setGeneratingCommentsChain(true);
      } else {
        setLoading(true);
      }

      try {
        if (
          ["comments", "likedComments", "dislikedComments"].includes(
            activeDataTab
          )
        ) {
          const fetchedComments = await getCommentsByIDs(ids);
          setComments(fetchedComments);
          setFetchedData((prev) => ({
            ...prev,
            [activeDataTab]: fetchedComments,
          }));
        } else {
          const fetchedPosts = await getPostsByIds(ids);
          setPosts(fetchedPosts);
          setFetchedData((prev) => ({
            ...prev,
            [activeDataTab]: fetchedPosts,
          }));
        }
      } catch (error) {
        const isCommentTab = [
          "comments",
          "likedComments",
          "dislikedComments",
        ].includes(activeDataTab);
        const resource = isCommentTab ? "comments" : "posts";
        const err: errorProps = {
          id: `fetch-${resource}-error`,
          userFriendlyMessage: `An error occurred while fetching ${resource}.`,
          errorMessage:
            error instanceof Error ? error.message : "Unknown error",
          error: error instanceof Error ? error : new Error("Unknown error"),
        };
        enqueueSnackbar({ variant: "error", ...err });
      } finally {
        setLoading(false);
        setGeneratingCommentsChain(false);
      }
    };

    fetchData();
  }, [activeDataTab, userData, id, fetchedData]);

  useEffect(() => {
    if (
      ["comments", "likedComments", "dislikedComments"].includes(activeDataTab)
    ) {
      try {
        const tree = buildCommentTree(comments);
        setCommentsChain(tree);
      } catch (err) {
        console.error(err);
      }
    }
  }, [comments, activeDataTab]);

  const handleCommentCreate = ({ reply, comment, replies }) => {
    if (!reply && !comment && !replies) setCreatingComment(true);

    createComment(
      userData?.id!,
      userData?.id!,
      reply ? comment : newComment,
      (createdComment) => {
        patchUser({
          userID: userData?.id!,
          field: "comments",
          newValue: [...(userData?.comments || []), createdComment.id!],
          onSuccess: () => {
            refreshUserData(userData?.id!);
            setCreatingComment(false);
          },
          onError: (error) => {
            const err: errorProps = {
              id: "patch-user-error",
              userFriendlyMessage:
                "An error occurred while updating user comments.",
              errorMessage:
                error instanceof Error ? error.message : "Unknown error",
              error:
                error instanceof Error ? error : new Error("Unknown error"),
            };
            enqueueSnackbar({ variant: "error", ...err });
            setCreatingComment(false);
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
        setCreatingComment(false);
      }
    );
  };

  const refreshPostById = (postId: string) => {
    getPostByID(
      postId,
      (post) => {
        setPosts((prev) => prev.map((p) => (p.id === post.id ? post : p)));
      },
      (error) => {
        const err: errorProps = {
          id: "fetch-post-error",
          userFriendlyMessage: "An error occurred while fetching the post.",
          errorMessage:
            error instanceof Error ? error.message : "Unknown error",
          error: error instanceof Error ? error : new Error("Unknown error"),
        };
        enqueueSnackbar({ variant: "error", ...err });
      }
    );
    refreshUserData(userData?.id!);
  };
  const handleWheel = (e) => {
    if (!containerRef.current) return;

    e.preventDefault();

    containerRef.current.scrollLeft += e.deltaY;
  };
  const containerRef = React.useRef<HTMLDivElement>(null);
  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener("wheel", handleWheel, { passive: false });
    }
    return () => {
      if (container) {
        container.removeEventListener("wheel", handleWheel);
      }
    };
  }, []);

  return (
    <SauceLayout
      callerIdentifier="userProfilePage"
      isLoggedIn={isLoggedIn}
      userData={loggedInUserData}
      setOpen={setOpen}
      setIsLoggedIn={setIsLoggedIn}
      categories={categories}
      onPostCreated={() => {}}
    >
      <Divider sx={{ borderColor: "white" }} />
      <Stack mt={2} px={2} gap={2} maxWidth="1200px" mx="auto" width="100%">
        <UserStats
          userData={userData}
          isLoggedIn={isLoggedIn}
          randomGIFIndex={randomGIFIndex}
          pageVariant={false}
        />
       
        <Stack
          sx={{
            overflowX: "auto",
            "&::-webkit-scrollbar": { display: "none" },
            msOverflowStyle: "none",
            scrollbarWidth: "none",
          }}
          ref={containerRef}
        >
          <ToggleButtonGroup
            color="primary"
            value={activeDataTab}
            exclusive
            onChange={handleChange}
            aria-label="data-view"
            sx={{
              mx: "auto",
              width: "max-content",
            }}
          >
            <ToggleButton disabled={userData?.posts.length === 0} value="posts">
              Posts ({userData?.posts.length})
            </ToggleButton>
            <ToggleButton
              disabled={userData?.comments.length === 0}
              value="comments"
            >
              Comments ({userData?.comments.length})
            </ToggleButton>
            <ToggleButton
              disabled={userData?.upvotedPosts.length === 0}
              value="upvotedPosts"
            >
              Liked Posts ({userData?.upvotedPosts.length})
            </ToggleButton>
            <ToggleButton
              disabled={userData?.likedComments.length === 0}
              value="likedComments"
            >
              Liked Comments ({userData?.likedComments.length})
            </ToggleButton>
            <ToggleButton
              disabled={userData?.downVotedPosts.length === 0}
              value="downVotedPosts"
            >
              Disliked Posts ({userData?.downVotedPosts.length})
            </ToggleButton>
            <ToggleButton
              disabled={userData?.dislikedComments.length === 0}
              value="dislikedComments"
            >
              Disliked Comments ({userData?.dislikedComments.length})
            </ToggleButton>
          </ToggleButtonGroup>
        </Stack>
        {loading && !generatingCommentsChain && (
          <Stack gap={1}>
            {[...Array(3)].map((_, index) => (
              <PostPreviewSkeletonLoader
                key={`loader-${index}`}
                pageVariant={false}
              />
            ))}
          </Stack>
        )}
        {generatingCommentsChain && (
          <Stack gap={1}>
            {[...Array(3)].map((_, index) => (
              <CommentSkeletonLoader />
            ))}
          </Stack>
        )}

        {!loading &&
          ["posts", "upvotedPosts", "reportedPosts", "downVotedPosts"].includes(
            activeDataTab
          ) && (
            <Fade in={!loading} timeout={1000}>
              <Stack gap={1} sx={{ display: !loading ? "flex" : "none" }}>
                {posts.map(
                  (post) =>
                    post.id && (
                      <PostPreview
                        key={post.id}
                        {...(post as any)}
                        commentsCount={post.comments?.length || 0}
                        randomGIFIndex={randomGIFIndex}
                        categories={categories}
                        pageVariant={false}
                        isPostAuthoredByCurrentUser={userData?.posts?.includes(
                          post.id
                        )}
                        isLoggedIn={isLoggedIn}
                        fetchPosts={() => refreshPostById(post.id!)}
                        upvotedByCurrentUser={userData?.upvotedPosts?.includes(
                          post.id
                        )}
                        downvotedByCurrentUser={userData?.downVotedPosts?.includes(
                          post.id
                        )}
                        reportedByCurrentUser={userData?.reportedPosts?.includes(
                          post.id
                        )}
                        id={post.id!}
                        userData={userData}
                      />
                    )
                )}
              </Stack>
            </Fade>
          )}

        {["comments", "likedComments", "dislikedComments"].includes(
          activeDataTab
        ) && (
          <Fade in={!generatingCommentsChain} timeout={1000}>
            <Stack
              gap={1}
              sx={{
                display: !generatingCommentsChain ? "flex" : "none",
              }}
            >
              {generatingCommentsChain
                ? [...Array(comments.length || 3)].map((_, idx) => (
                    <CommentSkeletonLoader key={`comment-skeleton-${idx}`} />
                  ))
                : commentsChain
                    .slice()
                    .reverse()
                    .map((comment) => (
                      <CommentBlock
                        authorID={comment.authorID}
                        postID={comment.postID}
                        userPageVariant={true}
                        key={comment.id}
                        id={comment.id}
                        dateCreated={comment.dateCreated}
                        userName={comment.userName}
                        commentContents={comment.text}
                        replies={comment.replies}
                        imageURL={comment.imageURL}
                        amIaReply={false}
                        depth={0}
                        isLoggedIn={isLoggedIn}
                        likes={comment.likes}
                        likedByCurrentUser={userData?.likedComments?.includes(
                          comment.id
                        )}
                        dislikes={comment.dislikes}
                        dislikedByCurrentUser={userData?.dislikedComments?.includes(
                          comment.id
                        )}
                        userData={userData}
                        handleCommentCreate={handleCommentCreate}
                        setGeneratingCommentsChain={setGeneratingCommentsChain}
                      />
                    ))}
            </Stack>
          </Fade>
        )}
      </Stack>
    </SauceLayout>
  );
}

export default UserProfilePage;
