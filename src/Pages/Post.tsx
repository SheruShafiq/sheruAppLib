import { Alert, Typography, Box, Stack, Switch, Button } from "@mui/material";
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
import { Comment, Post } from "../../dataTypeDefinitions";
const gipyAPIKey = import.meta.env.REACT_APP_GIPHY_API_KEY;
const tenorAPIKey = import.meta.env.REACT_APP_TENOR_API_KEY;
import { useNavigate } from "react-router-dom";

function PostPage({
  isLoggedIn,
  userData,
  setOpen,
  setIsLoggedIn,
  categories,
}) {
  const [parentComments, setParentComments] = useState<Comment[]>([]);
  const [relevantCommentIDs, setRelevantCommentIDs] = useState<number[]>([]);
  const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState(false);
  const [post, setPost] = useState<Post>();
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  useEffect(() => {
    fetchPostById({
      id: id!,
      onSuccess: (data) => {
        setPost(data);
        setLoading(false);
        setRelevantCommentIDs(data?.comments);
      },
      onError: (error) => {
        setLoading(false);
        enqueueSnackbar(`Error fetching post ${error}`, { variant: "error" });
      },
    });
  }, [id]);

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
        onPostCreated={(id: string) => {
          navigate(`/post/${id}`);
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
                window.location.reload();
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
                .map(Number)
                .includes(Number(post?.id || ""))}
              downvotedByCurrentUser={userData?.downVotedPosts
                .map(Number)
                .includes(Number(post?.id || ""))}
              reportedByCurrentUser={userData?.reportedPosts
                .map(Number)
                .includes(Number(post?.id || ""))}
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
          {/* {parentComments &&
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
            ))} */}
        </Stack>
      </Stack>
    </Stack>
  );
}

export default PostPage;
