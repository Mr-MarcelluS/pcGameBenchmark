const API_URL = "http://localhost:3000/api";
let isLoginMode = true;

// Toggle between Login and Register UI
function toggleAuthMode() {
    isLoginMode = !isLoginMode;
    document.getElementById('loginForm').style.display = isLoginMode ? 'block' : 'none';
    document.getElementById('registerForm').style.display = isLoginMode ? 'none' : 'block';
    document.querySelector('.auth-container h2').textContent = isLoginMode ? 'Login' : 'Create Account';
    document.getElementById('toggleText').textContent = isLoginMode ? 'Need an account? Register here.' : 'Already have an account? Sign in.';
    
    // Clear messages
    document.getElementById('errorMsg').style.display = 'none';
    document.getElementById('successMsg').style.display = 'none';
}

function showMessage(elementId, text) {
    const el = document.getElementById(elementId);
    el.textContent = text;
    el.style.display = 'block';
    // Hide the other message type
    const otherId = elementId === 'errorMsg' ? 'successMsg' : 'errorMsg';
    document.getElementById(otherId).style.display = 'none';
}

// --- HANDLE REGISTRATION ---
async function handleRegister(event) {
    event.preventDefault(); // Stop page reload
    
    const username = document.getElementById('regUsername').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;

    try {
        const response = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password })
        });

        const data = await response.json();

        if (response.ok) {
            showMessage('successMsg', 'Registration successful! You can now log in.');
            // Automatically switch back to login mode after 1.5 seconds
            setTimeout(toggleAuthMode, 1500); 
        } else {
            showMessage('errorMsg', data.error || 'Registration failed.');
        }
    } catch (error) {
        showMessage('errorMsg', 'Cannot connect to the server.');
    }
}

// --- HANDLE LOGIN ---
async function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            showMessage('successMsg', 'Login successful! Redirecting...');
            
            // 🚨 CRITICAL STEP: Save the JWT Token and User Info in the browser 🚨
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));

            // Redirect back to the homepage after 1 second
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);
        } else {
            showMessage('errorMsg', data.error || 'Invalid credentials.');
        }
    } catch (error) {
        showMessage('errorMsg', 'Cannot connect to the server.');
    }
}