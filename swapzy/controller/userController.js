const bcrypt = require('bcryptjs')
const { Users } = require('../sequelize/models');

// Controller method to get all users
// exports.getAllUsers = async function (req, res) {
//     try {
//         const users = await Users.findAll();
//         res.json(users);
//     } catch (err) {
//         res.status(500).json({ message: "Internal Server Error", error: err.message });
//     }
// };

// Controller method to get a user by id
// exports.getUserById = async function (req, res) {
//     const id = req.params.id;

//     try {
//         const user = await Users.findByPk(id);
//         if (!user)
//             res.status(404).send("User not found");
//         else
//             res.json(user);
//     } catch (err) {
//         res.status(500).json({ message: "Internal Server Error", error: err.message });
//     }
// };

// Controller method to get a user by username
// exports.getUserByUserName = async function (req, res) {
//     const username = req.params.username;

//     try {
//         const user = await Users.findOne({ where: { username: username } });
//         if (!user)
//             res.status(404).send("User not found");
//         else
//             res.json(user);
//     } catch (err) {
//         console.error('Error fetching user by username: ', err);
//         res.status(500).json({ message: "Internal Server Error", error: err.message });
//     }
// };

// Controller method to create a new user
exports.createUser = async function (req, res) {
    const { username, email, password, repeat_password } = req.body;

    let errorMessage = '';

    // Input validation
    if (!username || !email || !password || !repeat_password) {
        errorMessage = 'All fields are required!';
    } else if (password !== repeat_password) {
        errorMessage = 'Passwords do not match!';
    } else if (!isValidEmail(email)) {
        errorMessage = 'Invalid email address!';
    } else if (await usernameTaken(username)) {
        errorMessage = 'Username is already taken!';
    } else if (await emailTaken(email)) {
        errorMessage = 'Email already has an account!';
    }

    if (errorMessage) {
        res.status(400).json({ errorMessage });
    } else {

        try {
            // Hash password
            hashedPassword = await bcrypt.hash(password, 8);
            const newUser = await Users.create({
                username,
                email,
                password: hashedPassword,
                profile_img: null,
                location: null
            });
            req.session.username = username; // Store username in session
            res.status(201).json({ message: `User registered successfully: ${newUser}` });
        } catch (err) {
            res.status(500).json({ message: "Internal2 Server Error", error: err.message });
        }
    }
};

/*
Email Regex from Chat-GPT
- [^\s@]+ : one or more chars that are not whitespace nor @ (local part)
- @ : literal '@' symbol
- [^\s@]+ : one or more chars that are not whitespace nor @ (domain part)
- \. : dot separating the domain name from top-level domain
- [^\s@]+ : one or more chars that are not whitespace nor @ (top-level domain)
*/
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

async function usernameTaken(username) {
    const existUser = await Users.findOne({ where: { username } });
    return existUser !== null;
}

async function emailTaken(email) {
    const existUser = await Users.findOne({ where: { email } });
    return existUser !== null;
}

// Controller method to perform login
exports.login = async function (req, res) {
    const { username, password } = req.body;

    let errorMessage = '';

    if (!username || !password)
        errorMessage = 'All fields are required!';

    if (errorMessage)
        return res.status(400).json({ errorMessage });
    
    
    try {
        errorMessage = await checkUserPassword(username, password);

        if (errorMessage) {
            return res.status(401).json({ errorMessage });
        } else {
            req.session.username = username; // Store username in session

            return res.status(200).json({ message: 'Login successful' });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error processing login request' });

    }
}

async function checkUserPassword(username, password) {
    const user = await Users.findOne({ where: { username: username } });
    
    if (!user) {
        return 'Invalid username!';
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        return 'Invalid password!';
    }
    
    return '';
}

// Controller method to get a user by id
exports.getById = async function (req, res) {
    const username = req.params.username;

    try {
        const user = await Users.findOne({
            attributes: ['username', 'email', 'location', 'profile_img'],
            where: { username: username },
        });
        if (!user)
            res.status(404).send("User not found");
        else
            res.json(user);
    } catch (err) {
        res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
};

// Controller method to update a user by id
// exports.updateUser = async function (req, res) {
//     const id = req.params.id;
//     const { username, email, password, location, image_url } = req.body;

//     try {
//         const user = await Users.findByPk(id);
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

// Controller method to delete a todo by id
// exports.deleteUser = async function (req, res) {
//     const id = req.params.id;

//     try {
//         const user = await Users.findByPk(id);
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