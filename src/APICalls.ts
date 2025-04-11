/// <reference types="vite/client" />
const APIURL = import.meta.env.VITE_BACKEND_URL;
import {
  Post,
  user,
  Comment,
  Category,
  Report,
  cachedCommentsChainID,
  createPostProps,
  standardFetchByIDProps,
  fetchPostsProps,
  fetchPostsPaginatedProps,
  errorProps,
} from "../dataTypeDefinitions.ts";

async function fetchPosts({ onSuccess, onError }: fetchPostsProps) {
  try {
    const response = await fetch(`${APIURL}/posts`);
    const data = await response.json();
    const posts: Post[] = data.posts;
    onSuccess(posts);
  } catch (error) {
    onError(error); // need to implement proper error props
  }
}

async function fetchPostsPaginated({
  onSuccess,
  onError,
  page,
  pageSize,
}: fetchPostsPaginatedProps) {
  try {
    const response = await fetch(
      `${APIURL}/posts?_sort=dateCreated&_order=desc&_page=${page}&_limit=${pageSize}`
    );
    const data = await response.json();
    onSuccess(data);
  } catch (error) {
    onError(error);
  }
}

async function fetchPostById({
  id,
  onSuccess,
  onError,
}: standardFetchByIDProps) {
  try {
    const response = await fetch(`${APIURL}/posts/${id}`);
    const data: Post = await response.json();
    onSuccess(data);
  } catch (error) {
    const err: errorProps = {
      id: "fetching Paginated Posts Error",
      userFreindlyMessage: "An error occurred while fetching posts.",
      errorMessage: error instanceof Error ? error.message : "Unknown error",
      error: error instanceof Error ? error : new Error("Unknown error"),
    };
    onError(err);
  }
}

function createSafePost(post: Partial<Post>): Post {
  const now = new Date().toISOString();
  return {
    title: post.title ?? "",
    resource: post.resource ?? "",
    author: post.author ?? "",
    description: post.description ?? "",
    category: post.category ?? 0,
    upvotes: post.upvotes ?? 0,
    downvotes: post.downvotes ?? 0,
    reports: post.reports ?? 0,
    reportIDs: post.reportIDs ?? [],
    comments: post.comments ?? [],
    dateCreated: post.dateCreated ?? now,
    dateModified: now,
    dateDeleted: post.dateDeleted ?? "",
    cachedCommentsChainID: post.cachedCommentsChainID ?? "",
    cachedReportsChainID: post.cachedReportsChainID ?? "",
  };
}

async function createPost({ post, onSuccess, onError }: createPostProps) {
  try {
    if (
      !post.title ||
      !post.resource ||
      !post.author ||
      !post.category ||
      !post.description
    ) {
      throw new Error(
        "All required fields (title, resource, author, category, description) must be provided."
      );
    }
    const now = new Date().toISOString();
    post.dateCreated = post.dateCreated || now;
    post.dateModified = post.dateModified || now;
    post.dateDeleted = post.dateDeleted || "";
    const safeTestedPost = createSafePost(post);
    const response = await fetch(`${APIURL}/posts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(safeTestedPost),
    });

    const data: Post = await response.json();
    onSuccess(data);
  } catch (error) {
    const err: errorProps = {
      id: "createPostError",
      userFreindlyMessage: "An error occurred while creating the post.",
      errorMessage: error instanceof Error ? error.message : "Unknown error",
      error: error instanceof Error ? error : new Error("Unknown error"),
    };
    onError(err);
  }
}

async function updatePost(id, post, onSuccess, onError) {
  try {
    // Update dateModified field
    post.dateModified = new Date().toISOString();
    const response = await fetch(`${APIURL}/posts/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(post),
    });

    const data = await response.json();
    onSuccess(data);
  } catch (error) {
    onError(error);
  }
}
async function deletePost(id, onSuccess, onError) {
  try {
    // Instead of physical deletion, mark the post as deleted
    const now = new Date().toISOString();
    const response = await fetch(`${APIURL}/posts/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ dateDeleted: now, dateModified: now }),
    });

    const data = await response.json();
    onSuccess(data);
  } catch (error) {
    onError(error);
  }
}
async function upVotePost(id, currentUpvotes, onSuccess, onError) {
  try {
    const newUpvotes = currentUpvotes + 1;
    const now = new Date().toISOString();
    const response = await fetch(`${APIURL}/posts/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ upvotes: newUpvotes, dateModified: now }),
    });

    const data = await response.json();
    onSuccess(data);
  } catch (error) {
    onError(error);
  }
}

async function downVotePost(id, currentDownvotes, onSuccess, onError) {
  try {
    const newDownvotes = currentDownvotes + 1;
    const now = new Date().toISOString();
    const response = await fetch(`${APIURL}/posts/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ downvotes: newDownvotes, dateModified: now }),
    });

    const data = await response.json();
    onSuccess(data);
  } catch (error) {
    onError(error);
  }
}

async function reportPost(id, currentReports, onSuccess, onError) {
  try {
    const newReports = currentReports + 1;
    const now = new Date().toISOString();
    const response = await fetch(`${APIURL}/posts/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reports: newReports, dateModified: now }),
    });

    const data = await response.json();
    onSuccess(data);
  } catch (error) {
    onError(error);
  }
}

