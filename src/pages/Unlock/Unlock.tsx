import {
  DefiWalletIcon,
  WalletConnectIcon,
  XPortalIcon
} from '@/components/customIcons';
import { nativeAuth } from '@/config';
import { useWindowSize } from '@/hooks/useWindowSize';
import { RouteNamesEnum } from '@/localConstants';
import { getAndClearRedirectRoute } from '@/utils/redirectUtils';
import { useGetIsLoggedIn } from '@multiversx/sdk-dapp/hooks/account/useGetIsLoggedIn';
import { useExtensionLogin } from '@multiversx/sdk-dapp/hooks/login/useExtensionLogin';
import { useIframeLogin } from '@multiversx/sdk-dapp/hooks/login/useIframeLogin';
import { useWalletConnectV2Login } from '@multiversx/sdk-dapp/hooks/login/useWalletConnectV2Login';
import { useWebWalletLogin } from '@multiversx/sdk-dapp/hooks/login/useWebWalletLogin';
import {
  CrossWindowLoginButton,
  WebWalletLoginButton as WebWalletUrlLoginButton,
  type ExtensionLoginButtonPropsType,
  type LedgerLoginButtonPropsType,
  type OperaWalletLoginButtonPropsType,
  type WalletConnectLoginButtonPropsType,
  type WebWalletLoginButtonPropsType
} from '@multiversx/sdk-dapp/UI';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

type CommonPropsType =
  | OperaWalletLoginButtonPropsType
  | ExtensionLoginButtonPropsType
  | WebWalletLoginButtonPropsType
  | LedgerLoginButtonPropsType
  | WalletConnectLoginButtonPropsType;

// choose how you want to configure connecting to the web wallet
const USE_WEB_WALLET_CROSS_WINDOW = true;

const WebWalletLoginButton = USE_WEB_WALLET_CROSS_WINDOW
  ? CrossWindowLoginButton
  : WebWalletUrlLoginButton;

export const Unlock = () => {
  const navigate = useNavigate();
  const { width } = useWindowSize();
  const [onInitiateLogin, { isLoading }] = useIframeLogin({
    callbackRoute: RouteNamesEnum.home,
    nativeAuth
  });

  const commonProps = {
    callbackRoute: RouteNamesEnum.home,
    nativeAuth
  };

  const [extensionLogin] = useExtensionLogin(commonProps);
  const [webWalletLogin] = useWebWalletLogin(commonProps);
  const [walletConnectLogin] = useWalletConnectV2Login(commonProps);

  const isLoggedIn = useGetIsLoggedIn();

  useEffect(() => {
    if (isLoggedIn) {
      const redirectRoute = getAndClearRedirectRoute();
      navigate(redirectRoute || RouteNamesEnum.home);
    }
  }, [isLoggedIn, navigate]);

  return (
    <div className='min-h-screen w-full rounded-lg bg-gradient-to-b from-slate-50 to-blue-50 flex justify-center items-center px-4'>
      <div
        className='w-full max-w-md p-8 bg-white/90 backdrop-blur-md rounded-2xl shadow-xl'
        data-testid='unlockPage'
      >
        {/* Header */}
        <div className='text-center mb-10'>
          <h2 className='text-2xl font-bold text-slate-900 mb-2'>
            Connect Wallet
          </h2>
          <p className='text-slate-600'>Choose your preferred login method</p>
        </div>

        {/* Login Options */}
        <div className='grid grid-cols-3 gap-6'>
          <button
            onClick={() => extensionLogin()}
            className='flex flex-col items-center gap-3 p-4 rounded-xl hover:bg-slate-50 
                     transition-all group'
          >
            <div
              className='w-12 h-12 flex items-center justify-center bg-slate-100 
                          rounded-full group-hover:bg-slate-200 transition-colors'
            >
              <DefiWalletIcon height={25} />
            </div>
            <span className='text-sm font-medium text-slate-700'>
              DeFi Wallet
            </span>
          </button>

          <button
            onClick={() => webWalletLogin()}
            className='flex flex-col items-center gap-3 p-4 rounded-xl hover:bg-slate-50 
                     transition-all group'
          >
            <div
              className='w-12 h-12 flex items-center justify-center bg-slate-100 
                          rounded-full group-hover:bg-slate-200 transition-colors'
            >
              <WalletConnectIcon height={25} />
            </div>
            <span className='text-sm font-medium text-slate-700'>
              Web Wallet
            </span>
          </button>

          <button
            onClick={() => walletConnectLogin()}
            className='flex flex-col items-center gap-3 p-4 rounded-xl hover:bg-slate-50 
                     transition-all group'
          >
            <div
              className='w-12 h-12 flex items-center justify-center bg-slate-100 
                          rounded-full group-hover:bg-slate-200 transition-colors'
            >
              <XPortalIcon height={25} />
            </div>
            <span className='text-sm font-medium text-slate-700'>
              xPortal App
            </span>
          </button>
        </div>

        {/* Help Text */}
        <div className='mt-8 pt-6 border-t border-slate-200'>
          <p className='text-center text-sm text-slate-500'>
            New to MultiversX?{' '}
            <a
              href='https://multiversx.com/wallet'
              target='_blank'
              rel='noopener noreferrer'
              className='text-blue-600 hover:text-blue-700 font-medium'
            >
              Learn about wallets
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};
