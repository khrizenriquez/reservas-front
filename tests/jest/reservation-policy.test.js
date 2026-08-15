import { describe, expect, test } from "@jest/globals";

import {
  canManageReservation,
  canMutateReservation,
  reservationStartsInFuture,
  sortReservationsByStart,
  validateReservationInterval,
} from "../../lib/reservationPolicy.js";

describe("reservation policy", () => {
  test("validates a correct interval", () => {
    const result = validateReservationInterval(
      { date: "2026-08-16", startTime: "09:00", endTime: "10:00" },
      new Date("2026-08-15T16:00:00Z"),
    );
    expect(result).toBe("");
  });

  test("blocks invalid date and time rules", () => {
    expect(
      validateReservationInterval(
        { date: "2026-99-99", startTime: "09:00", endTime: "10:00" },
        new Date("2026-08-15T16:00:00Z"),
      ),
    ).toBe("Selecciona una fecha válida.");

    expect(
      validateReservationInterval(
        { date: "2026-08-16", startTime: "06:00", endTime: "10:00" },
        new Date("2026-08-15T16:00:00Z"),
      ),
    ).toBe("El intervalo debe estar entre 07:00 y 22:00.");

    expect(
      validateReservationInterval(
        { date: "2026-08-16", startTime: "12:00", endTime: "11:00" },
        new Date("2026-08-15T16:00:00Z"),
      ),
    ).toBe("La hora final debe ser posterior a la hora inicial.");
  });

  test("canManageReservation checks role and owner", () => {
    const reservation = { userId: 7 };
    expect(canManageReservation(reservation, { id: 7, role: { name: "TEACHER" } })).toBe(true);
    expect(canManageReservation(reservation, { id: 9, role: { name: "ADMIN" } })).toBe(true);
    expect(canManageReservation(reservation, { id: 9, role: { name: "TEACHER" } })).toBe(false);
  });

  test("future reservation and mutation permissions", () => {
    const now = new Date("2026-08-15T16:00:00Z");
    const activeFuture = { date: "2026-08-16", startTime: "09:00", status: "ACTIVE", userId: 5 };

    expect(reservationStartsInFuture(activeFuture, now)).toBe(true);
    expect(canMutateReservation(activeFuture, { id: 5, role: { name: "TEACHER" } }, now)).toBe(true);
    expect(canMutateReservation({ ...activeFuture, status: "CANCELLED" }, { id: 5, role: { name: "TEACHER" } }, now)).toBe(false);
  });

  test("sortReservationsByStart sorts chronologically", () => {
    const items = [
      { date: "2026-08-16", startTime: "12:00" },
      { date: "2026-08-16", startTime: "08:00" },
    ];
    items.sort(sortReservationsByStart);
    expect(items[0].startTime).toBe("08:00");
  });
});