async function undoUpVotePost(id, currentUpvotes, onSuccess, onError) {
  try {
    const newUpvotes = currentUpvotes - 1;
    const now = new Date().toISOString();
    const response = await fetch(`${APIURL}/posts/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ upvotes: newUpvotes, dateModified: now }),
    });

    const data = await response.json();
    onSuccess(data);
  } catch (error) {
    onError(error);
  }
}

async function undoDownVotePost(id, currentDownvotes, onSuccess, onError) {
  try {
    const newDownvotes = currentDownvotes - 1;
    const now = new Date().toISOString();
    const response = await fetch(`${APIURL}/posts/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ downvotes: newDownvotes, dateModified: now }),
    });

    const data = await response.json();
    onSuccess(data);
  } catch (error) {
    onError(error);
  }
}

async function undoReportPost(id, currentReports, onSuccess, onError) {
  try {
    const newReports = currentReports - 1;
    const now = new Date().toISOString();
    const response = await fetch(`${APIURL}/posts/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reports: newReports, dateModified: now }),
    });

    const data = await response.json();
    onSuccess(data);
  } catch (error) {
    onError(error);
  }
}

async function addComment(postId, comment, onSuccess, onError) {
  try {
    const newComment = { ...comment, postId };
    const response = await fetch(`${APIURL}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newComment),
    });

    const data = await response.json();
    onSuccess(data);
  } catch (error) {
    onError(error);
  }
}

async function deleteComment(commentId, onSuccess, onError) {
  try {
    const response = await fetch(`${APIURL}/comments/${commentId}`, {
      method: "DELETE",
    });
    onSuccess(response);
  } catch (error) {
    onError(error);
  }
}

async function editComment(commentId, comment, onSuccess, onError) {
  try {
    const response = await fetch(`${APIURL}/comments/${commentId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(comment),
    });

    const data = await response.json();
    onSuccess(data);
  } catch (error) {
    onError(error);
  }
}

async function fetchUsers(onSuccess, onError) {
  try {
    const response = await fetch(`${APIURL}/users`);

    const data = await response.json();
    onSuccess(data);
  } catch (error) {
    onError(error);
  }
}

async function fetchUserById(id, onSuccess, onError) {
  try {
    const response = await fetch(`${APIURL}/users/${id}`);

    const data = await response.json();
    onSuccess(data);
  } catch (error) {
    onError(error);
  }
}

// New helper function to get user by ID (alias for fetchUserById)
function getUserByID(userId, onSuccess, onError) {
  fetchUserById(userId, onSuccess, onError);
}

async function createUser(user, onSuccess, onError) {
  try {
    const now = new Date().toISOString();
    // Ensure required date fields are present
    user.dateCreated = user.dateCreated || now;
    user.dateModified = user.dateModified || now;
    user.dateDeleted = user.dateDeleted || "";
    const response = await fetch(`${APIURL}/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    });

    const data = await response.json();
    onSuccess(data);
  } catch (error) {
    onError(error);
  }
}

async function loginUser({ username, password }, onSuccess, onError) {
  try {
    // JSON Server supports filtering via query parameters
    const response = await fetch(
      `${APIURL}/users?username=${encodeURIComponent(
        username
      )}&password=${encodeURIComponent(password)}`
    );

    const data = await response.json();
    if (data.length > 0) {
      onSuccess(data[0]);
    } else {
      throw new Error("Invalid credentials");
    }
  } catch (error) {
    onError(error);
  }
}

async function signUpUser(
  { username, password, displayName },
  onSuccess,
  onError
) {
  try {
    const now = new Date().toISOString();
    // Create a new user with all required fields
    const user = {
      username,
      password,
      displayName,
      likedPosts: [],
      dislikedPosts: [],
      reportedPosts: [],
      comments: [],
      posts: [],
      dateCreated: now,
      dateModified: now,
      dateDeleted: "",
    };
    const response = await fetch(`${APIURL}/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    });

    const data = await response.json();
    onSuccess(data);
  } catch (error) {
    onError(error);
  }
}

async function updateUser(id, user, onSuccess, onError) {
  try {
    user.dateModified = new Date().toISOString();
    const response = await fetch(`${APIURL}/users/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    });

    const data = await response.json();
    onSuccess(data);
  } catch (error) {
    onError(error);
  }
}

async function getCommentByID(commentId, onSuccess, onError) {
  try {
    const response = await fetch(`${APIURL}/comments/${commentId}`);

    const data = await response.json();
    onSuccess(data);
  } catch (error) {
    onError(error);
  }
}

export {
  fetchPosts,
  fetchPostById,
  createPost,
  updatePost,
  deletePost,
  upVotePost,
  downVotePost,
  reportPost,
  undoUpVotePost,
  undoDownVotePost,
  undoReportPost,
  addComment,
  deleteComment,
  editComment,
  fetchUsers,
  fetchUserById,
  getUserByID, // newly added
  createUser,
  loginUser,
  signUpUser,
  updateUser,
  fetchPostsPaginated,
  getCommentByID,
};
