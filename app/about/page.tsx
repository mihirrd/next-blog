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
  const { title, content } = getAboutContent('about')

  return (
    <main>
      <section className="flex justify-center font-serif text-justify">
        <div className="flex flex-col p-10 w-full lg:w-2/5 md:text-lg">
            <article className='prose prose-h4:font-thin prose-h3:font-thin prose-h2:font-thin prose-code:font-thin prose-code:text-sm md:prose-xl text-justify'>
                <h3>Hey there!</h3>
        <Markdown>{content}</Markdown>
        </article>
        </div>
      </section>
    </main>
  )
}

export default page
