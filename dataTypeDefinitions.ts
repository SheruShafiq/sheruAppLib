interface Post{
    id: string
        title: string
        resource: string
        author: string
        description: string
        category: number
        upvotes: number
        downvotes: number
        reports: number
        reportIDs: string[]
        comments: number[]
        dateCreated: Date
        dateModified: Date
        dateDeleted: Date
        cachedCommentsChainID: string
        cachedReportsChainID: string
}

interface user{
        id: string
        username: string
        password: string
        displayName: string
        posts: string[]
        upvotedPosts: string[]
        downVotedPosts: string[]
        reportedPosts: string[]
        comments: string[]
        dateCreated: Date
        dateModified: Date
        dateDeleted: Date
        likedComments: string[]
        dislikedComments: string[]
}
interface Comment{
        id: string
        authorID: string
        text: string
        likes: number
        dislikes: number
        replies: string[]
        dateCreated: Date
        dateModified: Date
        dateDeleted: Date
        likedBy: string[]
        dislikedBy: string[]
        postID: string
}
interface Category{
        id: number
        name: string
        description: string
        posts: string[]
        dateCreated: Date
        dateModified: Date
        dateDeleted: Date
}
interface Report{
        id: string
        postID: string
        userID: string
        reason: string
        dateCreated: Date
        dateModified: Date
        dateDeleted: Date
}
interface cachedCommentsChainID{
        id: string
        postID: string
        comments: Comment[]
        dateCreated: Date
        dateModified: Date
        dateDeleted: Date
} 