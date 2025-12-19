/* --- 1. HARDWARE RANKING SYSTEM --- */
// We assign a "Power Score" to each hardware tier.
const hardwareScores = {
    cpu: {
        "low": 30,   // i3
        "med": 60,   // i5
        "high": 90,  // i7
        "ultra": 100 // i9
    },
    gpu: {
        "low": 30,   // GTX 1050
        "med": 70,   // RTX 3060
        "high": 100  // RTX 4070
    }
};

// Variable to store the User's current PC stats
let userPC = {
    cpuScore: 0,
    gpuScore: 0,
    ram: 0,
    isSet: false
};

/* --- 2. FUNCTION TO SAVE USER SPECS --- */
function saveSystemSpecs() {
    const cpuVal = document.getElementById("cpuSelect").value;
    const gpuVal = document.getElementById("gpuSelect").value;
    const ramVal = parseInt(document.getElementById("ramSelect").value);

    // Validation
    if (cpuVal === "0" || gpuVal === "0" || ramVal === 0) {
        alert("Please select all options (CPU, GPU, and RAM).");
        return;
    }

    // Save the Scores based on the Ranking System
    userPC.cpuScore = hardwareScores.cpu[cpuVal];
    userPC.gpuScore = hardwareScores.gpu[gpuVal];
    userPC.ram = ramVal;
    userPC.isSet = true;

    // Show success message
    document.getElementById("saveMessage").style.display = "block";
    
    // Scroll down to search bar smoothly
    document.querySelector('.hero').scrollIntoView({ behavior: 'smooth' });
}

/* --- 3. GAME DATABASE WITH REQUIREMENTS --- */
/* --- 3. GAME DATABASE (EXPANDED TO 20 GAMES) --- */
const gamesDatabase = [
    // --- HIGH SPEC GAMES ---
    {
        id: "cyberpunk",
        title: "Cyberpunk 2077",
        reqCpuScore: 90,
        reqGpuScore: 100,
        reqRam: 16,
        description: "A graphical masterpiece requiring high specs.",
        image: "images/cyberpunk.jpg" // ✅ Fixed
    },
    {
        id: "alan-wake-2",
        title: "Alan Wake 2",
        reqCpuScore: 90,
        reqGpuScore: 100,
        reqRam: 16,
        description: "Next-gen horror game with intense graphics.",
        image: "images/alan_wake.webp" // ✅ Fixed
    },
    {
        id: "starfield",
        title: "Starfield",
        reqCpuScore: 80,
        reqGpuScore: 90,
        reqRam: 16,
        description: "Massive space exploration RPG.",
        image: "images/starfield.jpg" // ✅ Fixed
    },
    {
        id: "rdr2",
        title: "Red Dead Redemption 2",
        reqCpuScore: 80, 
        reqGpuScore: 80,
        reqRam: 12,
        description: "Detailed open-world western.",
        image: "images/rdr2.jpg" // ✅ Fixed
    },
    {
        id: "hogwarts",
        title: "Hogwarts Legacy",
        reqCpuScore: 80, 
        reqGpuScore: 80,
        reqRam: 16,
        description: "Open world wizarding action RPG.",
        image: "images/hogwarts.png" // ✅ Fixed
    },
    {
        id: "cod-mw3",
        title: "Call of Duty: Modern Warfare III",
        reqCpuScore: 70, 
        reqGpuScore: 70,
        reqRam: 12,
        description: "Fast-paced military shooter.",
        image: "images/codmw3.webp" // ✅ Fixed
    },

    // --- MEDIUM SPEC GAMES ---
    {
        id: "gta-v",
        title: "Grand Theft Auto V",
        reqCpuScore: 40,
        reqGpuScore: 30,
        reqRam: 8,
        description: "Rockstar's open-world masterpiece.",
        image: "images/gtav.jpg" // ✅ Fixed
    },
    {
        id: "elden-ring",
        title: "Elden Ring",
        reqCpuScore: 60,
        reqGpuScore: 70,
        reqRam: 12,
        description: "Challenging fantasy action RPG.",
        image: "images/eldenring.jpg" // ✅ Fixed
    },
    {
        id: "apex",
        title: "Apex Legends",
        reqCpuScore: 50,
        reqGpuScore: 50,
        reqRam: 8,
        description: "Squad-based battle royale.",
        image: "images/apex.jpg" // ✅ Fixed
    },
    {
        id: "fortnite",
        title: "Fortnite",
        reqCpuScore: 40,
        reqGpuScore: 40,
        reqRam: 8,
        description: "Popular battle royale with building mechanics.",
        image: "images/fortnite.jpg" // ✅ Fixed
    },
    {
        id: "overwatch-2",
        title: "Overwatch 2",
        reqCpuScore: 40,
        reqGpuScore: 40,
        reqRam: 6,
        description: "Team-based hero shooter.",
        image: "images/overwatch.png" // ✅ Fixed
    },
    {
        id: "cs2",
        title: "Counter-Strike 2",
        reqCpuScore: 50,
        reqGpuScore: 50,
        reqRam: 8,
        description: "Tactical shooter, successor to CS:GO.",
        image: "images/cs2.jpg" // ✅ Fixed
    },
    
    // --- LOW SPEC GAMES ---
    {
        id: "valorant",
        title: "Valorant",
        reqCpuScore: 30,
        reqGpuScore: 20,
        reqRam: 4,
        description: "5v5 character-based tactical shooter.",
        image: "images/valorant.jpg" // ✅ Fixed
    },
    {
        id: "minecraft",
        title: "Minecraft",
        reqCpuScore: 20,
        reqGpuScore: 20,
        reqRam: 4,
        description: "Build anything you can imagine.",
        image: "images/minecraft.jpg" // ✅ Fixed
    },
    {
        id: "among-us",
        title: "Among Us",
        reqCpuScore: 10,
        reqGpuScore: 10,
        reqRam: 1,
        description: "Social deduction game.",
        image: "images/amongus.jpg" // ✅ Fixed
    },
    {
        id: "roblox",
        title: "Roblox",
        reqCpuScore: 10,
        reqGpuScore: 10,
        reqRam: 4,
        description: "User-generated game platform.",
        image: "images/roblox.avif" // ✅ Fixed
    },
    // Fallback for others using placeholders
    {
        id: "generic",
        title: "Generic Game",
        reqCpuScore: 10,
        reqGpuScore: 10,
        reqRam: 2,
        description: "Example Game",
        image: "https://placehold.co/300x400?text=Game+Cover"
    }
];

