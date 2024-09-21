import React from 'react'
import Markdown from "markdown-to-jsx"
import fs from 'fs'
import matter from "gray-matter"
import path from 'path'

function getPostContent(slug) {
    const folder = path.join(process.cwd(), "/posts/")
    const file = folder + `${slug}.md`
    const content = fs.readFileSync(file, 'utf8')
    const matterResult = matter(content)
    return {
        title: matterResult.data.title,
        date: matterResult.data.date,
        slug: slug,
        content: matterResult.content
    }
}

const page = (props: any) => {
const post = getPostContent(props.params.slug)
  return (
    <div>
        <article className='prose'>
        <Markdown>{post.content}</Markdown>
        </article>
    </div>
  )
}

export default page