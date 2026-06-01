import React from 'react'
import Markdown from "markdown-to-jsx"
import fs from 'fs'
import matter from "gray-matter"
import path from 'path'

function getAboutContent(slug) {
    const folder = path.join(process.cwd(), '/app/about/')
    const file = folder + 'about.md'
    const content = fs.readFileSync(file, 'utf8')
    const matterResult = matter(content)
    return {
        title: matterResult.data.title,
        content: matterResult.content,
    }
}

const page = () => {
  const { content } = getAboutContent('about')

  return (
    <main className="flex justify-center px-4 py-12">
      <div className="w-full max-w-2xl">
        <article className="prose prose-stone dark:prose-invert prose-h4:font-normal prose-h3:font-normal prose-h2:font-normal prose-code:font-normal prose-code:text-sm prose-lg md:prose-xl max-w-none font-serif">
          <h3>Hey there!</h3>
          <Markdown>{content}</Markdown>
        </article>
      </div>
    </main>
  )
}

export default page
