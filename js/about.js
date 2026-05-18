// ==========================================
// PAGE : À PROPOS (about.html)
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    const missionCards = document.querySelectorAll('.about-card');
    const modal = document.getElementById('mission-modal');
    const closeBtn = document.querySelector('.close-mission');

    // Descriptions complètes pour les missions (Simulation de base de données)
    const missionData = {
        "Démocratiser le Savoir": {
            img: "DocImgs/image.png",
            text: "Notre mission première est de rendre l'éducation de haute qualité accessible à tous les étudiants, sans distinction de ressources. Grâce à notre intelligence artificielle, nous brisons les barrières géographiques et financières pour offrir un tutorat d'élite à chaque apprenant, transformant ainsi le paysage universitaire mondial."
        },
        "Innover pour l'Apprentissage": {
            img: "DocImgs/Logo.png",
            text: "Nous repoussons les limites de la technologie pour créer des outils pédagogiques révolutionnaires. En combinant neurosciences et algorithmes génératifs, mAI_Teacher adapte son discours en temps réel aux blocages spécifiques de l'élève, garantissant une mémorisation durable et une compréhension profonde des concepts les plus complexes."
        },
        "Éthique & Bienveillance": {
            img: "DocImgs/Banner.png",
            text: "L'humain reste au cœur de notre démarche technologique. Nous nous engageons à développer une IA responsable, transparente et protectrice des données des utilisateurs. Notre objectif est de soutenir l'étudiant dans sa gestion du stress et sa santé mentale, en plus de ses performances académiques, pour un épanouissement total."
        },
        "Soutien 24h/24": {
            img: "DocImgs/image.png",
            text: "Parce que les questions n'attendent pas le lendemain, notre IA assure une permanence constante. Que ce soit à 3h du matin avant un examen ou pendant un cours intensif, mAI_Teacher fournit des explications claires et immédiates, garantissant qu'aucun étudiant ne reste jamais bloqué seul face à ses difficultés."
        },
        "Réussite Inclusive": {
            img: "DocImgs/Logo.png",
            text: "Nous combattons activement le décrochage universitaire en identifiant les lacunes précoces. mAI_Teacher propose des parcours de remédiation sur-mesure pour chaque profil, permettant à chaque étudiant, quel que soit son bagage initial, d'atteindre l'excellence et de valider ses diplômes avec confiance."
        },
        "Partenariat Académique": {
            img: "DocImgs/Banner.png",
            text: "Nous travaillons main dans la main avec les directions pédagogiques et les enseignants-chercheurs. Nos bases de connaissances sont alimentées par des ressources académiques certifiées, assurant que les conseils de notre IA sont toujours conformes aux programmes officiels et aux exigences des grandes écoles."
        },
        "Apprentissage Ludique": {
            img: "DocImgs/image.png",
            text: "Nous croyons que le plaisir est le moteur de la rétention. mAI_Teacher intègre des mécaniques de jeu, des badges et des défis interactifs pour transformer les révisions rébarbatives en une expérience captivante, augmentant ainsi l'engagement et la motivation des étudiants."
        },
        "Coaching Carrière": {
            img: "DocImgs/Logo.png",
            text: "Au-delà des examens, nous préparons votre entrée dans le monde professionnel. Notre IA analyse les tendances du marché du travail pour vous suggérer des compétences clés à acquérir, vous aide à rédiger vos CV et vous simule des entretiens d'embauche personnalisés."
        },
        "Communauté mAI": {
            img: "DocImgs/Banner.png",
            text: "L'apprentissage est aussi une aventure collective. Notre plateforme connecte des milliers d'étudiants partageant les mêmes objectifs, permettant l'entraide, le partage de fiches de révision certifiées et la création de groupes d'étude virtuels boostés par l'IA."
        },
        "Accessibilité Numérique": {
            img: "DocImgs/image.png",
            text: "Nous croyons que la technologie doit être un pont, pas une barrière. mAI_Teacher est conçu pour être pleinement accessible aux étudiants en situation de handicap, avec des interfaces adaptatives, des commandes vocales avancées et des supports de cours optimisés pour tous les lecteurs d'écran."
        }
    };

    missionCards.forEach(card => {
        card.style.cursor = "pointer";
        card.addEventListener('click', () => {
            const title = card.querySelector('h3').textContent;
            openMissionModal(title);
        });
    });

    function openMissionModal(title) {
        const data = missionData[title];
        if (!data) return;

        const modalTitle = document.getElementById('mission-title');
        const modalImg = document.getElementById('mission-img');
        const modalText = document.getElementById('mission-text');

        modalTitle.textContent = title;
        modalImg.src = data.img;
        
        // Tronquer à 150 caractères (Cahier des charges)
        const truncatedText = data.text.length > 150 ? data.text.substring(0, 150) + "..." : data.text;
        modalText.textContent = truncatedText;

        modal.style.display = "flex";
    }

    closeBtn.onclick = () => {
        modal.style.display = "none";
    };

    window.onclick = (event) => {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    };
});