import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { faFileSignature } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useSignMessage } from '@multiversx/sdk-dapp/hooks/signMessage/useSignMessage';

interface SignMessageProps {
  onSignSuccess: (signature: string) => void;
  message: string;
}

export const SignMessage = ({ onSignSuccess, message }: SignMessageProps) => {
  const { toast } = useToast();
  const { signMessage } = useSignMessage();

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!message.trim()) {
      return;
    }

    const res = await signMessage({
      message
    });

    if (!res?.signature) {
      toast({
        title: 'Error',
        description: 'Failed to sign message',
        variant: 'destructive'
      });
      return;
    }

    const signature = Buffer.from(res?.signature ?? '').toString('hex');

    onSignSuccess(signature);
  };

  return (
    <div className='flex flex-col gap-6'>
      <div className='flex gap-2 items-start'>
        <Button
          data-testid='signMsgBtn'
          onClick={handleSubmit}
          disabled={!message}
        >
          <FontAwesomeIcon icon={faFileSignature} className='mr-1' />
          Sign
        </Button>
      </div>
    </div>
  );
};
