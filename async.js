function wait(ms) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(console.log("Wait finished"))
        }, ms)
    });
}

async function hello() {
    console.log("waiting for 5 seconds")
    await wait(5000);

    console.log("waiting for 2 seconds")
    await wait(2000);

    await Promise.all([wait(1000), wait(2000), wait(3000)]);

    console.log('Hello World');
}

hello();
