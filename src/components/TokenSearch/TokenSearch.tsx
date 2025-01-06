import { Input } from '@/components/ui/input';
import { network } from '@/config';
import { useClickOutside } from '@/hooks/useClickOutside';
import { useDebounce } from '@/hooks/useDebounce';
import { useGetAccountInfo } from '@multiversx/sdk-dapp/hooks';
import { Search } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

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

export function TokenSearch({
  onSelect,
  mode = 'memexchange'
}: TokenSearchProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const { address } = useGetAccountInfo();
  const debouncedSearch = useDebounce(search, 300);

  useClickOutside(containerRef, () => setIsOpen(false));

  useEffect(() => {
    const searchTokens = async () => {
      if (!debouncedSearch && mode === 'memexchange') {
        setResults(null);
        return;
      }

      setLoading(true);
      try {
        let response;
        if (mode === 'memexchange') {
          response = await fetch(
            `${
              import.meta.env.VITE_MEMEXCHANGE_API_URL
            }/api/bonding-pairs/search?query=${debouncedSearch}`
          );
        } else {
          response = await fetch(
            `${network.apiAddress}/accounts/${address}/tokens`
          );
        }
        const data = await response.json();

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

  const handleSelect = (token: any) => {
    if (mode === 'memexchange') {
      onSelect({
        identifier: token.firstToken,
        name: token.coin.name,
        imageUrl: token.coin.imageUrl,
        description: token.coin.description,
        website: token.coin.website,
        social: token.coin.social
      });
    } else {
      onSelect({
        identifier: token.identifier,
        name: token.name
      });
    }
    setIsOpen(false);
    setSearch(mode === 'memexchange' ? token.coin.name : token.name);
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
          className='w-full h-12 pl-10 text-lg'
        />
        <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400' />
      </div>

      {isOpen && (results?.items?.length || loading) ? (
        <div className='absolute z-50 w-full mt-1 bg-white rounded-lg border shadow-lg max-h-[300px] overflow-auto'>
          {loading ? (
            <div className='p-4 text-center text-gray-500'>Searching...</div>
          ) : (
            <div className='p-2'>
              {results?.items.map((token: any) => (
                <button
                  key={
                    mode === 'memexchange' ? token.firstToken : token.identifier
                  }
                  onClick={() => handleSelect(token)}
                  className='w-full text-left p-3 hover:bg-gray-50 rounded-md flex items-center gap-3 group'
                >
                  <div className='flex items-center gap-3 flex-1'>
                    {mode === 'memexchange' && token.coin.imageUrl && (
                      <img
                        src={token.coin.imageUrl}
                        alt={token.coin.name}
                        className='w-8 h-8 rounded-full'
                      />
                    )}
                    <div className='flex flex-col'>
                      <span className='font-medium group-hover:text-blue-600'>
                        {mode === 'memexchange' ? token.coin.name : token.name}
                      </span>
                      <span className='text-sm text-gray-500'>
                        {mode === 'memexchange'
                          ? token.firstToken
                          : token.identifier}
                      </span>
                    </div>
                  </div>
                  {mode === 'memexchange' && token.creator === address && (
                    <span className='text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full'>
                      Creator
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
