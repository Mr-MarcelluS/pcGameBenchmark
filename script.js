const API_URL = "http://localhost:3000/api";

let userPC = {
    cpu: { name: "", mark: 0 },
    gpu: { name: "", mark: 0 },
    ram: 0,
    isSet: false
};

// Arrays to hold the full database locally
let allCPUs = [];
let allGPUs = [];

// --- NEW: AUTHENTICATION CHECKER ---
let currentUser = null;

async function checkAuthStatus() {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (token && userData) {
        currentUser = JSON.parse(userData);
        
        // 1. Change Navbar to Logout
        document.getElementById('navAuth').innerHTML = `<a href="#" onclick="logout()" style="color: #f44336; font-weight: bold;">Logout (${currentUser.username})</a>`;
        
        // 2. Fetch their saved specs from the database
        await fetchUserSpecs(currentUser.id);
    }
}

async function fetchUserSpecs(userId) {
    try {
        const response = await fetch(`${API_URL}/user/specs/${userId}`);
        if (response.ok) {
            const data = await response.json();
            
            // If they actually have hardware saved to their profile
            if (data.cpu_id && data.gpu_id && data.ram) {
                // Set the global userPC variable for the benchmark engine
                userPC.cpu.name = `${data.cpu_brand} ${data.cpu_model}`;
                userPC.cpu.mark = data.cpu_mark;
                userPC.gpu.name = `${data.gpu_brand} ${data.gpu_model}`;
                userPC.gpu.mark = data.g3d_mark;
                userPC.ram = data.ram;
                userPC.isSet = true;

                // Hide the dropdown form and show the profile summary
                document.getElementById('guestSection').style.display = 'none';
                const loggedInSection = document.getElementById('loggedInSection');
                loggedInSection.style.display = 'block';
                
                document.getElementById('welcomeUser').textContent = `Welcome back, ${currentUser.username}!`;
                document.getElementById('savedSpecsDisplay').innerHTML = `
                    <strong>CPU:</strong> ${userPC.cpu.name} <br>
                    <strong>GPU:</strong> ${userPC.gpu.name} <br>
                    <strong>RAM:</strong> ${userPC.ram} GB
                `;
            }
        }
    } catch (error) {
        console.error("Failed to load user profile specs:", error);
    }
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.reload(); // Refresh the page to turn back into a guest
}

function editSpecs() {
    // If a logged-in user wants to change their specs, show the form again
    document.getElementById('loggedInSection').style.display = 'none';
    document.getElementById('guestSection').style.display = 'block';
}

// --- 1. LOAD HARDWARE BRANDS ON STARTUP ---
document.addEventListener('DOMContentLoaded', async () => {
    try {
        const cpuRes = await fetch(`${API_URL}/cpus`);
        allCPUs = await cpuRes.json();
        
        const gpuRes = await fetch(`${API_URL}/gpus`);
        allGPUs = await gpuRes.json();

        const cpuBrands = [...new Set(allCPUs.map(c => c.brand))];
        const cpuBrandSelect = document.getElementById('cpuBrand');
        cpuBrands.forEach(b => cpuBrandSelect.innerHTML += `<option value="${b}">${b}</option>`);

        const gpuBrands = [...new Set(allGPUs.map(g => g.brand))];
        const gpuBrandSelect = document.getElementById('gpuBrand');
        gpuBrands.forEach(b => gpuBrandSelect.innerHTML += `<option value="${b}">${b}</option>`);

        // NEW: Run the auth check after dropdowns are loaded
        await checkAuthStatus();

    } catch (error) {
        console.error("Database connection failed:", error);
    }
});

// --- 2. CASCADING LOGIC FOR CPU ---
function updateCpuGens() {
    const brand = document.getElementById('cpuBrand').value;
    const genSelect = document.getElementById('cpuGen');
    const modelSelect = document.getElementById('cpuModel');

    // Reset downstream dropdowns
    genSelect.innerHTML = '<option value="0">-- Series/Gen --</option>';
    modelSelect.innerHTML = '<option value="0">-- Model --</option>';
    modelSelect.disabled = true;

    if (brand === "0") {
        genSelect.disabled = true;
        return;
    }

    // Filter generations by selected brand
    const filteredGens = [...new Set(allCPUs.filter(c => c.brand === brand).map(c => c.gen))];
    filteredGens.forEach(g => genSelect.innerHTML += `<option value="${g}">${g}</option>`);
    genSelect.disabled = false;
}

function updateCpuModels() {
    const brand = document.getElementById('cpuBrand').value;
    const gen = document.getElementById('cpuGen').value;
    const modelSelect = document.getElementById('cpuModel');

    modelSelect.innerHTML = '<option value="0">-- Model --</option>';

    if (gen === "0") {
        modelSelect.disabled = true;
        return;
    }

    // Filter models by brand AND generation
    const filteredModels = allCPUs.filter(c => c.brand === brand && c.gen === gen);
    filteredModels.forEach(m => {
        modelSelect.innerHTML += `<option value="${m.cpu_mark}">${m.model}</option>`;
    });
    modelSelect.disabled = false;
}

