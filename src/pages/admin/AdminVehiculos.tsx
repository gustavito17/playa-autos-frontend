import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import type { Vehiculo, VehiculoCreate, Marca } from '../../types/vehiculos';
import '../../styles/AdminVehiculos.css';

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
  const [cantidadMostrar, setCantidadMostrar] = useState(10);

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

  // Alias para cargarVehiculos
  const fetchVehiculos = cargarVehiculos;

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
    
    // Limitar cantidad
    return filtrados.slice(0, cantidadMostrar);
  }, [vehiculos, busqueda, cantidadMostrar]);

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
          <div className={`mensaje ${mensaje.tipo}`}>
            {mensaje.texto}
          </div>
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
          <div className="filtro-cantidad">
            <label>Mostrar </label>
            <select 
              value={cantidadMostrar} 
              onChange={(e) => setCantidadMostrar(Number(e.target.value))}
              className="select-cantidad"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={vehiculos.length}>Todos</option>
            </select>
          </div>
          <div className="filtro-resultados">
            <span>Mostrando {vehiculosFiltrados.length} de {vehiculos.length} vehículos</span>
          </div>
          <button 
            onClick={() => {
              setBusqueda('');
              setCantidadMostrar(10);
            }}
            className="btn-limpiar"
          >
            Limpiar
          </button>
        </div>

        <div className="tabla-vehiculos">
          <table>
            <thead>
              <tr>
                <th>Modelo</th>
                <th>Marca</th>
                <th>Año</th>
                <th>Estado</th>
                <th>Precio</th>
                <th>Imágenes</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {vehiculosFiltrados.map((vehiculo) => (
                <tr key={vehiculo.id}>
                  <td>{vehiculo.modelo}</td>
                  <td>{vehiculo.marca?.nombre || 'Sin marca'}</td>
                  <td>{vehiculo.anio}</td>
                  <td>{vehiculo.estado}</td>
                  <td>${vehiculo.precio.toLocaleString()}</td>
                  <td>
                    <div className="imagenes-preview">
                      {vehiculo.imagenes.map((imagen) => (
                        <img key={imagen.id} src={imagen.url} alt={vehiculo.modelo} />
                      ))}
                    </div>
                  </td>
                  <td>
                    <button
                      className="btn-editar"
                      onClick={() => {
                        setVehiculoEditar(vehiculo);
                        setFormData({
                          modelo: vehiculo.modelo,
                          anio: vehiculo.anio,
                          color: vehiculo.color,
                          estado: vehiculo.estado,
                          precio: vehiculo.precio,
                          descripcion: vehiculo.descripcion,
                          marca_id: vehiculo.marca_id,
                        });
                        setModalOpen(true);
                      }}
                    >
                      Editar
                    </button>
                    <button
                      className="btn-eliminar"
                      onClick={() => eliminarVehiculo(vehiculo.id)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {modalOpen && (
          <div className="modal">
            <div className="modal-content">
              <h2>{vehiculoEditar ? 'Editar' : 'Crear'} Vehículo</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Modelo:</label>
                  <input
                    type="text"
                    value={formData.modelo}
                    onChange={(e) => setFormData({...formData, modelo: e.target.value})}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Marca:</label>
                  <select
                    value={formData.marca_id}
                    onChange={(e) => setFormData({...formData, marca_id: Number(e.target.value)})}
                    required
                  >
                    <option value="">Seleccione una marca</option>
                    {marcas.map((marca) => (
                      <option key={marca.id} value={marca.id}>
                        {marca.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Año:</label>
                  <input
                    type="number"
                    value={formData.anio}
                    onChange={(e) => setFormData({...formData, anio: Number(e.target.value)})}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Color:</label>
                  <input
                    type="text"
                    value={formData.color}
                    onChange={(e) => setFormData({...formData, color: e.target.value})}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Imágenes:</label>
                  
                  {/* Mostrar imágenes existentes si estamos editando */}
                  {vehiculoEditar && vehiculoEditar.imagenes && vehiculoEditar.imagenes.length > 0 && (
                    <div className="imagenes-existentes">
                      <h4>Imágenes actuales: ({vehiculoEditar.imagenes.length}/10)</h4>
                      <div className="imagenes-grid">
                        {vehiculoEditar.imagenes.map((imagen) => (
                          <div key={imagen.id} className="imagen-item">
                            <img src={imagen.url} alt={vehiculoEditar.modelo} />
                            <button
                              type="button"
                              className="btn-eliminar-imagen"
                              onClick={() => eliminarImagen(imagen.id)}
                              title="Eliminar imagen"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Contador e indicador de estado */}
                  {(() => {
                    const currentImageCount = vehiculoEditar?.imagenes?.length || 0;
                    const pendingCount = pendingImageFiles?.length || 0;
                    const tempCount = tempImageFiles?.length || 0;
                    const totalImages = currentImageCount + pendingCount + tempCount;
                    const isAtLimit = totalImages >= 10;
                    
                    return (
                      <div className={`imagen-status-container ${
                        totalImages >= 8 ? 'warning' : totalImages >= 10 ? 'error' : 'normal'
                      }`}>
                        <div className="imagen-counter">
                          <span className="counter-text">
                            Total de imágenes: {totalImages}/10
                          </span>
                          {isAtLimit && (
                            <span className="limit-message">
                              Límite alcanzado - Elimina una imagen para agregar más
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })()}
                  
                  {/* Input para agregar nuevas imágenes */}
                  <label>Agregar nuevas imágenes:</label>
                  
                  {(() => {
                    const currentImageCount = vehiculoEditar?.imagenes?.length || 0;
                    const pendingCount = pendingImageFiles?.length || 0;
                    const tempCount = tempImageFiles?.length || 0;
                    const totalImages = currentImageCount + pendingCount + tempCount;
                    const isAtLimit = totalImages >= 10;
                    
                    return (
                      <>
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          disabled={isAtLimit}
                          className={isAtLimit ? 'input-disabled' : ''}
                          onChange={(e) => {
                            if (e.target.files && e.target.files.length > 0) {
                              const newImageCount = e.target.files.length;
                              const totalAfterAdd = totalImages + newImageCount;
                              
                              if (totalAfterAdd > 10) {
                                const availableSlots = 10 - totalImages;
                                mostrarMensaje('error', 
                                  `Solo puedes agregar ${availableSlots} imagen(es) más. ` +
                                  `Tienes ${totalImages}/10 imágenes. Intentas agregar ${newImageCount}.`
                                );
                                e.target.value = '';
                                return;
                              }
                              
                              // Mostrar mensaje de éxito
                              mostrarMensaje('success', 
                                `${newImageCount} imagen(es) agregada(s). Total: ${totalAfterAdd}/10`
                              );
                              
                              if (vehiculoEditar) {
                                // Para edición: combinar con archivos pendientes existentes
                                const newFilesArray = Array.from(e.target.files);
                                const existingPendingArray = pendingImageFiles ? Array.from(pendingImageFiles) : [];
                                const combinedFiles = [...existingPendingArray, ...newFilesArray];
                                
                                // Crear nuevo FileList
                                const dt = new DataTransfer();
                                combinedFiles.forEach(file => dt.items.add(file));
                                setPendingImageFiles(dt.files);
                                
                                // Limpiar el input
                                e.target.value = '';
                              } else {
                                // Para vehículo nuevo: usar el estado existente
                                const newFilesArray = Array.from(e.target.files);
                                const existingTempArray = tempImageFiles ? Array.from(tempImageFiles) : [];
                                const combinedFiles = [...existingTempArray, ...newFilesArray];
                                
                                const dt = new DataTransfer();
                                combinedFiles.forEach(file => dt.items.add(file));
                                setTempImageFiles(dt.files);
                                
                                e.target.value = '';
                              }
                            }
                          }}
                        />
                        {isAtLimit && (
                          <div className="input-disabled-message">
                            <span>Selección de archivos deshabilitada (límite alcanzado)</span>
                          </div>
                        )}
                      </>
                    );
                  })()}

                  {/* Vista previa para vehículos en edición - NUEVAS IMÁGENES PENDIENTES */}
                  {vehiculoEditar && pendingImageFiles && pendingImageFiles.length > 0 && (
                    <div className="imagenes-pendientes">
                      <div className="imagenes-header">
                        <h4>Nuevas imágenes a agregar: ({pendingImageFiles.length})</h4>
                        <button
                          type="button"
                          className="btn-limpiar-imagenes"
                          onClick={() => {
                            setPendingImageFiles(null);
                            // Limpiar URLs de objeto
                            Array.from(pendingImageFiles).forEach(file => {
                              URL.revokeObjectURL(URL.createObjectURL(file));
                            });
                          }}
                          title="Cancelar nuevas imágenes"
                        >
                          ✕ Cancelar nuevas
                        </button>
                      </div>
                      <div className="imagenes-grid">
                        {Array.from(pendingImageFiles).map((file, index) => {
                          const imageUrl = URL.createObjectURL(file);
                          return (
                            <div key={`pending-${index}`} className="imagen-item pending">
                              <img 
                                src={imageUrl} 
                                alt={`Nueva imagen ${index + 1}`}
                                onLoad={() => {
                                  // Limpiar la URL después de cargar
                                  setTimeout(() => URL.revokeObjectURL(imageUrl), 1000);
                                }}
                              />
                              <button
                                type="button"
                                className="btn-eliminar-imagen"
                                onClick={() => {
                                  const filesArray = Array.from(pendingImageFiles);
                                  filesArray.splice(index, 1);
                                  
                                  if (filesArray.length === 0) {
                                    setPendingImageFiles(null);
                                  } else {
                                    const dt = new DataTransfer();
                                    filesArray.forEach(file => dt.items.add(file));
                                    setPendingImageFiles(dt.files);
                                  }
                                  
                                  // Limpiar la URL del objeto eliminado
                                  URL.revokeObjectURL(imageUrl);
                                }}
                                title="Eliminar esta imagen"
                              >
                                ✕
                              </button>
                              <div className="imagen-info">
                                <span className="imagen-nombre">{file.name}</span>
                                <span className="imagen-size">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                                <span className="imagen-status">Pendiente</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      <div className="imagenes-warning">
                        <small>⚠️ Estas imágenes se subirán cuando presiones "Actualizar"</small>
                      </div>
                    </div>
                  )}
                  
                  {/* Vista previa de imágenes temporales para vehículos nuevos */}
                  {!vehiculoEditar && tempImageFiles && tempImageFiles.length > 0 && (
                    <div className="imagenes-temporales">
                      <div className="imagenes-header">
                        <h4>Imágenes seleccionadas: ({tempImageFiles.length}/10)</h4>
                        <button
                          type="button"
                          className="btn-limpiar-imagenes"
                          onClick={() => setTempImageFiles(null)}
                          title="Limpiar imágenes seleccionadas"
                        >
                          ✕ Limpiar
                        </button>
                      </div>
                      <div className="imagenes-grid">
                        {Array.from(tempImageFiles).map((file, index) => (
                          <div key={index} className="imagen-item">
                            <img 
                              src={URL.createObjectURL(file)} 
                              alt={`Preview ${index + 1}`} 
                            />
                            <div className="imagen-info">
                              <span className="imagen-nombre">{file.name}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="imagen-info-text">
                    <small>Máximo 10 imágenes. Formatos permitidos: JPG, PNG, GIF. Tamaño máximo: 5MB por imagen.</small>
                  </div>
                </div>

                <div className="form-group">
                  <label>Descripción:</label>
                  <textarea
                    value={formData.descripcion}
                    onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
                    required
                  />
                </div>

                <div className="modal-buttons">
                  <button 
                    type="submit" 
                    className={`btn-crear ${guardando ? 'btn-guardando' : ''}`}
                    disabled={guardando}
                  >
                    {guardando ? (
                      <>
                        <span className="spinner"></span>
                        {vehiculoEditar ? 'Actualizando...' : 'Creando...'}
                      </>
                    ) : (
                      vehiculoEditar ? 'Actualizar' : 'Crear'
                    )}
                  </button>
                  <button 
                    type="button" 
                    className="btn-cancelar"
                    onClick={() => {
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
                    disabled={guardando}
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminVehiculos;

