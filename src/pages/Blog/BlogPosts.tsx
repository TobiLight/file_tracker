import React from "react"
import { BlogPostsType, BlogPostType } from "../../lib/types"
import { BlogPost } from "./BlogPost"




export const BlogPosts = React.memo(({ count, posts }: BlogPostsType): JSX.Element => {
    return (
        <>
            {
                posts && posts.slice(0, count).map((post: BlogPostType) => (
                    <div key={post.title} className="blog-post rounded shadow p-3 bg-white md:h-full" >
                        <BlogPost
                            title={post.title}
                            description={post.description}
                            image={post.image}
                            url={post.url}
                        />
                    </div>
                ))
            }
        </>
    )
})
