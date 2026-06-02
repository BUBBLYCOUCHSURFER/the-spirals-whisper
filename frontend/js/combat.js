// Combat simulator logic

let combatState = null;

class CombatSimulator {
  constructor(playerClass = 'hunter') {
    const stats = CardEngine.getClassStats(playerClass);
    this.player = {
      class: playerClass,
      health: stats.health,
      maxHealth: stats.health,
      mana: stats.mana,
      maxMana: stats.mana,
      hand: [],
      deck: [...CardEngine.getStarterDeck(playerClass)],
      discard: []
    };
    this.monster = { name: 'Dungeon Wraith', health: 20, maxHealth: 20, attack: 2 };
    this.gameLog = [];
    this.shuffleDeck();
    this.drawHand(5);
  }
  
  shuffleDeck() {
    for (let i = this.player.deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.player.deck[i], this.player.deck[j]] = [this.player.deck[j], this.player.deck[i]];
    }
  }
  
  drawHand(count) {
    for (let i = 0; i < count; i++) {
      if (this.player.deck.length === 0) {
        this.player.deck = [...this.player.discard];
        this.player.discard = [];
        this.shuffleDeck();
        if (this.player.deck.length === 0) break;
      }
      const card = this.player.deck.pop();
      if (card) this.player.hand.push(card);
    }
  }
  
  playCard(cardIndex) {
    if (cardIndex < 0 || cardIndex >= this.player.hand.length) return { success: false, error: 'Invalid card' };
    const cardId = this.player.hand[cardIndex];
    const card = CardEngine.getCard(cardId);
    if (!card) return { success: false, error: 'Card not found' };
    if (this.player.mana < card.cost) return { success: false, error: 'Not enough mana' };
    
    const effect = card.effect(this.monster);
    if (effect.damage) {
      this.monster.health -= effect.damage;
      this.gameLog.push(`${card.name} deals ${effect.damage} damage!`);
    }
    if (effect.heal) {
      this.player.health = Math.min(this.player.health + effect.heal, this.player.maxHealth);
      this.gameLog.push(`${card.name} heals ${effect.heal} health!`);
    }
    
    this.player.mana -= card.cost;
    this.player.hand.splice(cardIndex, 1);
    this.player.discard.push(cardId);
    
    if (this.monster.health <= 0) {
      this.gameLog.push('Victory! Monster defeated!');
      return { success: true, victory: true };
    }
    return { success: true };
  }
  
  endTurn() {
    this.player.discard.push(...this.player.hand);
    this.player.hand = [];
    this.player.mana = this.player.maxMana;
    
    const damage = this.monster.attack;
    this.player.health -= damage;
    this.gameLog.push(`${this.monster.name} attacks for ${damage} damage!`);
    
    if (this.player.health <= 0) {
      this.gameLog.push('Defeat! You were overcome.');
      return { success: true, defeat: true };
    }
    
    this.drawHand(5);
    return { success: true };
  }
  
  getState() {
    return { player: { ...this.player }, monster: { ...this.monster }, gameLog: [...this.gameLog] };
  }
}

