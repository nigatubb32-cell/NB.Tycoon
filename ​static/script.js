// የአንተ ትክክለኛ Wallet አድራሻዎች
const WALLETS = {
    usdt: "0xe860a178302d1d96d2e3061b66e29e286b88a5fc", // የ USDT (BEP20) አድራሻህ!
    ltc: "LaiPv46mjh5CbfXiWRLqjLYT18QyVawBmj",          // የ LTC አድራሻህ!
    stars: "Pay via Telegram Stars Invoice"
};

function updatePaymentAddress() {
    const method = document.getElementById('payment-method').value;
    const addrBox = document.getElementById('wallet-address');
    
    if (WALLETS[method]) {
        addrBox.innerText = WALLETS[method];
    } else {
        addrBox.innerText = "Select Payment Method";
    }
}

// Telegram WebApp Initialization
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

// Tap Handler
let balance = 0;
function handleTap() {
    balance += 1;
    document.getElementById('balance').innerHTML = `${balance} <span>NB</span>`;
}

// Tab Switching System
function showTab(tabName) {
    document.getElementById('tab-mining').style.display = tabName === 'mining' ? 'block' : 'none';
    document.getElementById('tab-campaigns').style.display = tabName === 'campaigns' ? 'block' : 'none';
    
    const btns = document.querySelectorAll('.nav-btn');
    btns[0].classList.toggle('active', tabName === 'mining');
    btns[1].classList.toggle('active', tabName === 'campaigns');
}

// Show/Hide Add Task Form
function toggleCampaignForm() {
    const modal = document.getElementById('campaign-form-modal');
    modal.style.display = modal.style.display === 'none' ? 'flex' : 'none';
    if (modal.style.display === 'flex') {
        updatePaymentAddress(); // Form ሲከፈት አድራሻውን ያሳያል
    }
}

// Submit Campaign Form & Auto Verification Call
async function submitCampaign(e) {
    e.preventDefault();
    const btn = document.getElementById('verify-btn');
    btn.innerText = "Verifying Transaction...";
    btn.disabled = true;

    const payload = {
        channel: document.getElementById('channel-link').value,
        users: document.getElementById('task-users').value,
        method: document.getElementById('payment-method').value,
        txHash: document.getElementById('tx-hash').value
    };

    try {
        const response = await fetch('/api/verify-campaign', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (data.status === 'success') {
            alert('✅ Transaction Verified! Your Campaign is now LIVE.');
            toggleCampaignForm();
            location.reload();
        } else {
            alert('❌ Verification Failed: ' + data.message);
        }
    } catch (err) {
        alert('❌ Error verifying payment. Please check your TxHash.');
    } finally {
        btn.innerText = "Verify & Activate";
        btn.disabled = false;
    }
}

