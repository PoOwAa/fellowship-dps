import { Character } from "./characters/Character";
import { RimeSpellNames } from "./characters/Rime/rime.spells";

const GLOBAL_COOLDOWN = 1;

export function simulateRotation(character: Character, duration: number) {
  const priorityOrder: RimeSpellNames[] = [
    RimeSpellNames.GLACIAL_BLAST,
    RimeSpellNames.COLD_SNAP,
    RimeSpellNames.FREEZING_TORRENT,
    RimeSpellNames.BURSTING_ICE,
    RimeSpellNames.FROST_BOLT,
  ];
  let totalDamage = 0;
  let elapsedTime = 0;

  const rotationOrder = [];

  while (elapsedTime < duration) {
    for (const spellName of priorityOrder) {
      const spell = character.spells.find((s) => s.name === spellName);
      if (spell && spell.canCast(character)) {
        totalDamage += spell.cast(character);
        rotationOrder.push(spellName);
        elapsedTime += spell.castTime;
        character.reduceCooldowns(spell.castTime);

        // Apply GCD
        if (spell.castTime < GLOBAL_COOLDOWN) {
          elapsedTime += GLOBAL_COOLDOWN - spell.castTime;
          character.reduceCooldowns(GLOBAL_COOLDOWN - spell.castTime);
        }
        break;
      }
    }
  }

  return {
    totalDamage,
    dps: totalDamage / duration,
    rotationOrder,
  };
}
