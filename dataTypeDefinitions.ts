interface Post {
    id: string;
    title: string;
    resource: string;
    author: string;
    description: string;
    category: number;
    upvotes: number;
    downvotes: number;
    reports: number;
    reportIDs: string[];
    comments: number[];
    dateCreated: string;
    dateModified: string;
    dateDeleted: string;
    cachedCommentsChainID: string;
    cachedReportsChainID: string;
}

interface user {
    id: string;
    username: string;
    password: string;
    displayName: string;
    posts: string[];
    upvotedPosts: string[];
    downVotedPosts: string[];
    reportedPosts: string[];
    comments: string[];
    dateCreated: string;
    dateModified: string;
    dateDeleted: string;
    likedComments: string[];
    dislikedComments: string[];
}
interface Comment {
    id: string;
    authorID: string;
    text: string;
    likes: number;
    dislikes: number;
    replies: string[];
    dateCreated: string;
    dateModified: string;
    dateDeleted: string;
    likedBy: string[];
    dislikedBy: string[];
    postID: string;
}
interface Category {
    id: number;
    name: string;
    description: string;
    posts: string[];
    dateCreated: string;
    dateModified: string;
    dateDeleted: string;
}
interface Report {
    id: string;
    postID: string;
    userID: string;
    reason: string;
    dateCreated: string;
    dateModified: string;
    dateDeleted: string;
}
interface cachedCommentsChainID {
    id: string;
    postID: string;
    comments: Comment[];
    dateCreated: string;
    dateModified: string;
    dateDeleted: string;
}
interface fetchPostsProps {
    onSuccess: (posts: Post[]) => void;
    onError: (errorProps: errorProps) => void;
}
interface fetchPostsPaginatedProps {
    onSuccess: (posts: Post[]) => void;
    onError: (errorProps: errorProps) => void;
    page: number;
    pageSize: number;
}
interface standardFetchByIDProps {
    onSuccess: (post: Post) => void;
    onError: (errorProps: errorProps) => void;
    id: string;
}
interface createPostProps {
    post: Post;
    onSuccess: (post: Post) => void;
    onError: (errorProps: errorProps) => void;
}
interface errorProps {
    id: string;
    userFreindlyMessage: string;
    errorMessage: string;
    error: Error;
};
export type {
    errorProps,
    Post,
    user,
    Comment,
    Category,
    Report,
    cachedCommentsChainID,
    standardFetchByIDProps,
    fetchPostsProps,
    createPostProps,
    fetchPostsPaginatedProps,
};
