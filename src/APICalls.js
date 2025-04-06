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
            body: JSON.stringify({ reports: newReports }),
        });
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();
        onSuccess(data);
    } catch (error) {
        onError(error);
    }
}


async function undoUpVotePost(id, currentUpvotes, onSuccess, onError) {
    try {
        const newUpvotes = currentUpvotes - 1;
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

async function undoDownVotePost(id, currentDownvotes, onSuccess, onError) {
    try {
        const newDownvotes = currentDownvotes - 1;
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

async function undoReportPost(id, currentReports, onSuccess, onError) {
    try {
        const newReports = currentReports - 1;
        const response = await fetch(`http://localhost:3000/posts/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ reports: newReports }),
        });
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();
        onSuccess(data);
    } catch (error) {
        onError(error);
    }
}

async function addComment(postId, comment, onSuccess, onError) {
    try {
        const newComment = { ...comment, postId };
        const response = await fetch(`http://localhost:3000/comments`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newComment),
        });
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();
        onSuccess(data);
    } catch (error) {
        onError(error);
    }
}

async function deleteComment(commentId, onSuccess, onError) {
    try {
        const response = await fetch(`http://localhost:3000/comments/${commentId}`, {
            method: "DELETE",
        });
        if (!response.ok) throw new Error("Network response was not ok");
        onSuccess();
    } catch (error) {
        onError(error);
    }
}

async function editComment(commentId, comment, onSuccess, onError) {
    try {
        const response = await fetch(`http://localhost:3000/comments/${commentId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(comment),
        });
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();
        onSuccess(data);
    } catch (error) {
        onError(error);
    }
}

async function fetchUsers(onSuccess, onError) {
    try {
        const response = await fetch(`http://localhost:3000/users`);
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();
        onSuccess(data);
    } catch (error) {
        onError(error);
    }
}

async function fetchUserById(id, onSuccess, onError) {
    try {
        const response = await fetch(`http://localhost:3000/users/${id}`);
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();
        onSuccess(data);
    } catch (error) {
        onError(error);
    }
}

async function createUser(user, onSuccess, onError) {
    try {
        const response = await fetch(`http://localhost:3000/users`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(user),
        });
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();
        onSuccess(data);
    } catch (error) {
        onError(error);
    }
}

async function loginUser({ username, password }, onSuccess, onError) {
    try {
        // JSON Server supports filtering via query parameters
        const response = await fetch(`http://localhost:3000/users?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`);
        if (!response.ok) throw new Error("Network response was not ok");
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

async function signUpUser({ username, password }, onSuccess, onError) {
    try {
        // Use createUser and set username = username, and default displayName for simplicity.
        const user = { username: username, password, displayName: username, likedPosts: [], dislikedPosts: [], reportedPosts: [], comments: [] };
        const response = await fetch(`http://localhost:3000/users`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(user),
        });
        if (!response.ok) throw new Error("Network response was not ok");
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
    signUpUser,
};