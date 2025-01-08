import { RouteNamesEnum } from '@/localConstants/routes';
import { routes } from '@/routes/routes';
import { AuthenticatedRoutesWrapper } from '@multiversx/sdk-dapp/wrappers/AuthenticatedRoutesWrapper/AuthenticatedRoutesWrapper';
import { RocketIcon } from 'lucide-react';
import type { PropsWithChildren } from 'react';
import { useLocation } from 'react-router-dom';
import { Header } from './Header';

export const Layout = ({ children }: PropsWithChildren) => {
  const { search } = useLocation();
  return (
    <div className='flex min-h-screen flex-col bg-slate-200'>
      <Header />
      <div className='bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100 mt-14 sm:mt-16'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-center gap-2 text-xs sm:text-sm text-slate-700'>
          <RocketIcon className='h-4 w-4 text-blue-500' />
          <span className='text-center'>
            Looking for a fair launch platform?{' '}
            <a
              href='https://memexchange.fun/'
              target='_blank'
              rel='noopener noreferrer'
              className='text-blue-600 hover:text-blue-800 font-medium'
            >
              memExchange
            </a>{' '}
            ensures 100% of liquidity goes to the{' '}
            <a
              href='https://xexchange.com/'
              target='_blank'
              rel='noopener noreferrer'
              className='text-blue-600 hover:text-blue-800 font-medium'
            >
              xExchange
            </a>
          </span>
        </div>
      </div>
      <main className='flex flex-grow items-stretch justify-center p-4 sm:p-6 pt-16 sm:pt-20'>
        <AuthenticatedRoutesWrapper
          routes={routes}
          unlockRoute={`${RouteNamesEnum.unlock}${search}`}
        >
          {children}
        </AuthenticatedRoutesWrapper>
      </main>
    </div>
  );
};
