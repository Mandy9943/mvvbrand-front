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
import { useGetAccountInfo } from '@multiversx/sdk-dapp/hooks';
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
  onBrandingSuccess?: (response: { pullRequestUrl: string }) => void;
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
  onPrepareSuccess,
  onBrandingSuccess
}: TokenFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pngPreview, setPngPreview] = useState<string | null>(null);
  const [svgPreview, setSvgPreview] = useState<string | null>(null);

  const { address } = useGetAccountInfo();

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
        logoSvg: data.logoSvg,
        creator: address
      };

      if (mode === 'create') {
        const response = await ApiService.prepareTokenBranding(requestData);
        onPrepareSuccess?.(response, data.tokenId);
      } else {
        const response = await ApiService.submitTokenBranding(requestData);
        onBrandingSuccess?.(response);
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
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className='space-y-6 sm:space-y-8'
    >
      <Form {...form}>
        <div className='space-y-6 sm:space-y-8'>
          <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
            <Button
              type='button'
              variant='ghost'
              className='text-slate-600 hover:text-slate-900 self-start'
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
              <div className='text-left'>
                <h3 className='font-medium text-base sm:text-lg'>
                  {tokenName}
                </h3>
                <p className='text-xs sm:text-sm text-slate-500'>
                  {initialTokenId}
                </p>
              </div>
            </div>
          </div>

          <div className='h-px bg-slate-200' />

          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <FormField
              control={form.control}
              name='logoPng'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-sm sm:text-base'>
                    PNG Logo
                  </FormLabel>
                  <FormControl>
                    <div className='space-y-3'>
                      {pngPreview ? (
                        <div className='relative w-24 sm:w-32 h-24 sm:h-32 rounded-lg border overflow-hidden group'>
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
                            className='absolute inset-0 bg-black/50 text-white flex items-center justify-center 
                                     opacity-0 group-hover:opacity-100 transition-opacity'
                          >
                            <X className='h-5 sm:h-6 w-5 sm:w-6' />
                          </button>
                        </div>
                      ) : (
                        <div
                          className='w-24 sm:w-32 h-24 sm:h-32 rounded-lg border-2 border-dashed 
                                      flex items-center justify-center'
                        >
                          <ImageIcon className='h-6 sm:h-8 w-6 sm:w-8 text-gray-400' />
                        </div>
                      )}
                      <Input
                        id='png-input'
                        type='file'
                        accept='image/png'
                        onChange={(e) =>
                          handleFileChange(e, field, setPngPreview, 'png')
                        }
                        className={pngPreview ? 'hidden' : 'text-sm'}
                      />
                      {pngPreview && (
                        <Button
                          type='button'
                          variant='outline'
                          size='sm'
                          onClick={() =>
                            document.getElementById('png-input')?.click()
                          }
                          className='w-full sm:w-auto text-sm'
                        >
                          Change PNG
                        </Button>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage className='text-xs sm:text-sm' />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='logoSvg'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-sm sm:text-base'>
                    SVG Logo
                  </FormLabel>
                  <FormControl>
                    <div className='space-y-3'>
                      {svgPreview ? (
                        <div className='relative w-24 sm:w-32 h-24 sm:h-32 rounded-lg border overflow-hidden group'>
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
                            className='absolute inset-0 bg-black/50 text-white flex items-center justify-center 
                                     opacity-0 group-hover:opacity-100 transition-opacity'
                          >
                            <X className='h-5 sm:h-6 w-5 sm:w-6' />
                          </button>
                        </div>
                      ) : (
                        <div
                          className='w-24 sm:w-32 h-24 sm:h-32 rounded-lg border-2 border-dashed 
                                      flex items-center justify-center'
                        >
                          <ImageIcon className='h-6 sm:h-8 w-6 sm:w-8 text-gray-400' />
                        </div>
                      )}
                      <Input
                        id='svg-input'
                        type='file'
                        accept='image/svg+xml'
                        onChange={(e) =>
                          handleFileChange(e, field, setSvgPreview, 'svg')
                        }
                        className={svgPreview ? 'hidden' : 'text-sm'}
                      />
                      {svgPreview && (
                        <Button
                          type='button'
                          variant='outline'
                          size='sm'
                          onClick={() =>
                            document.getElementById('svg-input')?.click()
                          }
                          className='w-full sm:w-auto text-sm'
                        >
                          Change SVG
                        </Button>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage className='text-xs sm:text-sm' />
                </FormItem>
              )}
            />
          </div>

          <div className='space-y-6'>
            <FormField
              control={form.control}
              name='website'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-sm sm:text-base'>
                    Website
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder='https://...'
                      {...field}
                      className='text-sm sm:text-base p-2 sm:p-3'
                    />
                  </FormControl>
                  <FormMessage className='text-xs sm:text-sm' />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='description'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-sm sm:text-base'>
                    Description
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='Tell us about your token...'
                      className='min-h-[100px] text-sm sm:text-base p-2 sm:p-3'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className='text-xs sm:text-sm' />
                </FormItem>
              )}
            />

            <div className='space-y-4'>
              <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2'>
                <h3 className='text-base sm:text-lg font-medium'>
                  Social Links
                </h3>
                <Button
                  type='button'
                  variant='outline'
                  size='sm'
                  onClick={() => append({ platform: '', url: '' })}
                  className='w-full sm:w-auto'
                >
                  <Plus className='mr-2 h-4 w-4' />
                  Add Social
                </Button>
              </div>

              <div className='space-y-3'>
                {fields.map((field, index) => (
                  <div
                    key={field.id}
                    className='flex flex-col sm:flex-row gap-2 sm:gap-4'
                  >
                    <FormField
                      control={form.control}
                      name={`socials.${index}.platform`}
                      render={({ field }) => (
                        <FormItem className='flex-1'>
                          <FormControl>
                            <Input
                              placeholder='Platform (e.g., Twitter)'
                              {...field}
                              className='text-sm sm:text-base p-2 sm:p-3'
                            />
                          </FormControl>
                          <FormMessage className='text-xs sm:text-sm' />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`socials.${index}.url`}
                      render={({ field }) => (
                        <FormItem className='flex-1'>
                          <FormControl>
                            <Input
                              placeholder='URL'
                              {...field}
                              className='text-sm sm:text-base p-2 sm:p-3'
                            />
                          </FormControl>
                          <FormMessage className='text-xs sm:text-sm' />
                        </FormItem>
                      )}
                    />
                    <Button
                      type='button'
                      variant='destructive'
                      size='icon'
                      onClick={() => remove(index)}
                      className='self-start'
                    >
                      <Trash2 className='h-4 w-4' />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className='flex flex-col sm:flex-row justify-end gap-3 pt-4'>
            <Button
              type='submit'
              disabled={isSubmitting}
              className='w-full sm:w-auto order-2 sm:order-1'
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </Button>
          </div>
        </div>
      </Form>
    </form>
  );
}
