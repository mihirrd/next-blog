import React from 'react'
import TitleCard from './TitleCard'
import getPostMetadata from '../utils/getPostMetadata'

const BlogContainer = () => {
  const postsMeta = getPostMetadata("posts")
  return (
    <div className="flex justify-center px-4 py-12">
      <div className="w-full max-w-2xl">
        <h1 className="font-serif text-3xl font-medium text-stone-900 dark:text-stone-100 mb-2">Writing</h1>
        <p className="font-sans text-sm text-stone-500 dark:text-stone-400 mb-2">{postsMeta.length} posts on systems, software, and ideas</p>
        <div>
          {postsMeta.map(data =>
            <TitleCard
              key={data.slug}
              title={data.title}
              date={data.date}
              slug={data.slug}
              peek={data.peek}
              readingTime={data.readingTime}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default BlogContainer