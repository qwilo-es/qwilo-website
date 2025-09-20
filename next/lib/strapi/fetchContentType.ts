import { draftMode } from 'next/headers';
import qs from 'qs';

/**
 * Fetches data for a specified Strapi content type.
 *
 * @param {string} contentType - The type of content to fetch from Strapi.
 * @param {string} params - Query parameters to append to the API request.
 * @return {Promise<object>} The fetched data.
 */

interface StrapiData {
  id: number;
  [key: string]: any; // Allow for any additional fields
}

interface StrapiResponse {
  data: StrapiData | StrapiData[];
}

export function spreadStrapiData(data: StrapiResponse): StrapiData | null {
  if (Array.isArray(data.data) && data.data.length > 0) {
    return data.data[0];
  }
  if (!Array.isArray(data.data)) {
    return data.data;
  }
  return null;
}

export default async function fetchContentType(
  contentType: string,
  params: Record<string, unknown> = {},
  spreadData?: boolean
): Promise<any> {
  let isDraftMode = false;
  
  try {
    const draftModeResult = await draftMode();
    isDraftMode = draftModeResult.isEnabled;
  } catch (error) {
    console.log('Draft mode not available, defaulting to false:', error);
    isDraftMode = false;
  }

  try {
    // Debug environment variables
    console.log('Environment check:', {
      API_URL: process.env.NEXT_PUBLIC_API_URL,
      HAS_TOKEN: !!process.env.STRAPI_API_TOKEN,
      CONTENT_TYPE: contentType,
      DRAFT_MODE: isDraftMode
    });

    // Check if API URL is configured
    if (!process.env.NEXT_PUBLIC_API_URL) {
      console.error('NEXT_PUBLIC_API_URL is not configured');
      return spreadData ? null : { data: [] };
    }

    const queryParams = { ...params };

    if (isDraftMode) {
      queryParams.status = 'draft';
    }

    // Construct the full URL for the API request
    const url = new URL(`api/${contentType}`, process.env.NEXT_PUBLIC_API_URL);
    console.log('Fetching from URL:', url.toString());

    // Perform the fetch request with the provided query parameters
    const headers: Record<string, string> = {
      'strapi-encode-source-maps': isDraftMode ? 'true' : 'false',
    };

    // Only add Authorization header if token is available
    if (process.env.STRAPI_API_TOKEN) {
      headers['Authorization'] = `Bearer ${process.env.STRAPI_API_TOKEN}`;
    } else {
      console.log('No STRAPI_API_TOKEN found, making public API request');
    }

    const response = await fetch(`${url.href}?${qs.stringify(queryParams)}`, {
      method: 'GET',
      cache: 'no-store',
      headers,
    });

    if (!response.ok) {
      console.error(
        `Failed to fetch data from Strapi (url=${url.toString()}, status=${response.status})`
      );
      // Return appropriate fallback based on expected data structure
      return spreadData ? null : { data: [] };
    }
    const jsonData: StrapiResponse = await response.json();
    return spreadData ? spreadStrapiData(jsonData) : jsonData;
  } catch (error) {
    // Log any errors that occur during the fetch process
    console.error('FetchContentTypeError', error);
    // Return appropriate fallback based on expected data structure
    return spreadData ? null : { data: [] };
  }
}
