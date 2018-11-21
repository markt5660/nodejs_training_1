
// Create a promis which is already resolved
const pResolved = Promise.resolve({ id: 1 });
pResolved.then(result => console.log(result));

// Create a promise which is already rejected
const pRejected = Promise.reject(new Error('failed'));
pRejected.catch(err => console.log(err));

// Parallel promises
const p1 = new Promise((resolve) => {
    setTimeout(() => {
        console.log('Async oper 1...');
        resolve(1);
    }, 2000);
});

const p2 = new Promise((resolve) => {
    setTimeout(() => {
        console.log('Async oper 2...');
        resolve(2);
    }, 2000);
});

// Promise.all => all promises have to fulfill
// PRomise.race => the first promise to complete
Promise.race([p1, p2])
    .then(result => console.log(result))
    .catch(error => console.log('Error', error.message));