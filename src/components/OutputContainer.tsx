import { WithClassnameType } from '@/types';
import { Loader } from '@multiversx/sdk-dapp/UI/Loader/Loader';
import classNames from 'classnames';
import type { PropsWithChildren } from 'react';

interface OutputContainerPropsType
  extends PropsWithChildren,
    WithClassnameType {
  isLoading?: boolean;
}

export const OutputContainer = (props: OutputContainerPropsType) => {
  const { children, isLoading = false, className = 'p-4' } = props;

  return (
    <div
      className={classNames(
        'text-sm border border-gray-200 rounded overflow-auto',
        className
      )}
      data-testid={props['data-testid']}
    >
      {isLoading ? <Loader /> : children}
    </div>
  );
};
