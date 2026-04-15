import { notFound } from "next/navigation";
import { CURSOS_CATALOGO } from "@/lib/cursos-data";
import PagarClient from "./pagar-client";

export default async function PagarPage({
  params,
}: {
  params: Promise<{ cursoId: string }>;
}) {
  const { cursoId } = await params;
  const curso = CURSOS_CATALOGO.find((c) => c.id === cursoId);
  if (!curso) notFound();

  const nequiNumero = process.env.NEQUI_NUMERO_DISPLAY || "";
  const nequiLast4 = (process.env.NEQUI_NUMERO_LAST4 || "").replace(/\D/g, "").slice(-4);
  const nequiTitular = process.env.NEQUI_TITULAR || "";

  return (
    <PagarClient
      curso={{
        id: curso.id,
        titulo: curso.titulo,
        descripcion: curso.descripcion,
        precio: curso.precio,
        imagen: curso.imagen,
        duracionHoras: curso.duracionHoras,
      }}
      nequi={{ numero: nequiNumero, last4: nequiLast4, titular: nequiTitular }}
    />
  );
}
