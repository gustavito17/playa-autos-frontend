import React from 'react';
import { useConcesionaria } from '../context/ConcesionariaContext';

const PoliticasPrivacidad = () => {
  const { color_principal } = useConcesionaria();

  return (
    <div className="home-container" style={{ paddingTop: 0, maxWidth: 800, margin: '0 auto' }}>
      <h1
        style={{
          color: color_principal,
          marginTop: '32px',
          marginBottom: '18px',
          textAlign: 'center',
        }}
      >
        Políticas de Privacidad
      </h1>
      <section style={{ marginBottom: 28 }}>
        <h2 style={{ color: color_principal, fontSize: '1.2em', marginBottom: 8 }}>Datos personales que se recopilan</h2>
        <p>
          En este sitio web de concesionarias de vehículos se recopilan datos personales como nombre, número de teléfono, dirección de correo electrónico, e intereses relacionados con vehículos. Estos datos pueden ser proporcionados al realizar consultas, solicitar información o al interactuar con los servicios ofrecidos en la página.
        </p>
      </section>
      <section style={{ marginBottom: 28 }}>
        <h2 style={{ color: color_principal, fontSize: '1.2em', marginBottom: 8 }}>Finalidad del uso de los datos</h2>
        <p>
          Los datos personales recopilados se utilizan para establecer contacto, responder consultas, brindar información sobre vehículos de interés y realizar seguimiento comercial relacionado con los servicios ofrecidos por las concesionarias.
        </p>
      </section>
      <section style={{ marginBottom: 28 }}>
        <h2 style={{ color: color_principal, fontSize: '1.2em', marginBottom: 8 }}>Compartición de la información</h2>
        <p>
          La información personal proporcionada será compartida únicamente con las concesionarias asociadas, con el objetivo de ofrecer una mejor atención y respuesta a las necesidades de los usuarios. No se comparte información con terceros no autorizados bajo ninguna circunstancia.
        </p>
      </section>
      <section style={{ marginBottom: 28 }}>
        <h2 style={{ color: color_principal, fontSize: '1.2em', marginBottom: 8 }}>Derechos de los usuarios</h2>
        <p>
          Los usuarios tienen derecho a acceder, corregir, actualizar o solicitar la eliminación de sus datos personales en cualquier momento.
        </p>
      </section>
      <section style={{ marginBottom: 32 }}>
        <h2 style={{ color: color_principal, fontSize: '1.2em', marginBottom: 8 }}>Ejercicio de derechos</h2>
        <p>
          Para ejercer los derechos mencionados, los usuarios pueden comunicarse por correo electrónico o a través de WhatsApp. Todas las solicitudes serán atendidas en el menor tiempo posible y conforme a la normativa vigente sobre protección de datos personales.
        </p>
      </section>
      <div style={{
        background: '#f7f7f7',
        borderRadius: 8,
        padding: '18px 20px',
        textAlign: 'center',
        color: '#555',
        fontSize: '1em',
        marginBottom: 32,
      }}>
        Al continuar navegando en este sitio, aceptás nuestras políticas de privacidad.
      </div>
    </div>
  );
};

export default PoliticasPrivacidad; 