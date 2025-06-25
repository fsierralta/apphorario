import React from 'react';
import { PaginationLink } from '@/types';

interface Props {
  links: PaginationLink[];
}

const Pagination: React.FC<Props> = ({ links }) => (
  <nav className="flex justify-center items-center mt-4 gap-2">
   
      {links.map((link, index) => (
        <div key={index}>
          <a
            href={link.url ?? undefined}
            className={`px-4 py-1 sm:px-3 sm:py-2 rounded-lg 
               transition-colors duration-150 text-xs sm:text-base mb-4 
              ${link.active
                ? 'bg-white border border-md border-red-600 text-red-600 font-bold rounded-lg'
                : link.url
                  ? 'text-blue-600 bg-white hover:bg-blue-100 border border-gray-300 rounded-lg'
                  : 'bg-gray-600 text-gray-400 cursor-not-allowed pointer-events-none border border-gray-300 rounded'
              }`}
            aria-current={link.active ? 'page' : undefined}
            dangerouslySetInnerHTML={{ __html: link.label }}
          />
        </div>
      ))}
   
  </nav>
);

export default Pagination;