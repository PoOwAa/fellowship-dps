import { Rime } from "./characters/Rime/Rime";
import { simulateRotation } from "./simulator";

const rime = new Rime({
  stamina: 100,
  intellect: 100,
  crit: 5,
  expertise: 0,
  haste: 0,
});

const duration = 20;
const stats = simulateRotation(rime, duration);
console.log(`${rime.name} rotation calculation in ${duration} seconds`);
console.log(`Total damage: ${stats.totalDamage}`);
console.log(`DPS: ${stats.dps}`);
console.log(`Rotation: ${stats.rotationOrder.join(" -> ")}`);
