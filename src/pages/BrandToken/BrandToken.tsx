import { TokenForm } from '@/components/TokenForm/TokenForm';
import { TokenSearch } from '@/components/TokenSearch/TokenSearch';
import { Button } from '@/components/ui/button';
import { PageWrapper } from '@/wrappers';
import { useGetAccountInfo } from '@multiversx/sdk-dapp/hooks';
import { AlertTriangleIcon, CheckIcon } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface SelectedToken {
  identifier: string;
  name: string;
  imageUrl?: string;
  description?: string;
  website?: string;
  social?: Record<string, string>;
  creator?: string;
}

export const BrandToken = () => {
  const [selectedToken, setSelectedToken] = useState<SelectedToken | null>(
    null
  );
  const [isCompleted, setIsCompleted] = useState<string>('');
  const [creatorError, setCreatorError] = useState<string>('');
  const navigate = useNavigate();

  const { address } = useGetAccountInfo();

  const handleTokenSelect = (token: SelectedToken) => {
    if (token.creator && token.creator !== address) {
      setCreatorError(
        `You are not the creator of this token. Only ${token.creator} can brand this token. You are not currently allowed to brand this token, but in the future you might with a subscription plan. If you still need to brand now, contact an admin to help you.`
      );
    } else {
      setCreatorError('');
      setSelectedToken(token);
    }
  };

  return (
    <PageWrapper>
      <div className='w-full max-w-3xl mx-auto space-y-6 sm:space-y-8 px-4 sm:px-6 py-8 sm:py-16'>
        <div className='text-center space-y-3 sm:space-y-4'>
          <img
            src='/mxc-logo.webp'
            alt='MemeXchange Logo'
            className='h-8 sm:h-12 mx-auto mb-3 sm:mb-4'
          />
          <h1 className='text-2xl sm:text-3xl font-bold'>
            Brand Your MemeXchange Token
          </h1>
          <p className='text-sm sm:text-base text-slate-600'>
            Search for your token and customize its branding
          </p>
        </div>

        {!!isCompleted ? (
          <div className='bg-white p-4 sm:p-8 rounded-xl shadow-sm border'>
            <div className='text-center space-y-4'>
              <div className='mx-auto w-12 sm:w-16 h-12 sm:h-16 bg-green-100 rounded-full flex items-center justify-center'>
                <CheckIcon className='w-6 sm:w-8 h-6 sm:h-8 text-green-600' />
              </div>
              <h2 className='text-xl sm:text-2xl font-semibold'>
                Branding Request Submitted!
              </h2>
              <p className='text-sm sm:text-base text-slate-600'>
                Your token branding request has been submitted successfully. You
                can check the status of your request at:
              </p>
              <a
                href={isCompleted}
                target='_blank'
                rel='noopener noreferrer'
                className='inline-block text-sm sm:text-base text-blue-600 hover:text-blue-800 underline'
              >
                View Token Page
              </a>
              <div className='mt-6 sm:mt-8'>
                <Button
                  onClick={() => navigate('/')}
                  className='w-full sm:w-auto'
                >
                  Back to Home
                </Button>
              </div>
            </div>
          </div>
        ) : !selectedToken && !creatorError ? (
          <div className='bg-white p-4 sm:p-8 rounded-xl shadow-sm border'>
            <TokenSearch onSelect={handleTokenSelect} />
          </div>
        ) : creatorError ? (
          <div className='bg-white p-4 sm:p-8 rounded-xl shadow-sm border'>
            <div className='text-center space-y-4'>
              <div className='mx-auto w-12 sm:w-16 h-12 sm:h-16 bg-yellow-100 rounded-full flex items-center justify-center'>
                <AlertTriangleIcon className='w-6 sm:w-8 h-6 sm:h-8 text-yellow-600' />
              </div>
              <h2 className='text-xl sm:text-2xl font-semibold'>
                Access Restricted
              </h2>

              <p className='text-sm sm:text-base text-slate-600'>
                {creatorError}
              </p>
              <div className='mt-6 sm:mt-8'>
                <Button
                  onClick={() => {
                    setCreatorError('');
                    setSelectedToken(null);
                  }}
                  className='w-full sm:w-auto'
                >
                  Try Another Token
                </Button>
              </div>
            </div>
          </div>
        ) : (
          selectedToken && (
            <div className='bg-white p-4 sm:p-8 rounded-xl shadow-sm border'>
              <TokenForm
                mode='edit'
                initialTokenId={selectedToken.identifier}
                tokenName={selectedToken.name}
                tokenImage={selectedToken.imageUrl}
                description={selectedToken.description}
                website={selectedToken.website}
                social={selectedToken.social}
                onBack={() => setSelectedToken(null)}
                onBrandingSuccess={(response) =>
                  setIsCompleted(response.pullRequestUrl)
                }
              />
            </div>
          )
        )}
      </div>
    </PageWrapper>
  );
};
