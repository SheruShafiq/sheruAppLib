import React, { useEffect, useMemo, useState, useRef } from "react";
import {
  Stack,
  Divider,
  IconButton,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { fetchPostsPaginated, getPostByID, searchPosts } from "../APICalls";
import { useSnackbar } from "notistack";
import PostPreview from "@components/PostPreview";
import SauceLayout from "../Layouts/SauceLayout";
import PostPreviewSkeletonLoader from "../SkeletonLoaders/PostPreviewSkeletonLoader";
import Fade from "@mui/material/Fade";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import { useParams } from "react-router-dom";
import {
  fetchPostsPaginatedProps,
  Post,
  paginatedPostsMetaDataType,
  Category,
} from "../../dataTypeDefinitions";
import { errorProps } from "../../dataTypeDefinitions";
import IOSSpinner from "@components/IOSLoader";
import { GIFs } from "@assets/GIFs";
import HomeInteractions from "@components/HomeInteractions";
import IOSLoader from "@components/IOSLoader";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import SideMenu from "@components/SideMenu";
import useInfiniteScroll from "@hooks/useInfiniteScroll";
function SauceHome({
  isLoggedIn,
  userData,
  setOpen,
  setIsLoggedIn,
  refreshUserData,
  categories,
}) {
  const { pageNumber } = useParams();
  const currentDisplayHeight = window.innerHeight;
  const headerHeight = 65;
  const postPreviewHeight = 220;
  const pageSize = Math.floor(
    (currentDisplayHeight - headerHeight) / postPreviewHeight
  );
  const [userSortPrefrences, setUserSortPrefrences] = useState({
    sortBy: "dateCreated",
    sortOrder: "desc",
  });
  const [fetchingInitialPosts, setFetchingPosts] = useState(true);
  const [curentPage, setCuurentPage] = useState(
    pageNumber ? Number(pageNumber) : 1
  );
  const [posts, setPosts] = useState<Post[]>([]);
  const { enqueueSnackbar } = useSnackbar();

  const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState(false);
  const [metaData, setmetaData] = useState<paginatedPostsMetaDataType | null>(
    null
  );
  const [hasMorePosts, setHasMorePosts] = useState(true);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const fetchPostsHandeled = (
    page?: number,
    pageSize?: number,
    userSortPrefrences?: {
      sortBy: string;
      sortOrder: string;
    }
  ) => {
    setFetchingPosts(true);
    fetchPostsPaginated({
      onSuccess: (data) => {
        setPosts((prev) =>
          page && page > 1 ? [...prev, ...data.posts] : data.posts
        );
        setmetaData({
          first: data?.metadata?.first || "",
          prev: data?.metadata?.prev || "",
          next: data?.metadata?.next || "",
          last: data?.metadata?.last || "",
        });
        setHasMorePosts(!!data?.metadata?.next);
        setFetchingPosts(false);
      },
      onError: (error: errorProps) => {
        const err: errorProps = {
          id: "fetching Paginated Posts Error",
          userFriendlyMessage: "An error occurred while fetching posts.",
          errorMessage:
            error instanceof Error ? error.message : "Unknown error",
          error: error instanceof Error ? error : new Error("Unknown error"),
        };
        enqueueSnackbar({ variant: "error", ...err });
        setFetchingPosts(false);
      },
      page,
      pageSize,
      sortBy: userSortPrefrences?.sortBy || "dateCreated",
      sortOrder: userSortPrefrences?.sortOrder || "desc",
    } as fetchPostsPaginatedProps);
  };
  const [searchTerm, setSearchTerm] = useState<string | undefined>(undefined);
  function refreshPostById(id: string) {
    getPostByID(
      id,
      (post) => {
        setPosts((prevPosts) =>
          prevPosts.map((p) => (p.id === post.id ? post : p))
        );
      },
      (error) => {
        const err: errorProps = {
          id: "fetching Post Error",
          userFriendlyMessage: "An error occurred while fetching posts.",
          errorMessage:
            error instanceof Error ? error.message : "Unknown error",
          error: error instanceof Error ? error : new Error("Unknown error"),
        };
        enqueueSnackbar({ variant: "error", ...err });
      }
    );
    refreshUserData(userData.id);
  }
  useEffect(() => {
    fetchPostsHandeled(curentPage, pageSize, userSortPrefrences);
  }, [curentPage, userSortPrefrences]);

  const isNoPosts = posts.length === 0;
  const randomGIFIndex = useMemo(
    () => Math.floor(Math.random() * Math.min(GIFs.length, 200)),
    []
  );
  const firstPage = Number(metaData?.first?.match(/_page=(\d+)/)?.[1] || 1);
  const prevPage = metaData?.prev?.match(/_page=(\d+)/)?.[1];
  const nextPage = metaData?.next?.match(/_page=(\d+)/)?.[1];
  const lastPage = Number(metaData?.last?.match(/_page=(\d+)/)?.[1] || 1);
  useInfiniteScroll(
    loadMoreRef,
    () => {
      if (metaData?.next && !fetchingInitialPosts) {
        const next = metaData.next.match(/_page=(\d+)/)?.[1];
        if (next) setCuurentPage(Number(next));
      }
    },
    { rootMargin: "100px" }
  );
  const [pendingSearchTerm, setPendingSearchTerm] = useState<string>("");
  useEffect(() => {
    const handler = setTimeout(() => {
      setSearchTerm(pendingSearchTerm);
    }, 500);
    return () => {
      clearTimeout(handler);
    };
  }, [pendingSearchTerm]);
  useEffect(() => {
    if (searchTerm === "" || searchTerm === undefined) {
      fetchPostsHandeled;
    }
    if (searchTerm)
      (async () => {
        setFetchingPosts(true);
        searchPosts(
          searchTerm,
          (data) => {
            setPosts(data);
            setFetchingPosts(false);
          },
          (error) => {
            const err: errorProps = {
              id: "searchinh Post Error",
              userFriendlyMessage: "An error occurred while searching posts.",
              errorMessage:
                error instanceof Error ? error.message : "Unknown error",
              error:
                error instanceof Error ? error : new Error("Unknown error"),
            };
            enqueueSnackbar({ variant: "error", ...err });
            setFetchingPosts(false);
          }
        );
      })();
  }, [searchTerm]);
  return (
    <SauceLayout
      callerIdentifier="homePage"
      isLoggedIn={isLoggedIn}
      userData={userData}
      setOpen={setOpen}
      setIsLoggedIn={setIsLoggedIn}
      categories={categories}
      onPostCreated={() => {
        fetchPostsHandeled(curentPage, pageSize);
      }}
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
          <Stack
            direction={globalThis.isDesktop ? "row" : "column"}
            gap={2}
            alignItems={"center"}
            justifyContent={"space-between"}
          >
            <TextField
              variant="standard"
              onChange={(e) => {
                setPendingSearchTerm(e.target.value);
              }}
              sx={{
                width: globalThis.isDesktop ? "25%" : "100%",
                maxWidth: globalThis.isDesktop ? "400px" : "100%",
                minWidth: "200px",
              }}
              label="Search"
              slotProps={{
                input: {
                  endAdornment: (
                    <React.Fragment>
                      {fetchingInitialPosts ? <IOSLoader /> : null}
                    </React.Fragment>
                  ),
                },
              }}
            />
            <Stack
              sx={{
                width: globalThis.isDesktop ? "25%" : "100%",
                maxWidth: globalThis.isDesktop ? "400px" : "100%",
                minWidth: "200px",
              }}
              direction={"row"}
              gap={1}
            >
              <IconButton
                disabled={searchTerm !== ""}
                sx={{
                  width: "40px",
                }}
                onClick={() => {
                  setUserSortPrefrences((prev) => ({
                    ...prev,
                    sortOrder: prev.sortOrder === "asc" ? "desc" : "asc",
                  }));
                }}
              >
                <SwapVertIcon
                  color={
                    userSortPrefrences.sortOrder === "asc"
                      ? "primary"
                      : "secondary"
                  }
                />
              </IconButton>
              <FormControl size="small" fullWidth>
                <InputLabel
                  sx={{
                    left: "-15px",
                    top: "8px",
                  }}
                  id="select-sorting"
                >
                  Sort
                </InputLabel>
                <Select
                  disabled={searchTerm !== ""}
                  defaultValue={"dateCreated"}
                  labelId="select-sorting"
                  id="elect-sorting"
                  label="Age"
                  onChange={(e) => {
                    setUserSortPrefrences((prev) => ({
                      ...prev,
                      sortBy: e.target.value,
                    }));
                  }}
                  variant="standard"
                >
                  <MenuItem value={"dateCreated"}>Date Created</MenuItem>
                  <MenuItem value={"upVotedPosts"}>Upvotes</MenuItem>
                  <MenuItem value={"downVotedPost"}>Downvotes</MenuItem>
                </Select>
              </FormControl>
            </Stack>
          </Stack>
          <Stack direction={"row"} gap={2}>
            {globalThis.isDesktop && <SideMenu categories={categories} />}
            <Stack
              direction={"row"}
              gap={2}
              alignItems={"center"}
              width={"100%"}
            >
              <Fade in={fetchingInitialPosts} timeout={1000}>
                <Stack
                  gap={2}
                  width={"100%"}
                  display={fetchingInitialPosts ? "flex" : "none"}
                >
                  {[...Array(pageSize)].map((_, index) => (
                    <PostPreviewSkeletonLoader
                      key={index}
                      pageVariant={false}
                    />
                  ))}
                </Stack>
              </Fade>

              <Fade in={!fetchingInitialPosts} timeout={1000}>
                <Stack
                  gap={2}
                  sx={{
                    display: fetchingInitialPosts ? "none" : "flex",
                  }}
                  width={"100%"}
                >
                  {Object.keys(posts).map((key) => (
                    <PostPreview
                      randomGIFIndex={randomGIFIndex}
                      categories={categories}
                      pageVariant={false}
                      isPostAuthoredByCurrentUser={userData?.posts
                        ?.map(Number)
                        .includes(Number(posts[key]?.id))}
                      isLoggedIn={isLoggedIn}
                      fetchPosts={() => {
                        refreshPostById(posts[key]?.id);
                      }}
                      title={posts[key]?.title}
                      resource={posts[key]?.resource}
                      description={posts[key]?.description}
                      upvotes={posts[key]?.upvotes}
                      downvotes={posts[key]?.downvotes}
                      reports={posts[key]?.reports}
                      categoryID={posts[key]?.categoryID}
                      commentsCount={posts[key]?.comments?.length}
                      key={key}
                      id={posts[key]?.id}
                      dateCreated={posts[key]?.dateCreated}
                      upvotedByCurrentUser={userData?.upvotedPosts
                        ?.map(String)
                        .includes(String(posts[key]?.id))}
                      downvotedByCurrentUser={userData?.downVotedPosts
                        ?.map(String)
                        .includes(String(posts[key]?.id))}
                  reportedByCurrentUser={userData?.reportedPosts
                        ?.map(String)
                        .includes(String(posts[key]?.id))}
                  userData={userData}
                />
                  ))}
                <div ref={loadMoreRef} />
                </Stack>
              </Fade>
              {isNoPosts && !fetchingInitialPosts && (
                <Stack
                  width={"100%"}
                  height={"100%"}
                  justifyContent={"center"}
                  alignItems={"center"}
                  gap={2}
                >
                  <h2>No posts available</h2>
                </Stack>
              )}
            </Stack>
          </Stack>
        </Stack>
      </Stack>
      <Stack
        width={"100%"}
        height={"100%"}
        justifyContent={"center"}
        alignItems={"center"}
        gap={2}
        flexDirection={"row"}
      >
        <Stack flexDirection={"row"}>
          <IconButton
            onClick={() => {
              setCuurentPage(firstPage);
              window.history.pushState(null, "", `/${firstPage}`);
            }}
            disabled={curentPage === firstPage || fetchingInitialPosts}
          >
            <KeyboardDoubleArrowLeftIcon />
          </IconButton>
          <IconButton
            onClick={() => {
              setCuurentPage(prevPage ? Number(prevPage) : curentPage);
              window.history.pushState(null, "", `/${prevPage}`);
            }}
            disabled={curentPage === firstPage || fetchingInitialPosts}
          >
            <KeyboardArrowLeftIcon />
          </IconButton>
        </Stack>
        <Stack flexDirection={"row"}>
          <IconButton
            onClick={() => {
              setCuurentPage(nextPage ? Number(nextPage) : curentPage);
              window.history.pushState(null, "", `/${nextPage}`);
            }}
            disabled={fetchingInitialPosts || curentPage === lastPage}
          >
            <KeyboardArrowRightIcon />
          </IconButton>
          <IconButton
            onClick={() => {
              setCuurentPage(lastPage);
              window.history.pushState(null, "", `/${lastPage}`);
            }}
            disabled={fetchingInitialPosts || curentPage === lastPage}
          >
            <KeyboardDoubleArrowRightIcon />
          </IconButton>
        </Stack>
      </Stack>
    </SauceLayout>
  );
}

export default SauceHome;
