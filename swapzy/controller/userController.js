const bcrypt = require('bcryptjs')
const { Users } = require('../sequelize/models');
const { use } = require('passport');

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
                username: username,
                email: email,
                password: hashedPassword,
                profile_img: null,
                location: null
            });
            req.session.username = username; // Store username in session
            res.status(201).json({ message: `User registered successfully: ${newUser}` });
        } catch (err) {
            res.status(500).json({ message: "Internal Server Error", error: err.message });
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

// Controller to log out
exports.logout = async function (req, res) {
    if (req.session) {
        try {
            req.session.destroy();

            res.clearCookie('connect.sid'); // clear cookie
            res.json({ message: 'Logged out succesfully', redirect: '/' });
        } catch (err) {
            console.error('Error loggin out: ', err);
            return res.status(500).json({ message: 'Could not log out' });
        }
    } else {
        res.status(400).json({ message: 'No active session to log out '});
    }
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

// Controller to check if user is logged in
exports.checkLogin = async function (req, res) {
    if (req.session.username != null) {
        res.json({ isLoggedIn: true, username: req.session.username });
    } else {
        res.json({ isLoggedIn: false });
    }
}

// Controller to get user location
exports.getUserLocation = async function (req, res) {
    try {
        const username = req.session.username;
        if (!username)
            return res.status(401).json({ message: 'User not authenticatied' });

        const user = await Users.findOne({
            attributes: ['location'],
            where: { username: username }
        });

        if (!user || !user.location)
            return res.status(404).json({ message: 'Location not found' });

        const [lng, lat] = user.location.coordinates;
        res.json({ lat, lng });
    } catch (err) {
        console.error('Error fetching user location: ', err);
        res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
}

// Controller method to update a user by id
exports.updateUser = async function (req, res) {
    const userid = req.session.username

    const { username, email, password, repeat_password, location, image_url } = req.body;

    try {
        const user = await Users.findByPk(userid);
        if (user) {
            if (username && username !== user.username)
                user.username = username;
            if (email && email !== user.email)
                user.email = email;
            if (password && repeat_password) {
                if (password === repeat_password)
                    user.password = await bcrypt.hash(password, 8);
                else
                    return res.status(400).json({ message: 'Passwords do not match' });
            }
            if (location && location !== user.location) {
                if (location.lat && location.lng) {
                    user.location = {
                        type: 'Point',
                        coordinates: [location.lng, location.lat]
                    };
                } 
            }
            if (image_url && image_url !== user.image_url)
                user.profile_img = image_url;

            await user.save();
            res.json(user);
        } else {
            res.status(404).send("User not found");
        }
    } catch (err) {
        res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
}

// Controller to delete a user
exports.deleteUser = async function (req, res) {
    const username = req.session.username;

    if (!username)
        return res.status(401).json({ message: "User not logged in" });

    const password = req.body.password;

    if (!password)
        return res.status(400).json({ message: "Password is required" });

    try {
        const user = await Users.findByPk(username);

        if (!user)
            return res.status(404).json({ message: "User not found" });

        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword)
            return res.status(400).json({ message: "Invalid password" });

        await user.destroy(); // Delete user

        // Clear session
        req.session.destroy();

        res.status(200).json({ message: "User account deleted successfully" });
    } catch (err) {
        console.error("Error deleting user: ", err);
        res.status(500).json({ message: "An error occurred while deleting user account", error: err.message });
    }
}

// Controller for alerting the user when session is about to expire
exports.sessionInfo = function (req, res) {
    if (req.session) {
        const now = Date.now();
        const sessionExpiry = req.session.expires;
        
        if (sessionExpiry) {
            const remainingTime = sessionExpiry.getTime() - now;
            return res.json({ remainingTime });
        } else
            return res.json({ remainingTime: 0 });
    }
    res.status(401).json({ message: 'Session expired' });
}