import React from 'react'
import Image from 'next/image'
import profilePic from '../../public/images/headshot.png'
import concertPic from '../../public/images/concert.png'
import Link from 'next/link'

const page = () => {
  return (
    <main>
      <section className="flex justify-center mb-1 font-serif text-justify">
        <div className="flex flex-col p-10 w-full lg:w-2/5 md:text-lg">
          <p className='mb-10 prose md:prose-xl'>
            Hey there, my name is Mihir Deshpande. I am a Programmer and a Software Engineer. I work on Product Development and Distributed Systems.
            <br />
            I’m passionate about exploring tech, <a href='https://www.paulgraham.com/hp.html' target="blank" className=''>hacking</a> together cool projects and building robust and efficient software. From functional programming and distributed systems to containerization and collaborative development, I’ve built a well-rounded skill set. I have a solid foundation in functional programming, distributed systems, and modern development tools. I enjoy tackling complex systems, refining workflows, and creating impactful and well-documented solutions.
          </p>
          <div className="flex justify-center mb-10">
            <Image
              className="rounded-badge"
              src={profilePic}
              alt=''
              height={600}
              width={600}
            ></Image>
          </div>
          <p className='mb-10 prose md:prose-xl'>
            On a sidenote, I am also a Sitar Player and a student of Indian Classical Music. You can find my music on Youtube, Spotify and on Instagram reels!
          </p>
          <div className="flex justify-center mb-10">
            <Image
              className="object-cover rounded-xl"
              src={concertPic}
              alt=''
              height={600}
              width={600}
            ></Image>
          </div>
          <div className='text-center mt-4'>
          <Link href='Resume_Mihir_Deshpande.pdf'
            target='_blank'
            rel="noopener noreferrer">
            <p className='underline'>View Resume</p>
          </Link>
        </div>
        </div>
      </section>
    </main>
  )
}

export default page