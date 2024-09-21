import React from 'react'
import resume from '../../public/resume.png'
import Image from 'next/image'
import NavBar from '../components/NavBar'
import Footer from '../components/Footer'

const page = () => {
  return (
    <main>
    <NavBar/>
    <div className="w-4/5 text-sm md:w-2/3 md:text-lg">
    <div className='flex w-screen justify-center'>
    <Image 
        src={resume}
        height={800}
        width={800}
        alt=''></Image>
    </div>   
        </div>
    <Footer/>
        </main>
  )
}

export default page