// --- 3. CASCADING LOGIC FOR GPU ---
function updateGpuGens() {
    const brand = document.getElementById('gpuBrand').value;
    const genSelect = document.getElementById('gpuGen');
    const modelSelect = document.getElementById('gpuModel');

    genSelect.innerHTML = '<option value="0">-- Series/Gen --</option>';
    modelSelect.innerHTML = '<option value="0">-- Model --</option>';
    modelSelect.disabled = true;

    if (brand === "0") {
        genSelect.disabled = true;
        return;
    }

    const filteredGens = [...new Set(allGPUs.filter(g => g.brand === brand).map(g => g.gen))];
    filteredGens.forEach(g => genSelect.innerHTML += `<option value="${g}">${g}</option>`);
    genSelect.disabled = false;
}

function updateGpuModels() {
    const brand = document.getElementById('gpuBrand').value;
    const gen = document.getElementById('gpuGen').value;
    const modelSelect = document.getElementById('gpuModel');

    modelSelect.innerHTML = '<option value="0">-- Model --</option>';

    if (gen === "0") {
        modelSelect.disabled = true;
        return;
    }

    const filteredModels = allGPUs.filter(g => g.brand === brand && g.gen === gen);
    filteredModels.forEach(m => {
        modelSelect.innerHTML += `<option value="${m.g3d_mark}">${m.model}</option>`;
    });
    modelSelect.disabled = false;
}

// --- 4. SAVE SPECS ---
// --- 4. SAVE SPECS ---
async function saveSystemSpecs() {
    const cpuBrand = document.getElementById("cpuBrand").value;
    const cpuModelSelect = document.getElementById("cpuModel");
    
    const gpuBrand = document.getElementById("gpuBrand").value;
    const gpuModelSelect = document.getElementById("gpuModel");
    
    const ramVal = parseInt(document.getElementById("ramSelect").value);

    if (cpuModelSelect.value === "0" || gpuModelSelect.value === "0" || ramVal === 0 || isNaN(ramVal)) {
        alert("Please select your complete Brand, Gen, and Model for all hardware.");
        return;
    }

    // Grab the database IDs from the selected options (We need these for the users table)
    // To get the ID, we search our local array for the matching model and mark
    const cpuMark = parseInt(cpuModelSelect.value);
    const gpuMark = parseInt(gpuModelSelect.value);
    
    const selectedCpu = allCPUs.find(c => c.brand === cpuBrand && c.cpu_mark === cpuMark && c.model === cpuModelSelect.options[cpuModelSelect.selectedIndex].text);
    const selectedGpu = allGPUs.find(g => g.brand === gpuBrand && g.g3d_mark === gpuMark && g.model === gpuModelSelect.options[gpuModelSelect.selectedIndex].text);

    // Update the local benchmarking engine
    userPC.cpu.name = `${cpuBrand} ${selectedCpu.model}`;
    userPC.cpu.mark = cpuMark;
    userPC.gpu.name = `${gpuBrand} ${selectedGpu.model}`;
    userPC.gpu.mark = gpuMark;
    userPC.ram = ramVal;
    userPC.isSet = true;

    // IF LOGGED IN: Save to database!
    if (currentUser) {
        try {
            await fetch(`${API_URL}/user/specs`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: currentUser.id,
                    cpu_id: selectedCpu.id,
                    gpu_id: selectedGpu.id,
                    ram: ramVal
                })
            });
            // Re-fetch to update the UI
            await fetchUserSpecs(currentUser.id);
            document.getElementById("saveMessage").style.display = "block";
            document.getElementById("saveMessage").textContent = "Specs permanently saved to your profile!";
        } catch (err) {
            console.error("Failed to save to profile", err);
        }
    } else {
        // GUEST MODE
        document.getElementById("saveMessage").style.display = "block";
        document.getElementById("saveMessage").textContent = "Specs saved for this session! Search for a game below.";
    }

    document.querySelector('.hero').scrollIntoView({ behavior: 'smooth' });
}

// ... Keep your existing showSuggestions(), searchGame(), checkHardware(), renderHardwareRow() below this ...

// --- 3. AUTOCOMPLETE SUGGESTIONS (from DB) ---
async function showSuggestions() {
    const filter = document.getElementById('searchInput').value;
    const suggestionBox = document.getElementById('suggestionsList');

    if (filter.length < 2) { 
        suggestionBox.style.display = 'none';
        return;
    }

    try {
        const response = await fetch(`${API_URL}/games/search?q=${filter}`);
        const matches = await response.json();

        suggestionBox.innerHTML = '';
        if (matches.length > 0) {
            matches.forEach(game => {
                const div = document.createElement('div');
                div.classList.add('suggestion-item');
                div.innerHTML = `
                    <img src="${game.image}" onerror="this.src='https://placehold.co/50x50?text=?'"> 
                    <span>${game.title}</span>
                `;
                div.onclick = () => {
                    document.getElementById('searchInput').value = game.title;
                    suggestionBox.style.display = 'none';
                    searchGame();
                };
                suggestionBox.appendChild(div);
            });
            suggestionBox.style.display = 'block';
        } else {
            suggestionBox.style.display = 'none';
        }
    } catch (e) {
        console.error("Search failed:", e);
    }
}

