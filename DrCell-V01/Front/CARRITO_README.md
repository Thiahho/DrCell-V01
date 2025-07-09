# 🛒 Carrito de Compras - DrCell

## Funcionalidades Implementadas

### ✅ Carrito de Compras Completo
- **Persistencia en localStorage**: Los productos se mantienen en el carrito incluso al recargar la página
- **Gestión de cantidades**: Aumentar/disminuir cantidad de productos
- **Validación de stock**: No permite agregar más productos que el stock disponible
- **Cálculo automático**: Total de productos y precio total
- **Interfaz intuitiva**: Botón flotante con contador de productos

### ✅ Integración con WhatsApp
- **Envío automático**: Genera un mensaje formateado con todos los productos
- **Configuración fácil**: Número de WhatsApp configurable en un solo archivo
- **Mensaje personalizable**: Texto por defecto editable

## 📁 Archivos Creados/Modificados

### Nuevos Archivos:
- `src/store/cart-store.ts` - Store del carrito con Zustand
- `src/components/Cart.tsx` - Componente del carrito flotante
- `src/components/ui/toast.tsx` - Componente de notificaciones
- `src/config/whatsapp.ts` - Configuración de WhatsApp

### Archivos Modificados:
- `src/components/DetalleProducto.tsx` - Integración con carrito
- `src/App.tsx` - Inclusión del componente Cart
- `src/index.css` - Estilos y animaciones

## ⚙️ Configuración

### 1. Configurar Número de WhatsApp
Edita el archivo `src/config/whatsapp.ts`:

```typescript
export const WHATSAPP_CONFIG = {
  // Cambiar por el número real de WhatsApp (formato internacional)
  PHONE_NUMBER: '+5491112345678',
  
  // Mensaje personalizable
  DEFAULT_MESSAGE: 'Hola! Me interesa hacer un pedido desde la tienda online.',
  
  // Nombre de la empresa
  COMPANY_NAME: 'DrCell'
};
```

### 2. Formato del Número de WhatsApp
- **Argentina**: `+5491112345678`
- **México**: `+5215512345678`
- **España**: `+34612345678`
- **Colombia**: `+573001234567`

## 🎯 Cómo Funciona

### Agregar al Carrito:
1. El usuario selecciona un producto en la tienda
2. Elige las especificaciones (RAM, almacenamiento, color)
3. Hace clic en "Agregar al carrito"
4. Aparece una notificación de confirmación
5. El producto se guarda en localStorage

### Gestionar el Carrito:
1. Botón flotante en la esquina inferior derecha
2. Muestra el número total de productos
3. Al hacer clic se abre el panel del carrito
4. Permite modificar cantidades o eliminar productos
5. Muestra el total a pagar

### Enviar por WhatsApp:
1. Hacer clic en "Enviar pedido por WhatsApp"
2. Se genera automáticamente un mensaje formateado
3. Se abre WhatsApp Web/App con el mensaje pre-llenado
4. El cliente solo debe enviar el mensaje

## 📱 Ejemplo de Mensaje Generado

```
Hola! Me interesa hacer un pedido desde la tienda online.

🛒 *PEDIDO - DrCell*

• Samsung Galaxy S23 (8GB/256GB/Negro) - Cantidad: 1 - $1,200,000
• iPhone 15 Pro (12GB/512GB/Azul) - Cantidad: 2 - $2,800,000

*Total: $4,000,000*

Gracias por tu compra! 📱✨
```

## 🔧 Personalización

### Cambiar Colores del Carrito:
Edita las clases de Tailwind en `src/components/Cart.tsx`:
- Botón principal: `bg-blue-600`
- Botón WhatsApp: `bg-green-500`
- Contador: `bg-red-500`

### Modificar Animaciones:
Edita `src/index.css` para cambiar las animaciones de entrada y salida.

### Agregar Más Campos:
Para agregar más información al carrito, modifica la interfaz `CartItem` en `src/store/cart-store.ts`.

## 🚀 Próximas Mejoras Sugeridas

1. **Historial de pedidos**: Guardar pedidos enviados
2. **Cupones de descuento**: Sistema de códigos promocionales
3. **Múltiples métodos de pago**: Integración con pasarelas de pago
4. **Carrito compartido**: Sincronización entre dispositivos
5. **Notificaciones push**: Recordatorios de productos en carrito

## 📞 Soporte

Para cualquier duda o problema con la implementación del carrito, revisar:
1. Console del navegador para errores
2. localStorage para verificar que los datos se guarden
3. Configuración del número de WhatsApp
4. Permisos del navegador para abrir WhatsApp 