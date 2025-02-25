import { Rime } from "./characters/Rime/Rime";
import { simulateRotation } from "./simulator";

const rime = new Rime(100, 100, 5, 0, 0);
const duration = 20;
const stats = simulateRotation(rime, duration);
console.log(`${rime.name} rotation calculation in ${duration} seconds`);
console.log(`Total damage: ${stats.totalDamage}`);
console.log(`DPS: ${stats.dps}`);
console.log(`Rotation: ${stats.rotationOrder.join(" -> ")}`);
