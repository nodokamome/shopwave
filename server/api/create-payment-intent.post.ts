import Stripe from 'stripe'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)

  if (!config.stripeSecretKey) {
    throw createError({ statusCode: 500, statusMessage: 'Stripe secret key is not configured' })
  }

  const body = await readBody<{ amount: number }>(event)

  if (typeof body?.amount !== 'number' || body.amount <= 0) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid amount' })
  }

  const stripe = new Stripe(config.stripeSecretKey)

  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(body.amount * 100), // ドル → セント
    currency: 'usd',
    automatic_payment_methods: { enabled: true },
  })

  return { clientSecret: paymentIntent.client_secret }
})
