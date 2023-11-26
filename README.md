# Next.js v14 E-commerce Starter Kit 💻

Ready to use [Next.js](https://nextjs.org) v14 (TypeScript) E-commerce Starter Kit

Free 👍. Ready to use 😎. Just clone & deploy! 🤘

## Online Demo ⚡️

[mars.demos.my-boundless.app](https://mars.demos.my-boundless.app/) - deployed to Netlify.

## About Boundless Commerce

![Boundless-commerce.com](assets/logo.svg)

[Boundless-commerce.com](https://boundless-commerce.com/) - API’s First Headless E-commerce CMS: We Provide An
Admin-Side For Store Management, Powerful API, And Ready-To-Use Checkout Area.

## Getting Started

1. Go to [Boundless-commerce.com](https://boundless-commerce.com/) and create a free account (no credit card required).
2. Go to "Control panel" -> "Settings" -> "Access tokens" and create a new one:

![](assets/settings-menu.png)
![](assets/create-access-token-btn.png)

3. Copy `.env.example` to `.env.local`
4. Modify `.env.local`: put values for the `NEXT_PUBLIC_BOUNDLESS_API_PERMANENT_TOKEN` and `NEXT_PUBLIC_BOUNDLESS_INSTANCE_ID`, copy values from:

![](assets/copy-credentials.png)

If you want to use Stripe, put values for `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_SECRET_KEY` and `BOUNDLESS_MANAGEMENT_TOKEN`.

`BOUNDLESS_MANAGEMENT_TOKEN` it is token like `NEXT_PUBLIC_BOUNDLESS_API_PERMANENT_TOKEN`, but management rights should be enabled. 

5. Install dependencies: `npm install`
6. `npm run dev` - to start locally, then open `http://localhost:3000`
7. If you want Next.js cache to be validated - setup web hook in the Boundless Admin: "Control panel" -> "Settings" -> "Web hooks",
the hook url: `http://localhost:3000/api/on-update-hook`. Put a secret key and specify it as an ENV variable: `WEBHOOK_SIGN_KEY`

---

[NextJS eCommerce templates](https://boundless-commerce.com/templates) - Free. Ready to use. Just clone & deploy!
