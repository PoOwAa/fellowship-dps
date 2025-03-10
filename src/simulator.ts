import Character from "./characters/Character";

const GLOBAL_COOLDOWN = 1;

export function simulateRotation(character: Character, duration: number) {
  const spells = character.spells
    .sort((a, b) => {
      // Sort by damage / cast time
      const damagePerSecondA = a.damageFormula(character) / a.castTime;
      const damagePerSecondB = b.damageFormula(character) / b.castTime;

      return damagePerSecondB - damagePerSecondA;
    })
    .filter((spell) => spell.type === "active");

  const skillPriorityOrder = spells.map((spell) => spell.name);

  let totalDamage = 0;
  let elapsedTime = 0;

  const rotationOrder = [];

  while (elapsedTime < duration) {
    for (const spellName of skillPriorityOrder) {
      const spell = character.getSpell(spellName);

      if (!spell) {
        continue;
      }

      if (!spell.canCast(character)) {
        continue;
      }

      if (spell.castingType === "channeled") {
        // Apply tick damage
        for (let i = 0; i < spell.ticks; i++) {
          totalDamage += spell.cast(character);
          rotationOrder.push(`${spellName} tick ${i + 1}`);
          elapsedTime += spell.tickInterval;
          character.reduceCooldowns(spell.tickInterval);
        }
      } else {
        // Normal
        totalDamage += spell.cast(character);
        rotationOrder.push(spellName);
        elapsedTime += spell.castTime;
        character.reduceCooldowns(spell.castTime);
      }

      // Apply GCD
      if (spell.castTime < GLOBAL_COOLDOWN) {
        elapsedTime += GLOBAL_COOLDOWN - spell.castTime;
        character.reduceCooldowns(GLOBAL_COOLDOWN - spell.castTime);
      }
      break;
    }
  }

  return {
    totalDamage,
    dps: totalDamage / duration,
    rotationOrder,
  };
}
