import React from "react"

type BlogType = {
    blogposts: JSX.Element
}

export const Blog = React.memo(({ blogposts }: BlogType): JSX.Element => {
    return (
        <>
            {blogposts}
        </>
    )
})
