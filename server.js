

const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');       // NEW: For hashing passwords
const jwt = require('jsonwebtoken');    // NEW: For login tokens

const app = express();
const PORT = 3000;

// Secret key for JWT (In a real app, this is kept hidden, but fine for our project)
const JWT_SECRET = "super_secret_pc_benchmark_key_123!"; 

app.use(cors());
app.use(express.json());

// --- CREATE MYSQL CONNECTION POOL ---
// (Keep your existing pool code here!)

// --- CREATE MYSQL CONNECTION POOL ---
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',           // <-- CHANGE THIS if your MySQL username isn't root
    password: 'Kani{mySQL}8',   // <-- CHANGE THIS to your actual MySQL password
    database: 'pc_benchmark',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// --- API ENDPOINT 1: GET ALL CPUs ---
app.get('/api/cpus', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT id, brand, gen, model, cpu_mark FROM cpus ORDER BY cpu_mark DESC');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: 'Database error' });
    }
});

// --- API ENDPOINT 2: GET ALL GPUs ---
app.get('/api/gpus', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT id, brand, gen, model, g3d_mark FROM gpus ORDER BY g3d_mark DESC');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: 'Database error' });
    }
});

// --- API ENDPOINT 3: SEARCH FOR GAMES ---
app.get('/api/games/search', async (req, res) => {
    const query = req.query.q;
    try {
        // Fetch games that match the typed search string
        const [rows] = await pool.query('SELECT * FROM games WHERE title LIKE ?', [`%${query}%`]);
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error fetching games' });
    }
});

// ==========================================
// USER AUTHENTICATION & PROFILES
// ==========================================

// --- REGISTER A NEW USER ---
app.post('/api/register', async (req, res) => {
    const { username, email, password } = req.body;
    try {
        // 1. Hash the password (10 is the "salt rounds" - how heavily it's scrambled)
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // 2. Save user to database
        const [result] = await pool.query(
            'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
            [username, email, hashedPassword]
        );
        res.status(201).json({ message: "User registered successfully!" });
    } catch (err) {
        // Handle duplicate emails or usernames
        if (err.code === 'ER_DUP_ENTRY') {
            res.status(400).json({ error: "Username or Email already exists." });
        } else {
            console.error(err);
            res.status(500).json({ error: "Server error during registration." });
        }
    }
});

// --- LOGIN ---
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        // 1. Find the user by email
        const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        if (users.length === 0) return res.status(401).json({ error: "Invalid email or password." });
        
        const user = users[0];

        // 2. Check if the typed password matches the hashed password
        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(401).json({ error: "Invalid email or password." });

        // 3. Create a JWT Token (The digital ID card) valid for 24 hours
        const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '24h' });
        
        // 4. Send back the token and user details
        res.json({ 
            message: "Login successful", 
            token: token, 
            user: {
                id: user.id,
                username: user.username,
                cpu_id: user.cpu_id,
                gpu_id: user.gpu_id,
                ram: user.ram
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error during login." });
    }
});

// --- UPDATE USER'S SAVED SPECS ---
app.put('/api/user/specs', async (req, res) => {
    // We expect the frontend to send the user ID and their hardware IDs
    const { userId, cpu_id, gpu_id, ram } = req.body;
    try {
        await pool.query(
            'UPDATE users SET cpu_id = ?, gpu_id = ?, ram = ? WHERE id = ?',
            [cpu_id, gpu_id, ram, userId]
        );
        res.json({ message: "Specs saved to profile successfully!" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database error saving specs" });
    }
});

// --- GET FULL SPEC DETAILS FOR LOGGED IN USER ---
// We use a SQL JOIN to combine data from the users, cpus, and gpus tables
app.get('/api/user/specs/:id', async (req, res) => {
    const userId = req.params.id;
    try {
        const query = `
            SELECT u.ram, 
                   c.id AS cpu_id, c.brand AS cpu_brand, c.model AS cpu_model, c.cpu_mark, 
                   g.id AS gpu_id, g.brand AS gpu_brand, g.model AS gpu_model, g.g3d_mark 
            FROM users u
            LEFT JOIN cpus c ON u.cpu_id = c.id
            LEFT JOIN gpus g ON u.gpu_id = g.id
            WHERE u.id = ?
        `;
        const [rows] = await pool.query(query, [userId]);
        
        if (rows.length === 0) return res.status(404).json({ error: "User not found" });
        res.json(rows[0]); 
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database error fetching user specs" });
    }
});

// --- START THE SERVER ---
app.listen(PORT, () => {
    console.log(`Backend Server running on http://localhost:${PORT}`);
    console.log(`Connected to MySQL Database: pc_benchmark`);
});