import React from 'react'
import kafka from "../../public/kafka.webp"
import Image from 'next/image'
import Link from 'next/link'

const TitleCard = () => {
  return (
    <div className="card w-full mt-4 bg-base-100 shadow-xl">
  <figure>
  </figure>
  <Link href="/">
  <div className="card-body">
    <p className='font-thin text-sm'>Dec 2023</p>
    <h2 className="card-title">The Essence of Apache Kafka</h2>
    <p>Conceptually building Distributed Event Driven Architecture</p>
  </div>
  </Link>
</div>
  )
}

export default TitleCard