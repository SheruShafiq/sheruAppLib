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

export { fetchPosts };