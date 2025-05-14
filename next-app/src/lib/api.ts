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
} from './definitions';

// Set your API URL here
const APIURL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000';
const now = new Date().toISOString();

// Helper function for making API requests
async function apiRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${APIURL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error?.message || 'An error occurred');
  }

  return response.json();
}

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
    const posts = await apiRequest<Post[]>('/posts');
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
  page,
  pageSize,
  sortBy,
  sortOrder,
  onSuccess,
  onError,
}: fetchPostsPaginatedProps) {
  try {
    const response = await apiRequest<PaginatedPostsResponse>(
      `/posts?_page=${page}&_limit=${pageSize}&_sort=${sortBy}&_order=${sortOrder}`
    );
    onSuccess(response);
  } catch (error) {
    onError(error);
  }
}

export async function fetchPostById({
  id,
  onSuccess,
  onError,
}: standardFetchByIDProps) {
  try {
    const post = await apiRequest<Post>(`/posts/${id}`);
    onSuccess(post);
  } catch (error) {
    onError(error);
  }
}

export async function createPost({
  title,
  resource,
  description,
  categoryID,
  authorID,
  onSuccess,
  onError,
}: createPostProps) {
  try {
    const newPost = createSafePost({
      title,
      resource,
      description,
      categoryID,
      authorID,
    });

    const createdPost = await apiRequest<Post>('/posts', {
      method: 'POST',
      body: JSON.stringify(newPost),
    });

    onSuccess(createdPost);
  } catch (error) {
    onError(error);
  }
}

// Add more API calls as needed from your original project

export async function fetchUserById(
  id: string,
  onSuccess: (user: User) => void,
  onError: (error: any) => void
) {
  try {
    const user = await apiRequest<User>(`/users/${id}`);
    onSuccess(user);
  } catch (error) {
    onError(error);
  }
}

export async function fetchCategories(
  onSuccess: (categories: Category[]) => void,
  onError: (error: any) => void
) {
  try {
    const categories = await apiRequest<Category[]>('/categories');
    onSuccess(categories);
  } catch (error) {
    onError(error);
  }
}

export async function patchUserField({
  userID,
  field,
  newValue,
  onSuccess,
  onError,
}: PatchUserProps) {
  try {
    const user = await apiRequest<User>(`/users/${userID}`, {
      method: 'PATCH',
      body: JSON.stringify({ [field]: newValue }),
    });
    
    onSuccess(user);
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
    const newUser: Partial<User> = {
      username,
      password,
      displayName,
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
    };

    const user = await apiRequest<User>('/users', {
      method: 'POST',
      body: JSON.stringify(newUser),
    });
    
    onSuccess(user);
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
    const users = await apiRequest<User[]>(`/users?username=${username}`);
    
    if (users.length === 0) {
      throw new Error('User not found');
    }
    
    const user = users[0];
    if (user.password !== password) {
      throw new Error('Invalid password');
    }
    
    onSuccess(user);
  } catch (error) {
    onError(error);
  }
}

export async function patchVotePost(
  postId: string,
  voteType: 'upvote' | 'downvote',
  userId: string,
  onSuccess: () => void,
  onError: (error: any) => void
) {
  try {
    // First, update the post
    const voteField = voteType === 'upvote' ? 'upvotes' : 'downvotes';
    const post = await apiRequest<Post>(`/posts/${postId}`);
    const currentValue = voteType === 'upvote' ? post.upvotes : post.downvotes;
    
    await apiRequest(`/posts/${postId}`, {
      method: 'PATCH',
      body: JSON.stringify({ 
        [voteField]: currentValue + 1,
        dateModified: now
      })
    });

    // Then, update the user's voted posts
    const userVoteField = voteType === 'upvote' ? 'upvotedPosts' : 'downVotedPosts';
    const user = await apiRequest<User>(`/users/${userId}`);
    const currentVotedPosts = user[userVoteField] || [];
    
    await apiRequest(`/users/${userId}`, {
      method: 'PATCH',
      body: JSON.stringify({ 
        [userVoteField]: [...currentVotedPosts, postId],
        dateModified: now
      })
    });

    onSuccess();
  } catch (error) {
    onError(error);
  }
}

export async function patchUndoVotePost(
  postId: string,
  voteType: 'upvote' | 'downvote',
  userId: string,
  onSuccess: () => void,
  onError: (error: any) => void
) {
  try {
    // First, update the post
    const voteField = voteType === 'upvote' ? 'upvotes' : 'downvotes';
    const post = await apiRequest<Post>(`/posts/${postId}`);
    const currentValue = voteType === 'upvote' ? post.upvotes : post.downvotes;
    
    // Ensure the value doesn't go below 0
    const newValue = Math.max(0, currentValue - 1);
    
    await apiRequest(`/posts/${postId}`, {
      method: 'PATCH',
      body: JSON.stringify({ 
        [voteField]: newValue,
        dateModified: now
      })
    });

    // Then, update the user's voted posts
    const userVoteField = voteType === 'upvote' ? 'upvotedPosts' : 'downVotedPosts';
    const user = await apiRequest<User>(`/users/${userId}`);
    const currentVotedPosts = user[userVoteField] || [];
    
    await apiRequest(`/users/${userId}`, {
      method: 'PATCH',
      body: JSON.stringify({ 
        [userVoteField]: currentVotedPosts.filter(id => id !== postId),
        dateModified: now
      })
    });

    onSuccess();
  } catch (error) {
    onError(error);
  }
}

export async function patchUser(
  userId: string,
  userData: Partial<User>,
  onSuccess: () => void,
  onError: (error: any) => void
) {
  try {
    await apiRequest(`/users/${userId}`, {
      method: 'PATCH',
      body: JSON.stringify({ 
        ...userData,
        dateModified: now
      })
    });

    onSuccess();
  } catch (error) {
    onError(error);
  }
}
