import React from 'react'
import getPostContent from '../utils/getPostContent'
import Markdown from "markdown-to-jsx"

const BlogPost = ({slug}) => {
    const post = getPostContent(slug)
    return (
        <main>
            <article>
                <Markdown>{post.content}</Markdown>
            </article>
        </main>
    )
}

export default BlogPost