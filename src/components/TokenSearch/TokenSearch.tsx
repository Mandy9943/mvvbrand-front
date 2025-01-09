import { Input } from '@/components/ui/input';
import { network } from '@/config';
import { useClickOutside } from '@/hooks/useClickOutside';
import { useDebounce } from '@/hooks/useDebounce';
import { useGetAccountInfo } from '@multiversx/sdk-dapp/hooks';
import axios, { AxiosResponse } from 'axios';
import { Search } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import useSWR from 'swr';

interface TokenSearchProps {
  onSelect: (token: {
    identifier: string;
    name: string;
    imageUrl?: string;
    description?: string;
    website?: string;
    social?: Record<string, string>;
  }) => void;
  mode?: 'memexchange' | 'own';
}

interface OwnToken {
  identifier: string;
  name: string;
  ticker: string;
  owner: string;
  decimals: number;
  isPaused: boolean;
  canUpgrade: boolean;
  canMint: boolean;
  canBurn: boolean;
  mexPairType?: string;
}

interface TokenDetails {
  identifier: string;
  owner: string;
  // ... other fields if needed
}

export function TokenSearch({
  onSelect,
  mode = 'memexchange'
}: TokenSearchProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [tokenError, setTokenError] = useState<string | null>(null);

  const { address } = useGetAccountInfo();
  const debouncedSearch = useDebounce(search, 300);

  const { data: mvxBrandingOwnerRes } = useSWR<
    AxiosResponse<{ owner: string }>
  >(`${import.meta.env.VITE_API_URL}/api/branding/owner`, axios.get);
  const mvxBrandingOwner = mvxBrandingOwnerRes?.data?.owner;

  useClickOutside(containerRef, () => setIsOpen(false));

  useEffect(() => {
    const searchTokens = async () => {
      if (!debouncedSearch && mode === 'memexchange') {
        setResults(null);
        return;
      }

      setLoading(true);
      try {
        let data;
        if (mode === 'memexchange') {
          const response = await fetch(
            `${
              import.meta.env.VITE_MEMEXCHANGE_API_URL
            }/api/bonding-pairs/search?query=${debouncedSearch}&state=Finished`
          );
          data = await response.json();
        } else {
          const response = await fetch(
            `${network.apiAddress}/accounts/${address}/tokens?type=FungibleESDT`
          );
          data = await response.json();
          data = data.filter((item: any) => item.owner === address);
        }

        if (mode === 'own') {
          // Filter tokens based on search if needed
          const filteredData = debouncedSearch
            ? data.filter(
                (token: OwnToken) =>
                  token.identifier
                    .toLowerCase()
                    .includes(debouncedSearch.toLowerCase()) ||
                  token.name
                    .toLowerCase()
                    .includes(debouncedSearch.toLowerCase())
              )
            : data;
          setResults({ items: filteredData });
        } else {
          setResults(data);
        }
        setIsOpen(true);
      } catch (error) {
        console.error('Failed to fetch tokens:', error);
        setResults(null);
      } finally {
        setLoading(false);
      }
    };

    searchTokens();
  }, [debouncedSearch, mode]);

  const handleSelect = async (token: any) => {
    if (mode === 'memexchange') {
      try {
        // Fetch token details from MultiversX API
        const response = await fetch(
          `${network.apiAddress}/tokens?identifiers=${token.firstToken}`
        );
        const [tokenDetails]: TokenDetails[] = await response.json();

        if (tokenDetails.owner !== mvxBrandingOwner) {
          setTokenError(
            'Invalid token ownership. Please report this to admin.'
          );
          setIsOpen(false); // Close the dropdown when showing error
          return;
        }

        setTokenError(null); // Clear any existing error
        onSelect({
          identifier: token.firstToken,
          name: token.coin.name,
          imageUrl: token.coin.imageUrl,
          description: token.coin.description,
          website: token.coin.website,
          social: token.coin.social
        });
        setIsOpen(false);
        setSearch(token.coin.name);
      } catch (error) {
        console.error('Failed to verify token ownership:', error);
        setTokenError('Failed to verify token. Please try again later.');
        setIsOpen(false); // Close the dropdown when showing error
      }
    } else {
      onSelect({
        identifier: token.identifier,
        name: token.name
      });
      setIsOpen(false);
      setSearch(token.name);
    }
  };

  return (
    <div className='relative w-full' ref={containerRef}>
      <div className='relative'>
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={
            mode === 'memexchange'
              ? 'Search for a token...'
              : 'Search your tokens...'
          }
          className='w-full h-10 sm:h-12 pl-10 text-base sm:text-lg rounded-lg'
        />
        <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 sm:h-5 w-4 sm:w-5 text-gray-400' />
      </div>

      {tokenError && (
        <div className='absolute z-50 w-full mt-1 sm:mt-2 bg-red-50 text-red-600 rounded-lg border border-red-200 p-3'>
          {tokenError}
        </div>
      )}

      {isOpen && (results?.items?.length || loading) ? (
        <div className='absolute z-50 w-full mt-1 sm:mt-2 bg-white rounded-lg border shadow-lg max-h-[60vh] sm:max-h-[300px] overflow-auto'>
          {loading ? (
            <div className='p-3 sm:p-4 text-center text-gray-500 text-sm sm:text-base'>
              Searching...
            </div>
          ) : (
            <div className='p-1 sm:p-2'>
              {results?.items.map((token: any) => (
                <button
                  key={
                    mode === 'memexchange' ? token.firstToken : token.identifier
                  }
                  onClick={() => handleSelect(token)}
                  className='w-full text-left p-2 sm:p-3 hover:bg-gray-50 rounded-md 
                           flex items-center gap-2 sm:gap-3 group transition-colors'
                >
                  <div className='flex items-center gap-2 sm:gap-3 flex-1 min-w-0'>
                    {mode === 'memexchange' && token.coin.imageUrl && (
                      <img
                        src={token.coin.imageUrl}
                        alt={token.coin.name}
                        className='w-6 h-6 sm:w-8 sm:h-8 rounded-full flex-shrink-0'
                      />
                    )}
                    <div className='flex flex-col min-w-0'>
                      <span className='font-medium text-sm sm:text-base group-hover:text-blue-600 truncate'>
                        {mode === 'memexchange' ? token.coin.name : token.name}
                      </span>
                      <span className='text-xs sm:text-sm text-gray-500 truncate'>
                        {mode === 'memexchange'
                          ? token.firstToken
                          : token.identifier}
                      </span>
                    </div>
                  </div>
                  {mode === 'memexchange' && token.creator === address && (
                    <span
                      className='text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full 
                                   whitespace-nowrap flex-shrink-0'
                    >
                      Creator
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      ) : isOpen && debouncedSearch ? (
        <div className='absolute z-50 w-full mt-1 sm:mt-2 bg-white rounded-lg border shadow-lg'>
          <div className='p-3 sm:p-4 text-center text-gray-500 text-sm sm:text-base'>
            No results found
          </div>
        </div>
      ) : null}
    </div>
  );
}
