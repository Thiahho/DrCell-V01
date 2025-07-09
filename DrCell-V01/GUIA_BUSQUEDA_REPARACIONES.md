# Guía de Búsqueda de Reparaciones - DrCell

## 🔍 **Funcionalidad de Búsqueda Implementada**

### **Endpoints Disponibles:**

#### **1. Búsqueda con Filtros**
```
GET http://localhost:5015/celulares/buscar
```

**Parámetros de consulta:**
- `termino` - Búsqueda general en marca y modelo
- `marca` - Filtro específico por marca
- `modelo` - Filtro específico por modelo

#### **2. Vista Completa**
```
GET http://localhost:5015/celulares/vista-completa
```

## 📋 **Ejemplos de Uso en Postman**

### **Búsqueda General:**
```
GET http://localhost:5015/celulares/buscar?termino=Galaxy
```

### **Búsqueda por Marca:**
```
GET http://localhost:5015/celulares/buscar?marca=Samsung
```

### **Búsqueda por Modelo:**
```
GET http://localhost:5015/celulares/buscar?modelo=iPhone
```

### **Búsqueda Combinada:**
```
GET http://localhost:5015/celulares/buscar?marca=Samsung&modelo=Galaxy
```

### **Vista Completa:**
```
GET http://localhost:5015/celulares/vista-completa
```

## 🎯 **Respuestas Esperadas**

### **Búsqueda Exitosa:**
```json
{
  "success": true,
  "message": "Búsqueda realizada correctamente",
  "count": 5,
  "filters": {
    "termino": "Galaxy",
    "marca": null,
    "modelo": null
  },
  "data": [
    {
      "marca": "Samsung",
      "modelo": "Galaxy S21",
      "arreglomodulo": 150.00,
      "arreglobateria": 80.00,
      "arreglopin": 45.00,
      "colormodulo": "Negro",
      "tipo": "OLED",
      "marco": true,
      "version": "128GB"
    }
  ]
}
```

### **Sin Resultados:**
```json
{
  "success": true,
  "message": "Búsqueda realizada correctamente",
  "count": 0,
  "filters": {
    "termino": "XYZ",
    "marca": null,
    "modelo": null
  },
  "data": []
}
```

## 🚀 **Componente Frontend**

### **Archivo:** `Front/src/components/BusquedaReparaciones.tsx`

**Características:**
- ✅ Búsqueda por término libre
- ✅ Filtro por marca (dropdown)
- ✅ Filtro por modelo
- ✅ Resultados en cards
- ✅ Indicadores de "Sin presupuesto"
- ✅ Botón de limpiar filtros
- ✅ Loading states

### **Para Usar el Componente:**
```tsx
import BusquedaReparaciones from './components/BusquedaReparaciones';

// En tu página o componente
<BusquedaReparaciones />
```

## 📊 **Tipos de Búsqueda Disponibles**

### **1. Búsqueda por Término Libre**
- Busca en marca Y modelo simultáneamente
- Usa `ILIKE` para búsquedas case-insensitive
- Ejemplo: "Galaxy" encuentra "Samsung Galaxy S21"

### **2. Búsqueda por Marca**
- Filtro específico por marca
- Dropdown con marcas disponibles
- Ejemplo: "Samsung" muestra solo Samsung

### **3. Búsqueda por Modelo**
- Filtro específico por modelo
- Campo de texto libre
- Ejemplo: "iPhone" encuentra todos los iPhone

### **4. Búsqueda Combinada**
- Puedes combinar todos los filtros
- Los filtros se aplican con AND
- Ejemplo: marca="Samsung" + modelo="Galaxy"

## 🔧 **Configuración en Postman**

### **Headers:**
```
Content-Type: application/json
Accept: application/json
```

### **Variables de Entorno:**
```
base_url: http://localhost:5015
```

### **Colección de Pruebas:**
```json
{
  "info": {
    "name": "DrCell Reparaciones API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Vista Completa",
      "request": {
        "method": "GET",
        "url": "{{base_url}}/celulares/vista-completa"
      }
    },
    {
      "name": "Búsqueda por Término",
      "request": {
        "method": "GET",
        "url": "{{base_url}}/celulares/buscar?termino=Galaxy"
      }
    },
    {
      "name": "Búsqueda por Marca",
      "request": {
        "method": "GET",
        "url": "{{base_url}}/celulares/buscar?marca=Samsung"
      }
    }
  ]
}
```

## 🎨 **Características del Frontend**

### **Diseño Responsive:**
- Grid adaptativo: 1 columna (móvil) → 2 columnas (tablet) → 3 columnas (desktop)
- Cards con información completa
- Indicadores visuales de precios

### **Estados Visuales:**
- ✅ **Verde**: Precio disponible
- ⚠️ **Rojo**: Sin presupuesto
- 🔄 **Loading**: Durante búsqueda
- 📭 **Vacío**: Sin resultados

### **Funcionalidades:**
- Búsqueda en tiempo real
- Filtros combinables
- Limpieza de filtros
- Manejo de errores
- Paginación (limitado a 100 resultados)

## 📝 **Notas de Desarrollo**

### **Límites de Rendimiento:**
- Vista completa: máximo 50 registros
- Búsqueda: máximo 100 registros
- Búsquedas case-insensitive con `ILIKE`

### **Optimizaciones:**
- Uso de `AsQueryable()` para consultas dinámicas
- Filtros opcionales con validación
- Respuestas estructuradas con metadata

### **Seguridad:**
- Validación de parámetros de entrada
- Manejo de errores con try-catch
- Respuestas consistentes

## 🚀 **Próximos Pasos**

1. **Probar endpoints** en Postman
2. **Integrar componente** en la aplicación
3. **Ajustar límites** según necesidades
4. **Agregar paginación** si es necesario
5. **Implementar cache** para mejorar rendimiento 