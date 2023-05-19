const express = require('express');
require('dotenv').config();
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIP_PRIVATE_KEY)
const port = 4000;
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
stripe.customers
    .create({
        email: process.env.AUTH_EMAIL,
    })
    .then((customer) => console.log(customer.id))
    .catch((error) => console.error(error));
app.get('/', (req, res) => res.sendFile(__dirname + '/index.html'));
app.post('/create-checkout-session', async (req, res) => {
    const session = await stripe.checkout.sessions.create({
        line_items: [
            {
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: 'T-shirt',
                    },
                    unit_amount: 2000,
                },
                quantity: 1,
            },
        ],
        mode: 'payment',
        success_url: 'http://localhost:4000/success',
        cancel_url: 'http://localhost:4000/cancel',
    });
    return res.redirect(303, session.url);
});

app.get("/success", (req, res) => {
    return res.status(200).json({
        message: "Success"
    })
})
app.get("/cancel", (req, res) => {
    return res.status(400).json({
        message: "Cancel"
    })
})
app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`);
}).on('error', (err) => {
    console.log(err);
});
