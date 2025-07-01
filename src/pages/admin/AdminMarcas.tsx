import React, { useEffect, useState } from 'react';
import '../../styles/AdminMarcas.css';
import Mensaje from '../../components/common/Mensaje';
import MarcasCardsMobile from '../../components/marcas/MarcasCardsMobile';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const getToken = () => localStorage.getItem('token');

const initialForm = { nombre: '' };

type Marca = {
  id: number;
  nombre: string;
};

type MensajeType = { tipo: 'success' | 'error'; texto: string } | null;


const AdminMarcas: React.FC = () => {
  const [marcas, setMarcas] = useState<Marca[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<{ nombre: string }>(initialForm);
  const [editId, setEditId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [mensaje, setMensaje] = useState<MensajeType>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  // Paginación
  const [paginaActual, setPaginaActual] = useState(1);
  const cantidadPorPagina = 10;

  const mostrarMensaje = (tipo: 'success' | 'error', texto: string) => {
    setMensaje({ tipo, texto });
    setTimeout(() => setMensaje(null), 3000);
  };

  useEffect(() => {
    fetchMarcas();
    // Debug: mostrar si el token existe y la URL
    // console.log('TOKEN:', getToken());
    // console.log('API_URL:', API_URL);
  }, []);

  const fetchMarcas = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/marcas/`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (!res.ok) throw new Error('Error al cargar marcas');
      const data = await res.json();
      setMarcas(data);
    } catch (e) {
      if (e instanceof Error) mostrarMensaje('error', e.message);
      else mostrarMensaje('error', 'Error desconocido');
      // eslint-disable-next-line no-console
      console.error('Error fetchMarcas:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCreate = () => {
    setForm(initialForm);
    setEditId(null);
    setShowForm(true);
    setMensaje(null);
  };

  const handleEdit = (marca: Marca) => {
    setForm({ nombre: marca.nombre });
    setEditId(marca.id);
    setShowForm(true);
    setMensaje(null);
  };

  // No permitir eliminar marcas con vehículos asociados
  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Seguro que deseas eliminar esta marca?')) return;
    setDeletingId(id);
    setMensaje(null);
    try {
      // Verificar si hay vehículos asociados a la marca
      const vehiculosRes = await fetch(`${API_URL}/vehiculos?marca_id=${id}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (!vehiculosRes.ok) throw new Error('Error al verificar vehículos asociados');
      const vehiculos = await vehiculosRes.json();
      if (Array.isArray(vehiculos) && vehiculos.length > 0) {
        mostrarMensaje('error', 'No se puede eliminar la marca porque tiene vehículos asociados.');
        setDeletingId(null);
        return;
      }
      // Si no hay vehículos asociados, proceder a eliminar
      const res = await fetch(`${API_URL}/marcas/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (!res.ok) throw new Error('No se pudo eliminar la marca');
      mostrarMensaje('success', 'Marca eliminada correctamente');
      fetchMarcas();
    } catch (e) {
      if (e instanceof Error) mostrarMensaje('error', e.message);
      else mostrarMensaje('error', 'Error desconocido');
    } finally {
      setDeletingId(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMensaje(null);
    if (!form.nombre.trim()) {
      mostrarMensaje('error', 'El nombre es obligatorio');
      return;
    }
    try {
      const res = await fetch(
        editId ? `${API_URL}/marcas/${editId}` : `${API_URL}/marcas/`,
        {
          method: editId ? 'PUT' : 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getToken()}`,
          },
          body: JSON.stringify({ nombre: form.nombre.trim() }),
        }
      );
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || 'Error al guardar la marca');
      }
      mostrarMensaje('success', editId ? 'Marca actualizada' : 'Marca creada');
      setShowForm(false);
      setForm(initialForm);
      setEditId(null);
      // Si es creación, ir a la última página tras recargar marcas
      if (!editId) {
        // fetchMarcas es async, así que espera a que termine y luego cambia la página
        await fetchMarcas();
        setPaginaActual(() => {
          // Calcula la última página con el nuevo total
          const total = Math.ceil((marcas.length + 1) / cantidadPorPagina);
          return total;
        });
      } else {
        fetchMarcas();
      }
    } catch (e) {
      if (e instanceof Error) mostrarMensaje('error', e.message);
      else mostrarMensaje('error', 'Error desconocido');
    }
  };

  const closeForm = () => {
    setShowForm(false);
    setForm(initialForm);
    setEditId(null);
    setMensaje(null);
  };


  // Paginación: calcular marcas a mostrar y total de páginas
  const totalPaginas = Math.ceil(marcas.length / cantidadPorPagina);
  const marcasPaginadas = React.useMemo(() => {
    const inicio = (paginaActual - 1) * cantidadPorPagina;
    return marcas.slice(inicio, inicio + cantidadPorPagina);
  }, [marcas, paginaActual]);

  const irAPagina = (pagina: number) => {
    if (pagina < 1 || pagina > totalPaginas) return;
    setPaginaActual(pagina);
  };

  // Resetear página si cambian las marcas (ej: tras crear/eliminar)
  React.useEffect(() => {
    setPaginaActual(1);
  }, [marcas.length]);

  return (
    <div className="admin-vehiculos-wrapper">
      <div className="admin-marcas-container">
        <div className="admin-marcas-header">
          <h1>Gestión de Marcas</h1>
          <button className="btn-crear" onClick={handleCreate}>
            <span style={{ fontWeight: 700, fontSize: 18, marginRight: 6 }}>+</span> Nueva Marca
          </button>
        </div>
        {mensaje && <Mensaje tipo={mensaje.tipo} texto={mensaje.texto} />}
        {loading ? (
          <div className="loading">Cargando marcas...</div>
        ) : (
          <>
          <div className="tabla-marcas">
            <table>
              <thead>
                <tr>
                  {/* <th>ID</th> */}
                  <th>Nombre</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {marcas.length === 0 ? (
                  <tr>
                    <td colSpan={2} style={{ textAlign: 'center' }}>
                      No hay marcas registradas.
                    </td>
                  </tr>
                ) : (
                  marcasPaginadas.map((marca) => (
                    <tr key={marca.id}>
                      {/* <td>{marca.id}</td> */}
                      <td>{marca.nombre}</td>
                      <td>
                        <button
                          className="btn-editar"
                          onClick={() => handleEdit(marca)}
                        >
                          Editar
                        </button>
                        <button
                          className="btn-eliminar"
                          onClick={() => handleDelete(marca.id)}
                          disabled={deletingId === marca.id}
                        >
                          {deletingId === marca.id ? 'Eliminando...' : 'Eliminar'}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <MarcasCardsMobile
            marcas={marcasPaginadas}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
          {/* Paginación */}
          {totalPaginas > 1 && (
            <div className="paginacion-container">
              <button
                className="btn-paginacion btn-paginacion-anterior"
                onClick={() => irAPagina(paginaActual - 1)}
                disabled={paginaActual === 1}
              >Anterior</button>
              {Array.from({ length: totalPaginas }, (_, i) => i + 1).map(num => (
                <button
                  key={num}
                  className={`btn-paginacion btn-paginacion-numero${paginaActual === num ? ' activa' : ''}`}
                  onClick={() => irAPagina(num)}
                >{num}</button>
              ))}
              <button
                className="btn-paginacion btn-paginacion-siguiente"
                onClick={() => irAPagina(paginaActual + 1)}
                disabled={paginaActual === totalPaginas}
              >Siguiente</button>
            </div>
          )}
          </>
        )}
        {showForm && (
          <div className="modal">
            <div className="modal-content">
              <h2>{editId ? 'Editar Marca' : 'Nueva Marca'}</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="nombre">Nombre</label>
                  <input
                    type="text"
                    id="nombre"
                    name="nombre"
                    value={form.nombre}
                    onChange={handleInput}
                    autoFocus
                    maxLength={40}
                    required
                  />
                </div>
                <div className="modal-buttons">
                  <button type="submit" className={`btn-crear`}>
                    {editId ? 'Actualizar' : 'Crear'}
                  </button>
                  <button type="button" className="btn-cancelar" onClick={closeForm}>
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

export default AdminMarcas;
