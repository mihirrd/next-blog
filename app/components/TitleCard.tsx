import React from 'react'
import Link from 'next/link'

const TitleCard = ({ date, title, slug, peek, readingTime }) => {
  const formatDate = new Intl.DateTimeFormat("en-US", { dateStyle: 'long' }).format(new Date(date));
  return (
    <Link href={`/posts/${slug}`} className="block py-8 border-b border-stone-200 dark:border-stone-800 group">
      <div className="flex items-center gap-3 mb-2">
        <time className="text-sm text-stone-500 dark:text-stone-400">{formatDate}</time>
        <span className="text-stone-300 dark:text-stone-700" aria-hidden>·</span>
        <span className="text-sm text-stone-500 dark:text-stone-400">{readingTime} min read</span>
      </div>
      <h2 className="font-serif text-2xl font-medium text-stone-900 dark:text-stone-100 group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors leading-snug mb-2">
        {title}
      </h2>
      <p className="text-base text-stone-600 dark:text-stone-400 leading-relaxed line-clamp-2">{peek}</p>
    </Link>
  )
}

export default TitleCard