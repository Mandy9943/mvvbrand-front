import { nativeAuth } from '@/config';
import { useWindowSize } from '@/hooks/useWindowSize';
import { RouteNamesEnum } from '@/localConstants';
import { useGetIsLoggedIn } from '@multiversx/sdk-dapp/hooks/account/useGetIsLoggedIn';
import { useIframeLogin } from '@multiversx/sdk-dapp/hooks/login/useIframeLogin';
import {
  CrossWindowLoginButton,
  ExtensionLoginButton,
  WalletConnectLoginButton,
  WebWalletLoginButton as WebWalletUrlLoginButton,
  type ExtensionLoginButtonPropsType,
  type LedgerLoginButtonPropsType,
  type OperaWalletLoginButtonPropsType,
  type WalletConnectLoginButtonPropsType,
  type WebWalletLoginButtonPropsType
} from '@multiversx/sdk-dapp/UI';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { WebWalletLoginWrapper } from './components';

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

  const isMobile = width < 768;
  const commonProps: CommonPropsType = {
    callbackRoute: RouteNamesEnum.home,
    nativeAuth,

    disabled: isLoading
  };

  const isLoggedIn = useGetIsLoggedIn();

  useEffect(() => {
    if (isLoggedIn) {
      navigate(RouteNamesEnum.home);
    }
  }, [isLoggedIn, navigate]);

  return (
    <div className='flex justify-center items-center'>
      <div
        className='flex flex-col p-6 items-center justify-center gap-4 rounded-xl bg-[#f6f8fa]'
        data-testid='unlockPage'
      >
        <div className='flex flex-col items-center gap-1'>
          <h2 className='text-2xl'>Login</h2>

          <p className='text-center text-gray-400'>Choose a login method</p>
        </div>

        <div className='flex flex-col md:flex-row'>
          <WalletConnectLoginButton
            loginButtonText='xPortal App'
            {...commonProps}
          />
          <ExtensionLoginButton
            loginButtonText='DeFi Wallet'
            {...commonProps}
          />

          <WebWalletLoginWrapper {...commonProps} />
        </div>
      </div>
    </div>
  );
};
