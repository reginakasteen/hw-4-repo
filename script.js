const app = document.getElementById('app');
const intro = document.getElementById('intro-block');

const button = document.getElementById('display-btn');

intro.hidden = false;

let currentPage = 1;
let nextPageUrl = null;
let isLoading = false;

function renderPage(url) {
    if (!url || isLoading) return;

    isLoading = true;

    fetch(url)
        .then(res => {
            if (!res.ok) throw new Error('Network error');
            return res.json();
        })
        .then(data => {
            if (app.innerText === 'Loading...') {
                app.innerHTML = '';
            }

            data.results.forEach(item => {
                const statusColor =
                    item.status === 'Alive'
                        ? 'text-green-400'
                        : item.status === 'Dead'
                        ? 'text-red-400'
                        : 'text-yellow-400';

                const icon =
                    item.status === 'Alive'
                        ? 'fa-solid fa-heart-circle-check'
                        : item.status === 'Dead'
                        ? 'fa-solid fa-skull'
                        : 'fa-solid fa-question';

                app.insertAdjacentHTML('beforeend', `
                    <div class="relative my-4 mx-5 rounded-2xl overflow-hidden
                        border border-green-400/30 bg-black/50 
                        shadow-lg shadow-green-500/20
                        transition transform hover:-translate-y-2
                        fade-in-up hover:shadow-green-500/40"
                        data-id="${item.id}">

                        <div class="absolute inset-0 bg-black/30 backdrop-blur-lg"></div>

                        <div class="relative z-10 flex">
                            <img src="${item.image}" class="w-30 h-48 object-cover" />

                            <div class="p-4">
                                <h3 class="text-lg font-bold text-white font-adult">
                                    ${item.name}
                                </h3>

                                <p class="text-sm ${statusColor} font-adult">
                                    <i class="${icon} pe-2"></i>${item.status}
                                </p>
                            </div>
                        </div>
                    </div>
                `);
            });

            nextPageUrl = data.info.next;
        })
        .catch(console.error)
        .finally(() => {
            isLoading = false;
        });
}


button.addEventListener('click', () => {
    button.remove();
    app.innerText = "Loading...";
    intro.hidden = true;

renderPage(`https://rickandmortyapi.com/api/character?page=${currentPage}`);

window.addEventListener('scroll', () => {
    if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 200 &&
        nextPageUrl &&
        !isLoading) {
        renderPage(nextPageUrl);    
    }
});

app.addEventListener("click", (event) => {
    const card = event.target.closest('[data-id]');
    if (!card) return;

    getCharacter(`https://rickandmortyapi.com/api/character/${card.dataset.id}`);
})

const dialog = document.getElementById('dialog');
const dialogImg = document.getElementById('dialog-image');
const dialogName = document.getElementById('dialog-name');
const dialogStatus = document.getElementById('dialog-status');
const closeDialogBtn = document.getElementById('close-dialog');

function getCharacter(url) {
    fetch(url)
        .then(res => res.json())
        .then(item => {
            const statusColor =
                item.status === 'Alive'
                    ? 'text-green-400'
                    : item.status === 'Dead'
                    ? 'text-red-400'
                    : 'text-yellow-400';
            const icon =
                item.status === 'Alive'
                    ? 'fa-solid fa-heart-circle-check'
                    : item.status === 'Dead'
                    ? 'fa-solid fa-skull'
                    : 'fa-solid fa-question';

            dialogImg.src = item.image;
            dialogImg.alt = item.name;
            dialogName.textContent = item.name;
            dialogStatus.innerHTML = `<i class="${icon} pe-2"></i>${item.status}`;
            dialogStatus.className = `text-sm font-adult ${statusColor}`;

            dialog.showModal();
        });
}

closeDialogBtn.addEventListener('click', () => {
    dialog.close();
});

dialog.addEventListener('click', (e) => {
    if (e.target === dialog) {
        dialog.close();
    }
});


});