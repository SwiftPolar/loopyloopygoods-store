# Running Locally

1. Make sure you have stripe API webhooks setup, need to forward stripe localhost
   a. https://dashboard.stripe.com/acct_1SuCA1CdsN0lbrhg/test/workbench/webhooks Click on "Set up local listener"
   b. You must have stripe CLI installed.
   c. point to localhost:9000/hooks/payment/stripe_stripe

# Brand New Deployment

## Build

[Build it correctly](https://docs.medusajs.com/learn/build)

1. npx medusa db:migrate
2. NODE_ENV=production npm run build
3. cd .medusa/server && pnpm install
4. cp ../../.env ./

## Create Admin User

npx medusa user -e admin@example.com -p supersecret

## Admin Setup

1. Go to /app/login
2. Modify currency (add SGD, set SGD as default, delete Euro).
3. Create Region
4. Copy payload API key to .env file
5. Setup stripe webhook (via stripe dashboard) -> copy signing secret edit .env
6. Setup stripe API key
7. Create new sales channel, delete old sales channel. set new sales channel as default.
