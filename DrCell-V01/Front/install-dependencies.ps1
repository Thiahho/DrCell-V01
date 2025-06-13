# Instalar dependencias principales
npm install @hookform/resolvers @radix-ui/react-alert-dialog @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-label @radix-ui/react-slot @radix-ui/react-toast @tanstack/react-query axios class-variance-authority clsx framer-motion lucide-react react-hook-form tailwind-merge tailwindcss-animate zod zustand

# Instalar dependencias de desarrollo
npm install -D @typescript-eslint/eslint-plugin @typescript-eslint/parser autoprefixer eslint eslint-config-prettier eslint-plugin-react eslint-plugin-react-hooks husky lint-staged postcss prettier tailwindcss typescript

# Inicializar Husky
npx husky install
npx husky add .husky/pre-commit "npx lint-staged"

# Inicializar Tailwind
npx tailwindcss init -p 