function renderCombatUI() {
  const section = document.getElementById('combat-simulator');
  if (!section) return;
  if (!combatState) combatState = new CombatSimulator('hunter');
  
  const state = combatState.getState();
  section.innerHTML = `
    <div class="combat-container">
      <h2 class="section-title">⚔️ Combat Simulator</h2>
      <div class="combat-board">
        <div class="monster-panel">
          <h3 class="monster-name">${state.monster.name}</h3>
          <div class="health-bar">
            <div class="health-fill" style="width: ${(state.monster.health / state.monster.maxHealth) * 100}%"></div>
            <span class="health-text">${state.monster.health}/${state.monster.maxHealth}</span>
          </div>
          <p class="monster-stats">Attack: <span class="stat-value">${state.monster.attack}</span></p>
        </div>
        <div class="player-stats-panel">
          <div class="stat-box"><label>Health</label><div class="stat-bar"><div class="stat-fill health-fill" style="width: ${(state.player.health / state.player.maxHealth) * 100}%"></div><span class="stat-value">${state.player.health}/${state.player.maxHealth}</span></div></div>
          <div class="stat-box"><label>Mana</label><div class="stat-bar"><div class="stat-fill mana-fill" style="width: ${(state.player.mana / state.player.maxMana) * 100}%"></div><span class="stat-value">${state.player.mana}/${state.player.maxMana}</span></div></div>
          <div class="stat-box"><label>Hand</label><span class="stat-value">${state.player.hand.length} cards</span></div>
        </div>
      </div>
      <div class="hand-display">
        <h4>Your Hand</h4>
        <div class="card-hand">
          ${state.player.hand.map((cardId, idx) => {
            const card = CardEngine.getCard(cardId);
            if (!card) return '';
            const canPlay = state.player.mana >= card.cost;
            return `<div class="hand-card ${!canPlay ? 'disabled' : ''}" onclick="playCardFromHand(${idx})"><div class="card-cost">${card.cost}</div><div class="card-name">${card.name}</div><div class="card-effect-text">${card.effect({}).description}</div></div>`;
          }).join('')}
        </div>
      </div>
      <div class="combat-actions">
        <button class="action-button end-turn" onclick="endTurnInCombat()">End Turn</button>
        <button class="action-button reset" onclick="resetCombat()">Reset Combat</button>
      </div>
      <div class="game-log">
        <h4>Combat Log</h4>
        <div class="log-content">${state.gameLog.map(log => `<p class="log-entry">${log}</p>`).join('')}</div>
      </div>
    </div>
    <style>
      .combat-container { max-width: 1200px; margin: 0 auto; }
      .combat-board { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-bottom: 2rem; }
      .monster-panel, .player-stats-panel { background: var(--bg-slate); border: 1px solid var(--color-gold); border-radius: 4px; padding: 1.5rem; box-shadow: inset 0 0 20px rgba(245, 158, 11, 0.05); }
      .monster-name { color: var(--color-crimson); font-size: 1.5rem; margin-bottom: 1rem; }
      .health-bar, .stat-bar { background: var(--bg-slate-dark); border: 1px solid var(--color-gold); border-radius: 3px; height: 30px; position: relative; overflow: hidden; margin-bottom: 0.5rem; }
      .health-fill { background: linear-gradient(to right, var(--color-crimson), var(--color-crimson-bright)); height: 100%; transition: width 0.3s ease; }
      .mana-fill { background: linear-gradient(to right, var(--color-teal), var(--color-teal-dark)); height: 100%; transition: width 0.3s ease; }
      .health-text, .stat-value { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); color: var(--color-text-primary); font-weight: 600; font-size: 0.9rem; }
      .stat-value { color: var(--color-gold); }
      .stat-box { margin-bottom: 1rem; }
      .stat-box label { display: block; color: var(--color-gold); font-weight: 600; margin-bottom: 0.5rem; }
      .hand-display { background: var(--bg-slate); border: 1px solid var(--color-gold); border-radius: 4px; padding: 1.5rem; margin-bottom: 2rem; box-shadow: inset 0 0 20px rgba(245, 158, 11, 0.05); }
      .hand-display h4 { color: var(--color-gold); margin-bottom: 1rem; }
      .card-hand { display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 1rem; }
      .hand-card { background: var(--bg-slate-dark); border: 2px solid var(--color-gold); border-radius: 3px; padding: 0.75rem; cursor: pointer; transition: all 0.3s ease; text-align: center; }
      .hand-card:not(.disabled):hover { background: var(--bg-slate); box-shadow: var(--shadow-glow); transform: translateY(-2px); }
      .hand-card.disabled { opacity: 0.5; cursor: not-allowed; border-color: var(--color-text-secondary); }
      .card-cost { background: var(--color-gold); color: var(--bg-obsidian); border-radius: 2px; padding: 0.25rem 0.5rem; font-weight: 600; font-size: 0.8rem; display: inline-block; margin-bottom: 0.5rem; }
      .card-name { color: var(--color-gold); font-weight: 600; font-size: 0.9rem; margin-bottom: 0.25rem; }
      .card-effect-text { color: var(--color-text-secondary); font-size: 0.75rem; }
      .combat-actions { display: flex; gap: 1rem; justify-content: center; margin-bottom: 2rem; }
      .action-button { padding: 0.75rem 2rem; background: var(--color-gold); color: var(--bg-obsidian); border: 1px solid var(--color-gold-bright); border-radius: 3px; cursor: pointer; font-weight: 600; text-transform: uppercase; transition: all 0.3s ease; }
      .action-button:hover { background: var(--color-gold-bright); box-shadow: var(--shadow-glow); }
      .action-button.reset { background: var(--bg-slate); color: var(--color-text-primary); border-color: var(--color-text-secondary); }
      .game-log { background: var(--bg-slate); border: 1px solid var(--color-gold); border-radius: 4px; padding: 1.5rem; max-height: 300px; overflow-y: auto; }
      .game-log h4 { color: var(--color-gold); margin-bottom: 1rem; }
      .log-content { background: var(--bg-slate-dark); padding: 1rem; border-radius: 3px; }
      .log-entry { color: var(--color-text-secondary); font-size: 0.9rem; margin-bottom: 0.5rem; border-bottom: 1px solid var(--color-teal-dark); padding-bottom: 0.5rem; }
      .log-entry:last-child { border-bottom: none; margin-bottom: 0; padding-bottom: 0; }
      @media (max-width: 768px) { .combat-board { grid-template-columns: 1fr; } }
    </style>
  `;
}

