import React from 'react'
import Image from 'next/image'
import profilePic from '../../public/images/headshot.png'
import concertPic from '../../public/images/concert.png'

const page = () => {
  return (
    <main>
      <section className="flex justify-center mb-1 font-serif">
        <div className="flex flex-col p-10 w-full lg:w-2/5 md:text-lg">
          <p className='mb-10'>
            Hey there, my name is Mihir Deshpande.
            I am a Programmer and a Software Engineer. I am currently working in Helpshift as a Backend Dev. I am proficient in Java and Python. Nowadays, I am "functioning" in Clojure. I specialise in Product Development and Distributed Systems. This is the place where I dump(?) all my experiences and learnings in the text format. 
          </p>
          <div className="flex justify-center mb-10">
            <Image
              className="rounded-badge"
              src={profilePic}
              alt=''
              height={400}
              width={400}
            ></Image>
          </div>
          <p className='mb-10' >
            I am also a Sitar Player and a student of Indian Classical Music. You can find my music on Youtube, Spotify and on Instagram reels!
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