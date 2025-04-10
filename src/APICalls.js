const APIURL = import.meta.env.VITE_BACKEND_URL; // updated for Vite
async function fetchPosts(
    onSuccess,
    onError,
) {
    try {
        const response = await fetch(`${APIURL}/posts`);

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
        const response = await fetch(`${APIURL}/posts?_sort=dateCreated&_order=desc&_page=${page}&_limit=${maxPostPreviews}`);

        const data = await response.json();
        onSuccess(data);
    } catch (error) {
        onError(error);
    }
}

async function fetchPostById(id, onSuccess, onError) {
    try {
        const response = await fetch(`${APIURL}/posts/${id}`);

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

async function addComment(userID, comment, onSuccess, onError) {
    const now = new Date().toISOString();
    try {
        const newComment = {
            userID: userID,
            text: comment,
            likes: 0,
            dislikes: 0,
            replies: [],
            dateCreated: now,
            dateModified: now,
            dateDeleted: ""
        };
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
        const response = await fetch(`${APIURL}/users?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`);

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
            dateDeleted: ""
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

// Refactored helper to update comment likes and user's likedComments
async function updateCommentAndUserLike(commentId, userId, like = true, onSuccess, onError) {
    try {
        let res = await fetch(`${APIURL}/comments/${commentId}`);
        let comment = await res.json();
        const newLikes = like ? comment.likes + 1 : (comment.likes > 0 ? comment.likes - 1 : 0);
        res = await fetch(`${APIURL}/comments/${commentId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ likes: newLikes })
        });
        const updatedComment = await res.json();
        res = await fetch(`${APIURL}/users/${userId}`);
        let user = await res.json();
        if (like) {
            if (!user.likedComments.includes(commentId)) {
                user.likedComments.push(commentId);
            }
        } else {
            user.likedComments = user.likedComments.filter(id => id !== commentId);
        }
        res = await fetch(`${APIURL}/users/${userId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(user)
        });
        const updatedUser = await res.json();
        onSuccess({ comment: updatedComment, user: updatedUser });
    } catch (error) {
        onError(error);
    }
}

// Refactored likeComment function using the helper
async function likeComment(commentId, userId, onSuccess, onError) {
    updateCommentAndUserLike(commentId, userId, true, onSuccess, onError);
}

// Refactored undoLikeComment function using the helper
async function undoLikeComment(commentId, userId, onSuccess, onError) {
    updateCommentAndUserLike(commentId, userId, false, onSuccess, onError);
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
    getUserByID, // newly added
    createUser,
    loginUser,
    signUpUser,
    updateUser,
    fetchPostsPaginated,
    getCommentByID,
    likeComment,      // newly added
    undoLikeComment   // newly added
};