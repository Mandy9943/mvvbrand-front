import { RouteNamesEnum } from '@/localConstants';
import { setRedirectRoute } from '@/utils/redirectUtils';
import { PageWrapper } from '@/wrappers';
import { useGetIsLoggedIn } from '@multiversx/sdk-dapp/hooks';
import { useNavigate } from 'react-router-dom';

export const Home = () => {
  const navigate = useNavigate();
  const isLoggedIn = useGetIsLoggedIn();

  const handleNavigate = (route: RouteNamesEnum) => {
    if (!isLoggedIn) {
      setRedirectRoute(route);
      navigate(RouteNamesEnum.unlock);
    } else {
      navigate(route);
    }
  };

  return (
    <PageWrapper>
      <div className='min-h-screen bg-gradient-to-b from-slate-50 to-blue-50'>
        <div className='max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-8 sm:py-16'>
          {/* Hero Section - Adjusted spacing and font sizes */}
          <div className='text-center mb-12 sm:mb-16'>
            <h1 className='text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 mb-4 sm:mb-6'>
              Brand Your MultiversX Token{' '}
              <span className='text-blue-600'>in Minutes</span>
            </h1>
            <p className='text-lg sm:text-xl lg:text-2xl text-slate-600 max-w-3xl mx-auto px-2'>
              No coding required. Brand any token on MultiversX blockchain with
              just a few clicks.
            </p>
          </div>

          {/* Main CTA Buttons - Improved mobile layout */}
          <div className='flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 mb-12 sm:mb-16 px-4 sm:px-0'>
            <button
              onClick={() =>
                handleNavigate(RouteNamesEnum.brandMemexchangeToken)
              }
              className='px-6 sm:px-8 py-3 sm:py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 
                       transition-all transform hover:scale-105 shadow-lg text-base sm:text-lg font-semibold'
            >
              Brand MemeExchange Token
            </button>
            <button
              onClick={() => handleNavigate(RouteNamesEnum.brandMyToken)}
              className='px-6 sm:px-8 py-3 sm:py-4 bg-slate-800 text-white rounded-xl hover:bg-slate-900 
                       transition-all transform hover:scale-105 shadow-lg text-base sm:text-lg font-semibold'
            >
              Brand Custom Token
            </button>
          </div>

          {/* Features Grid - Improved mobile layout */}
          <div className='grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 text-center mb-12 sm:mb-20 px-2 sm:px-0'>
            <div className='p-4 sm:p-6 rounded-xl bg-white shadow-md'>
              <div className='text-blue-600 text-3xl sm:text-4xl mb-3 sm:mb-4'>
                🚀
              </div>
              <h3 className='text-lg sm:text-xl font-bold text-slate-800 mb-2'>
                Quick & Easy
              </h3>
              <p className='text-sm sm:text-base text-slate-600'>
                Brand your token in minutes without any technical knowledge
              </p>
            </div>
            <div className='p-4 sm:p-6 rounded-xl bg-white shadow-md'>
              <div className='text-blue-600 text-3xl sm:text-4xl mb-3 sm:mb-4'>
                🔒
              </div>
              <h3 className='text-lg sm:text-xl font-bold text-slate-800 mb-2'>
                No Dev Account Needed
              </h3>
              <p className='text-sm sm:text-base text-slate-600'>
                Skip the GitHub hassle - brand directly through our platform
              </p>
            </div>
            <div className='p-4 sm:p-6 rounded-xl bg-white shadow-md'>
              <div className='text-blue-600 text-3xl sm:text-4xl mb-3 sm:mb-4'>
                🌟
              </div>
              <h3 className='text-lg sm:text-xl font-bold text-slate-800 mb-2'>
                MemeExchange Integration
              </h3>
              <p className='text-sm sm:text-base text-slate-600'>
                Special support for MemeExchange.fun tokens
              </p>
            </div>
          </div>

          {/* Requirements Section - Enhanced mobile layout */}
          <div className='bg-white rounded-2xl shadow-lg p-4 sm:p-8 mb-12 sm:mb-16'>
            <h2 className='text-xl sm:text-2xl font-bold text-slate-900 mb-4 sm:mb-6 text-center'>
              MultiversX Official Branding Requirements
            </h2>

            {/* Warning Box - Improved mobile styling */}
            <div className='mb-6 sm:mb-8 mx-auto max-w-3xl'>
              <div className='bg-yellow-50 border-l-4 border-yellow-400 p-4 sm:p-5'>
                <div className='flex items-start space-x-3'>
                  <div className='flex-shrink-0 mt-0.5'>
                    <svg
                      className='h-5 w-5 text-yellow-400'
                      viewBox='0 0 20 20'
                      fill='currentColor'
                    >
                      <path
                        fillRule='evenodd'
                        d='M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z'
                        clipRule='evenodd'
                      />
                    </svg>
                  </div>
                  <p className='text-sm sm:text-base text-yellow-700'>
                    <strong>Important:</strong> Please prepare your logo
                    according to these requirements before proceeding.
                    Submissions that don't meet MultiversX's official
                    requirements will be rejected.
                  </p>
                </div>
              </div>
            </div>

            {/* Requirements Grid - Enhanced mobile layout */}
            <div className='grid gap-6 sm:gap-8 md:grid-cols-2'>
              {/* Left Column */}
              <div className='space-y-6'>
                <div className='bg-slate-50 rounded-xl p-5 sm:p-6'>
                  <h3 className='text-lg font-semibold text-blue-600 mb-4 flex items-center'>
                    <svg
                      className='w-5 h-5 mr-2 flex-shrink-0'
                      fill='currentColor'
                      viewBox='0 0 20 20'
                    >
                      <path d='M9 2a1 1 0 000 2h2a1 1 0 100-2H9z' />
                      <path
                        fillRule='evenodd'
                        d='M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5z'
                        clipRule='evenodd'
                      />
                    </svg>
                    Official Logo Requirements
                  </h3>
                  <ul className='space-y-3'>
                    {[
                      'Must look good when cropped as circle',
                      'Transparent background required',
                      'Good contrast on light/dark backgrounds',
                      'Must not resemble MultiversX logos'
                    ].map((req, index) => (
                      <li
                        key={index}
                        className='flex items-start text-slate-700'
                      >
                        <span className='text-blue-500 mr-2 text-lg leading-none'>
                          •
                        </span>
                        <span className='text-sm sm:text-base'>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className='bg-slate-50 rounded-xl p-5 sm:p-6'>
                  <h3 className='text-lg font-semibold text-blue-600 mb-4 flex items-center'>
                    <svg
                      className='w-5 h-5 mr-2 flex-shrink-0'
                      fill='currentColor'
                      viewBox='0 0 20 20'
                    >
                      <path
                        fillRule='evenodd'
                        d='M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z'
                        clipRule='evenodd'
                      />
                    </svg>
                    File Requirements
                  </h3>
                  <ul className='space-y-3'>
                    {[
                      'logo.png: 200x200px (max 100KB)',
                      'logo.svg: Square format required',
                      'info.json: Token information file'
                    ].map((req, index) => (
                      <li
                        key={index}
                        className='flex items-start text-slate-700'
                      >
                        <span className='text-blue-500 mr-2 text-lg leading-none'>
                          •
                        </span>
                        <span className='text-sm sm:text-base'>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Right Column */}
              <div className='md:border-l md:pl-8 md:border-slate-200'>
                <div className='bg-blue-50 rounded-xl p-5 sm:p-6'>
                  <h3 className='text-lg font-semibold text-blue-600 mb-3'>
                    MultiversX Official Documentation
                  </h3>
                  <p className='text-sm sm:text-base text-slate-600 mb-4'>
                    These requirements are set by MultiversX. For the most
                    up-to-date guidelines and detailed examples, please refer to
                    the official documentation.
                  </p>
                  <a
                    href='https://github.com/multiversx/mx-assets'
                    target='_blank'
                    rel='noopener noreferrer'
                    className='inline-flex items-center text-blue-600 hover:text-blue-700 font-medium'
                  >
                    View Official Documentation
                    <svg
                      className='ml-2 w-4 h-4'
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
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Built By Section */}
          <div className='text-center mt-8 sm:mt-16'>
            <p className='text-sm sm:text-base text-slate-600 mb-3'>
              Built with ❤️ by{' '}
              <a
                href='https://memexchange.fun'
                target='_blank'
                rel='noopener noreferrer'
                className='text-blue-600 hover:text-blue-700 font-medium'
              >
                MemeExchange.fun
              </a>
            </p>
            <div className='flex justify-center gap-4 items-center'>
              <a
                href='https://x.com/MVXBrand'
                target='_blank'
                rel='noopener noreferrer'
                className='text-slate-600 hover:text-blue-600 transition-colors'
                title='Follow us on X'
              >
                <svg
                  className='w-5 h-5'
                  viewBox='0 0 24 24'
                  fill='currentColor'
                >
                  <path d='M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z' />
                </svg>
              </a>
              <a
                href='https://t.me/mem_exchange'
                target='_blank'
                rel='noopener noreferrer'
                className='text-slate-600 hover:text-blue-600 transition-colors'
                title='Join our Telegram'
              >
                <svg
                  className='w-5 h-5'
                  viewBox='0 0 24 24'
                  fill='currentColor'
                >
                  <path d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .24z' />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};
