document.addEventListener('DOMContentLoaded', () => {
    const isenNantesCoords = [47.2748333, -1.50477777];
    const map = L.map('map-container').setView([48.0, -2.5], 7);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap'
    }).addTo(map);

    setTimeout(() => map.invalidateSize(), 100);

    const campus = [
        { name: "ISEN Nantes", coords: isenNantesCoords },
        { name: "ISEN Brest", coords: [48.406, -4.496] },
        { name: "ISEN Caen", coords: [49.176, -0.347] },
        { name: "ISEN Rennes", coords: [48.106, -1.691] }
    ];

    campus.forEach(c => {
        const marker = L.marker(c.coords).addTo(map).bindPopup(`<b>${c.name}</b>`);
        if (c.name.includes("Nantes")) marker.openPopup();
    });

    // --- MÉTÉO ---
    const API_KEY = "...pas_de_leak_dsl...";
    const weatherContainer = document.getElementById('weather-cards-container');

    async function fetchWeather(city) {
        try {
            const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city.name},fr&units=metric&lang=fr&appid=${API_KEY}`);
            const data = await response.json();
            createWeatherCard(city, data);
        } catch (error) {
            createWeatherCard(city, { main: { temp: 15 }, weather: [{ description: "Indisponible", icon: "01d" }] });
        }
    }

    function createWeatherCard(city, data) {
        const card = document.createElement('div');
        card.className = 'weather-card';
        card.innerHTML = `
            <h3>${city.name}</h3>
            <img class="weather-icon" src="https://openweathermap.org/img/wn/${data.weather[0].icon}.png" alt="Météo">
            <p><strong>${Math.round(data.main.temp)}°C</strong></p>
            <p style="font-size: 0.9em; color: #666;">${data.weather[0].description}</p>
        `;
        card.addEventListener('click', () => calculateDistance(city));
        weatherContainer.appendChild(card);
    }

    campus.forEach(city => fetchWeather(city));

    // --- GÉOLOCALISATION ---
    const gpsCoordsText = document.getElementById('gps-coords');
    const gpsDistanceText = document.getElementById('gps-distance');
    let userMarker, routingLine;

    function calculateDistance(target) {
        document.getElementById('distance-info').style.display = "block";
        gpsCoordsText.textContent = "Recherche de votre position...";

        navigator.geolocation.getCurrentPosition(pos => {
            const { latitude: lat, longitude: lon } = pos.coords;
            gpsCoordsText.innerHTML = `Position : <strong>${lat.toFixed(4)}, ${lon.toFixed(4)}</strong>`;

            const R = 6371;
            const dLat = (target.coords[0] - lat) * Math.PI / 180;
            const dLon = (target.coords[1] - lon) * Math.PI / 180;
            const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat * Math.PI / 180) * Math.cos(target.coords[0] * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
            const dist = (R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))).toFixed(2);

            gpsDistanceText.innerHTML = `Distance vers ${target.name} : <strong>${dist} km</strong>`;

            if (userMarker) map.removeLayer(userMarker);
            if (routingLine) map.removeLayer(routingLine);

            userMarker = L.marker([lat, lon]).addTo(map).bindPopup("Vous êtes ici").openPopup();
            routingLine = L.polyline([[lat, lon], target.coords], { color: 'red', dashArray: '5, 10' }).addTo(map);
            map.fitBounds(routingLine.getBounds(), { padding: [50, 50] });

        }, () => {
            gpsCoordsText.textContent = "Erreur : Position introuvable.";
        }, { enableHighAccuracy: true, maximumAge: 0 });
    }
});