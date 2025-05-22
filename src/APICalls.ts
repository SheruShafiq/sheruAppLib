
// <reference types="vite/client" />

import { apiRequest } from "./Helpers/api";
const APIURL = import.meta.env.VITE_BACKEND_URL;
import {
  Post,
  User,
  Comment,
  Category,
  createPostProps,
  standardFetchByIDProps,
  fetchPostsProps,
  fetchPostsPaginatedProps,
  createUserProps,
  loginUserProps,
  VoteField,
  PatchUserProps,
  PaginatedPostsResponse,
  LoginUserResponse,
  RowData,
  ExcelLog,
} from "../dataTypeDefinitions.ts";
const now = new Date().toISOString();
function createSafePost(post: Partial<Post>): Post {
  return {
    title: post.title ?? "",
    resource: post.resource ?? "",
    authorID: post.authorID ?? "",
    description: post.description ?? "",
    categoryID: post.categoryID ?? "",
    upvotes: post.upvotes ?? 0,
    downvotes: post.downvotes ?? 0,
    reports: post.reports ?? 0,
    reportIDs: post.reportIDs ?? [],
    comments: post.comments ?? [],
    dateCreated: post.dateCreated ?? now,
    dateModified: now,
    dateDeleted: post.dateDeleted ?? "",
  };
}

export async function fetchPosts({ onSuccess, onError }: fetchPostsProps) {
  try {
    const { posts } = await apiRequest<{ posts: Post[] }>(`/posts`);
    onSuccess(posts);
  } catch (error) {
    const err = error as Error;
    onError({
      id: "fetchPosts",
      userFriendlyMessage: "Unable to fetch posts.",
      errorMessage: err.message,
      error: err,
    });
  }
}

export async function fetchPostsPaginated({
  onSuccess,
  onError,
  page = 1,
  pageSize = 3,
  sortBy = "dateCreated",
  sortOrder = "desc",
}: fetchPostsPaginatedProps) {
  try {
    const data = await apiRequest<PaginatedPostsResponse>(
      `/posts?_sort=${sortBy}&_order=${sortOrder}&_page=${page}&_limit=${pageSize}`
    );
    onSuccess(data);
  } catch (error) {
    const err = error as Error;
    onError({
      id: "fetchPostsPaginated",
      userFriendlyMessage: "Unable to load posts.",
      errorMessage: err.message,
      error: err,
    });
  }
}

