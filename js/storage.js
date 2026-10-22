// Clave persistente en Storage
const CLAVE_STORAGE_CARRITO = "carrito_techstore_v1";

// Guardar carrito en LocalStorage
const guardarCarritoStorage = (carrito) => {
  localStorage.setItem(CLAVE_STORAGE_CARRITO, JSON.stringify(carrito));
};

// Obtener carrito usando Operador OR (Default a array vacío si no existe)
const obtenerCarritoStorage = () => {
  const carritoGuardado = localStorage.getItem(CLAVE_STORAGE_CARRITO);
  return JSON.parse(carritoGuardado) || [];
};

// Vaciar carrito del Storage
const vaciarCarritoStorage = () => {
  localStorage.removeItem(CLAVE_STORAGE_CARRITO);
};