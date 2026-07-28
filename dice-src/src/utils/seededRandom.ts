/**
 * Deterministic pseudo-random helpers for the public BEACON preview.
 *
 * This is not cryptography. Its job is continuity: the same encounter seed
 * recreates the same illustrative profile and souvenir.
 */

export type RandomSource = () => number;

/** Converts any text seed into a stable unsigned 32-bit number. */
export function hashSeed(input: string): number {
  let hash = 2166136261;

  for (let index = 0; index < input.length; index += 1) {
    hash ^= input.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
}

/** Small deterministic PRNG suitable for repeatable UI generation. */
export function createSeededRandom(seed: string | number): RandomSource {
  let state = typeof seed === "number" ? seed >>> 0 : hashSeed(seed);

  return () => {
    state += 0x6d2b79f5;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

/** Fisher-Yates shuffle using the supplied random source. */
export function shuffleWithRandom<T>(
  values: readonly T[],
  random: RandomSource
): T[] {
  const result = [...values];

  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
  }

  return result;
}

/** Generates a compact seed for one visitor encounter. */
export function createEncounterSeed(): string {
  const timePart = Date.now().toString(36);
  const randomPart = Math.floor(Math.random() * 0xffffffff)
    .toString(36)
    .padStart(7, "0");

  return `BEACON-${timePart}-${randomPart}`.toUpperCase();
}

/** Converts a seed into a stable display-safe numeric suffix. */
export function seedToDisplayNumber(seed: string, digits = 4): string {
  const modulus = 10 ** digits;
  return String(hashSeed(seed) % modulus).padStart(digits, "0");
}
