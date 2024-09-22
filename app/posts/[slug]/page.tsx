import React from 'react'
import Markdown from "markdown-to-jsx"
import fs from 'fs'
import matter from "gray-matter"
import path from 'path'
import Divider from '@/app/components/Divider'
import getPostMetadata from '@/app/utils/getPostMetadata'

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


export const generateStaticParams = async () => {
    const posts = getPostMetadata("posts/")
    return posts.map((post)=>
    ({slug: post.slug})
    )
  };


const page = (props: any) => {
    const post = getPostContent(props.params.slug)
    const date = new Date(post.date)
    const dateTimeFormatter = new Intl.DateTimeFormat("en-US", {dateStyle: 'long'});
    const formatDate = dateTimeFormatter.format(date);
  return (
    <div>
        <div className="flex justify-center font-serif">
        <div className="flex flex-col p-10 w-full lg:w-2/5">
        <div className='text-sm font-serif mb-2'>{formatDate}</div>
        <div className='lg:text-4xl text-2xl font-serif'>{post.title}</div>
        <Divider/>
        <article className='prose lg:prose-xl text-justify'>
        <Markdown>{post.content}</Markdown>
        </article>
        </div>
        </div>
    </div>
  )
}

export default page