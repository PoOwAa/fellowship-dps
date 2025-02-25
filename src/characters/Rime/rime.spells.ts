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

export const RIME_SPELLS = [
  new Spell(
    RimeSpellNames.ANIMA_SPIKE,
    0,
    0,
    () => {},
    (character) => character.intellect * 0.35,
    () => true
  ),
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
  new Spell(
    RimeSpellNames.FROST_BOLT,
    1.5,
    0,
    (character) => {
      if (character instanceof Rime) character.generateAnima(3);
    },
    (character) => character.intellect * 0.73,
    (character) => true
  ),
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
  new Spell(
    RimeSpellNames.COLD_SNAP,
    0,
    8,
    (character) => {
      if (
        character instanceof Rime &&
        character.winterOrb < Rime.MAX_WINTER_ORB
      ) {
        character.winterOrb++;
        console.log("Winter Orb generated");
        character.triggerAnimaSpike(3);
      }
    },
    (character) => character.intellect * 2.04,
    () => true
  ),
  /**
   * Glacial Blast
   * 2s Cast
   * 40yd range
   * 2 Winter Orbs
   *
   * Hurl a mass of ice at target enemy, dealing 504% intellect damage.
   */
  new Spell(
    RimeSpellNames.GLACIAL_BLAST,
    2,
    0,
    (character) => {
      if (character instanceof Rime && character.winterOrb >= 2) {
        character.winterOrb -= 2;
        console.log("Glacial Blast consumed 2 Winter Orbs.");
      } else {
        console.log("Not enough Winter Orbs to cast Glacial Blast");
      }
    },
    (character) =>
      character instanceof Rime && character.winterOrb >= 2
        ? character.intellect * 5.04
        : 0,
    (character) => character instanceof Rime && character.winterOrb >= 2
  ),
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
  new Spell(
    RimeSpellNames.FREEZING_TORRENT,
    2,
    10,
    (character) => {
      if (character instanceof Rime) {
        for (let i = 0; i < 6; i++) {
          character.generateAnima(1);
        }
        console.log("Freezing Torrent fully channeled: 6 Anima generated");
      }
    },
    (character) => character.intellect * 3.9,
    () => true
  ),
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
  new Spell(
    RimeSpellNames.BURSTING_ICE,
    2,
    15,
    (character, additionalData) => {
      if (character instanceof Rime) {
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
      }
    },
    (character) => character.intellect * 3.66,
    () => true
  ),
];
