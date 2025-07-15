import { useConcesionaria } from '../context/ConcesionariaContext';

const Contacto = () => {
  const { color_principal, nombre, loading } = useConcesionaria();

  if (loading) {
    return null;
  }

  return (
    <div className="home-container" style={{ paddingTop: 0 }}>
      <h1
        style={{
          color: color_principal,
          marginTop: '32px',
          marginBottom: '12px',
        }}
      >
        {nombre || 'Playa Autos'} - Contacto
      </h1>
      <p
        className="home-bienvenida"
        style={{ marginBottom: '18px' }}
      >
        Contáctanos para más información sobre nuestros vehículos.
      </p>

      <section className="home-vehiculos-section">
        <h2 className="home-vehiculos-titulo">Información de contacto</h2>
        <div style={{ 
          background: '#fff', 
          padding: '24px', 
          borderRadius: '16px', 
          boxShadow: '0 4px 16px rgba(0,0,0,0.07)',
          marginBottom: '32px'
        }}>
          <h3 style={{ color: color_principal, marginBottom: '16px' }}>Datos de la concesionaria</h3>
          <p><strong>Nombre:</strong> {nombre || 'Playa Autos'}</p>
          <p><strong>Email:</strong> contacto@concesionariasapp.com</p>
          <p><strong>Teléfono:</strong> +595 991 123 456</p>
          <p><strong>Horarios:</strong> Lunes a Viernes 8:00 - 18:00</p>
        </div>

        <div style={{ 
          background: '#fff', 
          padding: '24px', 
          borderRadius: '16px', 
          boxShadow: '0 4px 16px rgba(0,0,0,0.07)'
        }}>
          <h3 style={{ color: color_principal, marginBottom: '16px' }}>¿Necesitas ayuda?</h3>
          <p>Si tienes alguna pregunta sobre nuestros vehículos o servicios, no dudes en contactarnos. Estamos aquí para ayudarte a encontrar el vehículo perfecto para ti.</p>
        </div>
      </section>
    </div>
  );
};

export default Contacto; 