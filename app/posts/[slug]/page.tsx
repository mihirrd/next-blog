import React from 'react'
import Markdown from "markdown-to-jsx"
import fs from 'fs'
import matter from "gray-matter"
import path from 'path'
import Divider from '@/app/components/Divider'
import getPostMetadata from '@/app/utils/getPostMetadata'
import Link from 'next/link'
import { Metadata } from 'next'

function getPostContent(slug) {
    const folder = path.join(process.cwd(), "/posts/")
    const file = folder + `${slug}.md`
    const content = fs.readFileSync(file, 'utf8')
    const matterResult = matter(content)
    return {
        title: matterResult.data.title,
        subtitle: matterResult.data.subtitle,
        date: matterResult.data.date,
        slug: slug,
        content: matterResult.content,
        peek : matterResult.data.peek
    }
}

// This function generates dynamic metadata for each post
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
    // You can fetch your post data here
    const post = await getPostContent(params.slug) // Replace with your data fetching function
    
    return {
      title: `${post.title}`,
      description: post.peek,
      openGraph: {
        title: post.title,
        description: post.peek,
        type: 'article',
        authors: ['Mihir Deshpande']
      }
    }
  }


export const generateStaticParams = async () => {
    const posts = getPostMetadata("posts/")
    return posts.map((post) =>
        ({ slug: post.slug })
    )
};


const page = (props: any) => {
    const post = getPostContent(props.params.slug)
    const date = new Date(post.date)
    const dateTimeFormatter = new Intl.DateTimeFormat("en-US", { dateStyle: 'long' });
    const formatDate = dateTimeFormatter.format(date);
    return (
            <div className="flex justify-center font-serif">
                <div className="flex flex-col p-10 w-full lg:w-2/5">
                <Link  href='/' className='mb-5'>
                /Posts
                </Link>
                    <div className='text-sm font-serif mb-2 flex gap-2'>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-calendar3" viewBox="0 0 16 16">
  <path d="M14 0H2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2M1 3.857C1 3.384 1.448 3 2 3h12c.552 0 1 .384 1 .857v10.286c0 .473-.448.857-1 .857H2c-.552 0-1-.384-1-.857z"/>
  <path d="M6.5 7a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m-9 3a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m-9 3a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2"/>
</svg>
                        {formatDate}
                        </div>
                    <div className='lg:text-4xl text-2xl font-serif'>{post.title}</div>
                    <div className='lg:text-2xl text-xl font-serif text-stone-600 text-opacity-80 font-thin'>{post.subtitle}</div>
                    <Divider />
                    <article className='prose prose-h4:font-thin prose-h3:font-thin prose-code:font-thin prose-code:text-sm md:prose-xl text-justify'>
                        <Markdown>{post.content}</Markdown>
                    </article>
                </div>
            </div>
    )
}

export default page