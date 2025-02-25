import { Character } from "../Character";
import { RIME_SPELLS } from "./rime.spells";

export class Rime extends Character {
  static readonly MAX_ANIMA = 10;
  static readonly MAX_WINTER_ORB = 5;

  anima: number;
  winterOrb: number;

  constructor(
    stamina: number,
    intellect: number,
    crit: number,
    expertise: number,
    haste: number
  ) {
    super("Rime", 3907, 5, stamina, intellect, crit, expertise, haste);
    this.anima = 0;
    this.winterOrb = 0;

    this.spells = RIME_SPELLS;
  }

  generateAnima(amount: number): void {
    this.anima += amount;
    if (this.anima >= Rime.MAX_ANIMA) {
      this.anima = 0;
      this.triggerAnimaSpike(3);
      if (this.winterOrb < Rime.MAX_WINTER_ORB) {
        this.winterOrb++;
        console.log("Winter Orb generated");
      }
    }
  }

  triggerAnimaSpike(amount: number): void {
    const animaSpike = this.spells.find(
      (spell) => spell.name === "Anima Spike"
    );
    if (!animaSpike) return;
    for (let i = 0; i < amount; i++) {
      animaSpike.cast(this);
    }
  }

  private useWinterOrb(): number {
    if (this.winterOrb > 0) {
      this.winterOrb--;
      console.log("Winter Orb consumes!");
    }
    return 0;
  }
}
