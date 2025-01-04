import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';

import {
  NotificationModal,
  SignTransactionsModals,
  // uncomment this to use the custom transaction tracker
  // TransactionsTracker
  TransactionsToastList
} from '@multiversx/sdk-dapp/UI';
import { AxiosInterceptorContext } from '@multiversx/sdk-dapp/wrappers/AxiosInterceptorContext/AxiosInterceptorContext';

import { Layout } from '@/components/Layout';
import {
  apiTimeout,
  environment,
  sampleAuthenticatedDomains,
  walletConnectV2ProjectId
} from '@/config';
import { RouteNamesEnum } from '@/localConstants';
import { PageNotFound, Unlock } from '@/pages';
import { BatchTransactionsContextProvider } from '@/wrappers';
import { DappProvider } from '@multiversx/sdk-dapp/wrappers/DappProvider/DappProvider';
import { Toaster } from './components/ui/toaster';
import { routes } from './routes';

const AppContent = () => {
  return (
    <DappProvider
      environment={environment}
      customNetworkConfig={{
        name: 'customConfig',
        apiTimeout,
        walletConnectV2ProjectId
      }}
      dappConfig={{
        shouldUseWebViewProvider: true,
        logoutRoute: RouteNamesEnum.unlock
      }}
      customComponents={{
        transactionTracker: {
          // uncomment this to use the custom transaction tracker
          // component: TransactionsTracker,
          props: {
            onSuccess: (sessionId: string) => {
              console.log(`Session ${sessionId} successfully completed`);
            },
            onFail: (sessionId: string, errorMessage: string) => {
              console.log(`Session ${sessionId} failed. ${errorMessage ?? ''}`);
            }
          }
        }
      }}
    >
      <AxiosInterceptorContext.Listener>
        <Layout>
          <TransactionsToastList />
          <NotificationModal />
          <SignTransactionsModals />
          <Routes>
            <Route path={RouteNamesEnum.unlock} element={<Unlock />} />
            {routes.map((route) => (
              <Route
                path={route.path}
                key={`route-key-'${route.path}`}
                element={<route.component />}
              />
            ))}
            <Route path='*' element={<PageNotFound />} />
          </Routes>
        </Layout>
      </AxiosInterceptorContext.Listener>
    </DappProvider>
  );
};

export const App = () => {
  return (
    <AxiosInterceptorContext.Provider>
      <AxiosInterceptorContext.Interceptor
        authenticatedDomains={sampleAuthenticatedDomains}
      >
        <Router>
          <BatchTransactionsContextProvider>
            <AppContent />
            <Toaster />
          </BatchTransactionsContextProvider>
        </Router>
      </AxiosInterceptorContext.Interceptor>
    </AxiosInterceptorContext.Provider>
  );
};
