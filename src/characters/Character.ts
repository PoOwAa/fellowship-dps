import Spell from "../Spell";

export type CharacterOptions = {
  name: string;
  baseHealth: number;
  baseCrit: number;
  stamina: number;
  intellect: number;
  crit: number;
  expertise: number;
  haste: number;
};

export abstract class Character {
  name: string;
  protected baseHealth: number;
  health: number;

  /**
   * @param baseCrit - Base crit value
   *
   * Base critical strike chance for the character
   */
  protected baseCrit: number;

  /**
   * @param crit - Crit value
   *
   * 1 crit = 0.21% crit chance
   */
  crit: number;

  /**
   * @param stamina - Stamina value
   *
   * 1 stamina = 25 health
   */
  stamina: number;
  intellect: number;
  expertise: number;
  haste: number;

  spells: Spell<any>[];

  constructor(options: CharacterOptions) {
    this.name = options.name;
    this.baseHealth = options.baseHealth;
    this.baseCrit = options.baseCrit;
    this.stamina = options.stamina;
    this.health = this.baseHealth + options.stamina * 25;
    this.intellect = options.intellect;
    this.crit = this.baseCrit + options.crit * 0.21;
    this.expertise = options.expertise;
    this.haste = options.haste;
    this.spells = [];
  }

  getSpell(spellName: string): Spell<any> | undefined {
    return this.spells.find((spell) => spell.name === spellName);
  }

  castSpell(spellName: string): number {
    const spell = this.getSpell(spellName);
    if (!spell) return 0;

    return spell.cast(this);
  }

  reduceCooldowns(time: number): void {
    this.spells.forEach((spell) => spell.reduceCooldown(time));
  }
}
