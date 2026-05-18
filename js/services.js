// --- DONNÉES DES PRODUITS ---

const subscriptions = {
    "free": { name: "mAI_Teacher Free", price: 0, desc: "L'intelligence artificielle pour tous, sans frais.", img1: "DocImgs/Logo_Free.png", img2: "DocImgs/Logo_Free_Alt.png" },
    "plus": { name: "mAI_Teacher+", price: 15, desc: "Plus de puissance, plus de rapidité.", img1: "DocImgs/Logo_Plus.png", img2: "DocImgs/Logo_Plus_Alt.png" },
    "premium": { name: "mAI_Teacher Premium", price: 50, desc: "L'expérience ultime sans limite.", img1: "DocImgs/Logo_Premium.png", img2: "DocImgs/Logo_Premium_Alt.png" },
    "videos": { name: "mAI_Teacher Vidéos", price: 20, desc: "Accès exclusif à des contenus générés spécialement pour palier vos faiblesses.", img1: "DocImgs/Logo_Video.png", img2: "DocImgs/Logo_Video_Alt.png" },
    "tshort": { name: "mAI_T-short", price: 15, desc: "Des shorts vidéos adaptés à vos cours.", img1: "DocImgs/Logo_Tshort.png", img2: "DocImgs/Logo_Tshort_Alt.png" }
};

const merchItems = [
    { name: "mAI_T-shirt", price: 25, category: "vêtement", desc: "Le t-shirt officiel mAI_Teacher.", img1: "DocImgs/Tshirt_1.png", img2: "DocImgs/Tshirt_2.png" },
    { name: "Goodboy Badge", price: 5, category: "accessoire", desc: "Pour les élèves les plus sages.", img1: "DocImgs/Badge_GB_1.png", img2: "DocImgs/Badge_GB_2.png" },
    { name: "Good_student Badge", price: 5, category: "accessoire", desc: "Récompense académique officielle.", img1: "DocImgs/Badge_GS_1.png", img2: "DocImgs/Badge_GS_2.png" },
    { name: "Tasse mAI_Teacher", price: 12, category: "accessoire", desc: "Le mug professeur.", img1: "DocImgs/Mug_T_1.png", img2: "DocImgs/Mug_T_2.png" },
    { name: "Tasse Good_student", price: 12, category: "accessoire", desc: "Le mug des premiers de la classe.", img1: "DocImgs/Mug_S_1.png", img2: "DocImgs/Mug_S_2.png" }
];

// --- INITIALISATION ---

document.addEventListener('DOMContentLoaded', () => {
    updateCard(); // Affiche la carte au chargement
    loadMerch(merchItems);  // Charge la boutique initiale

    // Écouteurs pour le filtrage
    const nameFilter = document.getElementById('filter-name');
    const catFilter = document.getElementById('filter-category');
    const priceFilter = document.getElementById('filter-price');
    const priceVal = document.getElementById('price-val');

    const applyFilters = () => {
        const name = nameFilter.value.toLowerCase();
        const cat = catFilter.value;
        const maxPrice = parseInt(priceFilter.value);
        priceVal.textContent = maxPrice;

        const filtered = merchItems.filter(item => {
            const matchName = item.name.toLowerCase().includes(name);
            const matchCat = cat === 'all' || item.category === cat;
            const matchPrice = item.price <= maxPrice;
            return matchName && matchCat && matchPrice;
        });

        loadMerch(filtered);
    };

    nameFilter.addEventListener('input', applyFilters);
    catFilter.addEventListener('change', applyFilters);
    priceFilter.addEventListener('input', applyFilters);

    // Gestion de la flèche "retour en haut"
    const scrollBtn = document.getElementById('scroll-to-top');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            scrollBtn.style.display = "block";
        } else {
            scrollBtn.style.display = "none";
        }
    });
});

// --- FONCTIONS ---

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function updateCard() {
    const key = document.getElementById('product-selector').value;
    const sub = subscriptions[key];
    const container = document.getElementById('productCard');

    if (!container || !sub) return;

    container.innerHTML = `
        <div class="main-card">
            <img src="${sub.img1}" id="sub-img" 
                 onclick="toggleImg('sub-img', '${sub.img1}', '${sub.img2}')" 
                 alt="${sub.name}" title="Cliquez pour changer d'image">
            <h2>${sub.name}</h2>
            <p>${sub.desc}</p>
            <p class="price"><strong>Prix : ${sub.price}€</strong></p>
            <button class="buy-btn" onclick="showPurchaseMessage()">Acheter</button>
        </div>
    `;
}

function loadMerch(items) {
    const grid = document.getElementById('merch-grid');
    if (!grid) return;

    if (items.length === 0) {
        grid.innerHTML = "<p style='grid-column: 1/-1;'>Aucun produit ne correspond à vos critères.</p>";
        return;
    }

    grid.innerHTML = items.map((item, index) => `
        <div class="merch-box">
            <img src="${item.img1}" id="merch-img-${index}" 
                 onclick="toggleImg('merch-img-${index}', '${item.img1}', '${item.img2}')" 
                 alt="${item.name}" title="Cliquez pour changer d'image">
            <h3>${item.name}</h3>
            <p>${item.desc}</p>
            <p class="price"><strong>${item.price}€</strong></p>
            <button class="buy-btn" onclick="showPurchaseMessage()">Acheter</button>
        </div>
    `).join('');
}

function toggleImg(elementId, img1, img2) {
    const el = document.getElementById(elementId);
    if (!el) return;
    // On utilise la fin de l'URL pour la comparaison car src est souvent un chemin absolu
    if (el.src.endsWith(img1)) {
        el.src = img2;
    } else {
        el.src = img1;
    }
}

function showPurchaseMessage() {
    const canvas = document.getElementById('subscribe');
    const ctx = canvas.getContext("2d");
    
    // Positionner le canvas au centre de l'écran
    canvas.style.display = "block";
    canvas.style.position = "fixed";
    canvas.style.top = "50%";
    canvas.style.left = "50%";
    canvas.style.transform = "translate(-50%, -50%)";
    canvas.style.zIndex = "10000";
    canvas.style.borderRadius = "15px";
    canvas.style.boxShadow = "0 0 20px rgba(0,0,0,0.5)";

    // Fond Bleu ISEN
    ctx.fillStyle = "#2c3e50";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Dessin du Smiley
    const centerX = 60;
    const centerY = 100;

    // Visage
    ctx.beginPath();
    ctx.arc(centerX, centerY, 40, 0, Math.PI * 2);
    ctx.fillStyle = "#f1c40f"; // Jaune
    ctx.fill();
    ctx.stroke();

    // Yeux
    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.arc(centerX - 15, centerY - 10, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(centerX + 15, centerY - 10, 5, 0, Math.PI * 2);
    ctx.fill();

    // Sourire
    ctx.beginPath();
    ctx.arc(centerX, centerY + 5, 20, 0, Math.PI, false);
    ctx.stroke();

    // Texte
    ctx.fillStyle = "white";
    ctx.font = "bold 18px Arial";
    ctx.textAlign = "left";
    ctx.fillText("Vous avez acheté ce produit ! 😊", 120, 105);

    // Disparition après 3 secondes
    setTimeout(() => {
        canvas.style.display = "none";
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }, 3000);
}
