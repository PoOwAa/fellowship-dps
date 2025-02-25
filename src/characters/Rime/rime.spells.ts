import Spell from "../../Spell";
import { Rime } from "./Rime";

export enum RimeSpellNames {
  ANIMA_SPIKE = "Anima Spike",
  FROST_BOLT = "Frost Bolt",
  COLD_SNAP = "Cold Snap",
  GLACIAL_BLAST = "Glacial Blast",
  FREEZING_TORRENT = "Freezing Torrent",
  BURSTING_ICE = "Bursting Ice",
}

/**
 * Anima Spike
 * no description
 *
 * Based on tests it deals 35% intellect damage, can crit.
 */
const animaSpike = new Spell<Rime>({
  name: RimeSpellNames.ANIMA_SPIKE,
  castTime: 0,
  cooldown: 0,
  effect: () => {},
  damageFormula: (character) => character.intellect * 0.35,
  castCondition: () => true,
});

/**
 * Frost Bolt
 * 1.5s Cast
 * 40yd range
 *
 * Hurl a bolt of water and frost at target enemy, dealing
 * 73% intellect damage.
 *
 * Generates 3 Anima.
 */
const frostBolt = new Spell<Rime>({
  name: RimeSpellNames.FROST_BOLT,
  castTime: 1.5,
  cooldown: 0,
  effect: (character) => {
    if (character instanceof Rime) character.generateAnima(3);
  },
  damageFormula: (character) => character.intellect * 0.73,
});

/**
 * Cold Snap
 * Instant
 * 40yd range
 * 8.0s cooldown
 *
 * Assault the target with extreme cold, dealing 204% intellect damage.
 *
 * Cold Snap triggers Anima Spikes and generates 1 Winter Orb.
 */
const coldSnap = new Spell<Rime>({
  name: RimeSpellNames.COLD_SNAP,
  castTime: 0,
  cooldown: 8,
  effect: (character) => {
    if (character instanceof Rime) {
      character.updateWinterOrb(1);
      character.triggerAnimaSpike(3);
    }
  },
  damageFormula: (character) => character.intellect * 2.04,
});

/**
 * Glacial Blast
 * 2s Cast
 * 40yd range
 * 2 Winter Orbs
 *
 * Hurl a mass of ice at target enemy, dealing 504% intellect damage.
 */
const glacialBlast = new Spell<Rime>({
  name: RimeSpellNames.GLACIAL_BLAST,
  castTime: 2,
  cooldown: 0,
  effect: (character) => {
    character.updateWinterOrb(-2);
  },
  damageFormula: (character: Rime) => character.intellect * 5.04,
  castCondition: (character: Rime) => character.winterOrb >= 2,
});

/**
 * Freezing Torrent
 * 2s Channel
 * 40yd range
 * 10.0s cooldown
 *
 * Flay your target with a beam of frost energy, dealing 390% intellect
 * damage over 2 seconds while channeling.
 *
 * Generates 1 Anima per tick up to 6 Anima when fully channeled.
 */
const freezingTorrent = new Spell<Rime>({
  name: RimeSpellNames.FREEZING_TORRENT,
  castTime: 2,
  cooldown: 10,
  effect: (character) => {
    for (let i = 0; i < 6; i++) {
      character.generateAnima(1);
    }
    console.log("Freezing Torrent fully channeled: 6 Anima generated");
  },
  damageFormula: (character) => character.intellect * 3.9,
});

/**
 * Bursting Ice
 * 2s Cast
 * 40yd range
 * 15.0s cooldown
 *
 * Conjures an icy crystal inside a target that periodically erupts,
 * dealing 366% intellect damage to the target and nearby enemies
 * over 3 seconds.
 *
 * Bursting Ice generates 1 Anima per enemy hit up to a maximum
 * of 3 Anima each tick.
 */
const burstingIce = new Spell<Rime>({
  name: RimeSpellNames.BURSTING_ICE,
  castTime: 2,
  cooldown: 15,
  effect: (character, additionalData) => {
    const enemiesHit = additionalData?.enemiesHit || 1;
    // maximum 3 enemy / tick
    const animaGeneratedPerTick = Math.min(enemiesHit, 3);

    // 2 tick / second
    // 3 second duration on target
    // overall: 6 ticks
    const ticks = 6;
    for (let i = 0; i < ticks; i++) {
      character.generateAnima(animaGeneratedPerTick);
    }
    console.log(
      `Bursting Ice hit ${enemiesHit} enemies, generating ${
        animaGeneratedPerTick * ticks
      } Anima`
    );
  },
  damageFormula: (character) => character.intellect * 3.66,
});

export const RIME_SPELLS = [
  frostBolt,
  coldSnap,
  glacialBlast,
  freezingTorrent,
  burstingIce,
  animaSpike,
];
