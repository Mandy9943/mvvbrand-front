import { ChevronDownIcon, ChevronUpIcon } from 'lucide-react';
import { useState } from 'react';

export const ImageRequirementsHelper = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const tools = [
    {
      name: 'Image Resizer',
      description: 'Resize your PNG to required 200x200px size',
      url: 'https://imageresizer.com/',
      recommended: true
    },
    {
      name: 'Remove Background',
      description: 'Make your PNG background transparent',
      url: 'https://www.remove.bg/upload',
      recommended: true
    },
    {
      name: 'PNG to SVG Converter',
      description: 'Convert your PNG to required SVG format',
      url: 'https://png2svg.com/',
      recommended: false
    }
  ];

  return (
    <div className='mt-4 bg-slate-50 rounded-lg border border-slate-200'>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className='w-full px-4 py-3 flex items-center justify-between text-sm text-slate-600 hover:text-slate-900'
      >
        <span className='flex items-center'>
          <span className='mr-2'>🛠️</span>
          Need help preparing your logo?
        </span>
        {isExpanded ? (
          <ChevronUpIcon className='w-4 h-4' />
        ) : (
          <ChevronDownIcon className='w-4 h-4' />
        )}
      </button>

      {isExpanded && (
        <div className='px-4 pb-4'>
          <p className='text-xs text-slate-500 mb-3'>
            Recommended approach: 1) Resize image 2) Remove background 3)
            Convert to SVG
          </p>
          <div className='space-y-2'>
            {tools.map((tool) => (
              <a
                key={tool.name}
                href={tool.url}
                target='_blank'
                rel='noopener noreferrer'
                className='block p-2 rounded hover:bg-slate-100 transition-colors'
              >
                <div className='flex items-start'>
                  <div className='flex-grow'>
                    <p className='text-sm font-medium text-slate-900'>
                      {tool.name}
                      {tool.recommended && (
                        <span className='ml-2 text-xs text-green-600 font-normal'>
                          Recommended
                        </span>
                      )}
                    </p>
                    <p className='text-xs text-slate-500'>{tool.description}</p>
                  </div>
                  <svg
                    className='w-4 h-4 text-slate-400 flex-shrink-0 mt-1'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14'
                    />
                  </svg>
                </div>
              </a>
            ))}
          </div>
          <p className='text-xs text-slate-400 mt-3'>
            Note: These are third-party tools. We are not affiliated with them
            but they may help you meet the requirements.
          </p>
        </div>
      )}
    </div>
  );
};
