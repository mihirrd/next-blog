import Link from 'next/link'

const NavBar = () => {
  return (
    <nav className="flex justify-center px-4 sticky top-0 z-40 bg-stone-50/90 dark:bg-stone-950/90 backdrop-blur-sm border-b border-stone-200 dark:border-stone-800">
      <div className="w-full max-w-2xl flex items-center justify-between py-4">
        <Link href="/" className="font-serif text-xl font-medium tracking-tight text-stone-900 dark:text-stone-100 hover:text-amber-700 dark:hover:text-amber-400 transition-colors">
          Mihir Deshpande
        </Link>
        <div className="flex items-center gap-1">
          <Link href="/" className="text-base px-3 py-1.5 rounded-md text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-900 transition-colors">
            Posts
          </Link>
          <Link href="/about" className="text-base px-3 py-1.5 rounded-md text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-900 transition-colors">
            About
          </Link>
        </div>
      </div>
    </nav>
  )
}

export default NavBar