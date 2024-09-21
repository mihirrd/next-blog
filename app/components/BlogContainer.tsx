import React from 'react'
import TitleCard from './TitleCard'


const BlogContainer = () => {
  return (
    <div className="flex h-screen justify-center font-serif">
        <div className="text-justify w-4/5 text-sm md:w-2/3 mt-10 md:text-lg">
          <TitleCard/>
          <TitleCard/>
        </div>     
    </div>
  )
}

export default BlogContainer