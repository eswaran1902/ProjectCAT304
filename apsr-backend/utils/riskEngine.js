// Simple AI Risk/Attribution Logic
const calculateRiskScore = (transactionData) => {
    let riskScore = 0; // 0 = Safe, 100 = Fraud

    const { amount, timeSinceLinkClick, ipAddress, userAgent } = transactionData;

    // Rule 1: High value orders are scrutinized more
    if (amount > 1000) riskScore += 20;

    // Rule 2: Too fast (bot-like)
    if (timeSinceLinkClick && timeSinceLinkClick < 5000) riskScore += 50; // < 5 seconds

    // Rule 3: Missing User Agent
    if (!userAgent) riskScore += 30;

    // Rule 4: "Random" AI anomaly factor (Simulated)
    const anomaly = Math.random();
    if (anomaly > 0.9) riskScore += 15;

    return Math.min(riskScore, 100);
};

const calculateAttributionConfidence = (clickData, orderData) => {
    // Logic to determine how confident we are that this click led to this order
    // Simplified for demo
    return 'High Confidence';
};

module.exports = { calculateRiskScore, calculateAttributionConfidence };
