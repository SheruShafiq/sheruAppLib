"use client";

import React, { useEffect, useState } from "react";
import {
  Stack,
  Divider,
  Typography,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
} from "@mui/material";
import { useAuth } from "@/components/AuthProvider";
import SauceLayout from "@/components/SauceLayout";
import { fetchCategories, fetchPostsPaginated, fetchPostById } from "@/lib/api";
import { useSnackbar } from "notistack";
import { Post, Category, paginatedPostsMetaDataType } from "@/lib/definitions";
import PostPreview from "@/components/PostPreview";
import PostPreviewSkeletonLoader from "@/components/PostPreviewSkeletonLoader";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import { useRouter, useSearchParams } from "next/navigation";

export default function SauceClientPage() {
  const [loginDialogue, setLoginDialogue] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const { isLoggedIn, userData, setIsLoggedIn, refreshUserData } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get current page from URL or default to 1
  const currentPageParam = searchParams.get("page");
  const [currentPage, setCurrentPage] = useState(
    currentPageParam ? parseInt(currentPageParam) : 1
  );

  // Calculate page size based on screen height
  const [pageSize, setPageSize] = useState(10);
  useEffect(() => {
    if (typeof window !== "undefined") {
      const currentDisplayHeight = window.innerHeight;
      const headerHeight = 65;
      const postPreviewHeight = 220;
      const calculatedPageSize = Math.floor(
        (currentDisplayHeight - headerHeight) / postPreviewHeight
      );
      setPageSize(Math.max(calculatedPageSize, 5)); // At least 5 items per page
    }
  }, []);

  // Posts state
  const [posts, setPosts] = useState<Post[]>([]);
  const [fetchingPosts, setFetchingPosts] = useState(true);
  const [metaData, setMetaData] = useState<paginatedPostsMetaDataType | null>(
    null
  );

  // Sorting and search
  const [userSortPreferences, setUserSortPreferences] = useState({
    sortBy: "dateCreated",
    sortOrder: "desc",
  });
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [pendingSearchTerm, setPendingSearchTerm] = useState<string>("");

  useEffect(() => {
    // Fetch categories on component mount
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

  // Handle search input with debounce
  useEffect(() => {
    const handler = setTimeout(() => {
      setSearchTerm(pendingSearchTerm);
    }, 500);
    return () => {
      clearTimeout(handler);
    };
  }, [pendingSearchTerm]);

  // Fetch posts when page or sort preferences change
  useEffect(() => {
    fetchPostsHandled(currentPage, pageSize, userSortPreferences);

    // Update URL with current page
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set("page", currentPage.toString());
      window.history.pushState({}, "", url.toString());
    }
  }, [currentPage, userSortPreferences, pageSize]);

  // Function to fetch posts with pagination
  const fetchPostsHandled = (
    page: number,
    pageSize: number,
    sortPrefs: { sortBy: string; sortOrder: string }
  ) => {
    setFetchingPosts(true);
    fetchPostsPaginated({
      onSuccess: (data) => {
        setPosts(data?.posts || []);
        setMetaData({
          first: data?.metadata?.first || "",
          prev: data?.metadata?.prev || "",
          next: data?.metadata?.next || "",
          last: data?.metadata?.last || "",
        });
        setFetchingPosts(false);
      },
      onError: (error) => {
        enqueueSnackbar({
          variant: "error",
          message: "Failed to fetch posts",
        });
        setFetchingPosts(false);
      },
      page,
      pageSize,
      sortBy: sortPrefs.sortBy,
      sortOrder: sortPrefs.sortOrder,
    });
  };

  // Function to refresh a specific post
  const refreshPostById = (id: string) => {
    fetchPostById({
      id,
      onSuccess: (post) => {
        setPosts((prevPosts) =>
          prevPosts.map((p) => (p.id === post.id ? post : p))
        );
      },
      onError: (error) => {
        enqueueSnackbar({
          variant: "error",
          message: "Failed to refresh post",
        });
      },
    });

    if (userData?.id) {
      refreshUserData(userData.id);
    }
  };

  // Extract pagination information
  const firstPage = Number(metaData?.first?.match(/_page=(\d+)/)?.[1] || 1);
  const prevPage = metaData?.prev?.match(/_page=(\d+)/)?.[1];
  const nextPage = metaData?.next?.match(/_page=(\d+)/)?.[1];
  const lastPage = Number(metaData?.last?.match(/_page=(\d+)/)?.[1] || 1);

  // Handle sort change
  const handleSortChange = (sortBy: string) => {
    setUserSortPreferences((prev) => ({
      ...prev,
      sortBy,
    }));
  };

  // Toggle sort order
  const toggleSortOrder = () => {
    setUserSortPreferences((prev) => ({
      ...prev,
      sortOrder: prev.sortOrder === "asc" ? "desc" : "asc",
    }));
  };

  return (
    <SauceLayout
      isLoggedIn={isLoggedIn}
      userData={userData}
      setOpen={setLoginDialogue}
      setIsLoggedIn={setIsLoggedIn}
      categories={categories}
      callerIdentifier="homePage"
      onPostCreated={() => {
        fetchPostsHandled(currentPage, pageSize, userSortPreferences);
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
          <Typography variant="h4">Sauce Community</Typography>

          {/* Search and Filters */}
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            alignItems="center"
          >
            <TextField
              placeholder="Search posts..."
              variant="outlined"
              size="small"
              fullWidth
              value={pendingSearchTerm}
              onChange={(e) => setPendingSearchTerm(e.target.value)}
              sx={{ flex: 1 }}
            />

            <Stack direction="row" spacing={1} alignItems="center">
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Sort By</InputLabel>
                <Select
                  value={userSortPreferences.sortBy}
                  label="Sort By"
                  onChange={(e) => handleSortChange(e.target.value)}
                >
                  <MenuItem value="dateCreated">Date</MenuItem>
                  <MenuItem value="upvotes">Upvotes</MenuItem>
                  <MenuItem value="comments">Comments</MenuItem>
                  <MenuItem value="title">Title</MenuItem>
                </Select>
              </FormControl>

              <IconButton onClick={toggleSortOrder}>
                <SwapVertIcon />
              </IconButton>
            </Stack>
          </Stack>

          {/* Posts List */}
          <Stack spacing={2}>
            {fetchingPosts ? (
              // Show skeleton loaders while loading
              Array.from(new Array(pageSize)).map((_, index) => (
                <PostPreviewSkeletonLoader key={index} />
              ))
            ) : posts.length > 0 ? (
              posts.map((post) => (
                <PostPreview
                  key={post.id}
                  post={post}
                  isLoggedIn={isLoggedIn}
                  userData={userData}
                  refreshPost={refreshPostById}
                  refreshUserData={refreshUserData}
                  categories={categories}
                />
              ))
            ) : (
              <Stack
                alignItems="center"
                justifyContent="center"
                py={4}
                sx={{ backgroundColor: "rgba(0,0,0,0.2)", borderRadius: "8px" }}
              >
                <Typography variant="h6">No posts found</Typography>
                <Typography variant="body2" color="text.secondary">
                  Try a different search or be the first to create a post!
                </Typography>
              </Stack>
            )}
          </Stack>

          {/* Pagination */}
          {!fetchingPosts && posts.length > 0 && (
            <Stack direction="row" spacing={1} justifyContent="center" py={2}>
              <Button
                variant="outlined"
                disabled={currentPage === firstPage}
                onClick={() => setCurrentPage(firstPage)}
                startIcon={<KeyboardDoubleArrowLeftIcon />}
              >
                First
              </Button>
              <Button
                variant="outlined"
                disabled={!prevPage}
                onClick={() => prevPage && setCurrentPage(Number(prevPage))}
                startIcon={<KeyboardArrowLeftIcon />}
              >
                Prev
              </Button>
              <Button variant="contained" sx={{ minWidth: 64 }}>
                {currentPage}
              </Button>
              <Button
                variant="outlined"
                disabled={!nextPage}
                onClick={() => nextPage && setCurrentPage(Number(nextPage))}
                endIcon={<KeyboardArrowRightIcon />}
              >
                Next
              </Button>
              <Button
                variant="outlined"
                disabled={currentPage === lastPage}
                onClick={() => setCurrentPage(lastPage)}
                endIcon={<KeyboardDoubleArrowRightIcon />}
              >
                Last
              </Button>
            </Stack>
          )}
        </Stack>
      </Stack>
    </SauceLayout>
  );
}
