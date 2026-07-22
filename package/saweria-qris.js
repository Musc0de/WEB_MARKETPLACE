const axios = require('axios');
const cheerio = require('cheerio');
const QRCode = require('qrcode');
const { createCanvas, loadImage } = require('canvas');
const fs = require('fs');
const path = require('path');
const { generate } = require('random-username-generator');

const BACKEND = 'https://backend.saweria.co';
const FRONTEND = 'https://saweria.co';

const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'application/json, text/plain, */*',
    'Accept-Language': 'en-US,en;q=0.9',
    'Accept-Encoding': 'gzip, deflate, br',
    'Content-Type': 'application/json',
    'Origin': 'https://saweria.co',
    'Referer': 'https://saweria.co/',
    'Sec-Ch-Ua': '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
    'Sec-Ch-Ua-Mobile': '?0',
    'Sec-Ch-Ua-Platform': '"Windows"',
    'Sec-Fetch-Dest': 'empty',
    'Sec-Fetch-Mode': 'cors',
    'Sec-Fetch-Site': 'same-site'
};

function generateRandomMessage() {
    const messages = [
        "Semangat kak!",
        "Terima kasih atas kontennya",
        "Lanjutkan karya baiknya",
        "Support terus",
        "Keep up the good work!",
        "Sukses selalu",
        "Tetap semangat"
    ];
    return messages[Math.floor(Math.random() * messages.length)];
}

function insertPlusInEmail(email, insertStr) {
    const [localPart, domain] = email.split('@');
    const cleanLocalPart = localPart.split('+')[0];
    return `${cleanLocalPart}+${insertStr}@${domain}`;
}

async function paidStatus(transactionId) {
    /**
     * Check status of a saweria transaction paid or not from transaction_id.
     * @param {string} transactionId - String from output of createPayment
     * @returns {Promise<boolean>} - Returns true if paid, false if not paid
     * @throws {Error} - Throws error if transaction ID is not found
     */
    try {
        const response = await axios.get(`${BACKEND}/donations/qris/${transactionId}`, { headers });
        const data = response.data.data;
        return data.qr_string === "";
    } catch (error) {
        throw new Error("Transaction ID is not found!");
    }
}

async function createPaymentString(saweriaUsername, amount, sender, email, pesan) {
    /**
     * Outputs a details transaction from variables.
     * @param {string} saweriaUsername - The recipient's Saweria username
     * @param {number} amount - The donation amount in IDR
     * @param {string} sender - Name of donor
     * @param {string} email - Email of sender
     * @param {string} pesan - Message to be sent to the creator
     * @returns {Promise<Object>} - Transaction details from input variables
     * @throws {Error} - Throws error if parameters are missing or invalid
     */
    if (!saweriaUsername || !amount || !sender || !email || !pesan) {
        throw new Error("Parameter is missing!");
    }
    if (amount < 1000) {
        throw new Error("Minimum amount is 1000");
    }

    console.log(`Loading ${FRONTEND}/${saweriaUsername}`);
    
    const response = await axios.get(`${FRONTEND}/${saweriaUsername}`, { 
        headers: {
            ...headers,
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
            'Content-Type': 'text/html; charset=utf-8'
        }
    });
    
    const $ = cheerio.load(response.data);
    
    const nextDataScript = $('#__NEXT_DATA__');
    if (!nextDataScript.length) {
        console.log("Saweria account not found");
        throw new Error("Saweria account not found");
    }
    
    const nextData = JSON.parse(nextDataScript.text());
    const userId = nextData?.props?.pageProps?.data?.id;
    if (!userId) {
        console.log("Saweria account not found");
        throw new Error("Saweria account not found");
    }
    
    const payload = {
        agree: true,
        notUnderage: true,
        message: pesan,
        amount: parseInt(amount),
        payment_type: "qris",
        vote: "",
        currency: "IDR",
        customer_info: {
            first_name: sender,
            email: insertPlusInEmail(email, sender),
            phone: ""
        }
    };

    try {
        const paymentResponse = await axios.post(`${BACKEND}/donations/${userId}`, payload, { 
            headers: {
                ...headers,
                'Content-Type': 'application/json'
            }
        });
        return paymentResponse.data.data;
    } catch (error) {
        console.error('Payment request failed:', error.response?.data || error.message);
        throw new Error('Failed to create payment: ' + (error.response?.data?.message || error.message));
    }
}

async function generateQROnly(qrString, outputPath) {
    await QRCode.toFile(outputPath, qrString, {
        errorCorrectionLevel: 'H',
        margin: 1,
        width: 400,
        color: {
            dark: '#000000',
            light: '#ffffff'
        }
    });
    return outputPath;
}

async function generateQRWithTemplate(qrString, outputPath, saweriaUsername) {
    const TEMPLATE_WIDTH = 710;
    const TEMPLATE_HEIGHT = 844;
    
    const QR_SIZE = 380;
    
    const qrCanvas = createCanvas(QR_SIZE, QR_SIZE);
    await QRCode.toCanvas(qrCanvas, qrString, {
        errorCorrectionLevel: 'H',
        margin: 1,
        width: QR_SIZE,
        color: {
            dark: '#000000',
            light: '#ffffff'
        }
    });

    const canvas = createCanvas(TEMPLATE_WIDTH, TEMPLATE_HEIGHT);
    const ctx = canvas.getContext('2d');

    try {
        const template = await loadImage(path.join(__dirname, 'template.png'));
        ctx.drawImage(template, 0, 0, TEMPLATE_WIDTH, TEMPLATE_HEIGHT);

        ctx.font = 'bold 32px Arial';
        ctx.fillStyle = '#000000';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        ctx.fillText(saweriaUsername, TEMPLATE_WIDTH / 2, 160);

        const qrX = (TEMPLATE_WIDTH - QR_SIZE) / 2;
        const qrY = (TEMPLATE_HEIGHT - QR_SIZE) / 2 + 20;
        ctx.drawImage(qrCanvas, qrX, qrY);

        const buffer = canvas.toBuffer('image/png');
        fs.writeFileSync(outputPath, buffer);
        return outputPath;
    } catch (error) {
        console.log('Template tidak ditemukan, menggunakan QR code saja');
        return generateQROnly(qrString, outputPath);
    }
}

async function createPaymentQr(saweriaUsername, amount, email, outputPath = 'qris.png', useTemplate = true) {
    const randomSender = generate();
    const message = generateRandomMessage();

    const [qrString, transactionId] = await createPaymentQrRaw(saweriaUsername, amount, randomSender, email, message);
    if (qrString) {
        if (useTemplate) {
            await generateQRWithTemplate(qrString, outputPath, saweriaUsername);
        } else {
            await generateQROnly(qrString, outputPath);
        }
    }
    return [qrString, transactionId, outputPath];
}

async function createPaymentQrRaw(saweriaUsername, amount, sender, email, pesan) {
    const paymentDetails = await createPaymentString(saweriaUsername, amount, sender, email, pesan);
    return [paymentDetails.qr_string, paymentDetails.id];
}

module.exports = {
    paidStatus,
    createPaymentString,
    createPaymentQr,
    createPaymentQrRaw
}; 