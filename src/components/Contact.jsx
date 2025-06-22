import React from 'react';
import { Mail, Github, ExternalLink } from 'lucide-react';

const Contact = () => {
  const email = 'sulaimanalfareeth@gmail.com'; // Replace with your actual email
  const githubUrl = 'https://github.com/oldstone7'; // Replace with your GitHub URL
  const portfolioUrl = 'https://sulaimanalfareeth.vercel.app'; // Replace with your portfolio URL

  return (
    <div className="min-h-[calc(100vh-16rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
            Get In Touch
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
            Feel free to reach out for collaborations, freelance work or just a friendly hello
          </p>
        </div>

        <div className="mt-8 space-y-6">
          {/* Email */}
          <div className="rounded-md shadow-sm -space-y-px">
            <div className="flex items-center p-4 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <Mail className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-3" />
              <a 
                href={`mailto:${email}`}
                className="text-blue-600 dark:text-blue-400 hover:underline flex-1"
              >
                {email}
              </a>
            </div>
          </div>

          {/* GitHub */}
          <div className="rounded-md shadow-sm -space-y-px">
            <div className="flex items-center p-4 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <Github className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-3" />
              <a 
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline flex-1"
              >
                GitHub Profile
              </a>
              <ExternalLink className="h-4 w-4 text-gray-400" />
            </div>
          </div>

          {/* Portfolio */}
          <div className="rounded-md shadow-sm -space-y-px">
            <div className="flex items-center p-4 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <svg 
                className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-3" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" 
                />
              </svg>
              <a 
                href={portfolioUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline flex-1"
              >
                View My Portfolio
              </a>
              <ExternalLink className="h-4 w-4 text-gray-400" />
            </div>
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>I'll do my best to respond to your message as soon as possible!</p>
        </div>
      </div>
    </div>
  );
};

export default Contact;
