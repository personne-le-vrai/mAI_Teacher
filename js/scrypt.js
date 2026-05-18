document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 1. GESTION DES ÉVÈNEMENTS GLOBAUX
    // ==========================================

    // Détection de copie pour avertissement de plagiat
    document.addEventListener('copy', () => {
        const selection = window.getSelection().toString();
        if (selection.length > 0) {
            console.warn("%c⚠️ RAPPEL SUR LE PLAGIAT ⚠️", "color: red; font-size: 16px; font-weight: bold;");
            console.warn("Toute reproduction, même partielle, du contenu de mAI_Teacher sans autorisation préalable est strictement interdite (Code de la propriété intellectuelle).");
            console.warn("Veuillez citer vos sources ou contacter le responsable de l'équipe pour toute utilisation.");
        }
    });


    // ==========================================
    // 2. MENU ET NAVIGATION
    // ==========================================

    // Horloge temps réel et chronomètre de page (ou de site)
    const clockElement = document.getElementById('real-time-clock');
    const stopwatchElement = document.getElementById('page-stopwatch');

    // Récupère le temps sauvegardé dans la session, sinon commence à 0
    let secondsSpent = sessionStorage.getItem('siteTotalTime') ? parseInt(sessionStorage.getItem('siteTotalTime')) : 0;

    setInterval(() => {
        // Horloge
        const now = new Date();
        if (clockElement) clockElement.textContent = now.toLocaleTimeString('fr-FR');

        // Chronomètre persistant
        secondsSpent++;
        sessionStorage.setItem('siteTotalTime', secondsSpent); // Sauvegarde à chaque seconde

        if (stopwatchElement) {
            const minutes = Math.floor(secondsSpent / 60).toString().padStart(2, '0');
            const seconds = (secondsSpent % 60).toString().padStart(2, '0');
            stopwatchElement.textContent = `${minutes}:${seconds}`;
        }
    }, 1000);

    // Navigation avec délai, loader et confirmation pour l'équipe
    const loader = document.getElementById('loader-overlay');
    const navLinks = document.querySelectorAll('.nav-links a');
    const logoLink = document.querySelector('.logo a');

    // Couleurs pour le clic sur le menu
    const menuColors = ['#1abc9c', '#3498db', '#9b59b6', '#f1c40f', '#e67e22'];

    function handleNavigation(e, targetUrl, isTeamPage) {
        e.preventDefault(); // Bloque la navigation immédiate

        // Vérification spécifique pour la page Équipe avec insistance
        if (isTeamPage) {
            if (!confirm("Souhaitez-vous vraiment naviguer vers la page de présentation de l'équipe ?")) return;
        }

        // Affichage du loader et délai de 2 secondes
        if (loader) loader.classList.remove('hidden');
        setTimeout(() => {
            window.open(targetUrl, '_blank');
            if (loader) loader.classList.add('hidden'); // Cache le loader sur la page d'origine
        }, 2000);
    }

    // Gestion du clic sur le logo (retour accueil)
    if (logoLink) {
        logoLink.addEventListener('click', (e) => {
            const targetUrl = logoLink.getAttribute('href');
            console.log(`%cCHANGEMENT DE STYLE DÉTECTÉ : Le Logo change de couleur.`, "color: #3498db; font-weight: bold;");
            handleNavigation(e, targetUrl, false);
        });
    }

    // Gestion du clic sur les liens du menu
    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            const targetUrl = this.getAttribute('href');
            const isTeamPage = targetUrl === 'team.html';

            // Changement de couleur d'arrière-plan et log console
            const oldColor = window.getComputedStyle(this).backgroundColor;
            const newColor = menuColors[Math.floor(Math.random() * menuColors.length)];

            this.style.backgroundColor = newColor;
            console.log(`%cCHANGEMENT DE STYLE DÉTECTÉ : L'item de menu "${this.textContent}" change de fond.`, "color: #3498db; font-weight: bold;");
            console.log(`[Ancienne couleur : ${oldColor}] -> [Nouvelle couleur : ${newColor}]`);

            handleNavigation(e, targetUrl, isTeamPage);
        });
    });


    // ==========================================
    // 3. PAGE D'ACCUEIL : BANIÈRE ET SLOGAN
    // ==========================================

    // Zoom image au clic (le survol est déjà géré en CSS)
    const heroImg = document.querySelector('.zoom-banner');
    if (heroImg) {
        heroImg.addEventListener('click', () => {
            // Bascule le zoom au clic pour les appareils tactiles
            heroImg.style.transform = heroImg.style.transform === 'scale(2)' ? 'scale(1)' : 'scale(2)';
        });
    }

    // Animation du slogan
    const sloganElement = document.getElementById('slogan-text');
    if (sloganElement) {
        const fullText = "L'IA au service de votre réussite universitaire.";
        const words = fullText.split(' ');

        async function playSloganAnimation() {
            // Réinitialisation
            sloganElement.textContent = "";
            sloganElement.style.transition = "none";
            sloganElement.style.transform = "translateX(0)";

            // Apparition mot par mot
            for (let i = 0; i < words.length; i++) {
                sloganElement.textContent += words[i] + " ";
                await new Promise(resolve => setTimeout(resolve, 1000));
            }

            // Phase de translation (Droite -> Gauche -> Retour)
            sloganElement.style.transition = "transform 1s ease-in-out";
            sloganElement.style.transform = "translateX(30px)";
            await new Promise(resolve => setTimeout(resolve, 1000));
            sloganElement.style.transform = "translateX(-30px)";
            await new Promise(resolve => setTimeout(resolve, 1000));
            sloganElement.style.transform = "translateX(0)";
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Recommence
            playSloganAnimation();
        }

        playSloganAnimation();
    }


    // ==========================================
    // 4. PIED DE PAGE : TÉLÉPHONE INTERACTIF
    // ==========================================

    const phoneLink = document.getElementById('school-phone');

    if (phoneLink) {
        phoneLink.addEventListener('copy', (e) => {
            setTimeout(() => {
                const actualNumber = phoneLink.textContent.trim();
                const userInput = prompt(`Si vous voulez appeler ce numéro : ${actualNumber}, entrez-le à nouveau dans le champ ci-dessous puis validez :`);

                if (userInput === actualNumber) {
                    console.log(`%c📞 VOUS APPELEZ CE NUMÉRO : ${actualNumber.replace(/\s/g, '')}`, "color: #2ecc71; font-weight: bold; font-size: 14px;");

                    try {
                        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
                        
                        function playTone(freq1, freq2, duration) {
                            const osc1 = audioCtx.createOscillator();
                            const osc2 = audioCtx.createOscillator();
                            const gain = audioCtx.createGain();
                            osc1.frequency.value = freq1;
                            osc2.frequency.value = freq2;
                            gain.gain.value = 0.1;
                            osc1.connect(gain);
                            osc2.connect(gain);
                            gain.connect(audioCtx.destination);
                            osc1.start();
                            osc2.start();
                            setTimeout(() => { osc1.stop(); osc2.stop(); }, duration);
                        }

                        playTone(440, 480, 5000);
                    } catch (error) {
                        console.log("Audio API non supportée.");
                    }
                } else {
                    console.error("ERREUR DE SAISIE : Le numéro ne correspond pas.");
                }
            }, 200);
        });
    }

    // ==========================================
    // 5. EASTER EGGS 🐰 (Bonus)
    // ==========================================

    // Easter Egg : "isen" (Invert)
    let secretSequence = "";
    document.addEventListener('keydown', (e) => {
        secretSequence = (secretSequence + e.key.toLowerCase()).slice(-4);
        if (secretSequence === "isen") {
            console.log("🐰 Easter Egg trouvé ! Profil technique détecté.");
            document.body.style.transition = "filter 0.5s ease";
            document.body.style.filter = "invert(100%) hue-rotate(180deg)";
            setTimeout(() => { document.body.style.filter = "none"; }, 3000);
            secretSequence = "";
        }
    });

    // Easter Egg : Clic horloge (Turbo)
    if (clockElement) {
        let clickCount = 0;
        let clickTimer;
        clockElement.style.cursor = "pointer";
        clockElement.addEventListener('click', () => {
            clickCount++;
            clearTimeout(clickTimer);
            clickTimer = setTimeout(() => { clickCount = 0; }, 2000);
            if (clickCount === 5) {
                console.log("🏎️ Mode Turbo activé !");
                const logoImg = document.querySelector('.logo img');
                if (logoImg) {
                    logoImg.style.transition = "transform 2s cubic-bezier(0.25, 1, 0.5, 1)";
                    logoImg.style.transform = "rotate(3600deg)";
                    setTimeout(() => {
                        logoImg.style.transition = "none";
                        logoImg.style.transform = "rotate(0deg)";
                    }, 2000);
                }
                clickCount = 0;
            }
        });
    }

    // Easter Egg : Konami Code (Barrel Roll)
    const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let konamiPosition = 0;
    document.addEventListener('keydown', (e) => {
        if (e.key === konamiCode[konamiPosition]) {
            konamiPosition++;
            if (konamiPosition === konamiCode.length) {
                console.log("✈️ Do a barrel roll!");
                document.body.style.transition = "transform 2s ease-in-out";
                document.body.style.transform = "rotate(360deg)";
                setTimeout(() => {
                    document.body.style.transition = "none";
                    document.body.style.transform = "rotate(0deg)";
                }, 2000);
                konamiPosition = 0;
            }
        } else {
            konamiPosition = 0;
        }
    });

    // Easter Egg : "bug" (Glitch)
    let bugSequence = "";
    document.addEventListener('keydown', (e) => {
        bugSequence = (bugSequence + e.key.toLowerCase()).slice(-3);
        if (bugSequence === "bug") {
            console.log("👾 Glitch activé...");
            const style = document.createElement('style');
            style.innerHTML = `@keyframes glitch { 0% { transform: translate(2px, 1px); } 50% { transform: translate(-2px, -1px); filter: hue-rotate(90deg); } 100% { transform: translate(1px, -2px); } }`;
            document.head.appendChild(style);
            document.body.style.animation = "glitch 0.1s infinite";
            setTimeout(() => {
                document.body.style.animation = "none";
                document.head.removeChild(style);
            }, 2000);
            bugSequence = "";
        }
    });

    // Easter Egg : "hack" (Matrix)
    let hackSequence = "";
    document.addEventListener('keydown', (e) => {
        hackSequence = (hackSequence + e.key.toLowerCase()).slice(-4);
        if (hackSequence === "hack") {
            console.log("🕶️ Wake up, Neo...");
            const canvas = document.createElement('canvas');
            Object.assign(canvas.style, { position: 'fixed', top: '0', left: '0', width: '100vw', height: '100vh', zIndex: '99999', pointerEvents: 'none' });
            document.body.appendChild(canvas);
            const ctx = canvas.getContext('2d');
            canvas.width = window.innerWidth; canvas.height = window.innerHeight;
            const letters = '01'; const fontSize = 16; const columns = canvas.width / fontSize;
            const drops = Array(Math.floor(columns)).fill(1);
            const draw = setInterval(() => {
                ctx.fillStyle = 'rgba(0, 0, 0, 0.05)'; ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.fillStyle = '#0F0'; ctx.font = fontSize + 'px monospace';
                drops.forEach((y, i) => {
                    ctx.fillText(letters[Math.floor(Math.random()*2)], i * fontSize, y * fontSize);
                    if (y * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
                    drops[i]++;
                });
            }, 33);
            setTimeout(() => { clearInterval(draw); canvas.remove(); }, 5000);
            hackSequence = "";
        }
    });

    let fallSequence = "";
    document.addEventListener('keydown', (e) => {
        fallSequence = (fallSequence + e.key.toLowerCase()).slice(-4);
        if (fallSequence === "fall") {
            console.log("🍎 Gravité !");
            document.querySelectorAll('section, h1, h2, p, img, .nav-item, footer').forEach(el => {
                const r = el.getBoundingClientRect();
                Object.assign(el.style, { position: 'fixed', top: r.top+'px', left: r.left+'px', width: r.width+'px', zIndex: '9999', transition: 'top 1.5s cubic-bezier(0.6, 0.04, 0.98, 0.335)', pointerEvents: 'none' });
                setTimeout(() => { el.style.top = window.innerHeight+'px'; }, 100);
            });
            fallSequence = "";
        }
    });
});
const phoneLink = document.getElementById('school-phone');

if (phoneLink) {
    phoneLink.addEventListener('copy', (e) => {
        e.stopPropagation(); 

        const numTexte = phoneLink.textContent.trim();

        setTimeout(() => {
            const saisieUtilisateur = prompt(`Si vous voulez appeler ce numéro : ${numTexte}, entrez le de nouveau dans le champ ci-dessous puis validez`);

            if (saisieUtilisateur !== null) {
                console.log(`vous appelez ce numéro : ${numTexte}`);
                playAudio('sonnerie.m4a', 5000);;
            }
        }, 100);
    });
}

document.addEventListener('copy', () => {
    alert(
        "⚠️ PROPRIÉTÉ INTELLECTUELLE ⚠️\n\n" +
        "Ce contenu est protégé (Art. L122-4 du CPI).\n" +
        "Toute copie non autorisée est illicite et vous expose à des poursuites judiciaires immédiates."
    );
    console.log("Le plagiat est sévèrement réprimander par la loi")
});


function playAudio(url, duree) {
    const audio = new Audio(url);
    audio.play().catch(erreur => console.log("Audio bloqué :", erreur));

    setTimeout(() => {
        audio.pause();
        audio.currentTime = 0;
    }, duree);
}
