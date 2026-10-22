# 💻 TechStore - Simulador de Cotizaciones y Compras IT

Aplicación Web Interactiva desarrollada como **Proyecto / Entrega Final** para demostrar el dominio de JavaScript moderno, manipulación avanzada del DOM, asincronismo y persistencia de datos.

---

## 🚀 Tecnologías y Herramientas Utilizadas

* **HTML5 & CSS3** (Estructura semántica y diseño personalizado).
* **Bootstrap 5** (Framework CSS para una interfaz adaptable, limpia e intuitiva).
* **JavaScript (ES6+)**:
  * Programación Asincrónica (`async`/`await`, `try`/`catch`/`finally`).
  * Peticiones HTTP locales (`fetch`).
  * Funciones de orden superior (`map`, `filter`, `find`, `reduce`, `forEach`).
  * Sintaxis avanzada (Operadores ternarios, operador OR, destructuring).
  * Persistencia de datos (`localStorage`).
* **Librerías Externas**:
  * **SweetAlert2** (Alertas y modales de confirmación personalizados).
  * **Toastify JS** (Notificaciones toast flotantes).

---

## 📋 Funcionalidades del Simulador

1. **Catálogo Dinámico**: Carga asincrónica de productos desde un archivo simulado (`productos.json`) consumido mediante `fetch`.
2. **Filtros en Tiempo Real**: Búsqueda por texto (nombre) y filtrado por categorías de productos tecnológicos (Servidores, Redes, Seguridad, CCTV).
3. **Gestión de Carrito**: 
   * Agregar productos con persistencia automática en `localStorage`.
   * Modificar cantidades (incrementar/disminuir) o eliminar ítems individuales.
   * Cálculo automático del total a pagar mediante funciones de orden superior (`reduce`).
4. **Experiencia de Usuario (UX)**: Interfaz libre de elementos nativos bloqueantes (`alert`, `confirm`, `prompt`), reemplazados íntegramente por librerías UI profesionales.

---

## 📂 Estructura de Archivos

```text
/
├── index.html              # Archivo principal de la interfaz
├── assets/
│   ├── css/
│   │   └── styles.css      # Estilos visuales personalizados
│   └── img/                # Imágenes físicas de los productos (.jpg)
├── data/
│   └── productos.json      # Base de datos simulada en formato JSON
└── js/
    ├── main.js             # Lógica principal, eventos, DOM y fetch
    └── storage.js          # Lógica centralizada de LocalStorage
