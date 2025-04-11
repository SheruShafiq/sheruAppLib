/// <reference types="vite/client" />
const APIURL = import.meta.env.VITE_BACKEND_URL;
import {
  Post,
  User,
  Comment,
  Category,
  Report,
  cachedCommentsChainID,
  createPostProps,
  standardFetchByIDProps,
  fetchPostsProps,
  fetchPostsPaginatedProps,
  errorProps,
  createUserProps,
  loginUserProps,
} from "../dataTypeDefinitions.ts";
const now = new Date().toISOString();
function createSafePost(post: Partial<Post>): Post {
  return {
    title: post.title ?? "",
    resource: post.resource ?? "",
    authorID: post.authorID ?? "",
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
    onError(error);
  }
}

async function createPost({
  title,
  resource,
  authorID,
  category,
  description,
  onSuccess,
  onError,
}: createPostProps) {
  try {
    if (!title || !resource || !authorID || !category || !description) {
      throw new Error(
        "All required fields (title, resource, category, description) must be provided."
      );
    }
    const post: Partial<Post> = {
      title,
      resource,
      authorID,
      category,
      description,
      upvotes: 0,
      downvotes: 0,
      reports: 0,
      reportIDs: [],
      comments: [],
      cachedCommentsChainID: "",
      cachedReportsChainID: "",
    };
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

async function createUser({
  username,
  password,
  displayName,
  onSuccess,
  onError,
}: createUserProps) {
  try {
    if (!username || !password || !displayName) {
      throw new Error(
        "All required fields (username, password, displayName) must be provided."
      );
    }

    const user = {
      username: username,
      password: password,
      displayName: displayName,
      posts: [],
      upvotedPosts: [],
      downVotedPosts: [],
      reportedPosts: [],
      comments: [],
      dateCreated: now,
      dateModified: now,
      dateDeleted: "",
      likedComments: [],
      dislikedComments: [],
    } as User;

    const response = await fetch(`${APIURL}/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    });
    const data: User = await response.json();
    onSuccess(data);
  } catch (error) {
    onError(error);
  }
}

async function loginUser({
  username,
  password,
  onSuccess,
  onError,
}: loginUserProps) {
  try {
    const response = await fetch(
      `${APIURL}/users?username=${encodeURIComponent(
        username
      )}&password=${encodeURIComponent(password)}`
    );

    const data = await response.json();
    const user: User = data.users;

    if (Object.values(user).length > 0) {
      onSuccess(user[0]);
    } else {
      throw new Error("Invalid credentials");
    }
  } catch (error) {
    onError(error);
  }
}

async function updatePost(id, post, onSuccess, onError) {
  try {
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
  createUser,
  loginUser,
  updateUser,
  fetchPostsPaginated,
  getCommentByID,
};
