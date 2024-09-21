import React from 'react'
import resume from '../../public/resume.png'
import Image from 'next/image'
import NavBar from '../components/NavBar'
import Footer from '../components/Footer'

const page = () => {
  return (
    <main>
    <NavBar/>
    <div className="flex justify-center font-serif mb-8 text-sm md:text-base">
    <div className='w-4/5 md:w-3/5 mt-8'>
    <ul className="timeline timeline-snap-icon max-md:timeline-compact timeline-vertical">
  <li>
    <div className="timeline-middle">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        className="h-5 w-5">
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
          clipRule="evenodd" />
      </svg>
    </div>
    <div className="timeline-start mb-10 md:text-end">
      <time className="font-mono italic">2023 - Present</time>
      <div className="text-lg font-black">Software Engineer - Helpshift</div>
      <ul className='text-wrap text-justify mb-4 md:mb-0'>
        <li>
        Designed, developed, and maintained Backend Services using Clojure for a high-traffic, Consumer first, SaaS Platform handling millions of requests per day
        </li>
        <li>
        Implemented a robust and scalable architecture for a third party LLM Integration into a Chatbot service by leveraging Apache Kafka and Redis, to ensure high performance, Fault Tolerance and reliability
        </li>
        <li>
        Conducted thorough analysis and refactored existing microservices and improved maintainability, scalability and reduced the system latency by 50% by using Clojure workers, optimizing Queries and employing Caching techniques
        </li>
        <li>
        Collaborated with product managers to understand user requirements and translated them into Dev Specs, developing new features that align with business goals
        </li>
        <li>
        Participated in on-call rotations and responded to incidents promptly, diagnosing and resolving issues to minimize downtime
        </li>
        <li>
        Mentored new engineers, guiding best practices, code reviews, and troubleshooting techniques to facilitate their professional growth and development
        </li>
      </ul>
    </div>
    <hr />
  </li>
  <li>
    <hr />
    <div className="timeline-middle">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        className="h-5 w-5">
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
          clipRule="evenodd" />
      </svg>
    </div>
    <div className="timeline-end mb-10">
      <time className="font-mono italic">2021 - 2023</time>
      <div className="text-lg font-black">Software Engineer - miniOrange</div>
      <ul className='text-wrap text-justify'>
        <li>
        Worked on developing cloud and on-premise-based Identity and Access management plugin solutions focusing on Single Sign-on, API security, and Multifactor authentication with Protocols namely as SAML and OAuth/OIDC using Spring Boot and Hybernate ORM For Atlassian Platforms
        </li>
        <li>
        Led a team of 4 engineers focusing on API authentication module, planned sprints, conducted stand-ups, and ensured timely releases.
        </li>
    </ul>
    </div>
    <hr />
  </li>
</ul>
</div>
</div>
<Footer/>
</main>
  )
}

export default page