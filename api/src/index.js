const authorizeCreditCard = require('./config').authorizeCreditCard;
const faker = require('faker');

const randomCreditCard = () => faker.random.arrayElement([
    "4539500804082916",
    "5228863946709660",
    "371913267625163"
]);
let amount = 20;

setInterval(() => {
    amount += 20;
    authorizeCreditCard(randomCreditCard(), amount);
}, 4000);