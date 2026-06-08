import { useEffect, useState } from "react";
import {
  createproducto,
  deleteproducto,
  getproductos,
  updateproducto,
} from "../api/productos";
import { getcategories } from "../api/categorias";
import "../css/Productos.css";

function Producto() {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [nuevoproducto, setNuevoProducto] = useState({
    nombre: "",
    precio: "",
    stock: "",
    categoriaid: "",
    imagen: "",
  });
  const [editando, setEditando] = useState(null);

  useEffect(() => {
    async function cargarDatos() {
      try {
        const cats = await getcategories();
        const prods = await getproductos();
        setCategorias(cats);
        setProductos(prods);
      } catch (error) {
        console.error("Error al cargar datos:", error);
      }
    }

    cargarDatos();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNuevoProducto((prev) => ({ ...prev, [name]: value }));
  };

  const guardarProducto = async (e) => {
    e.preventDefault();

    const productoBase = {
      name: nuevoproducto.nombre.trim(),
      price: parseFloat(nuevoproducto.precio),
      categoryId: parseInt(nuevoproducto.categoriaid),
      stock: parseInt(nuevoproducto.stock || "0"),
      imageUrl: nuevoproducto.imagen.trim() || null,
    };

    const productoData =
      editando !== null ? { ...productoBase, id: editando } : productoBase;

    try {
      if (editando !== null) {
        await updateproducto(editando, productoData);
        alert("Producto actualizado exitosamente");
      } else {
        await createproducto(productoData);
        alert("Producto creado exitosamente");
      }

      const update = await getproductos();
      setProductos(update);
      setNuevoProducto({
        nombre: "",
        precio: "",
        stock: "",
        categoriaid: "",
        imagen: "",
      });
      setEditando(null);
    } catch (error) {
      console.error("Error al guardar producto:", error);
      alert(error.message || "Error al guardar producto");
    }
  };

  const eliminarProducto = async (id) => {
    if (!window.confirm("Estas seguro de eliminar este producto?")) return;

    try {
      await deleteproducto(id);
      setProductos((prev) => prev.filter((p) => p.id !== id));
      alert("Producto eliminado exitosamente");
    } catch (error) {
      console.error("Error al eliminar producto:", error);
      alert("Error al eliminar producto");
    }
  };

  const editar = (producto) => {
    setNuevoProducto({
      nombre: producto.name,
      precio: producto.price,
      stock: producto.stock,
      categoriaid: String(producto.categoryId),
      imagen: producto.imageUrl || "",
    });
    setEditando(producto.id);
  };

  return (
    <div className="productos-page">
      <header className="productos-header">
        <div>
          <h2>Administrar productos</h2>
          <p>Gestiona tu catalogo, precios, stock e imagenes.</p>
        </div>
      </header>

      <form onSubmit={guardarProducto} className="productos-form">
        <input
          type="text"
          className="form-control"
          name="nombre"
          placeholder="Nombre"
          value={nuevoproducto.nombre}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          className="form-control"
          name="precio"
          placeholder="Precio"
          value={nuevoproducto.precio}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          className="form-control"
          placeholder="Stock"
          name="stock"
          value={nuevoproducto.stock}
          min="0"
          onChange={handleChange}
        />

        <select
          className="form-select"
          name="categoriaid"
          value={nuevoproducto.categoriaid}
          onChange={handleChange}
          required
        >
          <option value="">Selecciona categoria</option>
          {categorias.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        <input
          type="text"
          className="form-control productos-url"
          name="imagen"
          placeholder="URL de imagen"
          value={nuevoproducto.imagen}
          onChange={handleChange}
        />

        <button type="submit" className="btn btn-success productos-submit">
          {editando !== null ? "Actualizar" : "Anadir"}
        </button>
      </form>

      {productos.length === 0 ? (
        <div className="productos-empty">No hay productos registrados.</div>
      ) : (
        <ul className="productos-list">
          {productos.map((p) => (
            <li key={p.id} className="producto-item">
              <div className="producto-info">
                {p.imageUrl ? (
                  <img src={p.imageUrl} alt={p.name} className="producto-img" />
                ) : (
                  <div className="producto-img producto-img-empty" />
                )}

                <div className="producto-copy">
                  <strong>{p.name}</strong>
                  <span>${p.price.toLocaleString()}</span>
                  <small>Stock: {p.stock}</small>
                </div>
              </div>

              <div className="producto-actions">
                <button
                  type="button"
                  className="btn btn-sm btn-primary"
                  onClick={() => editar(p)}
                >
                  Editar
                </button>
                <button
                  type="button"
                  className="btn btn-sm btn-danger"
                  onClick={() => eliminarProducto(p.id)}
                >
                  Eliminar
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Producto;