/* --- 4. THE COMPARISON & SUGGESTION ENGINE --- */
function searchGame() {
    if (!userPC.isSet) {
        alert("Please enter your PC Specs in Step 1 first!");
        document.getElementById("test").scrollIntoView({ behavior: 'smooth' });
        return;
    }

    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    const resultArea = document.getElementById('resultArea');
    resultArea.innerHTML = "";
    resultArea.style.display = "block";

    const foundGame = gamesDatabase.find(game => game.title.toLowerCase().includes(searchInput));

    if (foundGame) {
        let passCPU = userPC.cpuScore >= foundGame.reqCpuScore;
        let passGPU = userPC.gpuScore >= foundGame.reqGpuScore;
        let passRAM = userPC.ram >= foundGame.reqRam;
        let canRun = passCPU && passGPU && passRAM;
        
        let statusColor = canRun ? "#4CAF50" : "#f44336"; 
        let statusText = canRun ? "You Can Run It!" : "You Cannot Run It.";
        
        // ... inside searchGame() function ...

        // GENERATE SMARTER SUGGESTIONS
        let suggestions = "";

        // 1. CPU CHECK
        if (!passCPU) {
            suggestions += `
            <li class="check-item fail">
                <div class="check-header">
                    <strong>Processor (CPU)</strong>
                    <span class="badge fail-badge">Too Weak</span>
                </div>
                <p>Your CPU score is only <strong>${userPC.cpuScore}</strong>. This game requires a score of <strong>${foundGame.reqCpuScore}</strong> (Core i5/Ryzen 5 or better).</p>
            </li>`;
        } else {
             suggestions += `
            <li class="check-item pass">
                <div class="check-header">
                    <strong>Processor (CPU)</strong>
                    <span class="badge pass-badge">Good</span>
                </div>
            </li>`;
        }

        // 2. GPU CHECK
        if (!passGPU) {
            suggestions += `
            <li class="check-item fail">
                <div class="check-header">
                    <strong>Graphics Card</strong>
                    <span class="badge fail-badge">Too Weak</span>
                </div>
                <p>Your GPU score is <strong>${userPC.gpuScore}</strong>. This game requires a score of <strong>${foundGame.reqGpuScore}</strong> to run smoothly.</p>
            </li>`;
        } else {
            suggestions += `
            <li class="check-item pass">
                <div class="check-header">
                    <strong>Graphics Card</strong>
                    <span class="badge pass-badge">Good</span>
                </div>
            </li>`;
        }

        // 3. RAM CHECK
        if (!passRAM) {
            suggestions += `
            <li class="check-item fail">
                <div class="check-header">
                    <strong>Memory (RAM)</strong>
                    <span class="badge fail-badge">Insufficient</span>
                </div>
                <p>You have <strong>${userPC.ram}GB</strong>. This game needs at least <strong>${foundGame.reqRam}GB</strong>.</p>
            </li>`;
        } else {
             suggestions += `
            <li class="check-item pass">
                <div class="check-header">
                    <strong>Memory (RAM)</strong>
                    <span class="badge pass-badge">Good</span>
                </div>
            </li>`;
        }

        // Final Output Injection
        // ... inside searchGame() ...

        // Ensure this HTML structure includes the <img src="${foundGame.image}"> tag
        resultArea.innerHTML = `
            <div class="result-card" style="border-top: 5px solid ${statusColor}; display: flex; gap: 20px;">
                
                <div style="flex-shrink: 0;">
                     <img src="${foundGame.image}" style="width: 120px; height: 160px; object-fit: cover; border-radius: 5px;">
                </div>
                
                <div style="flex-grow: 1;">
                    <h3>${foundGame.title}</h3>
                    <h2 style="color: ${statusColor}; margin-bottom: 15px;">${statusText}</h2>
                    <ul class="analysis-list">
                        ${suggestions}
                    </ul>
                </div>
            </div>
        `;

        // NEW: Image is added to the left of the text
        resultArea.innerHTML = `
            <div class="result-card" style="border-color: ${statusColor}; display: flex; align-items: center; gap: 20px;">
                <img src="${foundGame.image}" style="width: 120px; height: 160px; object-fit: cover; border-radius: 5px;">
                <div>
                    <h3>${foundGame.title}</h3>
                    <h2 style="color: ${statusColor};">${statusText}</h2>
                    <ul style="text-align: left; margin-top: 10px; list-style: none; padding: 0;">
                        ${suggestions}
                    </ul>
                </div>
            </div>
        `;
    } else {
        resultArea.innerHTML = `<p>Game not found. Try "Cyberpunk", "GTA", or "Minecraft".</p>`;
    }
}

