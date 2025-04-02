// server.js (Backend with Node.js, Express, and MongoDB)
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const User = require('./models/User');
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({ secret: 'secret-key', resave: false, saveUninitialized: true }));

// Connect to MongoDB
mongoose.connect('mongodb+srv://pinapativallabha:<db_password>@cluster0.6e5h7yn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch((err) => console.log('MongoDB connection error: ', err));
// User Registration
app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword });
    await user.save();
    res.send('User registered successfully');
});

// User Login
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (user && await bcrypt.compare(password, user.password)) {
        req.session.user = user;
        res.send('Login successful');
    } else {
        res.send('Invalid credentials');
    }
});

// Logout
app.get('/logout', (req, res) => {
    req.session.destroy();
    res.send('Logged out');
});

app.listen(3000, () => console.log('Server running on port 3000'));
