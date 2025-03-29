import React from 'react'
import Image from 'next/image'
import profilePic from '../../public/images/headshot.png'
import concertPic from '../../public/images/concert.png'
import Link from 'next/link'

const page = () => {
  return (
    <main>
      <section className="flex justify-center font-serif text-justify">
        <div className="flex flex-col p-10 w-full lg:w-2/5 md:text-lg">
          <p className='mb-4 prose md:prose-xl'>
            Hey there, my name is Mihir. I am software engineer with 4 years of experience building scalable, high-performance backend systems. I am passionate about designing efficient and fault-tolerant system architectures. I am skilled in integrating LLMs into production environments, with hands-on experience in prompt engineering and GenAI implementation. I enjoy tackling complex problems, drive high-impact solutions, and lead projects that enhance system reliability, performance, and scalability.
            I love exploring tech and <a href='https://www.paulgraham.com/hp.html' target="blank" className=''>hacking</a> together cool projects.
            <br/>
            <br/>
            This is the place where I post my thoughts and learnings.
          </p>
          <div className='text-center mb-4'>
            <Link href='Resume_Mihir_Deshpande.pdf'
              target='_blank'
              rel="noopener noreferrer">
              <p className='underline'>View Resume</p>
            </Link>
          </div>
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
            On a sidenote, I am also a Sitar Player and a student of Indian Classical Music. You can find my music on Youtube, Spotify and on Instagram!
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
        </div>
      </section>
    </main>
  )
}

export default page