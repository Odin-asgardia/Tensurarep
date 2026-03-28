const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
    skillName: { type: String, required: true, unique: true },
    skillLineage: { type: String, enum: ['Virtue', 'Sin', 'Unbound'], required: true },
    description: String,
    levelRequired: { type: Number, default: 1 },
    skillType: { type: String, enum: ['Offensive', 'Defensive', 'Support', 'Healing', 'Buff', 'Debuff'], required: true },
    baseDamage: { type: Number, default: 0 },
    manaCost: { type: Number, default: 0 },
    cooldown: { type: Number, default: 0 },
    effect: { type: String, required: true },
    raceRestriction: { type: String, enum: ['Human', 'Demon', 'Slime', 'None'], default: 'None' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Skill', skillSchema);