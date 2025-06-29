import React from "react";
import "../../styles/AdminVehiculos.css";

interface PaginacionMobileProps {
  paginaActual: number;
  totalPaginas: number;
  irAPagina: (pagina: number) => void;
}

const PaginacionMobile: React.FC<PaginacionMobileProps> = ({ paginaActual, totalPaginas, irAPagina }) => {
  if (totalPaginas <= 1) return null;

  return (
    <div className="paginacion-container">
      <button
        className="btn-paginacion"
        onClick={() => irAPagina(paginaActual - 1)}
        disabled={paginaActual === 1}
      >Anterior</button>
      {Array.from({ length: totalPaginas }, (_, i) => i + 1).map(num => (
        <button
          key={num}
          className={`btn-paginacion${paginaActual === num ? ' activa' : ''}`}
          onClick={() => irAPagina(num)}
        >{num}</button>
      ))}
      <button
        className="btn-paginacion"
        onClick={() => irAPagina(paginaActual + 1)}
        disabled={paginaActual === totalPaginas}
      >Siguiente</button>
    </div>
  );
};

export default PaginacionMobile;
