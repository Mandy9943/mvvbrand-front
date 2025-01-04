import { TokenForm } from '@/components/TokenForm/TokenForm';
import { TokenSearch } from '@/components/TokenSearch/TokenSearch';
import { PageWrapper } from '@/wrappers';
import { useState } from 'react';

interface SelectedToken {
  identifier: string;
  name: string;
  imageUrl?: string;
  description?: string;
  website?: string;
  social?: Record<string, string>;
}

export const BrandToken = () => {
  const [selectedToken, setSelectedToken] = useState<SelectedToken | null>(
    null
  );

  return (
    <PageWrapper>
      <div className='w-full max-w-3xl mx-auto space-y-8'>
        <div className='text-center space-y-4'>
          <img
            src='/mxc-logo.webp'
            alt='MemeXchange Logo'
            className='h-12 mx-auto mb-4'
          />
          <h1 className='text-3xl font-bold'>Brand Your MemeXchange Token</h1>
          <p className='text-slate-600'>
            Search for your token and customize its branding
          </p>
        </div>

        {!selectedToken ? (
          <div className='bg-white p-8 rounded-xl shadow-sm border'>
            <TokenSearch onSelect={setSelectedToken} />
          </div>
        ) : (
          <div className='bg-white p-8 rounded-xl shadow-sm border'>
            <TokenForm
              mode='edit'
              initialTokenId={selectedToken.identifier}
              tokenName={selectedToken.name}
              tokenImage={selectedToken.imageUrl}
              description={selectedToken.description}
              website={selectedToken.website}
              social={selectedToken.social}
              onBack={() => setSelectedToken(null)}
            />
          </div>
        )}
      </div>
    </PageWrapper>
  );
};
