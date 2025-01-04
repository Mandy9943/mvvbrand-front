import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { TokenFormValues, tokenFormSchema } from '@/lib/schemas';
import { validateLogo } from '@/lib/validators/logo';
import { ApiService } from '@/services/api.service';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, ImageIcon, Plus, Trash2, X } from 'lucide-react';
import { useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';

interface TokenFormProps {
  mode: 'edit' | 'create';
  initialTokenId?: string;
  tokenName?: string;
  tokenImage?: string;
  description?: string;
  website?: string;
  social?: Record<string, string>;
  onBack?: () => void;
  onPrepareSuccess?: (
    response: { commitHash: string },
    tokenId: string
  ) => void;
}

export function TokenForm({
  mode = 'edit',
  initialTokenId,
  tokenName,
  tokenImage,
  description,
  website,
  social,
  onBack,
  onPrepareSuccess
}: TokenFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pngPreview, setPngPreview] = useState<string | null>(null);
  const [svgPreview, setSvgPreview] = useState<string | null>(null);

  const form = useForm<TokenFormValues>({
    resolver: zodResolver(tokenFormSchema),
    defaultValues: {
      tokenId: initialTokenId,
      description: description || '',
      website: website || '',
      // Transform social object to array format
      socials: social
        ? Object.entries(social).map(([platform, url]) => ({
            platform,
            url
          }))
        : []
    }
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'socials'
  });

  async function onSubmit(data: TokenFormValues) {
    try {
      setIsSubmitting(true);

      if (!data.logoPng || !data.logoSvg) {
        toast({
          title: 'Error',
          description: 'Both PNG and SVG logos are required',
          variant: 'destructive'
        });
        return;
      }

      const requestData = {
        tokenId: data.tokenId,
        tokenInfo: {
          website: data.website,
          description: data.description,
          social: data.socials.reduce(
            (acc, { platform, url }) => ({
              ...acc,
              [platform.toLowerCase()]: url
            }),
            {}
          ),
          status: 'active' as const,
          priceSource: { type: 'dataApi' as const }
        },
        logoPng: data.logoPng,
        logoSvg: data.logoSvg
      };

      if (mode === 'create') {
        const response = await ApiService.prepareTokenBranding(requestData);
        onPrepareSuccess?.(response, data.tokenId);
      } else {
        const response = await ApiService.submitTokenBranding(requestData);
        toast({
          title: 'Success',
          description: `Pull request created: ${response.pullRequestUrl}`
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error',
        description: 'Failed to submit token branding',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    field: any,
    setPreview: (value: string | null) => void,
    fileType: 'svg' | 'png'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const validationErrors = await validateLogo(file, fileType);

      if (validationErrors.length > 0) {
        // Clear the file input
        e.target.value = '';
        field.onChange(null);
        setPreview(null);

        // Show all validation errors
        toast({
          title: `Invalid ${fileType.toUpperCase()} File`,
          description: (
            <ul className='list-disc pl-4'>
              {validationErrors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          ),
          variant: 'destructive',
          duration: 5000 // Show for 5 seconds
        });
        return;
      }

      // Valid file - update form and preview
      field.onChange(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setPreview(event.target.result as string);
        }
      };
      reader.onerror = () => {
        toast({
          title: 'Error',
          description: 'Failed to read file',
          variant: 'destructive'
        });
      };
      reader.readAsDataURL(file);
    } catch (error: any) {
      console.error('File handling error:', error);
      toast({
        title: 'Error',
        description: `Failed to process the ${fileType.toUpperCase()} file: ${
          error.message
        }`,
        variant: 'destructive'
      });
      // Clear the invalid file
      e.target.value = '';
      field.onChange(null);
      setPreview(null);
    }
  };

  const clearFile = (
    field: any,
    setPreview: (value: string | null) => void,
    inputId: string
  ) => {
    field.onChange(null);
    setPreview(null);
    // Reset the file input value
    const fileInput = document.getElementById(inputId) as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  return (
    <Form {...form}>
      <div className='mb-8 space-y-6'>
        <div className='flex items-center justify-between'>
          <Button
            type='button'
            variant='ghost'
            className='text-slate-600 hover:text-slate-900'
            onClick={onBack}
          >
            <ArrowLeft className='mr-2 h-4 w-4' />
            Change Token
          </Button>
          <div className='flex items-center gap-3'>
            {tokenImage && (
              <img
                src={tokenImage}
                alt={tokenName}
                className='w-8 h-8 rounded-full'
              />
            )}
            <div className='text-right'>
              <h3 className='font-medium'>{tokenName}</h3>
              <p className='text-sm text-slate-500'>{initialTokenId}</p>
            </div>
          </div>
        </div>
        <div className='h-px bg-slate-200' />
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <FormField
            control={form.control}
            name='logoPng'
            render={({ field }) => (
              <FormItem>
                <FormLabel>PNG Logo</FormLabel>
                <FormControl>
                  <div className='space-y-2'>
                    {pngPreview ? (
                      <div className='relative w-32 h-32 rounded-lg border overflow-hidden group'>
                        <img
                          src={pngPreview}
                          alt='PNG Preview'
                          className='w-full h-full object-contain'
                        />
                        <button
                          type='button'
                          onClick={() =>
                            clearFile(field, setPngPreview, 'png-input')
                          }
                          className='absolute inset-0 bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity'
                        >
                          <X className='h-6 w-6' />
                        </button>
                      </div>
                    ) : (
                      <div className='w-32 h-32 rounded-lg border-2 border-dashed flex items-center justify-center'>
                        <ImageIcon className='h-8 w-8 text-gray-400' />
                      </div>
                    )}
                    <Input
                      id='png-input'
                      type='file'
                      accept='image/png'
                      onChange={(e) =>
                        handleFileChange(e, field, setPngPreview, 'png')
                      }
                      className={pngPreview ? 'hidden' : ''}
                    />
                    {pngPreview && (
                      <Button
                        type='button'
                        variant='outline'
                        size='sm'
                        onClick={() =>
                          document.getElementById('png-input')?.click()
                        }
                      >
                        Change PNG
                      </Button>
                    )}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='logoSvg'
            render={({ field }) => (
              <FormItem>
                <FormLabel>SVG Logo</FormLabel>
                <FormControl>
                  <div className='space-y-2'>
                    {svgPreview ? (
                      <div className='relative w-32 h-32 rounded-lg border overflow-hidden group'>
                        <img
                          src={svgPreview}
                          alt='SVG Preview'
                          className='w-full h-full object-contain'
                        />
                        <button
                          type='button'
                          onClick={() =>
                            clearFile(field, setSvgPreview, 'svg-input')
                          }
                          className='absolute inset-0 bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity'
                        >
                          <X className='h-6 w-6' />
                        </button>
                      </div>
                    ) : (
                      <div className='w-32 h-32 rounded-lg border-2 border-dashed flex items-center justify-center'>
                        <ImageIcon className='h-8 w-8 text-gray-400' />
                      </div>
                    )}
                    <Input
                      id='svg-input'
                      type='file'
                      accept='image/svg+xml'
                      onChange={(e) =>
                        handleFileChange(e, field, setSvgPreview, 'svg')
                      }
                      className={svgPreview ? 'hidden' : ''}
                    />
                    {svgPreview && (
                      <Button
                        type='button'
                        variant='outline'
                        size='sm'
                        onClick={() =>
                          document.getElementById('svg-input')?.click()
                        }
                      >
                        Change SVG
                      </Button>
                    )}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name='website'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Website</FormLabel>
              <FormControl>
                <Input placeholder='https://...' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='description'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder='Tell us about your token...'
                  className='min-h-[100px]'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className='space-y-4'>
          <div className='flex items-center justify-between'>
            <h3 className='text-lg font-medium'>Social Links</h3>
            <Button
              type='button'
              variant='outline'
              size='sm'
              onClick={() => append({ platform: '', url: '' })}
            >
              <Plus className='mr-2 h-4 w-4' />
              Add Social
            </Button>
          </div>

          <div className='space-y-4'>
            {fields.map((field, index) => (
              <div key={field.id} className='flex gap-4 items-start'>
                <FormField
                  control={form.control}
                  name={`socials.${index}.platform`}
                  render={({ field }) => (
                    <FormItem className='flex-1'>
                      <FormControl>
                        <Input
                          placeholder='Platform (e.g., Twitter)'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`socials.${index}.url`}
                  render={({ field }) => (
                    <FormItem className='flex-1'>
                      <FormControl>
                        <Input placeholder='URL' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type='button'
                  variant='destructive'
                  size='icon'
                  className='mt-1'
                  onClick={() => remove(index)}
                >
                  <Trash2 className='h-4 w-4' />
                </Button>
              </div>
            ))}
          </div>
        </div>

        <div className='flex justify-end'>
          <Button type='submit' disabled={isSubmitting} size='lg'>
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
