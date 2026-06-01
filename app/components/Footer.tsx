import React from 'react'

const Footer = () => {
  return (
    <footer className="flex justify-center px-4 mt-24">
      <div className="w-full max-w-2xl border-t border-stone-200 dark:border-stone-800 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-stone-500 dark:text-stone-400">
          © {new Date().getFullYear()} Mihir Deshpande
        </p>
        <nav className="flex items-center gap-5">
          <a href="https://www.linkedin.com/in/mihir-deshpande-10267989/" target="_blank" rel="noopener noreferrer"
            className="text-sm text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition-colors">
            LinkedIn
          </a>
          <a href="https://github.com/mihirrd" target="_blank" rel="noopener noreferrer"
            className="text-sm text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition-colors">
            GitHub
          </a>
          <a href="https://www.youtube.com/@mihirdeshpande7930" target="_blank" rel="noopener noreferrer"
            className="text-sm text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition-colors">
            YouTube
          </a>
          <a href="mailto:deshpande.mihir7@gmail.com"
            className="text-sm text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition-colors">
            Email
          </a>
        </nav>
      </div>
    </footer>
  )
}

export default Footer