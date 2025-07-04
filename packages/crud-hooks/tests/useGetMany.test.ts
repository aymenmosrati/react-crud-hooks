import { describe, it, expect } from "vitest";
import { createCrudHooks } from "../src";

describe("createCrudHooks", () => {
  it("should create basic hooks", () => {
    expect(typeof createCrudHooks).toBe("function");
  });
});
