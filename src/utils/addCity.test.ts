import { describe, it, expect } from "vitest";
import { addCity } from "./addCity"

describe("addCity", () => {
  it("addCity", () => {
    expect(addCity(["Москва"], "Казань")).toEqual(["Москва", "Казань"]);
  })

  it("не добавляем повтор и оставляет тот же массив", () => {
    const cities = ["Москва"];
    expect(addCity(cities, "Москва")).toBe(cities);
  });
})