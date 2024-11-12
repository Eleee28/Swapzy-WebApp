const { Product } = require('../sequelize/models');
const { Favorite } = require('../sequelize/models');

// Controller method to get all products
exports.getAll = async function (req, res) {
    try {
        const products = await Product.findAll({
            attributes: ['id', 'name', 'price', 'image_url']
        });
        res.json(products);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error fetching products"});
    }
}

// Controller method to get most recent products
exports.getRecent = async function (req, res) {
    try {
        const products = await Product.findAll({
            attributes: ['id', 'name', 'price', 'image_url'],
            where: {
                status: 'available',
            },
            order: [['created_at', 'DESC']],
            limit: 10,
        });
        res.json(products);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error fetching products"});
    }
}

// Controller to get a product by ID
exports.getByID = async function (req, res) {
    const id = req.params.id;

    try {
        const product = await Product.findByPk(id);
        if (!product)
            res.status(404).json({ message: "Product not found" });
        else
            res.json(product);
    } catch (err) {
        res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
    
};




// Controller method to get a number of products
// exports.getNProducts = async function (req, res) {
//     const n = req.params.n;
//     try {
//         const products = await Product.findAll({ limit: n });
//     }
// }

// Controller methods to get all products of a certain category

// Controller methods to get a product by id








// // Controller method to get all users
// exports.getAllProducts = async function (req, res) {
//     try {
//         const users = await User.findAll();
//         res.json(users);
//     } catch (err) {
//         res.status(500).json({ message: "Internal Server Error", error: err.message });
//     }
// };

// // Controller method to get a user by id
// exports.getUserById = async function (req, res) {
//     const id = req.params.id;

//     try {
//         const user = await User.findByPk(id);
//         if (!user)
//             res.status(404).send("User not found");
//         else
//             res.json(user);
//     } catch (err) {
//         res.status(500).json({ message: "Internal Server Error", error: err.message });
//     }
// };

// // Controller method to create a new user
// exports.createUser = async function (req, res) {
//     const { username, email, password, location, image_url } = req.body;
//     hashedPassword = await bcrypt.hash(password, 8);

//     try {
//         const newUser = await User.create({
//             username,
//             email,
//             hashedPassword,
//             location,
//             image_url,
//         });
//         res.status(201).json(newUser);
//     } catch (err) {
//         res.status(500).json({ message: "Internal Server Error", error: err.message });
//     }
// };

// // Controller method to update a user by id
// exports.updateUser = async function (req, res) {
//     const id = req.params.id;
//     const { username, email, password, location, image_url } = req.body;

//     try {
//         const user = await User.findByPk(id);
//         if (user) {
//             if (username && username !== user.username)
//                 user.username = username;
//             if (email && email !== user.email)
//                 user.email = email;
//             if (password)
//                 user.password = await bcrypt.hash(password, 8);
//             if (location && location !== user.location)
//                 user.location = location;
//             if (image_url && image_url !== user.image_url)
//                 user.image_url = image_url;

//             await user.save();
//             res.json(user);
//         } else {
//             res.status(404).send("User not found");
//         }
//     } catch (err) {
//         res.status(500).json({ message: "Internal Server Error", error: err.message });
//     }
// }

// // Controller method to delete a todo by id
// exports.deleteUser = async function (req, res) {
//     const id = req.params.id;

//     try {
//         const user = await User.findByPk(id);
//         if (user) {
//             await user.destroy();
//             res.json(user);
//         } else {
//             res.status(404).send("User not found");
//         }
//     } catch (err) {
//         res.status(500).json({ message: "Internal Server Error", error: err.message });
//     }
// };