// Environment Variables Diagnostic
// This file helps identify environment variable issues

const diagnostics = {
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  STRAPI_API_TOKEN: process.env.STRAPI_API_TOKEN ? 'SET' : 'NOT SET',
  NODE_ENV: process.env.NODE_ENV,
};

console.log('Environment Diagnostics:', diagnostics);

export default diagnostics;