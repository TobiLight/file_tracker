import React from "react";
import { BlogPostType } from "../../lib/types";
import defaultImage from "../../assets/images/newsimage.jpg"

export const BlogPost = React.memo(({ title, description, url, image }: BlogPostType) => {
    return (
        <div className="flex gap-4 md:grid h-full">
            <div className="img w-20 h-full md:w-full md:h-44 rounded">
                <img src={image && image.length > 0 ? image : defaultImage} alt={title} className="rounded object-cover w-full h-full" />
            </div>
            <div className="flex-1">
                <div className="grid place-content-center h-full">
                    <a href={url} className="font-medium pb-2 md:mb-4 md:border-b">
                        {title.slice(0, 100)}...
                    </a>
                    <div className="flex-col justify-between h-full">
                        <p className="text-sm md:text-xs">{description.slice(0, 80)}... <a className="font-medium " href={url}>read more</a></p>
                        {/* <p className="text-xs text-gray-500 pt-3 md:flex md:justify-end">
                            <span className="bg-blue-200 rounded p-1">
                                written by {author}
                            </span>
                        </p> */}
                    </div>
                </div>
            </div>
        </div>
    )
})