// Hide suggestions if clicking outside
document.addEventListener('click', function(e) {
    const suggestionBox = document.getElementById('suggestionsList');
    const searchInput = document.getElementById('searchInput');
    if (e.target !== searchInput && e.target !== suggestionBox) {
        suggestionBox.style.display = 'none';
    }
});

// --- 4. THE ADVANCED BENCHMARK ENGINE ---
async function searchGame() {
    if (!userPC.isSet) {
        alert("Please save your PC specs first!");
        document.getElementById("test").scrollIntoView({ behavior: 'smooth' });
        return;
    }

    const query = document.getElementById('searchInput').value;
    const resultArea = document.getElementById('resultArea');
    resultArea.style.display = "block";
    resultArea.innerHTML = "Calculating benchmarks...";
    
    try {
        const response = await fetch(`${API_URL}/games/search?q=${query}`);
        const results = await response.json();
        const game = results[0]; 

        if (game) {
            // CALCULATION LOGIC
            let cpuResult = checkHardware(userPC.cpu.mark, game.min_cpu_mark, game.rec_cpu_mark);
            let gpuResult = checkHardware(userPC.gpu.mark, game.min_g3d_mark, game.rec_g3d_mark);
            let ramResult = checkHardware(userPC.ram, game.min_ram, game.rec_ram);

            let canRun = (cpuResult !== 'fail' && gpuResult !== 'fail' && ramResult !== 'fail');
            let isOptimal = (cpuResult === 'rec' && gpuResult === 'rec' && ramResult === 'rec');

            let statusColor = canRun ? (isOptimal ? "#4CAF50" : "#FF9800") : "#f44336"; 
            let statusText = canRun ? (isOptimal ? "Meets Recommended Specs!" : "Meets Minimum Specs (May stutter)") : "Cannot Run This Game";

            resultArea.innerHTML = `
                <div class="result-card" style="border-top: 5px solid ${statusColor};">
                    <div style="display: flex; gap: 20px; align-items: center; margin-bottom: 20px;">
                        <img src="${game.image}" style="width: 120px; height: 160px; object-fit: cover; border-radius: 5px;" onerror="this.src='https://placehold.co/120x160'">
                        <div>
                            <h3 style="color: ${statusColor};">${game.title}</h3>
                            <h2>${statusText}</h2>
                        </div>
                    </div>
                    <ul class="analysis-list">
                        ${renderHardwareRow('CPU', userPC.cpu.name, cpuResult, userPC.cpu.mark, game.min_cpu_mark, game.rec_cpu_mark)}
                        ${renderHardwareRow('GPU', userPC.gpu.name, gpuResult, userPC.gpu.mark, game.min_g3d_mark, game.rec_g3d_mark)}
                        ${renderHardwareRow('RAM', userPC.ram + ' GB', ramResult, userPC.ram, game.min_ram, game.rec_ram)}
                    </ul>
                </div>
            `;
        } else {
            resultArea.innerHTML = `<p>Game not found in database.</p>`;
        }
    } catch (e) {
        console.error("DB Fetch Error:", e);
        resultArea.innerHTML = `<p style="color:red;">Error connecting to the database.</p>`;
    }
}

// HELPER: Calculates Min vs Rec
function checkHardware(userScore, minScore, recScore) {
    if (userScore >= recScore) return 'rec';
    if (userScore >= minScore) return 'min';
    return 'fail';
}

// HELPER: Draws the UI list item beautifully
function renderHardwareRow(type, name, result, userScore, minScore, recScore) {
    let badge = '';
    let description = '';

    if (result === 'rec') {
        badge = `<span class="badge pass-badge" style="background:rgba(76, 175, 80, 0.2); color:#4CAF50;">Recommended</span>`;
        description = `Excellent! Your score (${userScore}) exceeds recommended requirements.`;
    } else if (result === 'min') {
        badge = `<span class="badge" style="background:rgba(255, 152, 0, 0.2); color:#FF9800; padding:2px 8px; border-radius:12px; font-size:0.75rem; font-weight:bold; border:1px solid #FF9800;">Minimum</span>`;
        description = `Playable, but you might need to lower graphical settings. (Req: ${recScore})`;
    } else {
        badge = `<span class="badge fail-badge" style="background:rgba(244, 67, 54, 0.2); color:#f44336;">Fails</span>`;
        description = `Too weak. You need a score of at least ${minScore} to run this.`;
    }

    return `
    <li class="check-item">
        <div class="check-header">
            <strong>${type}: ${name}</strong>
            ${badge}
        </div>
        <p>${description}</p>
    </li>`;
}

// --- 5. BUTTON SHORTCUT ---
function checkGame(gameTitle) {
    document.getElementById('searchInput').value = gameTitle;
    searchGame();
    document.getElementById('resultArea').scrollIntoView({ behavior: 'smooth', block: 'center' });
}   