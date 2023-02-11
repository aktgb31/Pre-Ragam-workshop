promise1 = () => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(console.log("Waited for 1 second"))
        }, 1000)
    });
};

promise2 = () => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(console.log("Waited for 2 seconds"))
        }, 2000)
    });
}

promise3 = () => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(console.log("Waited for 3 seconds"))
        }, 3000)
    });
}

promise3().then(promise2).then(promise1).then(() => {
    console.log("All promises resolved");
}).catch(() => {
    console.log("Promises rejected");
});

Promise.all([promise1(), promise2(), promise3()]).then(() => {
    console.log("All promises resolved");
}).catch(() => {
    console.log("Promises rejected");
});