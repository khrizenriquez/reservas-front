import Link from "next/link";

import { LabCard } from "@/components/LabCard";
import { PublicHeader } from "@/components/PublicHeader";
import { SectionHeading } from "@/components/SectionHeading";
import { TimeRail } from "@/components/TimeRail";

const laboratories = [
  {
    number: "01",
    name: "Laboratorio de cómputo 1",
    description: "Un espacio flexible para clases prácticas, talleres y evaluaciones.",
    tone: "blue",
  },
  {
    number: "02",
    name: "Laboratorio de cómputo 2",
    description: "Preparado para sesiones que requieren continuidad y trabajo colaborativo.",
    tone: "teal",
  },
  {
    number: "03",
    name: "Laboratorio de cómputo 3",
    description: "Disponibilidad coordinada para actividades académicas y proyectos especiales.",
    tone: "amber",
  },
];

const steps = [
  ["01", "Consulta", "Elige fecha y horario; verás únicamente los espacios disponibles."],
  ["02", "Confirma", "Selecciona el laboratorio, explica el motivo y revisa el resumen."],
  ["03", "Da seguimiento", "Modifica o cancela a tiempo y recibe los cambios importantes."],
];

export default function LandingPage() {
  return (
    <>
      <PublicHeader />
      <main id="contenido-principal">
        <section className="landing-hero" aria-labelledby="hero-title">
          <div className="container landing-hero__grid">
            <div className="landing-hero__copy">
              <p className="eyebrow">Facultad de Ingeniería · UMG</p>
              <h1 id="hero-title" className="landing-title">
                El laboratorio correcto,
                <span> justo cuando lo necesitas.</span>
              </h1>
              <p className="landing-hero__lead">
                Consulta los tres laboratorios, reserva sin cruces de horario y mantén cada
                actividad académica bajo control.
              </p>
              <div className="buttons landing-hero__actions">
                <Link className="button is-primary is-medium" href="/acceso">
                  Ingresar al portal
                </Link>
                <a className="button is-light is-medium" href="#laboratorios">
                  Conocer los laboratorios
                </a>
              </div>
              <ul className="trust-list" aria-label="Características principales">
                <li>Disponibilidad en tiempo real</li>
                <li>Sesiones institucionales seguras</li>
                <li>Notificaciones de cambios</li>
              </ul>
            </div>

            <div className="hero-schedule" aria-label="Ejemplo visual de disponibilidad">
              <div className="hero-schedule__heading">
                <div>
                  <span className="hero-schedule__label">Vista del día</span>
                  <strong>Martes · 14 de agosto</strong>
                </div>
                <span className="status-pill status-pill--available">2 disponibles</span>
              </div>
              <TimeRail start="08:00" end="12:00" activeStart={1} activeSpan={2} />
              <div className="schedule-rows">
                <div className="schedule-row">
                  <span>Lab 1</span>
                  <span className="schedule-row__slot schedule-row__slot--busy">
                    Clase · 09:00–10:30
                  </span>
                </div>
                <div className="schedule-row">
                  <span>Lab 2</span>
                  <span className="schedule-row__slot schedule-row__slot--free">
                    Disponible
                  </span>
                </div>
                <div className="schedule-row">
                  <span>Lab 3</span>
                  <span className="schedule-row__slot schedule-row__slot--free">
                    Disponible
                  </span>
                </div>
              </div>
              <p className="hero-schedule__note">
                Los horarios son ilustrativos. Inicia sesión para consultar datos actuales.
              </p>
            </div>
          </div>
        </section>

        <section className="section landing-section" id="laboratorios" aria-labelledby="labs-title">
          <div className="container">
            <SectionHeading
              eyebrow="Tres espacios, una sola agenda"
              title="Laboratorios listos para tu próxima actividad"
              description="La plataforma administra exactamente los tres laboratorios institucionales y evita reservas superpuestas."
              id="labs-title"
            />
            <div className="lab-grid">
              {laboratories.map((lab) => (
                <LabCard key={lab.number} {...lab} />
              ))}
            </div>
          </div>
        </section>

        <section className="section process-section" id="como-funciona" aria-labelledby="process-title">
          <div className="container process-layout">
            <SectionHeading
              eyebrow="Un proceso breve y verificable"
              title="De la consulta a la reserva en tres pasos"
              description="Cada decisión queda respaldada por disponibilidad actual, permisos y un historial auditable."
              id="process-title"
              compact
            />
            <ol className="process-list">
              {steps.map(([number, title, copy]) => (
                <li key={number}>
                  <span className="process-list__number">{number}</span>
                  <div>
                    <h3>{title}</h3>
                    <p>{copy}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="section assurance-section" aria-labelledby="assurance-title">
          <div className="container assurance-layout">
            <div>
              <p className="eyebrow eyebrow--light">Diseñado para la operación universitaria</p>
              <h2 id="assurance-title">Claridad para docentes. Control para administración.</h2>
            </div>
            <div className="assurance-points">
              <p>
                <strong>Para docentes</strong>
                Próxima reserva, disponibilidad e historial en una navegación
                directa.
              </p>
              <p>
                <strong>Para administradores</strong>
                Ocupación, condiciones, usuarios y auditoría con permisos por rol.
              </p>
            </div>
          </div>
        </section>

        <section className="section faq-section" id="preguntas" aria-labelledby="faq-title">
          <div className="container faq-layout">
            <SectionHeading
              eyebrow="Antes de reservar"
              title="Preguntas frecuentes"
              description="Reglas claras para proteger el tiempo de todos."
              id="faq-title"
              compact
            />
            <div className="faq-list">
              <details>
                <summary>¿Qué horario puedo solicitar?</summary>
                <p>Entre 07:00 y 22:00, en bloques de 30 minutos y por un máximo de cuatro horas.</p>
              </details>
              <details>
                <summary>¿Puedo modificar una reserva?</summary>
                <p>El propietario o un administrador puede modificarla antes de su inicio.</p>
              </details>
              <details>
                <summary>¿Qué ocurre si cancelo?</summary>
                <p>El intervalo se libera inmediatamente y el cambio queda registrado.</p>
              </details>
            </div>
          </div>
        </section>

        <section className="section final-cta" aria-labelledby="cta-title">
          <div className="container final-cta__inner">
            <div>
              <p className="eyebrow">Tu próxima sesión empieza aquí</p>
              <h2 id="cta-title">Consulta. Reserva. Enseña.</h2>
            </div>
            <Link className="button is-primary is-medium" href="/acceso">
              Acceder con mi cuenta
            </Link>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="container site-footer__inner">
          <p>
            <strong>Reservas UMG</strong> · Facultad de Ingeniería
          </p>
          <nav aria-label="Enlaces del pie">
            <a href="#laboratorios">Laboratorios</a>
            <a href="#preguntas">Preguntas frecuentes</a>
            <a href="mailto:soporte@umg.edu.gt">Contacto institucional</a>
          </nav>
        </div>
      </footer>
    </>
  );
}
