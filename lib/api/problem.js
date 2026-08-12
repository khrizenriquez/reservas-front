const FRIENDLY_MESSAGES = Object.freeze({
  AUTH_INVALID_CREDENTIALS: "El correo o la contraseña no son correctos.",
  AUTH_REQUIRED: "Tu sesión terminó. Inicia sesión nuevamente.",
  AUTH_FORBIDDEN: "No tienes permisos para realizar esta acción.",
  AUTH_ACCOUNT_DISABLED: "La cuenta está deshabilitada. Contacta al administrador.",
  RATE_LIMITED: "Hay demasiados intentos. Espera un momento e inténtalo de nuevo.",
  RESERVATION_CONFLICT: "Ese horario ya no está disponible. Elige otro espacio.",
  RESERVATION_OUTSIDE_POLICY: "La reserva no cumple las reglas de horario vigentes.",
  VALIDATION_ERROR: "Revisa los datos ingresados e inténtalo de nuevo.",
});

export class ApiProblem extends Error {
  constructor(problem, status) {
    const code = problem?.code ?? "UNEXPECTED_ERROR";
    super(FRIENDLY_MESSAGES[code] ?? problem?.detail ?? "No pudimos completar la solicitud.");
    this.name = "ApiProblem";
    this.code = code;
    this.status = status;
    this.correlationId = problem?.correlationId ?? null;
    this.fields = Array.isArray(problem?.errors) ? problem.errors : [];
  }
}

export function messageForError(error) {
  if (error instanceof ApiProblem) {
    return error.message;
  }
  if (error instanceof TypeError) {
    return "No fue posible conectar con el servicio. Verifica tu conexión.";
  }
  return "Ocurrió un problema inesperado. Inténtalo de nuevo.";
}

