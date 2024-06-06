import type { Variant } from "types/Variant";

/**
 * Returns a random variant from the given array of variants based on their chance.
 *
 * @param {Variant<T>[]} variants - An array of variants.
 * @return {Variant<T> | null} - A random variant from the given array or null if the array is empty.
 */
export const useVariant = <T>(variants: Variant<T>[]): Variant<T> | null => {
  if (variants.length === 0) {
    return null;
  }

  let count_variants = 0;
  for (const variant of variants) {
    count_variants += variant.chance;
  }

  const one_range = Math.ceil(100 / count_variants);
  let start_range = 0;

  const slv: Variant<T>[] = [];
  for (const variant of variants) {
    start_range = start_range + variant.chance * one_range;

    slv.push({
      ...variant,
      chance: start_range > 100 ? 100 : start_range,
    });
  }

  const random = Math.floor(Math.random() * 100) + 1;

  for (const s of slv) {
    if (random <= s.chance) {
      return s;
    }
  }

  return null;
}