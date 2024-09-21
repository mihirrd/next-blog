import React from 'react'
import Link from 'next/link'

const NavBar = () => {
  return (
    <div className="navbar bg-base-100 p-4 font-mono border-b-2 border-b-stone-500">
  <div className="navbar-start">
    <div className="dropdown">
      <div tabIndex={0} role="button" className="btn btn-ghost md:hidden">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 6h16M4 12h8m-8 6h16" />
        </svg>
      </div>
      <ul
        tabIndex={0}
        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
        <li><Link href='/about' className='text-lg'>About</Link></li>
        <li><Link href='/' className='text-lg'>Blog</Link></li>
        <li><Link href='/resume' className='text-lg'>Resume</Link></li>
      </ul>
    </div>
    <Link href='/about' className="text-xl ml-4">Mihir Deshpande</Link>
  </div>
  <div className="navbar-center hidden md:flex">
    <ul className="menu gap-4 menu-horizontal px-1">
    <li><Link href='/about' className='text-lg'>About</Link></li>
    <li><Link href='/' className='text-lg'>Blog</Link></li>
    <li><Link href='/resume' className='text-lg'>Resume</Link></li>
    </ul>
  </div>
  <div className='navbar-end'>
  
  </div>
</div>
)
}

export default NavBar