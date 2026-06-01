import React from 'react'
import fs from 'fs'
import matter from "gray-matter"
import path from 'path'
import Divider from '@/app/components/Divider'
import MarkdownContent from '@/app/components/MarkdownContent'
import getPostMetadata from '@/app/utils/getPostMetadata'
import Link from 'next/link'
import { Metadata } from 'next'

function getPostContent(slug) {
    const folder = path.join(process.cwd(), "/posts/")
    const file = folder + `${slug}.md`
    const content = fs.readFileSync(file, 'utf8')
    const matterResult = matter(content)
    const wordCount = matterResult.content.trim().split(/\s+/).length
    const readingTime = Math.ceil(wordCount / 200)
    return {
        title: matterResult.data.title,
        subtitle: matterResult.data.subtitle,
        date: matterResult.data.date,
        slug: slug,
        content: matterResult.content,
        peek: matterResult.data.peek,
        readingTime,
    }
}

// This function generates dynamic metadata for each post
export async function generateMetadata(props: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const params = await props.params;
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


const page = async (props: any) => {
    const post = getPostContent((await props.params).slug)
    const formatDate = new Intl.DateTimeFormat("en-US", { dateStyle: 'long' }).format(new Date(post.date));
    return (
        <div className="flex justify-center px-4 py-12">
            <div className="w-full max-w-2xl">
                <Link href="/" className="text-sm text-stone-500 dark:text-stone-400 hover:text-amber-700 dark:hover:text-amber-400 transition-colors inline-block mb-8">
                    ← All posts
                </Link>
                <div className="flex items-center gap-3 mt-6 mb-4">
                    <time className="text-sm text-stone-500 dark:text-stone-400">{formatDate}</time>
                    <span className="text-stone-300 dark:text-stone-700" aria-hidden>·</span>
                    <span className="text-sm text-stone-500 dark:text-stone-400">{post.readingTime} min read</span>
                </div>
                <h1 className="font-serif text-3xl lg:text-4xl font-medium text-stone-900 dark:text-stone-100 leading-tight mb-3">
                    {post.title}
                </h1>
                {post.subtitle && (
                    <p className="font-serif text-2xl text-stone-600 dark:text-stone-400 font-light leading-snug mb-8">
                        {post.subtitle}
                    </p>
                )}
                <Divider />
                <article className="prose prose-stone dark:prose-invert prose-h2:font-medium prose-h3:font-normal prose-h4:font-normal prose-code:font-normal prose-code:text-sm prose-code:before:content-none prose-code:after:content-none prose-lg md:prose-xl max-w-none font-serif">
                    <MarkdownContent>{post.content}</MarkdownContent>
                </article>
            </div>
        </div>
    )
}

export default page