export async function fetchPostById({
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

export async function createPost({
  title,
  resource,
  authorID,
  categoryID,
  description,
  onSuccess,
  onError,
}: createPostProps) {
  try {
    if (!title || !resource || !authorID || !categoryID || !description) {
      throw new Error(
        "All required fields (title, resource, category, description) must be provided."
      );
    }
    const post: Partial<Post> = {
      title,
      resource,
      authorID,
      categoryID,
      description,
      upvotes: 0,
      downvotes: 0,
      reports: 0,
      reportIDs: [],
      comments: [],
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
interface FetchUserByIdProps {
  id: string;
  onSuccess: (user: User) => void;
  onError: (error: any) => void;
}

export async function fetchUserById(
  id: FetchUserByIdProps["id"],
  onSuccess: FetchUserByIdProps["onSuccess"],
  onError: FetchUserByIdProps["onError"]
): Promise<void> {
  try {
    const response = await fetch(`${APIURL}/users/${id}`);
    if (response.status === 404) {
      throw new Error("User not found");
    }
    const data: User = await response.json();
    onSuccess(data);
  } catch (error) {
    onError(error);
  }
}

export async function createUser({
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

export async function patchUser({
  userID,
  field,
  newValue,
  onSuccess,
  onError,
}: PatchUserProps) {
  try {
    const response = await fetch(`${APIURL}/users/${userID}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ [field]: newValue, dateModified: now }), 
  
      
    });

    if (!response.ok) {
      throw new Error("Failed to update user");
    }

    const data = await response.json();
    onSuccess(data);
  } catch (error) {
    onError(error);
  }
}

export async function loginUser({
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

    const { users } = (await response.json()) as LoginUserResponse;

    if (users.length > 0) {
      onSuccess(users[0]);
    } else {
      throw new Error("Invalid credentials");
    }
  } catch (error) {
    onError(error);
  }
}

/**
 * Reverses a vote change by decrementing the specified field.
 * @param id - The post ID.
 * @param field - Which field to update.
 * @param currentValue - The current value for that field.
 */
export async function patchUndoVotePost(
  id: string,
  field: VoteField,
  currentValue: number
): Promise<any> {
  const newValue = currentValue - 1;
  const now = new Date().toISOString();
  const response = await fetch(`${APIURL}/posts/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ [field]: newValue, dateModified: now }),
  });
  return response.json();
}

export async function patchVotePost(
  id: string,
  field: VoteField,
  currentValue: number,
  increment: number = 1
): Promise<any> {
  const newValue = currentValue + increment;
  const now = new Date().toISOString();
  const response = await fetch(`${APIURL}/posts/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ [field]: newValue, dateModified: now }),
  });
  return response.json();
}

export async function getPostByID(
  id: string,
  onSuccess: (post: Post) => void,
  onError: (error: any) => void
) {
  try {
    const response = await fetch(`${APIURL}/posts/${id}`);
    if (!response.ok) {
      throw new Error("Failed to fetch post");
    }
    const data: Post = await response.json();
    onSuccess(data);
  } catch (error) {
    onError(error);
  }
}


function getPostByIdPromise(postId: string): Promise<Post> {
  return new Promise((resolve, reject) => {
    getPostByID(
      postId,
      (post: Post) => resolve(post),
      (error: any) => reject(error)
    );
  });
}


export async function getPostsByIds(ids: string[]): Promise<Post[]> {
  return Promise.all(ids.map((id) => getPostByIdPromise(id)));
}

export async function fetchCategories(
  onSuccess: (categories: Category[]) => void,
  onError: (error: any) => void
) {
  try {
    const response = await fetch(`${APIURL}/categories`);
    if (!response.ok) {
      throw new Error("Failed to fetch categories");
    }
    const data = await response.json();
    const categories = data.categories;
    onSuccess(categories);
  } catch (error) {
    onError(error);
  }
}

export async function createComment(
  authorID: string,
  postID: string,
  comment: string,
  onSuccess: (comment: Comment) => void,
  onError: (error: any) => void
) {
  try {
    const newComment: Comment = {
      authorID: authorID,
      text: comment,
      likes: 0,
      dislikes: 0,
      replies: [],
      dateCreated: now,
      dateModified: now,
      dateDeleted: "",
      likedBy: [],
      dislikedBy: [],
      postID: postID,
    };
    const response = await fetch(`${APIURL}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newComment),
    });
    if (!response.ok) {
      throw new Error("Failed to create comment");
    }
    const data = await response.json();
    onSuccess(data);
  } catch (error) {
    onError(error);
  }
}

export async function fetchCommentByID(
  commentID: string,
  onSuccess: (comment: Comment) => void,
  onError: (error: any) => void
) {
  try {
    const response = await fetch(`${APIURL}/comments/${commentID}`);
    if (!response.ok) {
      throw new Error("Failed to fetch comment");
    }
    const data = await response.json();
    onSuccess(data);
  } catch (error) {
    onError(error);
  }
}



export type FullComment = Omit<Comment, "replies"> & {
  authorName: string;
  replies: FullComment[];
};

function getCommentByIdPromise(commentId: string): Promise<Comment> {
  return new Promise((resolve, reject) => {
    

    
    fetchCommentByID(commentId, resolve, reject);
  });
}

function getUserByIdPromise(userId: string): Promise<any> {
  return new Promise((resolve, reject) => {
    fetchUserById(userId, resolve, reject);
  });
}
export async function getCommentsByIDs(ids: string[]): Promise<Comment[]> {
  return Promise.all(
    ids.map(async (id) => {
      try {
        return await getCommentByIdPromise(id);
      } catch (error) {
        console.error(`Error fetching comment: ${error}`);
        throw error; 
    
        
      }
    })
  );
}
async function getFullComment(commentId: string): Promise<FullComment> {
  const comment = await getCommentByIdPromise(commentId);
  const user = await getUserByIdPromise(comment.authorID);
  const authorName = user?.displayName || "Unknown";
  
  
  let fullReplies: FullComment[] = [];
  if (Array.isArray(comment.replies) && comment.replies.length > 0) {
    fullReplies = await Promise.all(
      comment.replies.map((replyId: string) => getFullComment(replyId))
    );
  }
  return { ...comment, authorName, replies: fullReplies };
}

export async function generateCommentsChain(
  commentIds: string[]
): Promise<FullComment[]> {
  return Promise.all(commentIds.map((id) => getFullComment(id)));
}

export async function generateCommentsChainPaginated(
  commentIds: string[],
  page: number,
  pageSize: number
): Promise<{ comments: FullComment[]; hasMore: boolean }> {
  const start = (page - 1) * pageSize;
  const slice = commentIds.slice(start, start + pageSize);
  const comments = await Promise.all(slice.map((id) => getFullComment(id)));
  const hasMore = start + pageSize < commentIds.length;
  return { comments, hasMore };
}

export async function patchPost(
  id: string,
  field: string,
  newValue: any,
  onSuccess: (post: Post) => void,
  onError: (error: any) => void
) {
  try {
    const now = new Date().toISOString();
    const response = await fetch(`${APIURL}/posts/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ [field]: newValue, dateModified: now }),
    });
    if (!response.ok) {
      throw new Error("Failed to update post");
    }
    const data = await response.json();
    onSuccess(data);
  } catch (error) {
    onError(error);
  }
}

export async function patchVoteComment(
  id: string,
  field: VoteField,
  currentValue: number,
  increment: number = 1
): Promise<any> {
  const newValue = currentValue + increment;
  const now = new Date().toISOString();
  const response = await fetch(`${APIURL}/comments/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ [field]: newValue, dateModified: now }),
  });
  return response.json();
}

