# Tecnologías y Metodologías - DrCell Frontend

## 🚀 Stack Tecnológico Principal

### Core
- **React 18**: Framework principal para la construcción de la interfaz
- **TypeScript**: Superset de JavaScript para tipado estático
- **Vite**: Bundler y servidor de desarrollo

### Estilos y UI
- **Tailwind CSS**: Framework de utilidades CSS
- **Radix UI**: Componentes primitivos accesibles
- **class-variance-authority**: Sistema de variantes para componentes
- **clsx & tailwind-merge**: Utilidades para manejo de clases CSS

### Estado y Datos
- **Zustand**: Gestión de estado global
- **React Query**: Manejo de estado del servidor y caché
- **Axios**: Cliente HTTP para peticiones API

### Formularios y Validación
- **React Hook Form**: Manejo de formularios
- **Zod**: Validación de esquemas
- **@hookform/resolvers**: Integración de Zod con React Hook Form

### Desarrollo y Calidad
- **ESLint**: Linting de código
- **Prettier**: Formateo de código
- **Husky**: Git hooks
- **lint-staged**: Linting de archivos staged
- **TypeScript**: Tipado estático

## 📦 Dependencias Principales

```json
{
  "dependencies": {
    "@hookform/resolvers": "^3.3.4",
    "@radix-ui/react-*": "^1.0.0",
    "@tanstack/react-query": "^5.24.1",
    "axios": "^1.9.0",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.0",
    "react-hook-form": "^7.51.0",
    "tailwind-merge": "^2.2.1",
    "zod": "^3.22.4",
    "zustand": "^4.5.2"
  }
}
```

## 🏗️ Arquitectura y Estructura

### Estructura de Carpetas
```
src/
├── components/
│   ├── ui/          # Componentes base reutilizables
│   └── features/    # Componentes específicos de features
├── lib/
│   ├── utils.ts     # Utilidades generales
│   └── axios.ts     # Configuración de cliente HTTP
├── store/
│   └── auth-store.ts # Store de autenticación
├── hooks/           # Custom hooks
├── pages/           # Componentes de página
├── services/        # Servicios y APIs
└── types/           # Definiciones de tipos
```

### Patrones de Diseño
1. **Atomic Design**
   - Atoms: Componentes básicos (Button, Input)
   - Molecules: Componentes compuestos
   - Organisms: Secciones completas
   - Templates: Layouts
   - Pages: Vistas finales

2. **Container/Presentational**
   - Containers: Lógica y estado
   - Presentational: UI pura

3. **Custom Hooks**
   - Separación de lógica reutilizable
   - Encapsulamiento de estado y efectos

## 🔒 Seguridad

### Autenticación
- JWT (JSON Web Tokens)
- Refresh Token Rotation
- Interceptores Axios para manejo automático de tokens
- Almacenamiento seguro de tokens

### Protección de Rutas
- Middleware de autenticación
- Redirección automática
- Manejo de roles y permisos

## 🎨 Sistema de Diseño

### Variables CSS
```css
:root {
  --primary: 222.2 47.4% 11.2%;
  --primary-foreground: 210 40% 98%;
  --secondary: 210 40% 96.1%;
  --secondary-foreground: 222.2 47.4% 11.2%;
  /* ... más variables ... */
}
```

### Componentes Base
- Button
- Input
- Select
- Dialog
- Toast
- Dropdown
- Alert

## 📝 Convenciones de Código

### Nombrado
- Componentes: PascalCase (Button.tsx)
- Hooks: camelCase (useAuth.ts)
- Utilidades: camelCase (formatDate.ts)
- Tipos/Interfaces: PascalCase (User.ts)

### Estilos
- Tailwind para estilos
- Variables CSS para temas

### Estado
- Zustand para estado global
- React Query para estado del servidor
- useState para estado local

## 🧪 Testing

### Herramientas
- Jest
- React Testing Library

### Tipos de Tests
- Unit Tests
- Integration Tests

## 🚀 CI/CD

### Herramientas
- Husky para pre-commit hooks
- lint-staged para linting de archivos staged

### Proceso
1. Pre-commit
   - Linting
   - Formateo
   - Tests unitarios

## 📚 Documentación

### Herramientas
- JSDoc para documentación de código
- README.md para documentación general

### Contenido
- Guías de instalación
- Guías de contribución
- Documentación de componentes
- Documentación de API

## 🔄 Flujo de Trabajo

1. **Desarrollo**
   - Feature branches
   - Pull requests
   - Code review

2. **Calidad**
   - Linting
   - Testing
   - Type checking
   - Code review

## 🛠️ Herramientas de Desarrollo

### IDE
- VS Code
- Extensiones recomendadas:
  - ESLint
  - Prettier
  - Tailwind CSS IntelliSense
  - TypeScript

### DevTools
- React Developer Tools
- Network Inspector

## 📱 Responsive Design

### Breakpoints
```css
sm: '640px'
md: '768px'
lg: '1024px'
xl: '1280px'
2xl: '1536px'
```

### Enfoque
- Mobile First
- Diseño fluido
- Componentes adaptables 