// --- WARNING: INSERT YOUR CPA LOCKER CODE HERE ---
// This placeholder code demonstrates the logic of displaying an INLINE overlay/iframe.
// You MUST replace the content of the `locker_html` variable with the actual Content Locker code 
// provided by Ogads or AdBlueMedia.

const locker_html = `
    <div id="cpa-locker-overlay" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.9); z-index: 9999; display: none; justify-content: center; align-items: center;">
        <div class="locker-box" style="width: 90%; max-width: 500px; padding: 20px; background-color: #1a1a1a; border: 2px solid #00ffff; box-shadow: 0 0 20px #00ffff; text-align: center;">
            <h3 style="color: #00ffff; margin-bottom: 10px;">Security Verification Required</h3>
            <p style="color: white; margin-bottom: 20px;">To gain access to the utility tool, please complete a quick, free verification step below.</p>
            
            <iframe src="[YOUR_OGADS/ADBLUEMEDIA_LOCKER_LINK]" style="width: 100%; height: 300px; border: none; background: #222;"></iframe>
            
            <p style="color: #ccc; font-size: 12px; margin-top: 20px;">Verification ensures fair distribution and bot protection.</p>
        </div>
    </div>
`;


// ----------------------------------------------------
// LOGIC TO ACTIVATE THE CONTENT LOCKER
// ----------------------------------------------------

document.addEventListener('DOMContentLoaded', () => {
    // 1. Append the Locker Overlay to the Body
    document.body.insertAdjacentHTML('beforeend', locker_html);
    const lockerOverlay = document.getElementById('cpa-locker-overlay');

    // 2. Attach click event listener to all "Unlock" buttons
    const gameCTAs = document.querySelectorAll('.game-cta-button');
    gameCTAs.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            
            const gameId = button.getAttribute('data-game-id');
            console.log(`User clicked Game ID: ${gameId}. Activating Content Locker...`);
            
            // Display the Content Locker Overlay
            if (lockerOverlay) {
                lockerOverlay.style.display = 'flex';
            }
        });
    });
    
    // 3. Optional: Make the main CTA button scroll down instead of locking immediately
    document.getElementById('main-cta').addEventListener('click', () => {
        document.getElementById('game-grid').scrollIntoView({ behavior: 'smooth' });
    });
});