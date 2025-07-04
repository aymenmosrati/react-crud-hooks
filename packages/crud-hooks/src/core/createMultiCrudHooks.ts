import { CrudOptions } from "../types/types";
import { createCrudHooks } from "./createCrudHooks";

export function createMultiCrudHooks<T = any>(
  definitions: Record<string, CrudOptions<T>>
) {
  const result: Record<string, any> = {};

  for (const [key, options] of Object.entries(definitions)) {
    result[key] = createCrudHooks(options);
  }

  return result;
}
