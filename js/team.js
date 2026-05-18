document.addEventListener('DOMContentLoaded', () => {
    const editButton = document.getElementById('edit-mode-btn');
    const addButton = document.getElementById('add-member-btn');
    const teamContainer = document.getElementById('team-container');

    let isEditModeActive = false;

    editButton.addEventListener('click', toggleEditMode);
    addButton.addEventListener('click', addTeamMember);

    function toggleEditMode() {
        if (isEditModeActive) {
            if (confirm("Voulez-vous vraiment quitter le mode édition ?")) {
                exitEditMode();
            }
            return;
        }

        let adminUsername = prompt("Entrez le nom du profil administrateur :");
        if (adminUsername === "admin") {
            let mdp = prompt("Entrez le mot de passe administrateur :");
            if (mdp === "admin_pwd") {
                activateEditFeatures();
            } else {
                alert("Mot de passe incorrect.");
            }
        } else {
            alert("Nom d'utilisateur incorrect.");
        }
    }

    function activateEditFeatures() {
        isEditModeActive = true;
        teamContainer.classList.add('edit-mode-active');
        editButton.textContent = "Quitter l'Édition";
        editButton.style.backgroundColor = "#e67e22";
        editButton.style.color = "white";

        const memberNames = document.querySelectorAll(".member-name");
        memberNames.forEach(name => {
            name.contentEditable = "true";
            name.style.border = "1px dashed #007acc";
        });

        const memberRoles = document.querySelectorAll(".member-role");
        memberRoles.forEach(role => {
            role.contentEditable = "true";
            role.style.border = "1px dashed #007acc";
        });

        addButton.style.display = "inline-block";

        const deleteButtons = document.querySelectorAll(".delete-member-btn");
        deleteButtons.forEach(btn => {
            btn.style.display = "block";
            btn.onclick = deleteTeamMember;
        });
    }

    function exitEditMode() {
        isEditModeActive = false;
        teamContainer.classList.remove('edit-mode-active');
        editButton.textContent = "Mode Édition";
        editButton.style.backgroundColor = "";
        editButton.style.color = "";

        const editableElements = document.querySelectorAll(".member-name, .member-role");
        editableElements.forEach(el => {
            el.contentEditable = "false";
            el.style.border = "none";
        });

        addButton.style.display = "none";

        const deleteButtons = document.querySelectorAll(".delete-member-btn");
        deleteButtons.forEach(btn => {
            btn.style.display = "none";
        });
    }

    function addTeamMember() {
        const newCard = document.createElement('div');
        newCard.className = 'team-card';
        newCard.innerHTML = `
            <div class="image-wrapper">
                <img src="DocImgs/image.png" alt="Nouveau membre" class="member-photo">
                <div class="scratch-overlay"></div>
            </div>
            <h3 class="member-name" contenteditable="true" style="border: 1px dashed #007acc;">Nouveau Nom</h3>
            <p class="member-role" contenteditable="true" style="border: 1px dashed #007acc;">Nouveau Rôle</p>
            <button class="delete-member-btn" style="display: block;">🗑️</button>
        `;
        newCard.querySelector('.delete-member-btn').onclick = deleteTeamMember;
        teamContainer.appendChild(newCard);
        
        initScratchEffectForElement(newCard.querySelector('.scratch-overlay'));
    }

    function deleteTeamMember(event) {
        const card = event.target.closest('.team-card');
        if (card && confirm("Supprimer ce membre ?")) {
            card.remove();
        }
    }

    function changeMemberPhoto(imgElement) {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    imgElement.src = event.target.result;
                };
                reader.readAsDataURL(file);
            }
        };
        input.click();
    }

    function initScratchEffect() {
        const overlays = document.querySelectorAll('.scratch-overlay');
        overlays.forEach(overlay => {
            initScratchEffectForElement(overlay);
        });
    }

    function initScratchEffectForElement(overlay) {
        const wrapper = overlay.parentElement;
        const width = 150;
        const height = 150;

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        canvas.className = 'scratch-canvas';
        wrapper.appendChild(canvas);

        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#2c3e50';
        ctx.fillRect(0, 0, width, height);

        ctx.fillStyle = 'white';
        ctx.font = '14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Survolez pour gratter !', width / 2, height / 2);

        overlay.remove();

        function scratch(e) {
            const rect = canvas.getBoundingClientRect();
            const clientX = e.clientX || (e.touches && e.touches[0].clientX);
            const clientY = e.clientY || (e.touches && e.touches[0].clientY);
            
            if (!clientX || !clientY) return;

            const x = clientX - rect.left;
            const y = clientY - rect.top;

            ctx.globalCompositeOperation = 'destination-out';
            ctx.beginPath();
            ctx.arc(x, y, 25, 0, Math.PI * 2);
            ctx.fill();
            
            checkCompletion(canvas, ctx, width, height);
        }

        canvas.addEventListener('mousemove', scratch);
        canvas.addEventListener('touchmove', (e) => {
            scratch(e);
            e.preventDefault();
        }, { passive: false });
    }

    function checkCompletion(canvas, ctx, width, height) {
        const imageData = ctx.getImageData(0, 0, width, height);
        const pixels = imageData.data;
        let transparentPixels = 0;

        for (let i = 3; i < pixels.length; i += 4) {
            if (pixels[i] === 0) transparentPixels++;
        }

        const percentage = (transparentPixels / (pixels.length / 4)) * 100;
        canvas.dataset.scratched = percentage;

        if (percentage > 90) {
            canvas.style.transition = "opacity 0.5s ease";
            canvas.style.opacity = "0";
            setTimeout(() => canvas.remove(), 500);
        }
    }

    initScratchEffect();

    const modal = document.getElementById('member-modal');
    const closeBtn = document.querySelector('.close-btn');

    teamContainer.addEventListener('click', (e) => {
        if (isEditModeActive) {
            if (e.target.classList.contains('member-photo')) {
                changeMemberPhoto(e.target);
            }
            return; 
        }

        const card = e.target.closest('.team-card');
        if (card && !e.target.classList.contains('delete-member-btn')) {
            const canvas = card.querySelector('.scratch-canvas');
            if (canvas) {
                const scratched = parseFloat(canvas.dataset.scratched || 0);
                if (scratched < 80) {
                    alert(`Continuez à gratter ! (${Math.round(scratched)}% effectué, il faut 80% pour voir les détails)`);
                    return;
                }
            }

            const name = card.querySelector('.member-name').textContent;
            const img = card.querySelector('.member-photo').src;
            const role = card.querySelector('.member-role').textContent;

            document.getElementById('modal-name').textContent = name;
            document.getElementById('modal-img').src = img;
            document.getElementById('modal-desc').textContent = `Expert en ${role}. Membre clé de l'aventure mAI_Teacher.`;
            
            modal.style.display = 'flex';
        }
    });

    closeBtn.onclick = () => {
        modal.style.display = 'none';
    };

    window.onclick = (event) => {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    };
});