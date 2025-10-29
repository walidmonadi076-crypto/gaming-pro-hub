// ====================================================================
// CPA Locker Logic and HTML (cpa-locker.js)
// ====================================================================

// 1. HTML STRUCTURE FOR THE LOCKER (Overlay)
// يمكنك تغيير هذا النص والروابط لاحقًا ليتناسب مع Gamics
const locker_html = `
<style>
/* CSS for the Locker Overlay */
#cpa-locker-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.9); /* Dark semi-transparent background */
    z-index: 99999;
    display: none; /* Hidden by default */
    justify-content: center;
    align-items: center;
    backdrop-filter: blur(5px);
}

.locker-container {
    background: #1e1e1e; /* Dark theme container */
    padding: 40px;
    border-radius: 12px;
    box-shadow: 0 0 40px rgba(255, 0, 119, 0.5); /* Neon shadow */
    max-width: 450px;
    text-align: center;
    color: #f0f0f0;
    border: 1px solid #333;
    animation: fadeIn 0.5s;
}

.locker-container h2 {
    color: #FF0077; /* Neon Pink highlight */
    margin-bottom: 10px;
}

.locker-container p {
    margin-bottom: 25px;
    font-size: 1.1em;
}

.locker-container button {
    background: #FF0077; /* CTA Button */
    color: white;
    border: none;
    padding: 12px 30px;
    border-radius: 8px;
    font-weight: bold;
    cursor: pointer;
    transition: background 0.3s;
}

.locker-container button:hover {
    background: #C0005B;
}

.close-btn {
    position: absolute;
    top: 15px;
    right: 15px;
    color: #bbb;
    font-size: 1.5em;
    cursor: pointer;
    transition: color 0.3s;
}

.close-btn:hover {
    color: #FF0077;
}

@keyframes fadeIn {
    from { opacity: 0; transform: scale(0.95); }
    to { opacity: 1; transform: scale(1); }
}
</style>

<div id="cpa-locker-overlay">
    <div class="locker-container">
        <span class="close-btn" id="close-locker-btn">&times;</span>
        <h2>Unlock Exclusive Offer!</h2>
        <p>To access this game download or premium content, a quick Human Verification step is required.</p>
        
        <div id="cpa-widget-placeholder">
            <p style="color:#FFDD00; font-weight: bold;">[PLACE YOUR CPA LOCKER CODE HERE]</p>
            <p style="font-size: 0.9em; margin-top: 10px; color: #aaa;">(Example: Embed the CPA script widget.)</p>
        </div>
        
    </div>
</div>
`;

// ... (كل الكود الخاص بـ locker_html و الـ CSS هنا)

// **1. لف كل منطق تشغيل الـ Locker داخل دالة**
function initCpaLocker() {
    // 2. إضافة الـ Locker Overlay HTML (نضمن وجوده)
    if (!document.getElementById('cpa-locker-overlay')) {
        document.body.insertAdjacentHTML('beforeend', locker_html);
        const closeBtn = document.getElementById('close-locker-btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                document.getElementById('cpa-locker-overlay').style.display = 'none';
            });
        }
    }

    const lockerOverlay = document.getElementById('cpa-locker-overlay');

    // 3. تحديد أزرار Gamics (هذا يتم تشغيله الآن بعد تحميل الألعاب)
    // نستخدم document.querySelectorAll لجمع الأزرار في كل مرة يتم تشغيل الدالة
    const ctaButtons = document.querySelectorAll('.header-action-btn, .card-badge-btn'); 

    ctaButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault(); 
            if (lockerOverlay) {
                lockerOverlay.style.display = 'flex';
            }
        }, { once: true }); // لضمان أن الحدث لا يتكرر
    });
}

// **4. تشغيل الدالة تلقائياً عند تحميل الصفحة لأول مرة (للأزرار الثابتة)**
document.addEventListener('DOMContentLoaded', initCpaLocker);

// **ملاحظة:** game-loader.js سيقوم بتشغيل هذه الدالة مرة أخرى بعد تحميل المحتوى الديناميكي.