document.addEventListener('DOMContentLoaded', () => {

    const form = document.getElementById('contact-form');
    const fullnameInput = document.getElementById('fullname');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');
    const submitBtn = document.getElementById('submit-btn');

    const formContainer = document.getElementById('form-container');
    const gameContainer = document.getElementById('game-container');
    const successMessage = document.getElementById('success-message');

    successMessage.style.display = 'none';

    fullnameInput.addEventListener('input', checkGlobalFormValidity);
    emailInput.addEventListener('input', checkGlobalFormValidity);
    messageInput.addEventListener('input', checkGlobalFormValidity);

    function validateName() {
        const value = fullnameInput.value.trim();
        const words = value.split(/\s+/).filter(w => w !== "");
        const errorSpan = document.getElementById('error-name');

        if (value !== "" && words.length === 2) {
            errorSpan.textContent = "";
            return true;
        } else {
            errorSpan.textContent = "Erreur : Entrez exactement 2 mots (Prénom et Nom).";
            errorSpan.style.color = "#e53935";
            console.error("Erreur de saisie : Le champ 'Prénom Nom' est mal rempli.");
            return false;
        }
    }

    function validateEmail() {
        const value = emailInput.value.trim();
        const errorSpan = document.getElementById('error-email');

        if (value.includes('@') && value.includes('.')) {
            errorSpan.textContent = "";
            return true;
        } else {
            errorSpan.textContent = "Erreur : L'email doit contenir un '@' et un '.'.";
            errorSpan.style.color = "#e53935";
            console.error("Erreur de saisie : L'adresse email n'est pas valide.");
            return false;
        }
    }

    function validateMessage() {
        const value = messageInput.value.trim();
        const errorSpan = document.getElementById('error-message');

        if (value.length >= 20 && value.length <= 1000) {
            errorSpan.textContent = "";
            return true;
        } else {
            errorSpan.textContent = `Erreur : Le message doit faire entre 20 et 1000 caractères (Actuel: ${value.length}).`;
            errorSpan.style.color = "#e53935";
            console.error(`Erreur de saisie : La taille du message est incorrecte (${value.length} caractères).`);
            return false;
        }
    }

    function checkGlobalFormValidity() {
        const isNameValid = (fullnameInput.value.trim().split(/\s+/).filter(w => w !== "").length === 2);
        const isEmailValid = emailInput.value.includes('@') && emailInput.value.includes('.');
        const isMsgValid = messageInput.value.trim().length >= 20 && messageInput.value.trim().length <= 1000;

        validateName();
        validateEmail();
        validateMessage();

        submitBtn.disabled = !(isNameValid && isEmailValid && isMsgValid);
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        formContainer.classList.add('hidden');
        formContainer.style.display = 'none';

        gameContainer.classList.remove('hidden');
        gameContainer.style.display = 'block';

        initMiniGame();
    });

    const canvas = document.getElementById('mini-game-canvas');
    const ctx = canvas.getContext('2d');
    const resultDiv = document.getElementById('game-result');

    let board = [];
    let gameActive = false;
    const cellSize = canvas.width / 3;

    function initMiniGame() {
        board = ["", "", "", "", "", "", "", "", ""];
        gameActive = true;
        resultDiv.innerHTML = "<strong>À vous de jouer ! Vous êtes les Croix (X). Cliquez sur la grille.</strong>";
        resultDiv.style.color = "black";
        drawBoard();
    }

    function drawBoard() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.beginPath();
        ctx.strokeStyle = "#2c3e50";
        ctx.lineWidth = 4;
        for (let i = 1; i < 3; i++) {
            ctx.moveTo(i * cellSize, 0);
            ctx.lineTo(i * cellSize, canvas.height);
            ctx.moveTo(0, i * cellSize);
            ctx.lineTo(canvas.width, i * cellSize);
        }
        ctx.stroke();

        for (let i = 0; i < 9; i++) {
            const row = Math.floor(i / 3);
            const col = i % 3;
            const x = col * cellSize + cellSize / 2;
            const y = row * cellSize + cellSize / 2;

            if (board[i] === "X") {
                drawX(x, y);
            } else if (board[i] === "O") {
                drawO(x, y);
            }
        }
    }

    function drawX(x, y) {
        ctx.beginPath();
        ctx.strokeStyle = "#e53935";
        ctx.lineWidth = 8;
        ctx.moveTo(x - 30, y - 30);
        ctx.lineTo(x + 30, y + 30);
        ctx.moveTo(x + 30, y - 30);
        ctx.lineTo(x - 30, y + 30);
        ctx.stroke();
    }

    function drawO(x, y) {
        ctx.beginPath();
        ctx.strokeStyle = "#3498db";
        ctx.lineWidth = 8;
        ctx.arc(x, y, 35, 0, Math.PI * 2);
        ctx.stroke();
    }

    canvas.addEventListener('click', (e) => {
        if (!gameActive) return;

        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const col = Math.floor(mouseX / cellSize);
        const row = Math.floor(mouseY / cellSize);
        const index = row * 3 + col;

        if (board[index] === "") {
            board[index] = "X";
            drawBoard();
            checkGameState("X");

            if (gameActive) {
                setTimeout(aiTurn, 500);
            }
        }
    });

    function aiTurn() {
        const emptyCells = board.map((val, idx) => val === "" ? idx : null).filter(val => val !== null);

        if (emptyCells.length > 0) {
            const randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
            board[randomIndex] = "O";
            drawBoard();
            checkGameState("O");
        }
    }

    function checkGameState(player) {
        const winConditions = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ];

        let hasWon = false;
        for (let condition of winConditions) {
            if (board[condition[0]] === player && board[condition[1]] === player && board[condition[2]] === player) {
                hasWon = true;
                break;
            }
        }

        if (hasWon) {
            gameActive = false;
            if (player === "X") {
                endGame(true);
            } else {
                endGame(false);
            }
            return;
        }

        if (!board.includes("")) {
            gameActive = false;
            endGame(false);
        }
    }

    function endGame(userWon) {
        setTimeout(() => {
            gameContainer.classList.add('hidden');
            gameContainer.style.display = 'none';

            if (userWon) {
                playSuccessAnimation();
            } else {
                alert("L'IA a défendu le serveur avec succès (Défaite ou Égalité). Votre formulaire a été effacé !");
                form.reset();
                formContainer.classList.remove('hidden');
                formContainer.style.display = 'block';
                checkGlobalFormValidity();
            }
        }, 1000);
    }

    function playSuccessAnimation() {
        successMessage.classList.remove('hidden');
        successMessage.style.display = 'block';

        successMessage.innerHTML = `
            <div id="sending-anim" style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 20px;">
                <div class="spinner" style="width: 40px; height: 40px; border: 5px solid #f3f3f3; border-top: 5px solid #3498db; border-radius: 50%; animation: spin 1s linear infinite; margin-bottom: 15px;"></div>
                <h3 style="color: #2c3e50; font-family: monospace;">Cryptage et envoi des données...</h3>
            </div>
        `;

        setTimeout(() => {
            if (!document.getElementById('pop-anim')) {
                const style = document.createElement('style');
                style.id = 'pop-anim';
                style.innerHTML = `
                    @keyframes popIn {
                        0% { transform: scale(0); opacity: 0; }
                        80% { transform: scale(1.2); opacity: 1; }
                        100% { transform: scale(1); opacity: 1; }
                    }
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                `;
                document.head.appendChild(style);
            }

            successMessage.innerHTML = `
                <div style="text-align: center; animation: popIn 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; transform: scale(0);">
                    <div style="font-size: 60px; color: #2ecc71; margin-bottom: 10px;">✔️</div>
                    <h3 style="color: #2ecc71; margin: 0;">Succès !</h3>
                    <p style="color: #666; margin-top: 5px;">Votre message a bien été transmis à mAI_Teacher.</p>
                </div>
            `;
        }, 2000);
    }

});