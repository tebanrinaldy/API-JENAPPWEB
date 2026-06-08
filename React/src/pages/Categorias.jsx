import { useEffect, useState } from "react";
import { FiEdit2, FiFolder, FiPlus, FiTrash2, FiX } from "react-icons/fi";
import {
  createcategories,
  deletecategories,
  getcategories,
  updatecategories,
} from "../api/categorias";
import "../css/Categorias.css";

function Categorias() {
  const [categorias, setCategorias] = useState([]);
  const [nombre, setNombre] = useState("");
  const [editando, setEditando] = useState(null);

  useEffect(() => {
    cargarCategorias();
  }, []);

  const cargarCategorias = async () => {
    const data = await getcategories();
    setCategorias(data);
  };

  const handleEditar = (categoria) => {
    setEditando(categoria);
    setNombre(categoria.name);
  };

  const handleCancelar = () => {
    setEditando(null);
    setNombre("");
  };

  const handlecreate = async (e) => {
    e.preventDefault();

    if (
      !editando &&
      categorias.some((cat) => cat.name?.toLowerCase() === nombre.toLowerCase())
    ) {
      alert("La categoría ya existe");
      return;
    }

    if (editando) {
      await updatecategories(editando.id, { name: nombre });
      alert("Categoría actualizada con éxito");
      setEditando(null);
    } else {
      await createcategories({ name: nombre });
      alert("Categoría creada con éxito");
    }

    setNombre("");
    await cargarCategorias();
  };

  const eliminarCategoria = async (id) => {
    const confirmar = window.confirm(
      "¿Estás seguro de que deseas eliminar esta categoría?"
    );
    if (!confirmar) return;
    await deletecategories(id);
    alert("Categoría eliminada con éxito");
    await cargarCategorias();
  };

  return (
    <div className="categoria-page">
      <header className="page-hero">
        <div>
          <h2>Categorías de productos</h2>
          <p>Organiza tu catálogo para que vender y buscar sea más rápido.</p>
        </div>
      </header>

      <form onSubmit={handlecreate} className="categoria-form surface-panel">
        <input
          type="text"
          className="form-control"
          placeholder="Nueva categoría"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />

        {editando ? (
          <>
            <button type="submit" className="btn btn-warning">
              <FiEdit2 /> Guardar
            </button>
            <button type="button" className="btn btn-secondary" onClick={handleCancelar}>
              <FiX /> Cancelar
            </button>
          </>
        ) : (
          <button type="submit" className="btn btn-success">
            <FiPlus /> Crear
          </button>
        )}
      </form>

      <div className="categoria-grid">
        {categorias.map((cat) => (
          <article key={cat.id} className="categoria-card">
            <div className="categoria-icon">
              <FiFolder />
            </div>
            <span>{cat.name}</span>
            <div className="categoria-actions">
              <button className="btn btn-sm btn-primary" onClick={() => handleEditar(cat)}>
                <FiEdit2 /> Editar
              </button>
              <button className="btn btn-sm btn-danger" onClick={() => eliminarCategoria(cat.id)}>
                <FiTrash2 /> Eliminar
              </button>
            </div>
          </article>
        ))}

        {categorias.length === 0 && (
          <div className="surface-panel categoria-empty">No hay categorías registradas.</div>
        )}
      </div>
    </div>
  );
}

export default Categorias;
