function loadGameCards() {
    const container = document.getElementById('game-cards-container');
    if (!container) return; 

    fetch('/api/games')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to load games data');
            }
            return response.json();
        })
        .then(games => {
            let htmlContent = '';

            games.forEach(game => {
                htmlContent += `
                    <li class="scrollbar-item">
                        <div class="game-card custom-game-card"> 
                            
                            <figure class="card-banner img-holder" style="--width: 450; --height: 600;">
                                <img src="${game.image}" width="450" height="600" loading="lazy" alt="${game.title}"
                                    class="img-cover">
                            </figure>
                            
                            <div class="card-info-strip">
                                <div class="card-meta">
                                    <div class="meta-top">
                                         <h4 class="h4">
                                            <a href="#" class="card-title">${game.title}</a>
                                         </h4>
                                         <p class="card-genre">${game.genre}</p>
                                    </div>
                                    <div class="meta-bottom">
                                        <button class="btn card-badge-btn has-before" data-game-cta="${game.title}">
                                            ${game.cta_text}
                                        </button>
                                        <span class="card-category">${game.category}</span>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </li>
                `;
            });

            container.innerHTML = `<ul class="has-scrollbar">${htmlContent}</ul>`;

            if (typeof initCpaLocker === 'function') {
                initCpaLocker();
            }
        })
        .catch(error => {
            console.error('Error fetching games data:', error);
            container.innerHTML = '<p style="color:red; text-align:center; padding: 20px;">Failed to load game content. Please check your connection.</p>';
        });
}

document.addEventListener('DOMContentLoaded', loadGameCards);
