'use client';
import { useEffect, useRef, useState } from "react";
import Link from 'next/link'

const NavBar = () => {
    return (
        <div className="flex justify-center">
            <div className="navbar bg-base-100 p-4 font-serif border-b-2 border-b-stone-400 lg:w-2/5">
                <div className="navbar-start flex-1">
                    <div className="text-xl">Mihir Deshpande</div>
                </div>
                <div className="navbar-end">
                    <ul className="menu menu-horizontal justify-end w-full px-1 gap-1">
                        <li>
                            <Link href='/' className='text-lg flex items-center gap-1 px-2 py-1 sm:px-3 sm:py-2'>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                                </svg>
                                Posts
                            </Link>
                        </li>
                        <li>
                            <Link href='/about' className='text-lg flex items-center gap-1 px-2 py-1 sm:px-3 sm:py-2'>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                About
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default NavBar