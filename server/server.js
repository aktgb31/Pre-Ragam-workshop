// ___________ creating server ____________________________
const express = require("express");
const app = express(); // it will create a instance of express server (in our case it is app)
const session = require("express-session");

app.use(session({
    secret: "secret",
    saveUninitialized: false,
    resave: true,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24
    }
}))


app.use(express.urlencoded({ extended: true })); // it will parse the url
app.use(express.json()); // it will parse the json data
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
        autoIncrement: true
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
        autoIncrement: true
    },
});

User.hasMany(CartItem);
Product.hasMany(CartItem);
CartItem.belongsTo(Product);

// sequelize.sync({ force: true }).then(() => {
sequelize.sync({ alter: true }).then(() => {
    console.log("databases synced !");

    // Product.create({
    //     id: 1,
    //     name: "Canon Camera",
    //     description: "Cool canon DSLR Camera",
    //     cost: 500,
    //     image: "https://m.media-amazon.com/images/I/914hFeTU2-L._SL1500_.jpg"
    // });

    // Product.bulkCreate([
    //     {
    //         id: 2,
    //         name: "Iphone 14 Pro Max",
    //         description: "Brand new Iphone 14 Pro Max by Apple",
    //         cost: 1200,
    //         image: "https://m.media-amazon.com/images/I/71yzJoE7WlL._SX522_.jpg"
    //     }, {
    //         id: 3,
    //         name: "Ipad Pro",
    //         description: "Brand new Ipad Pro by Apple",
    //         cost: 40000,
    //         image: "https://images.hindustantimes.com/tech/img/2021/09/14/1600x900/WhatsApp_Image_2021-09-14_at_5.13.31_PM_1631623490905_1631623503195.jpeg"
    //     }
    // ])

});

function isAuthenticated(req, res, next) {
    if (req.session.user) {
        next();
    } else {
        res.redirect("/register");
    }
}

// ___________ making route for server __________________

// making route for the home page
app.get("/home", isAuthenticated, (req, res) => {
    res.sendFile(__dirname + "/public/home.html");
});

// making route for the login page
app.get("/register", async (req, res) => {
    res.sendFile(__dirname + "/public/register.html");
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

    req.session.user = email;

    return res.redirect("/home");
});

app.post("/login", async (req, res) => {
    let email = req.body.email;
    let password = req.body.password;

    const user = await User.findByPk(email);
    if (user && user.password === password) {

        // The user is a valid user
        req.session.user = email;

        return res.redirect("/home");
    }


    res.status(400).send({
        message: "user not found"
    });
});

app.get("/logout", isAuthenticated, (req, res) => {
    req.session.destroy();
    res.redirect("/register");
});


// making route to get all prodoucts
app.get("/products", isAuthenticated, (req, res) => {
    let promise;

    promise = Product.findAll();

    promise.then((products) => {
        res.status(200).send(products);
    });

});

// making route to get a product on the basis of given product id

app.get("/product/:id", isAuthenticated, (req, res) => {
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

// Routes for cart
// 1. add product to cart
// 2. remove product from cart
// 3. get all products from cart

app.post("/cart", isAuthenticated, async (req, res) => {
    const email = req.session.user;
    const productId = req.body.productId;

    const cartItem = await CartItem.create({
        userEmail: email,
        productId: productId
    });

    res.send(cartItem);
});

app.get("/cart", isAuthenticated, async (req, res) => {
    const email = req.session.user;

    const cartItems = await CartItem.findAll({
        where: {
            userEmail: email
        },
        include: [Product]
    });
    res.send(cartItems);
});

app.delete("/cart/:id", isAuthenticated, async (req, res) => {

    const cartItemId = req.params.id;
    await CartItem.destroy({
        where: {
            id: cartItemId,
        }
    });

    res.status(200).send({
        message: "cart item deleted successfully"
    });
});

app.get('/', (req, res) => {
    res.redirect("/home");
});

app.get('*', (req, res) => {
    res.send("404 page not found");
})
// ___________ starting server ____________________

app.listen(4000, () => {
    console.log("server started at port 4000");
});