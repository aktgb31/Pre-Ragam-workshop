function getUrl() {
    const temp = window.location.href.split('/');
    temp.pop();
    return temp.join('/');
}

document.getElementById('signup-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('signup-userName').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;

    const data = {
        name,
        email,
        password
    };
    console.log(data);

    fetch('http://localhost:3000/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then(res => res.json()).then(data => {
        console.log(data);
        if (data.status === 'success') {
            alert('Account created successfully');
            location.reload();
        }
        else {
            alert(data.message);
        }
    }).catch(err => {
        console.log(err);
        alert(err.message);
    });
});



document.getElementById('login-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    const data = {
        email,
        password
    };
    console.log(data);

    fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then(res => res.json()).then(data => {
        console.log(data);
        if (data.status === 'success') {
            window.location.assign(getUrl() + '/home');
        }
        else {
            alert(data.message);
        }
    }).catch(err => {
        console.log(err);
        alert('Invalid email or password');
    });
});

