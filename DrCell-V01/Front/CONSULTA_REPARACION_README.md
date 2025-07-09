# Consulta de Reparaciones - DrCell

## Descripción
Sistema de consulta de precios de reparaciones para celulares que utiliza la vista `vCelularesMBP` para obtener información completa de módulos, baterías y pines.

## Funcionalidades

### 1. Consulta por Marca y Modelo
- Selección de marca desde la base de datos
- Filtrado automático de modelos según la marca seleccionada
- Carga dinámica de variantes disponibles

### 2. Filtros Adicionales
- **Color del módulo**: Filtra por color específico
- **Marco**: Con marco o sin marco
- **Versión**: Versión específica del modelo
- **Tipo**: Tipo de módulo disponible

### 3. Visualización de Precios
- **Módulo**: Precio de reparación del módulo
- **Pin de carga**: Precio de reparación del pin
- **Batería**: Precio de reparación de la batería

### 4. Indicadores Visuales
- ✅ **Verde**: Precio disponible
- ⚠️ **Rojo**: Sin presupuesto disponible
- **Resumen**: Lista de servicios disponibles

## Estructura de la Base de Datos

### Vista vCelularesMBP
```sql
CREATE OR REPLACE VIEW vcelularesmbp AS
SELECT 
    c.marca,
    c.modelo,
    m.marco, 
    m.color AS colormodulo, 
    m.tipo,
    m.version, 
    m.costo AS costomodulo, 
    b.costo AS costobat, 
    p.costo AS costopin 
FROM celulares c
JOIN pines p ON c.modelo = p.modelo
JOIN modulos m ON c.modelo = m.modelo
JOIN baterias b ON c.modelo = b.modelo;
```

### Modelo C#
```csharp
public class vCelularesMBP
{
    public string? marca { get; set; }
    public string? modelo { get; set; }
    public Boolean marco { get; set; }
    public string? colormodulo { get; set; }
    public string? tipo { get; set; }
    public string? version { get; set; }
    public decimal? costomodulo { get; set; }
    public decimal? costobat { get; set; }
    public decimal? costopin { get; set; }
}
```

## API Endpoints

### GET /celulares/marcas
Obtiene todas las marcas disponibles.

### GET /celulares/modelos/{marca}
Obtiene los modelos disponibles para una marca específica.

### GET /celulares/info/{marca}/{modelo}
Obtiene información completa de reparaciones para un modelo específico.

**Respuesta:**
```json
[
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
```

## Manejo de Valores Nulos

### Casos de "Sin Presupuesto"
- Cuando `costomodulo` es NULL → "Sin presupuesto" en módulo
- Cuando `costobat` es NULL → "Sin presupuesto" en batería  
- Cuando `costopin` es NULL → "Sin presupuesto" en pin

### Indicadores Visuales
- **Fondo rojo + texto rojo**: Sin presupuesto disponible
- **Fondo verde + texto verde**: Precio disponible
- **Icono ⚠️**: Sin presupuesto
- **Icono ✅**: Precio disponible

## Flujo de Usuario

1. **Selección de Marca**: Usuario selecciona una marca del dropdown
2. **Selección de Modelo**: Se filtran automáticamente los modelos disponibles
3. **Filtros Opcionales**: Usuario puede refinar por color, marco, versión y tipo
4. **Visualización de Precios**: Se muestran los precios disponibles con indicadores visuales
5. **Resumen**: Se muestra un resumen de todos los servicios disponibles

## Características Técnicas

### Frontend (React + TypeScript)
- **Estado reactivo**: Filtros se actualizan automáticamente
- **Validación**: Campos se habilitan/deshabilitan según selecciones previas
- **UX mejorada**: Indicadores visuales claros para precios disponibles/no disponibles
- **Responsive**: Diseño adaptable para móviles y desktop

### Backend (ASP.NET Core)
- **Vista optimizada**: Consulta única para obtener toda la información
- **Mapeo automático**: Conversión de `costo` a `arreglo` para compatibilidad
- **Filtrado eficiente**: Uso de `EF.Functions.ILike` para búsquedas case-insensitive

## Instalación y Configuración

### 1. Base de Datos
Ejecutar el script SQL para crear la vista:
```sql
-- Ejecutar BD/vCelularesMBP.sql
```

### 2. Backend
La configuración ya está incluida en:
- `ApplicationDbContext.cs`
- `EquiposService.cs`
- `CelularesController.cs`

### 3. Frontend
El componente ya está configurado en:
- `ConsultaReparacionSection.tsx`

## Notas de Desarrollo

- Los precios se obtienen de la vista `vCelularesMBP`
- Los valores NULL se manejan como "Sin presupuesto"
- El diseño es responsive y accesible
- Se incluyen indicadores visuales para mejor UX
- La API es RESTful y sigue las mejores prácticas 