import React, { useEffect, useState, useRef } from "react";
import "../../styles/AdminConcesionarias.css";
import Mensaje from '../../components/common/Mensaje';

const API_URL = import.meta.env.VITE_API_URL;
const MAX_LOGO_SIZE_MB = 5;

const AdminConcesionarias: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [concesionariaId, setConcesionariaId] = useState<string | null>(null);
  const [nombre, setNombre] = useState("");
  const [color, setColor] = useState("#000000");
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const colorInputRef = useRef<HTMLInputElement>(null);
  const [mensaje, setMensaje] = useState<{ tipo: 'success' | 'error'; texto: string } | null>(null);

  const mostrarMensaje = (tipo: 'success' | 'error', texto: string) => {
    setMensaje({ tipo, texto });
    setTimeout(() => setMensaje(null), 3000);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      mostrarMensaje('error', 'No autenticado. Redirigiendo a login...');
      setTimeout(() => {
        window.location.href = "/login";
      }, 1500);
      return;
    }
    fetch(`${API_URL}/api/usuarios/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("No se pudo obtener usuario");
        return res.json();
      })
      .then((data) => {
        setConcesionariaId(data.concesionaria_id);
        return fetch(`${API_URL}/concesionarias/${data.concesionaria_id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      })
      .then((res) => {
        if (!res.ok) throw new Error("No se pudo obtener concesionaria");
        return res.json();
      })
      .then((data) => {
        console.log('Concesionaria data:', data);
        setNombre(data.nombre || "");
        setColor(data.color_principal || "#000000");
        setLogoUrl(data.logo_url || null);
        setLogoPreview(null); // Limpiar preview si viene del backend
        document.documentElement.style.setProperty('--primary-color', data.color_principal || "#000000");
      })
      .catch((err) => mostrarMensaje('error', err.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    document.documentElement.style.setProperty('--primary-color', color);
  }, [color]);

  // Limpiar preview al cambiar logoFile
  useEffect(() => {
    if (logoFile) {
      // Validar tipo y tamaño
      if (!logoFile.type.startsWith('image/')) {
        setError('El archivo debe ser una imagen');
        setLogoFile(null);
        setLogoPreview(null);
        return;
      }
      if (logoFile.size > MAX_LOGO_SIZE_MB * 1024 * 1024) {
        setError(`El logo debe pesar menos de ${MAX_LOGO_SIZE_MB}MB`);
        setLogoFile(null);
        setLogoPreview(null);
        return;
      }
      const url = URL.createObjectURL(logoFile);
      setLogoPreview(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setLogoPreview(null);
    }
  }, [logoFile]);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const file = e.target.files?.[0] || null;
    setLogoFile(file);
  };

  const handleRemoveLogo = () => {
    setLogoFile(null);
    setLogoPreview(null);
  };

  const handleGuardar = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMensaje(null);
    const token = localStorage.getItem("token");
    if (!token || !concesionariaId) {
      mostrarMensaje('error', 'No autenticado');
      setSaving(false);
      return;
    }
    try {
      // Actualizar nombre y color
      const putRes = await fetch(`${API_URL}/concesionarias/${concesionariaId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ nombre, color_principal: color, logo_url: logoUrl }),
      });
      if (!putRes.ok) throw new Error("Error al guardar cambios");
      // Subir logo si hay uno nuevo
      if (logoFile) {
        const formData = new FormData();
        formData.append("file", logoFile);
        const postRes = await fetch(`${API_URL}/concesionarias/${concesionariaId}/logo`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });
        if (!postRes.ok) {
          const errData = await postRes.json().catch(() => ({}));
          throw new Error(errData.detail || "Error al subir logo");
        }
        const logoData = await postRes.json();
        setLogoUrl(logoData.logo_url);
        setLogoFile(null);
        setLogoPreview(null);
      }
      mostrarMensaje('success', 'Cambios guardados correctamente');
    } catch (err: any) {
      mostrarMensaje('error', err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="admin-vehiculos-wrapper">
    <div className="container admin-concesionarias"><p>Cargando...</p></div>
  </div>;

  return (
    <div className="admin-vehiculos-wrapper">
      <div className="container admin-concesionarias">
        {mensaje && <Mensaje tipo={mensaje.tipo} texto={mensaje.texto} />}
        <h2>Editar concesionaria</h2>
        <form onSubmit={handleGuardar} className="admin-concesionarias-form">
          <div className="form-group">
            <label>Nombre</label>
            <input
              className="form-input"
              type="text"
              value={nombre}
              onChange={e => setNombre(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Color principal</label>
            <input
              className="form-input"
              type="color"
              value={color}
              ref={colorInputRef}
              onChange={e => setColor(e.target.value)}
              style={{ width: 50, height: 40, padding: 0, border: 'none', background: 'none' }}
            />
          </div>
          <div className="form-group">
            <label>Logo actual</label>
            {logoUrl ? (
              <img src={logoUrl} alt="Logo concesionaria" className="admin-concesionarias-logo" />
            ) : (
              <span>No hay logo</span>
            )}
          </div>
          <div className="form-group">
            <label>Nuevo logo</label>
            <input
              className="form-input"
              type="file"
              accept="image/*"
              onChange={handleLogoChange}
            />
            {logoPreview && (
              <div style={{ marginTop: 10 }}>
                <img src={logoPreview} alt="Vista previa logo" className="admin-concesionarias-logo" />
                <button type="button" className="btn" style={{ marginLeft: 10 }} onClick={handleRemoveLogo}>Quitar</button>
              </div>
            )}
          </div>
          <button className="btn" type="submit" disabled={saving}>{saving ? "Guardando..." : "Guardar cambios"}</button>
        </form>
      </div>
    </div>
  );
};

export default AdminConcesionarias; 