const faker = require('faker');
const tracer = require('./config/tracing').tracer;
const payment = require('./config/payment_client');

const randomCreditCard = () => faker.random.arrayElement([
    '4539500804082916',
    '5228863946709660',
    '371913267625163'
]);

setInterval(() => {

    const span = tracer.startSpan('requesting-authorization');
    const ctx = { span };
    payment.authorizeCreditCard(ctx, randomCreditCard(), 100)
        .then((authorization) => {
            const { status, approvalCode } = authorization;
            console.log(`::api:: authorization received ${approvalCode} - ${status}`);
        }).catch((err) => {
            console.warn(`::api:: error received`, err);
        }).finally(()=> {
            span.finish();
        });

}, 4000);
