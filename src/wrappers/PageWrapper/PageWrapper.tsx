import type { PropsWithChildren } from 'react';

export const PageWrapper = ({ children }: PropsWithChildren) => {
  return (
    <div className='flex flex-1 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 p-8 sm:p-12 items-center justify-center'>
      {children}
    </div>
  );
};
