const WALLETS = {
    usdt: "0xe860a178302d1d96d2e3061b66e29e286b88a5fc",
    ltc: "LaiPv46mjh5CbfXiWRLqjLYT18QyVawBmj",
    stars: "Pay via Telegram Stars Invoice"
};

let balance = 0;

const tg = window.Telegram?.WebApp;
if (tg) {
    tg.expand();
}

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

function showTab(tabName) {
    document.getElementById('tab-mining').style.display = tabName === 'mining' ? 'block' : 'none';
    document.getElementById('tab-campaigns').style.display = tabName === 'campaigns' ? 'block' : 'none';
    
    const btns = document.querySelectorAll('.nav-btn');
    if (btns.length >= 2) {
        btns[0].classList.toggle('active', tabName === 'mining');
        btns[1].classList.toggle('active', tabName === 'campaigns');
    }
}

function updatePaymentAddress() {
    const method = document.getElementById('payment-method').value;
    const addrBox = document.getElementById('wallet-address');
    if (addrBox) {
        addrBox.innerText = WALLETS[method] || "Select Payment Method";
    }
}

function toggleCampaignForm() {
    const modal = document.getElementById('campaign-form-modal');
    modal.style.display = modal.style.display === 'none' ? 'flex' : 'none';
    if (modal.style.display === 'flex') {
        updatePaymentAddress();
    }
}

function doTask(url) {
    if (tg && tg.openTelegramLink) {
        tg.openTelegramLink(url);
    } else {
        window.open(url, '_blank');
    }
}

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
