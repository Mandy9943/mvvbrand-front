export const LOGO_REQUIREMENTS = {
  maxSizeKb: 100,
  dimensions: {
    width: 200,
    height: 200
  }
};

export async function validateLogo(
  file: File,
  type: 'svg' | 'png'
): Promise<string[]> {
  const errors: string[] = [];

  // Basic file validation
  if (!file) {
    errors.push('No file provided');
    return errors;
  }

  // Check file size (100kb max)
  const fileSizeKb = file.size / 1024;
  if (fileSizeKb > LOGO_REQUIREMENTS.maxSizeKb) {
    errors.push(
      `File size must be under ${
        LOGO_REQUIREMENTS.maxSizeKb
      }KB (current: ${Math.round(fileSizeKb)}KB)`
    );
  }

  try {
    if (type === 'png') {
      const imageValidation = await validatePngImage(file);
      errors.push(...imageValidation);
    } else {
      const svgValidation = await validateSvgFormat(file);
      errors.push(...svgValidation);
    }
  } catch (error: any) {
    errors.push(
      `Failed to validate ${type.toUpperCase()} file: ${error?.message}`
    );
  }

  return errors;
}

async function validatePngImage(file: File): Promise<string[]> {
  const errors: string[] = [];

  return new Promise((resolve) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);

      // Check dimensions
      if (
        img.width !== LOGO_REQUIREMENTS.dimensions.width ||
        img.height !== LOGO_REQUIREMENTS.dimensions.height
      ) {
        errors.push(
          `PNG must be exactly ${LOGO_REQUIREMENTS.dimensions.width}x${LOGO_REQUIREMENTS.dimensions.height} pixels`
        );
      }

      // Create canvas to check transparency
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');

      if (ctx) {
        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const hasTransparency = checkTransparency(imageData);

        if (!hasTransparency) {
          errors.push('PNG must have transparent background');
        }
      }

      resolve(errors);
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      errors.push('Invalid PNG file');
      resolve(errors);
    };

    img.src = objectUrl;
  });
}

async function validateSvgFormat(file: File): Promise<string[]> {
  const errors: string[] = [];

  try {
    const text = await file.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(text, 'image/svg+xml');

    // Check for parsing errors
    const parserError = doc.querySelector('parsererror');
    if (parserError) {
      errors.push('Invalid SVG format');
      return errors;
    }

    // Check viewBox aspect ratio
    const svg = doc.querySelector('svg');
    if (svg) {
      const viewBox = svg.getAttribute('viewBox');
      if (viewBox) {
        const [, , width, height] = viewBox.split(' ').map(Number);
        if (width !== height) {
          errors.push('SVG must have square format (equal width and height)');
        }
      }
    }
  } catch (error) {
    errors.push('Failed to validate SVG file');
  }

  return errors;
}

function checkTransparency(imageData: ImageData): boolean {
  const data = imageData.data;
  for (let i = 3; i < data.length; i += 4) {
    if (data[i] < 255) {
      return true; // Found at least one transparent pixel
    }
  }
  return false;
}
