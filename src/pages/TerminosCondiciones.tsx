import { useConcesionaria } from '../context/ConcesionariaContext';

const TerminosCondiciones = () => {
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
        Términos y Condiciones
      </h1>
      <section style={{ marginBottom: 28 }}>
        <h2 style={{ color: color_principal, fontSize: '1.2em', marginBottom: 8 }}>1. Uso permitido del sitio web y servicios</h2>
        <p>
          El acceso y uso de este sitio web están destinados exclusivamente a fines informativos y de consulta sobre vehículos, servicios y promociones ofrecidos por concesionarias asociadas. El usuario se compromete a utilizar el sitio y sus servicios de manera lícita, respetando la normativa vigente y los presentes términos y condiciones.
        </p>
      </section>
      <section style={{ marginBottom: 28 }}>
        <h2 style={{ color: color_principal, fontSize: '1.2em', marginBottom: 8 }}>2. Responsabilidades del usuario</h2>
        <p>
          El usuario es responsable de la veracidad y exactitud de la información que proporcione a través del sitio. Asimismo, se compromete a no realizar acciones que puedan dañar, sobrecargar, deteriorar o impedir el normal funcionamiento del sitio, ni a vulnerar derechos de terceros.
        </p>
      </section>
      <section style={{ marginBottom: 28 }}>
        <h2 style={{ color: color_principal, fontSize: '1.2em', marginBottom: 8 }}>3. Limitaciones de responsabilidad</h2>
        <p>
          El sitio web y las concesionarias asociadas no garantizan la disponibilidad, continuidad ni infalibilidad del funcionamiento del sitio, ni la exactitud o vigencia de la información publicada. No se asume responsabilidad por daños o perjuicios derivados del uso del sitio, de la información contenida o de la imposibilidad de acceder al mismo.
        </p>
      </section>
      <section style={{ marginBottom: 28 }}>
        <h2 style={{ color: color_principal, fontSize: '1.2em', marginBottom: 8 }}>4. Propiedad intelectual y uso del contenido</h2>
        <p>
          Todos los contenidos, marcas, logotipos, imágenes, textos y diseños presentes en este sitio son propiedad de sus respectivos titulares y están protegidos por la legislación vigente. Queda prohibida su reproducción, distribución o modificación sin autorización expresa. El uso del contenido del sitio es exclusivamente personal y no comercial.
        </p>
      </section>
      <section style={{ marginBottom: 28 }}>
        <h2 style={{ color: color_principal, fontSize: '1.2em', marginBottom: 8 }}>5. Política de privacidad y protección de datos personales</h2>
        <p>
          El sitio respeta la privacidad de los usuarios y protege sus datos personales conforme a la normativa aplicable. Para más información sobre el tratamiento de datos, consulte la sección de Políticas de Privacidad.
        </p>
      </section>
      <section style={{ marginBottom: 28 }}>
        <h2 style={{ color: color_principal, fontSize: '1.2em', marginBottom: 8 }}>6. Modificaciones de los términos</h2>
        <p>
          Los presentes términos y condiciones pueden ser modificados en cualquier momento. Las modificaciones entrarán en vigencia a partir de su publicación en el sitio web. Se recomienda revisar periódicamente esta sección para estar informado sobre posibles cambios.
        </p>
      </section>
      <section style={{ marginBottom: 32 }}>
        <h2 style={{ color: color_principal, fontSize: '1.2em', marginBottom: 8 }}>7. Ley aplicable y jurisdicción</h2>
        <p>
          El uso de este sitio web se rige por la legislación vigente en el país de operación de las concesionarias. Ante cualquier controversia, el usuario y las concesionarias se someten a la jurisdicción de los tribunales competentes.
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
        Al continuar navegando en este sitio, aceptás los presentes términos y condiciones de uso.
      </div>
    </div>
  );
};

export default TerminosCondiciones; 