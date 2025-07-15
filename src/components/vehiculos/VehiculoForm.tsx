import React from 'react';
import type { Vehiculo, VehiculoCreate, Marca } from '../../types/vehiculos';

interface VehiculoFormProps {
  vehiculoEditar: Vehiculo | null;
  formData: VehiculoCreate;
  setFormData: (formData: VehiculoCreate) => void;
  guardando: boolean;
  marcas: Marca[];
  pendingImageFiles: FileList | null;
  setPendingImageFiles: (files: FileList | null) => void;
  tempImageFiles: FileList | null;
  setTempImageFiles: (files: FileList | null) => void;
  mostrarMensaje: (tipo: 'success' | 'error', texto: string) => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  onClose: () => void;
  eliminarImagen: (id: number) => Promise<void>;
}

const VehiculoForm: React.FC<VehiculoFormProps> = ({
  vehiculoEditar,
  formData,
  setFormData,
  guardando,
  marcas,
  pendingImageFiles,
  setPendingImageFiles,
  tempImageFiles,
  setTempImageFiles,
  mostrarMensaje,
  onSubmit,
  onClose,
  eliminarImagen
}) => {
  return (
    <div className="modal">
      <div className="modal-content">
        <h2>{vehiculoEditar ? 'Editar' : 'Crear'} Vehículo</h2>
        <form onSubmit={onSubmit}>
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
            <select
              value={formData.anio}
              onChange={(e) => setFormData({...formData, anio: Number(e.target.value)})}
              required
            >
              <option value="">Seleccione un año</option>
              {Array.from({ length: new Date().getFullYear() - 1979 }, (_, i) => new Date().getFullYear() - i).map((anio) => (
                <option key={anio} value={anio}>{anio}</option>
              ))}
            </select>
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
            <label>Precio (Gs.)</label>
            <input
              type="number"
              value={formData.precio === 0 ? '' : formData.precio}
              onChange={(e) => {
                const value = e.target.value;
                setFormData({
                  ...formData,
                  precio: value === '' ? 0 : Number(value)
                });
              }}
              required
              min={0}
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
            <label>Estado:</label>
            <select
              value={formData.estado || ''}
              onChange={e => setFormData({ ...formData, estado: e.target.value })}
              required
            >
              <option value="">Seleccione un estado</option>
              <option value="usado">Usado</option>
              <option value="0km">0km</option>
              <option value="importado">Importado</option>
            </select>
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
              onClick={onClose}
              disabled={guardando}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VehiculoForm;
