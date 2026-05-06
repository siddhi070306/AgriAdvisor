const Feedback = require("../models/Feedback");

// 🎯 Adjustable weight (easy to tune later)
const PERSONALIZATION_WEIGHT = 8;
const MAX_BOOST = 20;
const MIN_BOOST = -20;

/**
 * Generate explanation text for UI
 */
function generateExplanation(crop, score) {
  if (!crop) return "General recommendation";

  if (score > 1.5) {
    return `Strong past success with ${crop}`;
  } else if (score > 0) {
    return `Moderate performance with ${crop}`;
  } else {
    return `Previous low performance with ${crop}`;
  }
}

/**
 * Apply personalization based on user feedback history
 */
const applyPersonalization = async (recommendations, userId) => {
  try {
    // 🔒 Safety check
    if (!userId || !recommendations || recommendations.length === 0) {
      return recommendations;
    }

    // 📊 Fetch user feedback from DB
    const feedbacks = await Feedback.find({ userId });

    if (!feedbacks.length) return recommendations;

    // 🧠 Build crop statistics
    const cropStats = {};

    feedbacks.forEach(fb => {
      const crop = (fb.cropName || "").toLowerCase();
      if (!crop) return;

      if (!cropStats[crop]) {
        cropStats[crop] = { total: 0, score: 0 };
      }

      cropStats[crop].total++;

      // 🎯 Outcome scoring
      if (fb.outcome === "Profit") cropStats[crop].score += 2;
      else if (fb.outcome === "Neutral") cropStats[crop].score += 1;
      else if (fb.outcome === "Loss") cropStats[crop].score -= 1;

      // ⭐ Rating weight
      if (fb.rating) {
        cropStats[crop].score += fb.rating / 5;
      }
    });

    // 🧠 Normalize scores
    const cropScores = {};
    Object.keys(cropStats).forEach(crop => {
      cropScores[crop] =
        cropStats[crop].score / cropStats[crop].total;
    });

    // 🚀 Apply personalization
    const personalized = recommendations.map(rec => {
      let boost = 0;

      // 🔍 Robust crop matching
      const recText = `${rec.crop || ""} ${rec.action || ""}`.toLowerCase();

      const matchedCrop = Object.keys(cropScores).find(crop =>
        recText.includes(crop)
      );

      if (matchedCrop) {
        boost = cropScores[matchedCrop] * PERSONALIZATION_WEIGHT;
      }

      // ⚠️ Clamp boost to avoid extreme values
      boost = Math.max(MIN_BOOST, Math.min(MAX_BOOST, boost));

      // 🎯 Base score from system
      const baseScore = rec.score || rec.confidence || 50;

      return {
        ...rec,
        personalizedScore: baseScore + boost,
        basedOn: matchedCrop || null,
        personalized: boost !== 0,
        explanation: generateExplanation(
          matchedCrop,
          cropScores[matchedCrop]
        )
      };
    });

    // 📊 Sort by personalized score
    return personalized.sort(
      (a, b) => b.personalizedScore - a.personalizedScore
    );

  } catch (error) {
    console.error("❌ Personalization Error:", error);
    return recommendations; // fallback safely
  }
};

module.exports = { applyPersonalization };