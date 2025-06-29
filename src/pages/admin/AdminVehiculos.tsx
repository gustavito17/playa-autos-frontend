import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import type { Vehiculo, VehiculoCreate, Marca } from '../../types/vehiculos';
import '../../styles/AdminVehiculos.css';
import VehiculoForm from '../../components/vehiculos/VehiculoForm';
import VehiculoList from '../../components/vehiculos/VehiculoList';
import VehiculosCardsMobile from '../../components/vehiculos/VehiculosCardsMobile';
import VehiculoModal from '../../components/vehiculos/VehiculoModal';
import Mensaje from '../../components/common/Mensaje';

const AdminVehiculos: React.FC = () => {
  const { user } = useAuth();
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
  const [marcas, setMarcas] = useState<Marca[]>([]);
  const [loading, setLoading] = useState(true);
  const [mensaje, setMensaje] = useState<{ tipo: 'success' | 'error'; texto: string } | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [vehiculoEditar, setVehiculoEditar] = useState<Vehiculo | null>(null);
  // Agregar estado para controlar si se está guardando
  const [guardando, setGuardando] = useState(false);
  const [formData, setFormData] = useState<VehiculoCreate>({
    modelo: '',
    anio: new Date().getFullYear(),
    color: '',
    estado: 'usado',
    precio: 0,
    descripcion: '',
    marca_id: 0,
  });
  const [tempImageFiles, setTempImageFiles] = useState<FileList | null>(null);
  const [pendingImageFiles, setPendingImageFiles] = useState<FileList | null>(null);
  
  // Estados para filtros
  const [busqueda, setBusqueda] = useState('');
  // Nuevo estado para paginación
  const [paginaActual, setPaginaActual] = useState(1);
  const cantidadPorPagina = 10;

  const mostrarMensaje = (tipo: 'success' | 'error', texto: string) => {
    setMensaje({ tipo, texto });
    setTimeout(() => setMensaje(null), 3000);
  };

  const cargarVehiculos = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/vehiculos`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (!response.ok) throw new Error('Error al cargar vehículos');
      const data = await response.json();
      console.log('Datos de vehículos:', data);
      setVehiculos(data);
    } catch (err) {
      mostrarMensaje('error', err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  const cargarMarcas = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/marcas`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (!response.ok) throw new Error('Error al cargar marcas');
      const data = await response.json();
      setMarcas(data);
    } catch (err) {
      mostrarMensaje('error', err instanceof Error ? err.message : 'Error desconocido');
    }
  };

  // Función para crear vehículo
  const createVehiculo = async (vehiculoData: VehiculoCreate): Promise<Vehiculo> => {
    // Agregar concesionaria_id del usuario autenticado
    const vehiculoConConcesionaria = {
      ...vehiculoData,
      concesionaria_id: user?.concesionaria_id || 0
    };
    
    const response = await fetch(`${import.meta.env.VITE_API_URL}/vehiculos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(vehiculoConConcesionaria),
    });
    
    if (!response.ok) {
      throw new Error('Error al crear vehículo');
    }
    
    return await response.json();
  };

  // Función para actualizar vehículo
  const updateVehiculo = async (id: number, vehiculoData: VehiculoCreate): Promise<Vehiculo> => {
    // Agregar concesionaria_id del usuario autenticado
    const vehiculoConConcesionaria = {
      ...vehiculoData,
      concesionaria_id: user?.concesionaria_id || 0
    };
    
    const response = await fetch(`${import.meta.env.VITE_API_URL}/vehiculos/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(vehiculoConConcesionaria),
    });
    
    if (!response.ok) {
      throw new Error('Error al actualizar vehículo');
    }
    
    return await response.json();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prevenir múltiples envíos
    if (guardando) {
      return;
    }
    
    // Validar que el usuario tenga concesionaria_id
    if (!user?.concesionaria_id) {
      mostrarMensaje('error', 'Error: No se pudo obtener la información de la concesionaria');
      return;
    }
    
    setGuardando(true); // Deshabilitar el botón
    
    try {
      if (vehiculoEditar) {
        // Actualizar vehículo existente
        await updateVehiculo(vehiculoEditar.id, formData);
        
        // Subir imágenes pendientes si las hay
        if (pendingImageFiles && pendingImageFiles.length > 0) {
          await handleImageUpload(pendingImageFiles, vehiculoEditar.id);
          setPendingImageFiles(null);
        }
        
        mostrarMensaje('success', 'Vehículo actualizado exitosamente');
      } else {
        // Crear nuevo vehículo
        const nuevoVehiculo = await createVehiculo(formData);
        
        // Subir imágenes temporales si las hay
        if (tempImageFiles && tempImageFiles.length > 0) {
          await handleImageUpload(tempImageFiles, nuevoVehiculo.id);
          setTempImageFiles(null);
        }
        
        mostrarMensaje('success', 'Vehículo creado exitosamente');
      }
      
      // Cerrar modal y recargar datos
      setModalOpen(false);
      setVehiculoEditar(null);
      setPendingImageFiles(null);
      setTempImageFiles(null);
      await cargarVehiculos(); // Usar await para esperar la recarga
      
      // Resetear formulario
      setFormData({
        modelo: '',
        anio: new Date().getFullYear(),
        color: '',
        estado: 'usado',
        precio: 0,
        descripcion: '',
        marca_id: 0,
      });
    } catch (error) {
      console.error('Error:', error);
      mostrarMensaje('error', 'Error al procesar la solicitud');
    } finally {
      setGuardando(false); // Rehabilitar el botón
    }
  };

  const handleImageUpload = async (files: FileList | File, vehiculoIdParam: number) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        mostrarMensaje('error', 'No hay token de autenticación');
        return;
      }
  
      if (!vehiculoIdParam || vehiculoIdParam === 0) {
        mostrarMensaje('error', 'ID de vehículo no válido');
        return;
      }
  
      const fileArray = files instanceof FileList ? Array.from(files) : [files];
  
      for (const file of fileArray) {
        // Validaciones del frontend (pre-validación)
        if (file.size > 5 * 1024 * 1024) {
          mostrarMensaje('error', `El archivo ${file.name} es demasiado grande. Máximo 5MB`);
          continue;
        }
  
        if (!file.type.startsWith('image/')) {
          mostrarMensaje('error', `El archivo ${file.name} debe ser una imagen`);
          continue;
        }
  
        console.log('🔍 Subiendo:', file.name, 'Tamaño:', file.size, 'Tipo:', file.type);
  
        // USAR XMLHttpRequest PARA EVITAR INTERCEPTOR
        await new Promise((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          const formData = new FormData();
          formData.append('file', file);
  
          xhr.open('POST', `${import.meta.env.VITE_API_URL}/vehiculos/${vehiculoIdParam}/imagenes/`);
          xhr.setRequestHeader('Authorization', `Bearer ${token}`);
          // NO establecer Content-Type - se establece automáticamente para multipart/form-data
  
          xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
              console.log('✅ Subido exitosamente:', file.name);
              try {
                const response = JSON.parse(xhr.responseText);
                console.log('📄 Respuesta del servidor:', response);
                resolve(response);
              } catch (parseError) {
                console.log('✅ Subida exitosa (respuesta no JSON)');
                resolve(xhr.responseText);
              }
            } else {
              // Manejo específico de códigos de error del backend
              let errorMessage = `Error al subir ${file.name}`;
              
              try {
                const errorResponse = JSON.parse(xhr.responseText);
                errorMessage = errorResponse.detail || errorMessage;
              } catch (parseError) {
                errorMessage = xhr.responseText || errorMessage;
              }
  
              console.error('❌ Error del servidor:', xhr.status, errorMessage);
              
              // Manejo específico por código de estado
              switch (xhr.status) {
                case 400:
                  if (errorMessage.includes('debe ser una imagen')) {
                    reject(new Error(`${file.name}: El archivo debe ser una imagen válida`));
                  } else if (errorMessage.includes('demasiado grande')) {
                    reject(new Error(`${file.name}: El archivo es demasiado grande (máximo 5MB)`));
                  } else {
                    reject(new Error(`${file.name}: Archivo inválido - ${errorMessage}`));
                  }
                  break;
                case 401:
                  reject(new Error('Token de autenticación inválido o expirado'));
                  break;
                case 403:
                  reject(new Error('No tienes permiso para añadir imágenes a este vehículo'));
                  break;
                case 404:
                  reject(new Error('Vehículo no encontrado'));
                  break;
                case 500:
                  reject(new Error(`Error interno del servidor: ${errorMessage}`));
                  break;
                default:
                  reject(new Error(`Error ${xhr.status}: ${errorMessage}`));
              }
            }
          };
  
          xhr.onerror = () => {
            console.error('❌ Error de red:', xhr.statusText);
            reject(new Error(`Error de red al subir ${file.name}. Verifica tu conexión a internet.`));
          };
  
          xhr.ontimeout = () => {
            console.error('❌ Timeout:', file.name);
            reject(new Error(`Timeout al subir ${file.name}. El servidor tardó demasiado en responder.`));
          };
  
          // Establecer timeout de 30 segundos
          xhr.timeout = 30000;
  
          xhr.send(formData);
        });
      }
  
      mostrarMensaje('success', 'Imágenes subidas exitosamente');
      await cargarVehiculos(); // Recargar para mostrar las nuevas imágenes
    } catch (error) {
      console.error('❌ Error general en handleImageUpload:', error);
      mostrarMensaje('error', error instanceof Error ? error.message : 'Error al subir imágenes');
    }
  };

  const eliminarImagen = async (imagenId: number) => {
    if (!window.confirm('¿Está seguro de eliminar esta imagen?')) return;
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/vehiculos/imagenes/${imagenId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      
      if (!response.ok) throw new Error('Error al eliminar imagen');
      
      mostrarMensaje('success', 'Imagen eliminada exitosamente');
      
      // Actualizar el vehículo en edición para reflejar el cambio
      if (vehiculoEditar) {
        const vehiculoActualizado = {
          ...vehiculoEditar,
          imagenes: vehiculoEditar.imagenes.filter(img => img.id !== imagenId)
        };
        setVehiculoEditar(vehiculoActualizado);
      }
      
      await cargarVehiculos(); // Recargar la lista
    } catch (err) {
      mostrarMensaje('error', err instanceof Error ? err.message : 'Error al eliminar imagen');
    }
  };

  const eliminarVehiculo = async (id: number) => {
    if (!window.confirm('¿Está seguro de eliminar este vehículo?')) return;
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/vehiculos/${id}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) throw new Error('Error al eliminar vehículo');
      mostrarMensaje('success', 'Vehículo eliminado exitosamente');
      await cargarVehiculos();
    } catch (err) {
      mostrarMensaje('error', err instanceof Error ? err.message : 'Error desconocido');
    }
  };

  // Eliminar declaración de fetchVehiculos si existe

  // Agregar después del useEffect existente
  useEffect(() => {
    cargarMarcas();
    cargarVehiculos();
  }, []);

  // Filtrar vehículos cuando cambien los datos o filtros
  const vehiculosFiltrados = React.useMemo(() => {
    let filtrados = vehiculos;
    
    // Filtrar por búsqueda
    if (busqueda.trim()) {
      filtrados = filtrados.filter(vehiculo => 
        vehiculo.modelo.toLowerCase().includes(busqueda.toLowerCase()) ||
        vehiculo.marca?.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        vehiculo.descripcion.toLowerCase().includes(busqueda.toLowerCase())
      );
    }
    
    return filtrados;
  }, [vehiculos, busqueda]);

  // Calcular paginación
  const totalPaginas = Math.ceil(vehiculosFiltrados.length / cantidadPorPagina);
  const vehiculosPaginados = React.useMemo(() => {
    const inicio = (paginaActual - 1) * cantidadPorPagina;
    return vehiculosFiltrados.slice(inicio, inicio + cantidadPorPagina);
  }, [vehiculosFiltrados, paginaActual]);

  // Cambiar de página
  const irAPagina = (pagina: number) => {
    if (pagina < 1 || pagina > totalPaginas) return;
    setPaginaActual(pagina);
  };

  // Resetear página al cambiar filtro de búsqueda
  React.useEffect(() => {
    setPaginaActual(1);
  }, [busqueda]);

  if (loading) return <div className="loading">Cargando...</div>;

  return (
    <div className="admin-vehiculos-wrapper">
      <div className="admin-vehiculos-container">
        <div className="admin-header">
          <h1>Administración de Vehículos</h1>
          <button className="btn-crear" onClick={() => setModalOpen(true)}>
            Crear Nuevo Vehículo
          </button>
        </div>

        {mensaje && (
          <Mensaje tipo={mensaje.tipo} texto={mensaje.texto} />
        )}

        {/* Barra de filtros */}
        <div className="filtros-container">
          <div className="border-line"></div>
          <div className="filtro-busqueda">
            <input
              type="text"
              placeholder="Buscar por modelo, marca o descripción..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="input-busqueda"
            />
          </div>
        </div>


        {/* Vista tabla en escritorio, tarjetas en móvil */}
        <div>
          <div className="tabla-vehiculos">
            <VehiculoList
              vehiculosFiltrados={vehiculosPaginados}
              setVehiculoEditar={setVehiculoEditar}
              setFormData={setFormData}
              setModalOpen={setModalOpen}
              eliminarVehiculo={eliminarVehiculo}
            />
          </div>
          <VehiculosCardsMobile
            vehiculos={vehiculosPaginados}
            onEditar={setVehiculoEditar}
            onEliminar={eliminarVehiculo}
            onSetFormData={setFormData}
            onSetModalOpen={setModalOpen}
          />
        </div>

        {/* Paginación debajo de la tabla */}
        {totalPaginas > 1 && (
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
        )}

        {modalOpen && (
          <VehiculoModal isOpen={modalOpen}>
            <VehiculoForm
              vehiculoEditar={vehiculoEditar}
              formData={formData}
              setFormData={setFormData}
              guardando={guardando}
              marcas={marcas}
              pendingImageFiles={pendingImageFiles}
              setPendingImageFiles={setPendingImageFiles}
              tempImageFiles={tempImageFiles}
              setTempImageFiles={setTempImageFiles}
              mostrarMensaje={mostrarMensaje}
              onSubmit={handleSubmit}
              onClose={() => {
                setModalOpen(false);
                setVehiculoEditar(null);
                setPendingImageFiles(null);
                setTempImageFiles(null);
                setFormData({
                  modelo: '',
                  anio: new Date().getFullYear(),
                  color: '',
                  estado: 'usado',
                  precio: 0,
                  descripcion: '',
                  marca_id: 0,
                });
              }}
              eliminarImagen={eliminarImagen}
            />
          </VehiculoModal>
        )
        }
      </div>
    </div>
  );
};

export default AdminVehiculos;

