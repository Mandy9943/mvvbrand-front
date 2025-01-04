import { RouteNamesEnum } from '@/localConstants';
import { PageWrapper } from '@/wrappers';
import { useNavigate } from 'react-router-dom';

export const Home = () => {
  const navigate = useNavigate();

  return (
    <PageWrapper>
      <div className='flex flex-col-reverse sm:flex-row items-center h-full w-full'>
        <div className='flex items-start sm:items-center h-full w-full sm:w-1/2'>
          <div className='flex flex-col gap-6 max-w-[600px] text-center sm:text-left'>
            <h1 className='text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-800'>
              Brand your blockchain token
            </h1>
            <p className='text-xl sm:text-2xl text-slate-600'>
              Join the multiverse and create unique, branded tokens
            </p>
            <div className='flex flex-col sm:flex-row gap-4 mt-4'>
              <button
                onClick={() => navigate(RouteNamesEnum.brandMemexchangeToken)}
                className='px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-lg font-medium'
              >
                Brand a Memexchange coin
              </button>
              <button
                onClick={() => navigate(RouteNamesEnum.brandMyToken)}
                className='px-6 py-3 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors text-lg font-medium'
              >
                Brand your own coin
              </button>
            </div>
          </div>
        </div>
        <div className='w-full sm:w-1/2 h-full sm:h-full relative'>
          <div
            className='absolute inset-0 bg-contain bg-center bg-no-repeat'
            style={{
              backgroundImage:
                'url(https://cdn.usegalileo.ai/sdxl10/62425988-c1ce-4193-91c9-5d94c852e360.png)',
              opacity: 0.15
            }}
          />
        </div>
      </div>
    </PageWrapper>
  );
};