/* --- 5. SEARCH SUGGESTIONS LOGIC --- */

function showSuggestions() {
    const input = document.getElementById('searchInput');
    const filter = input.value.toLowerCase();
    const suggestionBox = document.getElementById('suggestionsList');

    suggestionBox.innerHTML = '';

    if (filter.length === 0) {
        suggestionBox.style.display = 'none';
        return;
    }

    const matches = gamesDatabase.filter(game => 
        game.title.toLowerCase().includes(filter)
    );

    if (matches.length > 0) {
        matches.forEach(game => {
            const div = document.createElement('div');
            div.classList.add('suggestion-item');
            
            // --- UPDATED LINE: Now includes the IMG tag ---
            // It uses the local path found in your database (e.g., 'images/gta.jpg')
            div.innerHTML = `
                <img src="${game.image}" alt="${game.title}">
                <span>${game.title}</span>
            `;
            
            div.onclick = function() {
                input.value = game.title;
                suggestionBox.style.display = 'none'; 
                searchGame(); // Run the full search
            };

            suggestionBox.appendChild(div);
        });
        suggestionBox.style.display = 'block'; 
    } else {
        suggestionBox.style.display = 'none'; 
    }
}

// Optional: Hide suggestions if user clicks outside the box
document.addEventListener('click', function(e) {
    const suggestionBox = document.getElementById('suggestionsList');
    const searchInput = document.getElementById('searchInput');
    
    if (e.target !== searchInput && e.target !== suggestionBox) {
        suggestionBox.style.display = 'none';
    }
});

/* --- 6. BUTTON SHORTCUT FUNCTION --- */
function checkGame(gameTitle) {
    // 1. Fill the search box automatically
    const searchInput = document.getElementById('searchInput');
    searchInput.value = gameTitle;
    
    // 2. Run the existing search logic
    searchGame();
    
    // 3. Smooth scroll to the result so the user sees it
    document.getElementById('resultArea').scrollIntoView({ behavior: 'smooth', block: 'center' });
}