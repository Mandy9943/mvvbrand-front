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
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20'>
          {/* Hero Section */}
          <div className='text-center mb-16'>
            <h1 className='text-4xl sm:text-6xl font-extrabold text-slate-900 mb-6'>
              Brand Your MultiversX Token{' '}
              <span className='text-blue-600'>in Minutes</span>
            </h1>
            <p className='text-xl sm:text-2xl text-slate-600 max-w-3xl mx-auto'>
              No coding required. Brand any token on MultiversX blockchain with
              just a few clicks.
            </p>
          </div>

          {/* Main CTA Buttons */}
          <div className='flex flex-col sm:flex-row justify-center gap-4 mb-16'>
            <button
              onClick={() =>
                handleNavigate(RouteNamesEnum.brandMemexchangeToken)
              }
              className='px-8 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 
                         transition-all transform hover:scale-105 shadow-lg text-lg font-semibold'
            >
              Brand MemeExchange Token
            </button>
            <button
              onClick={() => handleNavigate(RouteNamesEnum.brandMyToken)}
              className='px-8 py-4 bg-slate-800 text-white rounded-xl hover:bg-slate-900 
                         transition-all transform hover:scale-105 shadow-lg text-lg font-semibold'
            >
              Brand Custom Token
            </button>
          </div>

          {/* Features Grid */}
          <div className='grid md:grid-cols-3 gap-8 text-center'>
            <div className='p-6 rounded-xl bg-white shadow-md'>
              <div className='text-blue-600 text-4xl mb-4'>🚀</div>
              <h3 className='text-xl font-bold text-slate-800 mb-2'>
                Quick & Easy
              </h3>
              <p className='text-slate-600'>
                Brand your token in minutes without any technical knowledge
              </p>
            </div>
            <div className='p-6 rounded-xl bg-white shadow-md'>
              <div className='text-blue-600 text-4xl mb-4'>🔒</div>
              <h3 className='text-xl font-bold text-slate-800 mb-2'>
                No Dev Account Needed
              </h3>
              <p className='text-slate-600'>
                Skip the GitHub hassle - brand directly through our platform
              </p>
            </div>
            <div className='p-6 rounded-xl bg-white shadow-md'>
              <div className='text-blue-600 text-4xl mb-4'>🌟</div>
              <h3 className='text-xl font-bold text-slate-800 mb-2'>
                MemeExchange Integration
              </h3>
              <p className='text-slate-600'>
                Special support for MemeExchange.fun tokens
              </p>
            </div>
          </div>

          {/* Built By Section */}
          <div className='text-center mt-16'>
            <p className='text-slate-600'>
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
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};
