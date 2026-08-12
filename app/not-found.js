import Link from "next/link";

export default function NotFound() {
  return (
    <main id="contenido-principal" className="centered-state">
      <p className="eyebrow">404</p>
      <h1>Esta página no está en la agenda.</h1>
      <p>La dirección solicitada no existe o cambió.</p>
      <Link className="button is-primary" href="/">
        Volver al inicio
      </Link>
    </main>
  );
}
