import { SignMessage } from '@/components/SignMessage/SignMessage';
import { TokenForm } from '@/components/TokenForm/TokenForm';
import { TokenSearch } from '@/components/TokenSearch/TokenSearch';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { ApiService } from '@/services/api.service';
import { PageWrapper } from '@/wrappers';
import { CheckIcon } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface PrepareResponse {
  commitHash: string;
}

interface SelectedToken {
  identifier: string;
  name: string;
  imageUrl?: string;
  description?: string;
  website?: string;
  social?: Record<string, string>;
}

export const BrandOwnToken = () => {
  const [selectedToken, setSelectedToken] = useState<SelectedToken | null>(
    null
  );
  const [commitHash, setCommitHash] = useState<string | null>(null);
  const [isCompleted, setIsCompleted] = useState<string>('');
  const { toast } = useToast();
  const navigate = useNavigate();

  const handlePrepareSuccess = (response: PrepareResponse) => {
    setCommitHash(response.commitHash);
  };

  const handleSignSuccess = async (signature: string) => {
    try {
      if (!commitHash || !selectedToken) return;

      const res = await ApiService.completeTokenBranding(
        selectedToken.identifier,
        {
          signature,
          commitHash
        }
      );

      setIsCompleted(res.pullRequestUrl);
      toast({
        title: 'Success',
        description: 'Token branding request submitted successfully'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to complete token branding',
        variant: 'destructive'
      });
    }
  };

  const getStepContent = () => {
    if (!!isCompleted) {
      return (
        <div className='bg-white p-4 sm:p-8 rounded-xl shadow-sm border'>
          <div className='text-center space-y-4'>
            <div className='mx-auto w-12 sm:w-16 h-12 sm:h-16 bg-green-100 rounded-full flex items-center justify-center'>
              <CheckIcon className='w-6 sm:w-8 h-6 sm:h-8 text-green-600' />
            </div>
            <h2 className='text-xl sm:text-2xl font-semibold'>
              Branding Request Submitted!
            </h2>
            <p className='text-sm sm:text-base text-slate-600 max-w-md mx-auto'>
              Your token branding request has been submitted successfully. You
              can check the status of your request at:
            </p>
            <a
              href={`${isCompleted}`}
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
      );
    }

    if (!selectedToken) {
      return (
        <div className='bg-white p-4 sm:p-8 rounded-xl shadow-sm border'>
          <TokenSearch onSelect={setSelectedToken} mode='own' />
        </div>
      );
    }

    if (!commitHash) {
      return (
        <div className='bg-white p-4 sm:p-8 rounded-xl shadow-sm border'>
          <TokenForm
            mode='create'
            initialTokenId={selectedToken.identifier}
            tokenName={selectedToken.name}
            tokenImage={selectedToken.imageUrl}
            description={selectedToken.description}
            website={selectedToken.website}
            social={selectedToken.social}
            onBack={() => setSelectedToken(null)}
            onPrepareSuccess={handlePrepareSuccess}
          />
        </div>
      );
    }

    return (
      <div className='bg-white p-4 sm:p-8 rounded-xl shadow-sm border'>
        <div className='space-y-4 sm:space-y-6'>
          <div className='p-3 sm:p-4 bg-slate-50 rounded-lg'>
            <p className='text-sm sm:text-base text-slate-600 mb-2'>
              Please sign this message to complete the branding process:
            </p>
            <code className='block bg-white p-2 sm:p-3 rounded border text-xs sm:text-sm break-all'>
              {commitHash}
            </code>
          </div>

          <SignMessage message={commitHash} onSignSuccess={handleSignSuccess} />
        </div>
      </div>
    );
  };

  const getStepTitle = () => {
    if (!selectedToken) return 'Select your token';
    if (!commitHash) return 'Fill in your token details';
    return 'Sign the branding request';
  };

  return (
    <PageWrapper>
      <div className='w-full max-w-3xl mx-auto space-y-6 sm:space-y-8 px-4 sm:px-6 py-8 sm:py-16'>
        <div className='text-center space-y-3 sm:space-y-4'>
          <h1 className='text-2xl sm:text-3xl font-bold'>
            Brand Your Own Token
          </h1>
          <p className='text-sm sm:text-base text-slate-600'>
            {getStepTitle()}
          </p>
        </div>

        {getStepContent()}
      </div>
    </PageWrapper>
  );
};
