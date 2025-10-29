// Function to dynamically load game cards
function loadGameCards() {
    // تحديد الحاوية (Container) التي سنضع فيها الألعاب
    const container = document.getElementById('game-cards-container');
    if (!container) return; 

    // جلب البيانات من ملف games.json
    fetch('./games.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to load games data');
            }
            return response.json();
        })
        .then(games => {
            let htmlContent = '';

            // بناء HTML لكل لعبة في المصفوفة
            games.forEach(game => {
                htmlContent += `
                    <li class="scrollbar-item">
                        <div class="game-card featured-game-card">
                            <figure class="card-banner img-holder" style="--width: 450; --height: 600;">
                                <img src="${game.image}" width="450" height="600" loading="lazy" alt="${game.title}"
                                    class="img-cover">
                            </figure>
                            <div class="card-content">
                                <h4 class="h4">
                                    <a href="#" class="card-title">${game.title}</a>
                                </h4>
                                <div class="card-meta">
                                    <div class="card-meta-item">
                                        <p class="card-subtitle">${game.category}</p>
                                    </div>
                                    <div class="card-meta-item">
                                        <span class="span">${game.genre}</span>
                                    </div>
                                </div>
                                <p class="card-text">${game.description}</p>
                            </div>
                            <div class="card-badge">
                                <button class="btn card-badge-btn has-before" data-game-cta="${game.title}">
                                    ${game.cta_text}
                                </button>
                                <a href="#" class="card-badge-btn has-before read-more-btn">Read More</a>
                            </div>
                        </div>
                    </li>
                `;
            });

            // إدخال المحتوى الديناميكي في الصفحة
            container.innerHTML = `<ul class="has-scrollbar">${htmlContent}</ul>`;

            // هام: إعادة تفعيل منطق CPA Locker على الأزرار الجديدة
            if (typeof initCpaLocker === 'function') {
                initCpaLocker();
            }
        })
        .catch(error => {
            console.error('Error fetching games data:', error);
            container.innerHTML = '<p style="color:red; text-align:center; padding: 20px;">Failed to load game content. Check games.json file.</p>';
        });
}

document.addEventListener('DOMContentLoaded', loadGameCards);
