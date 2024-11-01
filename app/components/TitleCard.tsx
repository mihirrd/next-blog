import React from 'react'
import Link from 'next/link'

const TitleCard = ({ date, title, slug }) => {
    const publishDate = new Date(date)
    const dateTimeFormatter = new Intl.DateTimeFormat("en-US", { dateStyle: 'long' });
    const formatDate = dateTimeFormatter.format(publishDate);
    return (
        <div className="card w-full mt-4 bg-base-100 shadow-xl">
            <figure>
            </figure>
            <Link href={`../posts/${slug}`}>
                <div className="card-body">
                    <p className='font-thin text-sm'>{formatDate}</p>
                    <h2 className="md:text-2xl text-xl">{title}</h2>
                </div>
            </Link>
        </div>
    )
}

export default TitleCard