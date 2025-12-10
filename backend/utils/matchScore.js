// backend/utils/matchScore.js
const bioSimilarity = require("./bioSimilarity");

// Calculate skill-based score
function calcSkillScore(userA, userB) {
  const aWants = new Set(userA.skillsWant || []);
  const aKnows = new Set(userA.skillsKnow || []);
  const bWants = new Set(userB.skillsWant || []);
  const bKnows = new Set(userB.skillsKnow || []);

  let aFromB = 0;
  bKnows.forEach((skill) => {
    if (aWants.has(skill)) aFromB++;
  });

  let bFromA = 0;
  aKnows.forEach((skill) => {
    if (bWants.has(skill)) bFromA++;
  });

  const total = aFromB + bFromA;

  const maxPossible = 10; // tunable
  const normalized = Math.min(1, total / maxPossible); // 0–1
  const skillScore = Math.round(normalized * 70); // out of 70

  return skillScore;
}

// Learning style score
function calcStyleScore(userA, userB) {
  if (!userA.learningStyle || !userB.learningStyle) return 0;
  if (userA.learningStyle === "" || userB.learningStyle === "") return 0;
  return userA.learningStyle === userB.learningStyle ? 15 : 5;
}

// Bio similarity score
function calcBioScore(userA, userB) {
  const sim = bioSimilarity(userA.bio, userB.bio); // 0–1
  return Math.round(sim * 15); // 0–15
}

function calcTotalMatchScore(userA, userB) {
  const skillScore = calcSkillScore(userA, userB);
  const styleScore = calcStyleScore(userA, userB);
  const bioScore = calcBioScore(userA, userB);

  const total = skillScore + styleScore + bioScore; // ~0–100
  return {
    total,
    skillScore,
    styleScore,
    bioScore,
  };
}

module.exports = { calcTotalMatchScore };
