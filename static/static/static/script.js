let balance = 0;

const tg = window.Telegram?.WebApp;
if (tg) {
    tg.expand();
}

// Splash screen hide after 2.5 seconds
window.addEventListener('load', () => {
    setTimeout(() => {
        const splash = document.getElementById('splash-screen');
        if (splash) splash.style.display = 'none';
    }, 2500);
});

function handleTap() {
    balance += 1;
    document.getElementById('balance').innerHTML = `${balance} <span>NB</span>`;
}

