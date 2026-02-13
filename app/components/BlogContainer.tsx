import React from 'react'
import TitleCard from './TitleCard'
import getPostMetadata from '../utils/getPostMetadata'

const BlogContainer = () => {
  const postsMeta = getPostMetadata("posts")
  return (
    <div className="flex justify-center font-serif">
      <div className="w-4/5 text-sm lg:w-2/5 lg:text-lg ">
        {postsMeta.map(data =>
          <TitleCard
            key={data.slug}
            title={data.title}
            date={data.date}
            slug={data.slug}
            peek={data.peek} />
        )}
      </div>
    </div>
  )
}

export default BlogContainer