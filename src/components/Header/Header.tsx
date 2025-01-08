import { MxLink } from '@/components/MxLink';
import { Button } from '@/components/ui/button';
import { environment } from '@/config';
import { RouteNamesEnum } from '@/localConstants';
import { useGetIsLoggedIn } from '@multiversx/sdk-dapp/hooks';
import { logout } from '@multiversx/sdk-dapp/utils/logout';
import { useMatch } from 'react-router-dom';

const callbackUrl = `${window.location.origin}/unlock`;
const onRedirect = undefined; // use this to redirect with useNavigate to a specific page after logout
const shouldAttemptReLogin = false; // use for special cases where you want to re-login after logout
const options = {
  /*
   * @param {boolean} [shouldBroadcastLogoutAcrossTabs=true]
   * @description If your dApp supports multiple accounts on multiple tabs,
   * this param will broadcast the logout event across all tabs.
   */
  shouldBroadcastLogoutAcrossTabs: true,
  /*
   * @param {boolean} [hasConsentPopup=false]
   * @description Set it to true if you want to perform async calls before logging out on Safari.
   * It will open a consent popup for the user to confirm the action before leaving the page.
   */
  hasConsentPopup: false
};

export const Header = () => {
  const isLoggedIn = useGetIsLoggedIn();
  const isUnlockRoute = Boolean(useMatch(RouteNamesEnum.unlock));

  const handleLogout = () => {
    sessionStorage.clear();
    logout(callbackUrl, onRedirect, shouldAttemptReLogin, options);
  };

  return (
    <header className='fixed top-0 left-0 right-0 bg-black/80 backdrop-blur-md border-b border-slate-200 z-50'>
      <div className='max-w-7xl mx-auto px-3 sm:px-6 lg:px-8'>
        <div className='flex items-center justify-between h-14 sm:h-16'>
          {/* Logo Section */}
          <MxLink
            className='flex items-center space-x-2 text-slate-900 hover:text-blue-600 transition-colors'
            to={RouteNamesEnum.home}
          >
            <img src='/icon.png' alt='MVXBrand' className='h-6 sm:h-8 w-auto' />
            <span className='font-semibold text-base sm:text-lg text-white'>
              MVXBrand
            </span>
          </MxLink>

          {/* Right Section */}
          <div className='flex items-center space-x-2 sm:space-x-4'>
            {/* Environment Badge */}
            <div className='hidden sm:flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-100'>
              <div className='w-2 h-2 rounded-full bg-green-500' />
              <span className='text-sm text-slate-600'>{environment}</span>
            </div>

            {/* Auth Button */}
            {isLoggedIn ? (
              <Button
                onClick={handleLogout}
                className='bg-slate-800 hover:bg-slate-900 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg
                          text-sm sm:text-base transition-all hover:shadow-md'
              >
                Disconnect
              </Button>
            ) : (
              !isUnlockRoute && (
                <Button
                  asChild
                  className='bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg
                          text-sm sm:text-base transition-all hover:shadow-md'
                >
                  <MxLink to={RouteNamesEnum.unlock}>Connect Wallet</MxLink>
                </Button>
              )
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
