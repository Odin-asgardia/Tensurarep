const mongoose = require('mongoose');

const characterSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    unique: true,
    minlength: 2,
    maxlength: 30
  },
  race: {
    type: String,
    enum: ['Human', 'Demon', 'Slime'],
    required: true
  },
  raceChangedFrom: {
    type: String,
    default: null
  },
  level: {
    type: Number,
    default: 1,
    min: 1,
    max: 999
  },
  experience: {
    type: Number,
    default: 0
  },
  experienceNextLevel: {
    type: Number,
    default: 1000
  },
  stats: {
    hp: { type: Number, default: 100 },
    maxHp: { type: Number, default: 100 },
    attack: { type: Number, default: 10 },
    defense: { type: Number, default: 5 },
    speed: { type: Number, default: 8 },
    magicPower: { type: Number, default: 12 },
    magicDefense: { type: Number, default: 5 }
  },
  inventory: {
    evolutionCrystals: { type: Number, default: 0 },
    raceFragments: { type: Number, default: 0 },
    gold: { type: Number, default: 0 },
    equipment: {
      weapon: { type: String, default: 'Iron Sword' },
      armor: { type: String, default: 'Leather Armor' },
      accessory: { type: String, default: null }
    },
    consumables: [{
      itemId: String,
      quantity: Number
    }]
  },
  skills: [{
    skillId: mongoose.Schema.Types.ObjectId,
    skillName: String,
    level: { type: Number, default: 1 },
    learned: Date
  }],
  learnedSkillLineages: {
    type: [String],
    enum: ['Virtue', 'Sin', 'Unbound'],
    default: []
  },
  storyProgress: {
    act: { type: Number, default: 1 },
    completed: { type: Boolean, default: false },
    lastCheckpoint: { type: String, default: 'Start' }
  },
  raceChangeAvailable: {
    type: Boolean,
    default: false
  },
  raceChangeCompleted: {
    type: Boolean,
    default: false
  },
  battleStats: {
    wins: { type: Number, default: 0 },
    losses: { type: Number, default: 0 },
    totalBattles: { type: Number, default: 0 }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

characterSchema.methods.calculateExpForNextLevel = function() {
  return Math.floor(1000 * (this.level * 1.1));
};

characterSchema.methods.gainExperience = function(amount) {
  this.experience += amount;
  
  while (this.experience >= this.experienceNextLevel && this.level < 999) {
    this.experience -= this.experienceNextLevel;
    this.level += 1;
    this.experienceNextLevel = this.calculateExpForNextLevel();
    
    this.stats.maxHp += 5;
    this.stats.hp = this.stats.maxHp;
    this.stats.attack += 2;
    this.stats.defense += 1;
    this.stats.speed += 1;
    this.stats.magicPower += 2;
  }
};

characterSchema.methods.addEvolutionCrystals = function(amount) {
  this.inventory.evolutionCrystals += amount;
};

characterSchema.methods.addRaceFragments = function(amount) {
  this.inventory.raceFragments += amount;
};

module.exports = mongoose.model('Character', characterSchema);