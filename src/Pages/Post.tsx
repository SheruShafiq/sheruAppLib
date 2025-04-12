import { Stack } from "@mui/material";
import React, { useState, useEffect } from "react";
import { fetchPostById, fetchCommentsChain } from "../APICalls";
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
const gipyAPIKey = import.meta.env.REACT_APP_GIPHY_API_KEY;
import { useNavigate } from "react-router-dom";

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
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const { enqueueSnackbar } = useSnackbar();
  const [commentsChain, setCommentsChain] = useState<Comment[] | undefined>(
    undefined
  );
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
        enqueueSnackbar(`Error fetching post ${error}`, { variant: "error" });
      },
    });
  }

  useEffect(() => {
    refreshUserData(userData.id!);
    fetchCurrentPostData(id!);
  }, [id]);
  function refreshData(id: string) {
    fetchCurrentPostData(id);
    refreshUserData(userData.id!);
  }
  useEffect(() => {
    if (
      post?.cachedCommentsChainID !== "" &&
      post?.cachedCommentsChainID !== undefined
    ) {
      fetchCommentsChain(
        post?.cachedCommentsChainID || "",
        (comments) => {
          setCommentsChain(comments);
        },
        (error) => {
          const err: errorProps = {
            id: "fetching cached comments chain error",
            userFreindlyMessage: "An error occurred while fetching comments.",
            errorMessage:
              error instanceof Error ? error.message : "Unknown error",
            error: error instanceof Error ? error : new Error("Unknown error"),
          };
          enqueueSnackbar({ variant: "error", ...err });
        }
      );
    } else {
      setCommentsChain([]);
    }
  }, [post?.cachedCommentsChainID]);
  async function fetchImage() {
    const response = await fetch(
      `https://api.giphy.com/v1/gifs/random?api_key=${gipyAPIKey}&tag=cyberpunkProfilePicture&rating=g`
    );
    const data = await response.json();
    if (response.ok) {
      return data.data.images.original.url;
    } else {
      return null;
    }
  }
  return (
    <Stack px={2} width={"100%"}>
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
      <Stack maxWidth={"600px"}>
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
            text={"Comments"}
            speed={60}
            letterCase="lowercase"
            className="postPageCommentsTitle"
            type="alphanumeric"
          />
          {commentsChain &&
            commentsChain.length > 0 &&
            commentsChain.map((comment, index) => (
              <CommentBlock
                key={index}
                dateCreated={comment?.dateCreated}
                userName={"comment?.displayName"}
                commentContents={comment?.text}
                replies={comment?.replies}
                imageURL={"comment?.imageURL"}
                amIaReply={false}
              />
            ))}
        </Stack>
      </Stack>
    </Stack>
  );
}

export default PostPage;
