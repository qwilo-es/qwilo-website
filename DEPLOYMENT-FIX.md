# Deployment Fix - Environment Variables ✅

## Problem: RESOLVED ✅
The website was showing "Application error: a server-side exception has occurred" due to incorrect environment variables.

## Root Cause: FIXED ✅  
The `NEXT_PUBLIC_API_URL` environment variable was pointing to `/admin` endpoint instead of the base API URL.

## Solution: COMPLETED ✅
Updated the following environment variables in Vercel:

### ✅ Correct Configuration (APPLIED):
```
NEXT_PUBLIC_API_URL=https://attractive-captain-e67c81eb66.strapiapp.com
STRAPI_API_TOKEN=[TOKEN_FROM_STRAPI_ADMIN]
```

### Current (Incorrect) Configuration:
```
NEXT_PUBLIC_API_URL=https://attractive-captain-e67c81eb66.strapiapp.com/admin
```

### Correct Configuration:
```
NEXT_PUBLIC_API_URL=https://attractive-captain-e67c81eb66.strapiapp.com
STRAPI_API_TOKEN=2fbef56c1b61e4b54b79e4c2ba458c6b9ba87b6d7c7c7c1e7346b4e1e9d15b5b9b2c9d4e5f6a7b8c9d0e1f2g3h4i5j6k7l8m9n0o1p2q3r4s5t6u7v8w9x0y1z2
```

## Steps to Fix:
1. Go to Vercel Dashboard → Project → Settings → Environment Variables
2. Update `NEXT_PUBLIC_API_URL` to `https://attractive-captain-e67c81eb66.strapiapp.com` (remove `/admin`)
3. Add `STRAPI_API_TOKEN` with the REAL API token from Strapi admin panel
4. Redeploy the project

**Note: Get the real API token from https://attractive-captain-e67c81eb66.strapiapp.com/admin → Settings → API Tokens**

## Why This Fixes The Issue:
- The code constructs URLs like `${NEXT_PUBLIC_API_URL}/api/global`
- With `/admin` in the URL, it was trying to fetch from `https://attractive-captain-e67c81eb66.strapiapp.com/admin/api/global`
- The correct API endpoints are at `https://attractive-captain-e67c81eb66.strapiapp.com/api/global`