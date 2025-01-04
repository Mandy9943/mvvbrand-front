import { useGetSignMessageInfoStatus } from '@multiversx/sdk-dapp/hooks/signMessage/useGetSignedMessageStatus';

export const SignFailure = () => {
  const { errorMessage } = useGetSignMessageInfoStatus();

  return (
    <div className='flex flex-col'>
      <p>Message could not be signed</p>
      <p className='flex gap-1'>
        Reason: <span>{errorMessage ?? '-'}</span>
      </p>
    </div>
  );
};
