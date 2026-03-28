const mongoose = require('mongoose');
const battleSchema = new mongoose.Schema({
    character1Id: { type: mongoose.Schema.Types.ObjectId, ref: 'Character', required: true },
    character2Id: { type: mongoose.Schema.Types.ObjectId, ref: 'Character' },
    battleType: { type: String, enum: ['PvP', 'PvE', 'Story'], default: 'PvE' },
    winnerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Character' },
    turns: [{
        turnNumber: Number,
        character1Action: { type: String, action: String, skillId: mongoose.Schema.Types.ObjectId, damage: Number },
        character2Action: { type: String, action: String, skillId: mongoose.Schema.Types.ObjectId, damage: Number },
        character1HP: Number,
        character2HP: Number
    }],
    totalTurns: Number,
    expReward: Number,
    crystalReward: Number,
    fragmentReward: Number,
    goldReward: Number,
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Battle', battleSchema);