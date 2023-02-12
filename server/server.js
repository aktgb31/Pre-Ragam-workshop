// ___________ creating server ____________________________
const express = require("express");
const app = express(); // it will create a instance of express server (in our case it is app)

app.use(express.urlencoded({ extended: true })); // it will parse the url
app.use(express.static("public")); // it will make the public folder as static folder

// ___________ connecting server to database ________________
const Sequelize = require("sequelize");

const sequelize = new Sequelize("pre_ragam", "root", "31233123", {
    host: "localhost",
    dialect: "mysql",
});

sequelize
    .authenticate()
    .then(() => {
        console.log("done");
    })
    .catch(() => {
        console.log("error");
    });


// _________________define models_____________________

const User = sequelize.define("user", {
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true,
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false,
    }
});

const Product = sequelize.define("product", {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    description: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    cost: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    image: {
        type: Sequelize.STRING,
        allowNull: true
    }
});

const CartItem = sequelize.define("cartItem", {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
    },
});

User.hasMany(CartItem);
Product.hasMany(CartItem);

sequelize.sync({ force: true }).then(() => {
    console.log("databases synced !");

    Product.create({
        id: 1,
        name: "product 1",
        description: "this is the product 1",
        cost: 5000
    });

    Product.bulkCreate([
        {
            id: 2,
            name: "prduct 2",
            description: "this is product 2",
            cost: 4000
        }, {
            id: 3,
            name: "product 3",
            description: "this is a new brand mobile phone ",
            cost: 40000
        }
    ])

});

// ___________ making route for server __________________

// making route for the home page
app.get("/home", (req, res) => {
    // console.log()
    res.status(200).send({
        message: "welcome to pre_ragam ecoom home page",
    });
});

// User Routes
// 1. Register new user
// 2. Login user
// 3. Logout user
app.post("/register", async (req, res) => {
    let email = req.body.email;
    let password = req.body.password;

    const user = await User.findByPk(email);

    if (user) {
        return res.status(400).send({
            message: "user already exists"
        });
    }

    await User.create({
        email: email,
        password: password
    });

    res.status(200).send({
        message: "user created successfully"
    });
});

app.post("/login", async (req, res) => {
    let email = req.body.email;
    let password = req.body.password;

    const user = await User.findByPk(email);
    if (user && user.password === password) {
        return res.status(200).send({
            message: "user logged in successfully"
        });
    }

    res.status(400).send({
        message: "user not found"
    });
});



// making route to get all prodoucts

app.get("/products", (req, res) => {
    let promise;

    promise = Product.findAll();

    promise.then((products) => {
        res.status(200).send(products);
    });

    // sequelize.findALl

    // res.status(200).send(products);
});

// making route to get a product on the basis of given product id

app.get("/product/:id", (req, res) => {
    let productId = req.params.id;
    let prmoise;
    prmoise = Product.findByPk(productId);

    prmoise
        .then((product) => {
            res.status(200).send(product);
        })
        .catch((err) => {
            res.status(500).send("error while fetching data from product table");
        });
});

// ___________ starting server ____________________

app.listen(4000, () => {
    console.log("server started at port 4000");
});