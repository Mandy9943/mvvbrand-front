import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
console.log(API_URL);

export interface TokenBrandingResponse {
  message: string;
  pullRequestUrl: string;
  commitHash: string;
  signature: string;
}

export interface TokenBrandingRequest {
  tokenId: string;
  tokenInfo: {
    website: string;
    description: string;
    social: Record<string, string>;
    status: 'active';
    priceSource: {
      type: 'dataApi';
    };
  };
  logoPng: File;
  logoSvg: File;
  creator: string;
}

interface BrandingStep1Response {
  commitHash: string;
}

export class ApiService {
  static async submitTokenBranding({
    tokenId,
    tokenInfo,
    logoPng,
    logoSvg,
    creator
  }: TokenBrandingRequest): Promise<TokenBrandingResponse> {
    const formData = new FormData();
    formData.append('tokenId', tokenId);
    formData.append('tokenInfo', JSON.stringify(tokenInfo));
    formData.append('logoPng', logoPng);
    formData.append('logoSvg', logoSvg);
    formData.append('creator', creator);

    const response = await axios.post<TokenBrandingResponse>(
      `${API_URL}/api/token-branding`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    );

    return response.data;
  }

  static async prepareTokenBranding(
    data: TokenBrandingRequest
  ): Promise<BrandingStep1Response> {
    const formData = new FormData();
    formData.append('tokenId', data.tokenId);
    formData.append('tokenInfo', JSON.stringify(data.tokenInfo));
    formData.append('logoPng', data.logoPng);
    formData.append('logoSvg', data.logoSvg);

    const response = await axios.post<BrandingStep1Response>(
      `${API_URL}/api/tokens/${data.tokenId}/branding/prepare`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    );

    return response.data;
  }

  static async completeTokenBranding(
    tokenId: string,
    data: { signature: string; commitHash: string }
  ): Promise<{
    pullRequestUrl: string;
  }> {
    const response = await axios.post(
      `${API_URL}/api/tokens/${tokenId}/branding/complete`,
      data,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data;
  }
}