function playCardFromHand(cardIndex) {
  if (!combatState) return;
  const result = combatState.playCard(cardIndex);
  if (result.success) {
    if (result.victory) showVictoryOverlay();
    renderCombatUI();
  } else {
    UI.showNotification(`Error: ${result.error}`, 'error');
  }
}

function endTurnInCombat() {
  if (!combatState) return;
  const result = combatState.endTurn();
  if (result.success) {
    if (result.defeat) showDefeatOverlay();
    renderCombatUI();
  }
}

function resetCombat() {
  combatState = new CombatSimulator('hunter');
  renderCombatUI();
}

function showVictoryOverlay() {
  const overlay = document.createElement('div');
  overlay.innerHTML = `<div style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0, 0, 0, 0.8); display: flex; align-items: center; justify-content: center; z-index: 10000;"><div style="background: var(--bg-slate); border: 3px solid var(--color-gold); border-radius: 4px; padding: 2rem; text-align: center; box-shadow: 0 0 50px var(--color-gold);"><h2 style="color: var(--color-gold); font-size: 2.5rem; margin-bottom: 1rem; text-transform: uppercase;">Victory!</h2><p style="color: var(--color-text-primary); margin-bottom: 1.5rem;">You have defeated the Dungeon Wraith!</p><button onclick="location.reload()" style="padding: 0.75rem 2rem; background: var(--color-gold); color: var(--bg-obsidian); border: 1px solid var(--color-gold-bright); border-radius: 3px; cursor: pointer; font-weight: 600; text-transform: uppercase;">Play Again</button></div></div>`;
  document.body.appendChild(overlay);
}

function showDefeatOverlay() {
  const overlay = document.createElement('div');
  overlay.innerHTML = `<div style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0, 0, 0, 0.8); display: flex; align-items: center; justify-content: center; z-index: 10000;"><div style="background: var(--bg-slate); border: 3px solid var(--color-crimson); border-radius: 4px; padding: 2rem; text-align: center; box-shadow: 0 0 50px var(--color-crimson);"><h2 style="color: var(--color-crimson); font-size: 2.5rem; margin-bottom: 1rem; text-transform: uppercase;">Defeat!</h2><p style="color: var(--color-text-primary); margin-bottom: 1.5rem;">You were overcome by the darkness.</p><button onclick="location.reload()" style="padding: 0.75rem 2rem; background: var(--color-crimson); color: var(--color-text-primary); border: 1px solid var(--color-crimson-bright); border-radius: 3px; cursor: pointer; font-weight: 600; text-transform: uppercase;">Try Again</button></div></div>`;
  document.body.appendChild(overlay);
}

document.addEventListener('DOMContentLoaded', () => {
  renderCombatUI();
});

window.Combat = { CombatSimulator, renderCombatUI, playCardFromHand, endTurnInCombat, resetCombat };
