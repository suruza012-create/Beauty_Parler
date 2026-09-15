# Deployment

## Backend

Deploy `server/` to Render, Railway, or another Node hosting provider.

Required environment variables:

- `MONGO_URI`: MongoDB Atlas connection string
- `JWT_SECRET`: long random secret
- `PORT`: provider port, usually supplied automatically
- `CLIENT_ORIGINS`: comma-separated public client and admin URLs
- `NODE_ENV=production`
- `PAYMENT_PROVIDER=manual` until a verified merchant gateway is configured
- `ADMIN_EMAIL`: initial admin email
- `ADMIN_PASSWORD`: strong initial admin password

Start command:

```bash
npm start
```

Add this script to `server/package.json` if the provider needs it:

```json
"start": "node server.js"
```

Health check: `/health`

## Client and Admin

Deploy `client/` and `admin/` separately with Vite. Set `VITE_API_URL` to the deployed API URL ending in `/api`.

Build command:

```bash
npm run build
```

## Payment

The API creates a pending payment record. Live bKash, Nagad, SSLCommerz, or card capture requires merchant credentials and provider webhook verification. Never mark a payment successful from the browser alone.
