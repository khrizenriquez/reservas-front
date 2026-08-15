export const messages = {
  es: { language: "Idioma", spanish: "Español", english: "Inglés", retry: "Reintentar", api: { validation: "Revisa los datos ingresados.", unauthorized: "No fue posible iniciar sesión.", forbidden: "No tienes acceso a esta acción.", notFound: "No encontramos la información solicitada.", conflict: "La acción entra en conflicto con el estado actual.", server: "El servicio no está disponible. Intenta nuevamente.", network: "Revisa tu conexión e inténtalo nuevamente." } },
  en: { language: "Language", spanish: "Spanish", english: "English", retry: "Try again", api: { validation: "Check the information entered.", unauthorized: "We could not sign you in.", forbidden: "You do not have access to this action.", notFound: "We could not find the requested information.", conflict: "This action conflicts with the current state.", server: "The service is unavailable. Please try again.", network: "Check your connection and try again." } }
};

export const textFor = (language, key) => key.split(".").reduce((value, part) => value?.[part], messages[language]) ?? key;
