import React from 'react';

export interface Marca {
  id: number;
  nombre: string;
}

interface Props {
  marcas: Marca[];
  onEdit: (marca: Marca) => void;
  onDelete: (id: number) => void;
}

const MarcasCardsMobile: React.FC<Props> = ({ marcas, onEdit, onDelete }) => (
  <div className="marcas-cards-mobile">
    {marcas.map(marca => (
      <div className="marca-card-mobile" key={marca.id}>
        <div><b>Nombre:</b> {marca.nombre}</div>
        <div style={{ marginTop: 8 }}>
          <button className="btn-editar" onClick={() => onEdit(marca)}>Editar</button>
          <button className="btn-eliminar" onClick={() => onDelete(marca.id)}>Eliminar</button>
        </div>
      </div>
    ))}
  </div>
);

export default MarcasCardsMobile; 