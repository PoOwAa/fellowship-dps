import Spell from "../Spell";

export class Character {
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

  spells: Spell[];

  constructor(
    name: string,
    baseHealth: number,
    baseCrit: number,
    stamina: number,
    intellect: number,
    crit: number,
    expertise: number,
    haste: number
  ) {
    this.name = name;
    this.baseHealth = baseHealth;
    this.baseCrit = baseCrit;
    this.stamina = stamina;
    this.health = this.baseHealth + stamina * 25;
    this.intellect = intellect;
    this.crit = this.baseCrit + crit * 0.21;
    this.expertise = expertise;
    this.haste = haste;
    this.spells = [];
  }

  castSpell(spellName: string): number {
    const spell = this.spells.find((spell) => spell.name === spellName);
    if (!spell) return 0;

    return spell.cast(this);
  }

  reduceCooldowns(time: number): void {
    this.spells.forEach((spell) => spell.reduceCooldown(time));
  }
}
