// src/js/services/inventario.service.js

let productosMock = [
  { id: 1, codigo: 'PROD-001', nombre: 'Laptop Dell Inspiron 15', categoria: 'Computadores', precio: 1200.00, stock: 15, stockMinimo: 5, estado: 'Disponible', proveedor: 'Dell Colombia' },
  { id: 2, codigo: 'PROD-002', nombre: 'Mouse Inalámbrico Logitech', categoria: 'Accesorios', precio: 25.50, stock: 3, stockMinimo: 10, estado: 'Stock Bajo', proveedor: 'Logitech' },
  { id: 3, codigo: 'PROD-003', nombre: 'Teclado Mecánico RGB', categoria: 'Accesorios', precio: 85.00, stock: 0, stockMinimo: 5, estado: 'Agotado', proveedor: 'Razer' },
  { id: 4, codigo: 'PROD-004', nombre: 'Monitor LG 27" 4K', categoria: 'Monitores', precio: 350.00, stock: 8, stockMinimo: 3, estado: 'Disponible', proveedor: 'LG Electronics' },
  { id: 5, codigo: 'PROD-005', nombre: 'Silla Ergonómica Pro', categoria: 'Mobiliario', precio: 280.00, stock: 2, stockMinimo: 4, estado: 'Stock Bajo', proveedor: 'Herman Miller' },
  { id: 6, codigo: 'PROD-006', nombre: 'Impresora Láser HP', categoria: 'Impresoras', precio: 450.00, stock: 12, stockMinimo: 3, estado: 'Disponible', proveedor: 'HP' },
  { id: 7, codigo: 'PROD-007', nombre: 'Webcam HD 1080p', categoria: 'Accesorios', precio: 65.00, stock: 1, stockMinimo: 8, estado: 'Stock Bajo', proveedor: 'Logitech' },
  { id: 8, codigo: 'PROD-008', nombre: 'Disco Duro Externo 1TB', categoria: 'Almacenamiento', precio: 95.00, stock: 20, stockMinimo: 5, estado: 'Disponible', proveedor: 'Seagate' },
];

let nextId = 9;

export const inventarioService = {
  getAll(filtros = {}) {
    let resultado = [...productosMock];

    if (filtros.estado) {
      resultado = resultado.filter(p => p.estado === filtros.estado);
    }

    if (filtros.categoria) {
      resultado = resultado.filter(p => p.categoria === filtros.categoria);
    }

    if (filtros.busqueda) {
      const busqueda = filtros.busqueda.toLowerCase();
      resultado = resultado.filter(p =>
        p.nombre.toLowerCase().includes(busqueda) ||
        p.codigo.toLowerCase().includes(busqueda) ||
        p.proveedor.toLowerCase().includes(busqueda)
      );
    }

    return resultado;
  },

  getById(id) {
    return productosMock.find(p => p.id === id) || null;
  },

  create(producto) {
    const estado = producto.stock === 0 ? 'Agotado' : producto.stock <= producto.stockMinimo ? 'Stock Bajo' : 'Disponible';
    const nuevoProducto = {
      id: nextId++,
      codigo: `PROD-${String(nextId - 1).padStart(3, '0')}`,
      ...producto,
      estado,
    };
    productosMock.push(nuevoProducto);
    return nuevoProducto;
  },

  update(id, datosActualizados) {
    const index = productosMock.findIndex(p => p.id === id);
    if (index === -1) return null;

    const estado = datosActualizados.stock === 0 ? 'Agotado' : datosActualizados.stock <= datosActualizados.stockMinimo ? 'Stock Bajo' : 'Disponible';
    productosMock[index] = { ...productosMock[index], ...datosActualizados, estado };
    return productosMock[index];
  },

  delete(id) {
    const index = productosMock.findIndex(p => p.id === id);
    if (index === -1) return false;
    productosMock.splice(index, 1);
    return true;
  },

  getEstadisticas() {
    const total = productosMock.length;
    const disponibles = productosMock.filter(p => p.estado === 'Disponible').length;
    const stockBajo = productosMock.filter(p => p.estado === 'Stock Bajo').length;
    const agotados = productosMock.filter(p => p.estado === 'Agotado').length;
    const valorInventario = productosMock.reduce((sum, p) => sum + (p.precio * p.stock), 0);

    return { total, disponibles, stockBajo, agotados, valorInventario };
  },

  getCategorias() {
    return [...new Set(productosMock.map(p => p.categoria))];
  },

  getProductosStockBajo() {
    return productosMock.filter(p => p.estado === 'Stock Bajo' || p.estado === 'Agotado');
  },
};