'use client';
import { useEffect, useRef, useState } from "react";
import Link from 'next/link'
import ThemeToggle from './ThemeToggle';

const NavBar = () => {
    const divRef = useRef<HTMLDivElement>(null);
    const [hideMenu, setHideMenu] = useState(true);

    const isListenerAttached = useRef(false);

    const toggleHideMenu = () => {
        console.log("hello")
        setHideMenu((prev) => !prev);
    };

    const handleClickOutside = (event: MouseEvent) => {
        // Check if click happened outside the div
        if (divRef.current && !divRef.current.contains(event.target as Node)) {
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
            <div className="navbar bg-base-100 p-4 font-serif border-b-2 border-b-stone-400 lg:w-2/5">
                {/* Left section with hamburger menu and title */}
                <div className="navbar-start w-1/3">
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
                            <li onClick={toggleHideMenu}><Link href='/' className='text-lg'>Posts</Link></li>
                            <li onClick={toggleHideMenu}><Link href='/about' className='text-lg'>About</Link></li>
                        </ul>
                    </div>
                    <div className="text-xl">Mihir Deshpande</div>
                </div>
                
                {/* Middle section with navigation links (centered, desktop only) */}
                <div className="navbar-center w-1/3 hidden md:flex justify-center">
                    <ul className="menu menu-horizontal">
                        <li><Link href='/' className='text-lg'>Posts</Link></li>
                        <li><Link href='/about' className='text-lg'>About</Link></li>
                    </ul>
                </div>
                
                {/* Right section with theme toggle */}
                <div className="navbar-end w-1/3 flex justify-end">
                    <ThemeToggle />
                </div>
            </div>
        </div>
    )
}

export default NavBar