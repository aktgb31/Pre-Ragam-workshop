getPromise = () => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(console.log('Hello World'))
        }, 5000)
    });
}

getPromise().then(() => {
    console.log('Promise resolved');
}).then(() => { console.log("Hi This is a Chain") }).catch(() => {
    console.log('Promise rejected');
});

console.log("Promise not resolved");