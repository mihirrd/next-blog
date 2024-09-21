import React from 'react'
import NavBar from '../components/NavBar'
import Footer from '../components/Footer'
import Image from 'next/image'
import profilePic from '../../public/headshot.png'
import concertPic from '../../public/concert.png'

const page = () => {
  return (
    <main>
        <NavBar/>
        <section className="flex justify-center mb-1 font-serif">
            <div className="flex flex-col p-10 text-justify w-full lg:w-2/5 md:text-lg">
            <p className='mb-10'>
              Hey there, my name is Mihir Deshpande. 
              I am a Software Engineer. I am currently working in Helpshift as a Backend Engineer. I am proficient in Java and Python. Now a days, I am mostly "functioning" in Clojure. I specialise in Product Development and Distributed Systems.
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
              I am also a Sitar Player and a student of Indian Classial Music. You can find my music on Youtube, spotify and on Instagram reels!
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
        <Footer/>
        
    </main>
    
  )
}

export default page