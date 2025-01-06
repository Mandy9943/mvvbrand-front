import { RouteNamesEnum } from '@/localConstants/routes';
import { routes } from '@/routes/routes';
import { AuthenticatedRoutesWrapper } from '@multiversx/sdk-dapp/wrappers/AuthenticatedRoutesWrapper/AuthenticatedRoutesWrapper';
import type { PropsWithChildren } from 'react';
import { useLocation } from 'react-router-dom';
import { Header } from './Header';

export const Layout = ({ children }: PropsWithChildren) => {
  const { search } = useLocation();
  return (
    <div className='flex min-h-screen flex-col bg-slate-200'>
      <Header />
      <main className='flex flex-grow items-stretch justify-center p-6 pt-20'>
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
