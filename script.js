/* GLOBAL STYLES */
:root {
    --dark-bg: #1A1A1A;     /* Background Color */
    --card-bg: #282828;     /* Card Background */
    --neon-pink: #FF0077;   /* Primary Accent Color (Neon Pink) */
    --text-color: #F0F0F0;  /* Light Text */
}

body {
    font-family: 'Arial', sans-serif;
    background-color: var(--dark-bg);
    color: var(--text-color);
    margin: 0;
    padding: 0;
    line-height: 1.6;
}

/* NAVIGATION BAR (مطابقة لتصميم G2GAMING) */
.navbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 5%;
    background-color: rgba(0, 0, 0, 0.4);
    position: absolute;
    top: 0;
    left: 0;
    width: 90%;
    z-index: 10;
}

.logo {
    color: var(--neon-pink);
    font-size: 1.8em;
    font-weight: bold;
    text-shadow: 0 0 5px var(--neon-pink);
}

.nav-links a {
    color: var(--text-color);
    text-decoration: none;
    margin-left: 30px;
    font-size: 1em;
    transition: color 0.3s;
}

.nav-links a:hover {
    color: var(--neon-pink);
}

/* HEADER SECTION */
.hero-section {
    padding: 150px 5% 50px 5%;
    text-align: center;
    /* يمكنك وضع صورة الخلفية الجديدة هنا */
    background: url('/images/bg-g2gaming.jpg') no-repeat center center/cover;
    position: relative;
    height: 60vh; /* ارتفاع الشاشة */
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.hero-content {
    z-index: 5; /* لضمان ظهور المحتوى فوق الصورة */
}

.neon-pink-text {
    font-size: 3.5em;
    color: var(--text-color);
    text-shadow: 0 0 10px var(--neon-pink), 0 0 20px rgba(255, 0, 119, 0.5);
    margin-bottom: 10px;
}

/* MAIN CTA BUTTON (مطابقة لزر "EXPLORE OFFERS NOW") */
.cta-button {
    background-color: var(--neon-pink);
    color: white;
    border: 2px solid var(--neon-pink);
    padding: 15px 35px;
    font-size: 1.1em;
    font-weight: bold;
    cursor: pointer;
    border-radius: 5px;
    margin-top: 20px;
    transition: all 0.3s;
    box-shadow: 0 0 10px rgba(255, 0, 119, 0.5);
}

.cta-button:hover {
    background-color: #C0005B;
    transform: translateY(-2px);
}

/* GAME GRID SECTION */
.game-grid-section {
    padding: 50px 5%;
    text-align: left;
}

.game-grid-section h2 {
    color: var(--text-color);
    margin-bottom: 30px;
    border-bottom: 2px solid #333;
    padding-bottom: 10px;
}

.game-grid-section {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 20px;
    max-width: 1200px;
    margin: 0 auto;
}

/* GAME CARD STYLES */
.game-card {
    background-color: var(--card-bg);
    padding: 0; /* تم إزالة الـ Padding الداخلي */
    border-radius: 8px;
    overflow: hidden; /* لإخفاء تجاوز الصورة */
    border: 1px solid #333;
    transition: all 0.3s ease;
}

.game-card:hover {
    border-color: var(--neon-pink);
    box-shadow: 0 0 15px rgba(255, 0, 119, 0.4);
}

.game-card img {
    width: 100%;
    height: auto;
    display: block;
    margin-bottom: 10px;
}

.game-card h3 {
    padding: 0 15px;
    font-size: 1.1em;
}

.fine-print {
    display: block;
    color: #888;
    font-size: 0.8em;
    padding: 0 15px;
}

.game-cta-button {
    background-color: var(--neon-pink);
    color: white;
    border: none;
    padding: 10px 0;
    width: 100%;
    font-weight: bold;
    cursor: pointer;
    margin-top: 15px;
    transition: background-color 0.3s;
    text-transform: uppercase;
}

.game-cta-button:hover {
    background-color: #C0005B;
}

/* FOOTER */
footer {
    padding: 20px 5%;
    text-align: center;
    background-color: #0d0d0d;
    border-top: 1px solid #333;
    font-size: 0.9em;
}

footer a {
    color: var(--neon-pink);
    text-decoration: none;
    margin: 0 10px;
}