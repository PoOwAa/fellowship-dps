import Character from "./characters/Character";

export type SpellCastingType = "instant" | "cast" | "channeled";
export type SpellType = "active" | "passive";

export type SpellOptions<T extends Character> = {
  name: string;
  type: SpellType;
  castTime: number;
  castingType?: SpellCastingType;
  tickInterval?: number;
  cooldown: number;
  effect?: (character: T, additionalData?: any) => void;
  damageFormula: (character: T, additionalData?: any) => number;
  castCondition?: (character: T) => boolean;
  baseCrit?: number;
};

export default class Spell<T extends Character> {
  name: string;
  type: SpellType;
  castTime: number;
  castingType: SpellCastingType;
  tickInterval: number;
  cooldown: number;
  cooldownRemaining: number;
  effect: (character: T, additionalData?: any) => void;
  damageFormula: (character: T, additionalData?: any) => number;
  castCondition: (character: T) => boolean;
  baseCrit: number;

  constructor(options: SpellOptions<T>) {
    this.name = options.name;
    this.castTime = options.castTime;
    this.castingType = options.castingType || "cast";
    this.cooldown = options.cooldown;
    this.cooldownRemaining = 0;
    this.effect = options.effect || (() => {});
    this.damageFormula = options.damageFormula;
    this.baseCrit = options.baseCrit || 0;
    this.castCondition = options.castCondition || (() => true);
    this.tickInterval = options.tickInterval || 0.5;
    this.type = options.type;
  }

  cast(character: T, additionalData?: any): number {
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

  canCast(character: T): boolean {
    return this.cooldownRemaining <= 0 && this.castCondition(character);
  }

  get ticks(): number {
    if (this.castingType !== "channeled") {
      return 0;
    }

    return Math.floor(this.castTime / this.tickInterval);
  }
}
