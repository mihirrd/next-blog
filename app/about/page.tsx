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
            <div className="flex flex-col text-justify w-4/5 md:w-2/5 md:text-lg">
            <p className='mb-12 mt-8'>
              Hey there, my name is Mihir Deshpande. 
              I am Software Engineer. I am currently working in Helpshift as a Backend Engineer. 
              I specialise in prodcut development and Distributed Systems.    
              </p>
              <div className="flex justify-center mb-12">
              <Image
              className="rounded-badge"
              src={profilePic} 
              alt=''
              height={400}
              width={400}
              ></Image>
              </div>
              <p className='text-center mb-12' >
              I am also a sitar player and a student of Indian Classial Music. You can find my music on Youtube and spotify. 
              </p>
              <div className="flex justify-center mb-12">
              <Image
               className="object-cover rounded-lg"
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