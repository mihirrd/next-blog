import React from 'react'
import TitleCard from './TitleCard'
import getPostMetadata from '../utils/getPostMetadata'

const BlogContainer = () => {
  const postsMeta = getPostMetadata("posts")
  return (
    <div className="flex justify-center px-4 pt-4 pb-12">
      <div className="w-full max-w-2xl">
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