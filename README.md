# SnapWord Frontend

Vue 3 + Vite frontend for the SnapWord project.

## Features

- Upload or capture an image
- Send the image to the FastAPI backend for recognition
- Show the recognized result
- Save recognized words to the logged-in user's account
- Review and learn words per account

## Development

Install dependencies:

```powershell
npm install
```

Start the frontend:

```powershell
npm run dev
```

By default, the Vite dev server proxies `/api/*` requests to:

```text
http://127.0.0.1:8000
```

If your backend uses a different address, set this environment variable before starting Vite:

```powershell
$env:VITE_API_PROXY_TARGET='http://127.0.0.1:8000'
```

## Production API URL

If you want the frontend to call a deployed backend directly, set:

```powershell
$env:VITE_API_BASE_URL='https://your-backend-domain.com'
```

Then build the frontend:

```powershell
npm run build
```

## Main Pages

- `/` home
- `/camera` camera capture
- `/result` recognition result
- `/learn` learning page
- `/review` review page
- `/profile` login/profile
