const APIURL = import.meta.env.VITE_BACKEND_URL; // updated for Vite
async function fetchPosts(
    onSuccess,
    onError,
) {
    try {
        const response = await fetch(`${APIURL}/posts`);
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        const data = await response.json();
        onSuccess(data);
    } catch (error) {
        onError(error);
    }
}

async function fetchPostsPaginated(
    onSuccess,
    onError,
    page,
    maxPostPreviews
) {
    try {
        const response = await fetch(`${APIURL}/posts?_sort=id,-views&_page=${page}&_per_page=${maxPostPreviews}`);
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
        const response = await fetch(`${APIURL}/posts/${id}`);
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
        // Ensure new date fields are set
        const now = new Date().toISOString();
        post.dateCreated = post.dateCreated || now;
        post.dateModified = now;
        post.dateDeleted = post.dateDeleted || "";
        const response = await fetch(`${APIURL}/posts`, {
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
        // Update dateModified field
        post.dateModified = new Date().toISOString();
        const response = await fetch(`${APIURL}/posts/${id}`, {
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
        // Instead of physical deletion, mark the post as deleted
        const now = new Date().toISOString();
        const response = await fetch(`${APIURL}/posts/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ dateDeleted: now, dateModified: now }),
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
async function upVotePost(id, currentUpvotes, onSuccess, onError) {
    try {
        const newUpvotes = currentUpvotes + 1;
        const now = new Date().toISOString();
        const response = await fetch(`${APIURL}/posts/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ upvotes: newUpvotes, dateModified: now }),
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
        const now = new Date().toISOString();
        const response = await fetch(`${APIURL}/posts/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ downvotes: newDownvotes, dateModified: now }),
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
        const now = new Date().toISOString();
        const response = await fetch(`${APIURL}/posts/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ reports: newReports, dateModified: now }),
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
        const now = new Date().toISOString();
        const response = await fetch(`${APIURL}/posts/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ upvotes: newUpvotes, dateModified: now }),
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
        const now = new Date().toISOString();
        const response = await fetch(`${APIURL}/posts/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ downvotes: newDownvotes, dateModified: now }),
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
        const now = new Date().toISOString();
        const response = await fetch(`${APIURL}/posts/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ reports: newReports, dateModified: now }),
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
        const response = await fetch(`${APIURL}/comments`, {
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
        const response = await fetch(`${APIURL}/comments/${commentId}`, {
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
        const response = await fetch(`${APIURL}/comments/${commentId}`, {
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
        const response = await fetch(`${APIURL}/users`);
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();
        onSuccess(data);
    } catch (error) {
        onError(error);
    }
}

async function fetchUserById(id, onSuccess, onError) {
    try {
        const response = await fetch(`${APIURL}/users/${id}`);
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();
        onSuccess(data);
    } catch (error) {
        onError(error);
    }
}

async function createUser(user, onSuccess, onError) {
    try {
        const response = await fetch(`${APIURL}/users`, {
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
        const response = await fetch(`${APIURL}/users?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`);
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

async function signUpUser({ username, password, displayName }, onSuccess, onError) {
    try {
        const user = { username: username, password, displayName: displayName, likedPosts: [], dislikedPosts: [], reportedPosts: [], comments: [] };
        const response = await fetch(`${APIURL}/users`, {
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

async function updateUser(id, user, onSuccess, onError) {
    try {
        const response = await fetch(`${APIURL}/users/${id}`, {
            method: "PUT",
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
    updateUser,
    fetchPostsPaginated
};