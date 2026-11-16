# Live Deployment Checklist

## 1) Backend (Render / Railway / VPS)

1. Open your hosting provider.
2. Create a Node.js web service.
3. Set the root directory to `server`.
4. Use build command:
   ```bash
   npm install
   ```
5. Use start command:
   ```bash
   npm start
   ```
6. Add these environment variables:
   ```env
   MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/beauty_parlour
   JWT_SECRET=replace_with_long_random_secret
   PORT=10000
   NODE_ENV=production
   CLIENT_ORIGINS=https://your-client-domain.com,https://your-admin-domain.com
   ADMIN_EMAIL=admin@example.com
   ADMIN_PASSWORD=StrongPassword123!
   PAYMENT_PROVIDER=manual
   ```
7. Verify: `https://your-backend-domain/health` returns HTTP 200.

## 2) Client Site (Vercel / Netlify)

1. Import the `client` folder.
2. Set build command:
   ```bash
   npm install
   npm run build
   ```
3. Set publish directory:
   ```bash
   dist
   ```
4. Add environment variable:
   ```env
   VITE_API_URL=https://your-backend-domain/api
   ```
5. Deploy.

## 3) Admin Site (Vercel / Netlify)

1. Import the `admin` folder.
2. Set build command:
   ```bash
   npm install
   npm run build
   ```
3. Set publish directory:
   ```bash
   dist
   ```
4. Add environment variable:
   ```env
   VITE_API_URL=https://your-backend-domain/api
   ```
5. Deploy.

## 4) Final Checks

- Client opens and loads home page
- Admin login works
- User registration/login works
- Booking flow works
- Dashboard loads notifications
- `/health` returns success
- Protected routes return 401 without token

## 5) Payment Setup

- Do not enable live payment before merchant credentials are ready
- Use `PAYMENT_PROVIDER=manual` until a verified gateway is configured
- Final payment confirmation must happen in the backend, not only in the browser
