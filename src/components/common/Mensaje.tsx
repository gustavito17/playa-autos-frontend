import React from 'react';

interface MensajeProps {
  tipo: 'success' | 'error';
  texto: string;
}

const Mensaje: React.FC<MensajeProps> = ({ tipo, texto }) => {
  return (
    <div className={`mensaje ${tipo}`}>
      {texto}
    </div>
  );
};

export default Mensaje;
