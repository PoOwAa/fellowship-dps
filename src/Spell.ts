import { Character } from "./characters/Character";

export default class Spell {
  name: string;
  castTime: number;
  cooldown: number;
  cooldownRemaining: number;
  effect: (character: Character, additionalData?: any) => void;
  damageFormula: (character: Character, additionalData?: any) => number;
  castCondition: (character: Character) => boolean;
  baseCrit: number;

  constructor(
    name: string,
    castTime: number,
    cooldown: number,
    effect: (character: Character, additionalData?: any) => void,
    damageFormula: (character: Character, additionalData?: any) => number,
    castCondition: (character: Character) => boolean,
    baseCrit: number = 0
  ) {
    this.name = name;
    this.castTime = castTime;
    this.cooldown = cooldown;
    this.cooldownRemaining = 0;
    this.effect = effect;
    this.damageFormula = damageFormula;
    this.baseCrit = baseCrit;
    this.castCondition = castCondition;
  }

  cast(character: Character, additionalData?: any): number {
    this.cooldownRemaining = this.cooldown;

    const isCrit =
      Math.floor(Math.random() * 100) < character.crit + this.baseCrit;
    const damage =
      this.damageFormula(character, additionalData) * (isCrit ? 2 : 1);
    console.log(
      `${character.name} casts ${this.name} dealing ${damage} damage`
    );
    this.effect(character);
    return damage;
  }

  reduceCooldown(time: number): void {
    if (this.cooldownRemaining > 0) {
      this.cooldownRemaining = Math.max(this.cooldownRemaining - time, 0);
    }
  }

  canCast(character: Character): boolean {
    return this.cooldownRemaining <= 0 && this.castCondition(character);
  }
}
