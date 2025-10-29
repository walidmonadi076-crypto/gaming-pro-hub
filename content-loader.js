function loadSiteContent() {
    fetch('/api/content')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to load site content');
            }
            return response.json();
        })
        .then(content => {
            if (content.hero_subtitle) {
                const subtitleEl = document.querySelector('.hero-subtitle');
                if (subtitleEl) subtitleEl.textContent = content.hero_subtitle;
            }

            if (content.hero_title) {
                const titleEl = document.querySelector('.hero-title');
                if (titleEl) {
                    const parts = content.hero_title.split(' ');
                    if (parts.length > 1) {
                        const lastWord = parts.pop();
                        titleEl.innerHTML = parts.join(' ') + ' <span class="span">' + lastWord + '</span>';
                    } else {
                        titleEl.textContent = content.hero_title;
                    }
                }
            }

            if (content.hero_description) {
                const descEl = document.querySelector('.hero-text');
                if (descEl) descEl.textContent = content.hero_description;
            }

            if (content.countdown_days) {
                const countdownEl = document.querySelector('.countdown-text .span');
                if (countdownEl) countdownEl.textContent = content.countdown_days;
            }

            if (content.site_title) {
                document.title = content.site_title;
            }
        })
        .catch(error => {
            console.error('Error fetching site content:', error);
        });
}

document.addEventListener('DOMContentLoaded', loadSiteContent);
