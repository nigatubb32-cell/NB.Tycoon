import os
import requests
from flask import Flask, send_from_directory, request, jsonify

app = Flask(__name__, static_folder='static')

MY_USDT_ADDRESS = "0xe860a178302d1d96d2e3061b66e29e286b88a5fc".lower()
MY_LTC_ADDRESS = "LaiPv46mjh5CbfXiWRLqjLYT18QyVawBmj"

@app.route('/')
def home():
    return send_from_directory('static', 'index.html')

@app.route('/api/verify-campaign', methods=['POST'])
def verify_campaign():
    data = request.json or {}
    tx_hash = data.get('txHash')
    method = data.get('method')
    channel = data.get('channel')

    if not tx_hash or not channel:
        return jsonify({"status": "error", "message": "Missing TxHash or Channel Link"}), 400

    if method == 'usdt':
        bsc_url = f"https://api.bscscan.com/api?module=transaction&action=gettxreceiptstatus&txhash={tx_hash}"
        try:
            res = requests.get(bsc_url, timeout=10).json()
            if res.get('status') == '1':
                return jsonify({"status": "success", "message": "USDT Payment Confirmed!"})
            else:
                return jsonify({"status": "error", "message": "Invalid or Pending Transaction Hash"}), 400
        except Exception:
            return jsonify({"status": "error", "message": "Blockchain API error"}), 500

    elif method == 'ltc':
        ltc_url = f"https://api.blockcypher.com/v1/ltc/main/txs/{tx_hash}"
        try:
            res = requests.get(ltc_url, timeout=10).json()
            if res.get('confirmations', 0) > 0:
                return jsonify({"status": "success", "message": "LTC Payment Confirmed!"})
            else:
                return jsonify({"status": "error", "message": "LTC Transaction not confirmed yet"}), 400
        except Exception:
            return jsonify({"status": "error", "message": "LTC API error"}), 500

    elif method == 'stars':
        return jsonify({"status": "success", "message": "Stars Payment Confirmed!"})

    return jsonify({"status": "error", "message": "Unsupported Payment Method"}), 400

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
