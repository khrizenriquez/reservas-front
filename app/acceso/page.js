import { BrandMark } from "@/components/BrandMark";
import { LoginForm } from "@/components/LoginForm";

export const metadata = {
  title: "Acceso institucional",
  robots: { index: false, follow: false },
};

export default function AccessPage() {
  return (
    <main id="contenido-principal" className="access-page">
      <section className="access-intro" aria-label="Portal de reservas">
        <BrandMark />
        <div>
          <p className="eyebrow eyebrow--light">Operación académica coordinada</p>
          <h2>Tu agenda de laboratorios, clara de principio a fin.</h2>
          <p>
            Un solo espacio para confirmar horarios, evitar cruces y mantener informada a la
            comunidad académica.
          </p>
        </div>
        <ol className="access-intro__steps" aria-label="Proceso de reserva">
          <li><span>01</span> Consulta el horario</li>
          <li><span>02</span> Reserva el laboratorio</li>
          <li><span>03</span> Recibe seguimiento</li>
        </ol>
      </section>
      <section className="access-panel">
        <LoginForm />
      </section>
    </main>
  );
}

