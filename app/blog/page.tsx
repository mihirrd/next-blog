import React from 'react'
import NavBar from '../components/NavBar'
import Footer from '../components/Footer'

const page = () => {
  return (
    <main>
        <NavBar/>
        <div className="flex h-screen justify-center">
            <div className="text-justify w-3/5">
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. At placeat, facilis praesentium odio nobis rem doloremque earum voluptatibus quis quasi assumenda debitis ea totam error. Odio voluptatem fugit saepe id!
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. At placeat, facilis praesentium odio nobis rem doloremque earum voluptatibus quis quasi assumenda debitis ea totam error. Odio voluptatem fugit saepe id!consectetur adipisicing elit. At placeat, facilis praesentium odio nobis rem doloremque earum voluptatibus quis quasi assumenda debitis ea totam error. Odio voluptatem fugit saepe id!ipsum dolor sit, amet consectetur adipisicing elit. At placeat, facilis praesentium odio nobis rem doloremque earum voluptatibus quis quasi assumenda debitis ea totam error. Odio voluptatem fugit saepe id!
            </div>
        </div>
        <Footer/>
    </main>
    
  )
}

export default page