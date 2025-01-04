import { z } from 'zod';

export const tokenFormSchema = z.object({
  tokenId: z.string(),
  logoPng: z.instanceof(File).nullable(),
  logoSvg: z.instanceof(File).nullable(),
  website: z.string().url(),
  description: z.string().min(10).max(500),
  socials: z.array(
    z.object({
      platform: z.string(),
      url: z.string().url()
    })
  )
});

export type TokenFormValues = z.infer<typeof tokenFormSchema>;
