async function fetchPosts(
    onSuccess,
    onError,
) {
    try {
        const response = await fetch("http://localhost:3000/posts");
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        const data = await response.json();
        onSuccess(data);
    } catch (error) {
        onError(error);
    }
}

async function fetchPostById(id, onSuccess, onError) {
    try {
        const response = await fetch(`http://localhost:3000/posts/${id}`);
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        const data = await response.json();
        onSuccess(data);
    } catch (error) {
        onError(error);
    }
}

async function postPost(
    post,
    onSuccess,
    onError,
) {
    try {
        const response = await fetch("http://localhost:3000/posts", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(post),
        });
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        const data = await response.json();
        onSuccess(data);
    } catch (error) {
        onError(error);
    }
}
async function updatePost(
    id,
    post,
    onSuccess,
    onError,
) {
    try {
        const response = await fetch(`http://localhost:3000/posts/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(post),
        });
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        const data = await response.json();
        onSuccess(data);
    } catch (error) {
        onError(error);
    }
}
async function deletePost(
    id,
    onSuccess,
    onError,
) {
    try {
        const response = await fetch(`http://localhost:3000/posts/${id}`, {
            method: "DELETE",
        });
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        onSuccess();
    } catch (error) {
        onError(error);
    }
}
async function upVotePost(id, currentUpvotes, onSuccess, onError) {
    try {
        const newUpvotes = currentUpvotes + 1;
        const response = await fetch(`http://localhost:3000/posts/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ upvotes: newUpvotes }),
        });
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();
        onSuccess(data);
    } catch (error) {
        onError(error);
    }
}

async function downVotePost(id, currentDownvotes, onSuccess, onError) {
    try {
        const newDownvotes = currentDownvotes + 1;
        const response = await fetch(`http://localhost:3000/posts/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ downvotes: newDownvotes }),
        });
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();
        onSuccess(data);
    } catch (error) {
        onError(error);
    }
}

async function reportPost(id, currentReports, onSuccess, onError) {
    try {
        const newReports = currentReports + 1;
        const response = await fetch(`http://localhost:3000/posts/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ offlineReports: newReports }),
        });
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();
        onSuccess(data);
    } catch (error) {
        onError(error);
    }
}
async function addComment(
    id,
    comment,
    onSuccess,
    onError,
) {
    try {
        const response = await fetch(`http://localhost:3000/posts/${id}/comments`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(comment),
        });
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        const data = await response.json();
        onSuccess(data);
    } catch (error) {
        onError(error);
    }
}
async function deleteComment(
    postId,
    commentId,
    onSuccess,
    onError,
) {
    try {
        const response = await fetch(`http://localhost:3000/posts/${postId}/comments/${commentId}`, {
            method: "DELETE",
        });
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        onSuccess();
    } catch (error) {
        onError(error);
    }
}
async function editComment(
    postId,
    commentId,
    comment,
    onSuccess,
    onError,
) {
    try {
        const response = await fetch(`http://localhost:3000/posts/${postId}/comments/${commentId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(comment),
        });
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        const data = await response.json();
        onSuccess(data);
    } catch (error) {
        onError(error);
    }
}

export {
    fetchPosts,
    fetchPostById,
    postPost,
    updatePost,
    deletePost,
    upVotePost,
    downVotePost,
    reportPost,
    addComment,
    deleteComment,
    editComment,
};