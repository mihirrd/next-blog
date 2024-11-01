'use client';
import { useEffect, useRef, useState } from "react";
import Link from 'next/link'

const NavBar = () => {
    const divRef = useRef(null);
    const [hideMenu, setHideMenu] = useState(true);

    const isListenerAttached = useRef(false);

    const toggleHideMenu = () => {
        console.log("hello")
        setHideMenu((prev) => !prev);
    };

    const handleClickOutside = (event) => {
    // Check if click happened outside the div
    if (divRef.current && !divRef.current.contains(event.target)) {
      setHideMenu(true);

      // Remove event listener as required operation is performed
      document.removeEventListener("mousedown", handleClickOutside);
      isListenerAttached.current = false;
    }
  };

  useEffect(() => {
    if (!hideMenu && !isListenerAttached.current) {
      // Add event listener to check outside click
      document.addEventListener("mousedown", handleClickOutside);
      isListenerAttached.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hideMenu]);


    return (
        <div className="flex justify-center">
        <div className="navbar bg-base-100 p-4 font-mono border-b-2 border-b-stone-500 lg:w-2/5">
            <div className="navbar-start">
                <div className="dropdown" ref={divRef}>
                    <div 
                    tabIndex={0} 
                    role="button" 
                    className="btn btn-ghost md:hidden"
                    onClick={toggleHideMenu}>
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
                    <ul tabIndex={0}
                        className={`menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow ${hideMenu ? "hidden" : ""}`}
                        >
                        <li onClick={toggleHideMenu}><Link href='/about' className='text-lg'>About</Link></li>
                        <li onClick={toggleHideMenu}><Link href='/' className='text-lg'>Posts</Link></li>
                    
                    </ul>
                </div>
                <div className="text-xl">Mihir Deshpande</div>
            </div>
            <div className="navbar-end hidden md:flex">
                <ul className="menu menu-horizontal">
                    <li><Link href='/about' className='text-lg'>
                    About</Link></li>
                    <li><Link href='/' className='text-lg'>Posts</Link></li>
                    
                </ul>
            </div>
        </div>
        </div>
    )
}

export default NavBar