export async function patchUndoVoteComment(
  id: string,
  field: VoteField,
  currentValue: number
): Promise<any> {
  const newValue = currentValue - 1;
  const now = new Date().toISOString();
  const response = await fetch(`${APIURL}/comments/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ [field]: newValue, dateModified: now }),
  });
  return response.json();
}

export async function patchComment(
  id: string,
  field: string,
  newValue: any,
  onSuccess: (comment: Comment) => void,
  onError: (error: any) => void
) {
  try {
    const now = new Date().toISOString();
    const response = await fetch(`${APIURL}/comments/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ [field]: newValue, dateModified: now }),
    });
    if (!response.ok) {
      throw new Error("Failed to update comment");
    }
    const data = await response.json();
    onSuccess(data);
  } catch (error) {
    onError(error);
  }
}

export async function getRandomGIFBasedOffof({ keyword }: { keyword: string }) {
  if (APIURL === "http://localhost:3000") {
    return "";
  }
  keyword = keyword?.replace(/\s+/g, "+");
  try {
    const response = await fetch(
      `https://api.giphy.com/v1/gifs/search?api_key=${
        import.meta.env.VITE_GIPHY_API_KEY
      }&q=${keyword}&limit=1&offset=0&rating=g&lang=en`
    );
    const data = await response.json();
    return data.data[0]?.images?.original?.url || "";
  } catch (error) {
    console.error("Error fetching GIF:", error);
    return "";
  }
}

export async function searchPosts(
  searchTerm: string,
  onSuccess: (posts: Post[]) => void,
  onError: (error: any) => void
) {
  try {
    const response = await fetch(
      `${APIURL}/posts?title_like=${encodeURIComponent(
        searchTerm
      )}&_limit=3&_sort=title&_order=desc`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch posts");
    }
    const data = await response.json();
    const posts = data.posts;
    onSuccess(posts);
  } catch (error) {
    onError(error);
  }
}

export async function updateCategories(
  id: string,
  field: string,
  newValue: any,
  onSuccess: (category: Category) => void,
  onError: (error: any) => void
) {
  try {
    const now = new Date().toISOString();
    const response = await fetch(`${APIURL}/categories/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ [field]: newValue, dateModified: now }),
    });
    if (!response.ok) {
      throw new Error("Failed to update category");
    }
    const data = await response.json();
    onSuccess(data);
  } catch (error) {
    onError(error);
  }
}

export async function logExcelInput(
  rows: RowData[],
  onSuccess: (log: ExcelLog) => void,
  onError: (error: any) => void
) {
  try {
    const now = new Date().toISOString();
    const log: ExcelLog = { rows, dateCreated: now };
    const data = await apiRequest<ExcelLog>("/excelLogs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(log),
    });
    onSuccess(data);
  } catch (error) {
    onError(error);
  }
}
