@echo off
echo Instalando dependencias de DrCell Frontend...
cd /d "%~dp0"

echo Limpiando node_modules y package-lock.json...
if exist node_modules rmdir /s /q node_modules
if exist package-lock.json del package-lock.json

echo Instalando dependencias principales...
call npm install --legacy-peer-deps react-scripts@5.0.1 tailwindcss-animate @radix-ui/react-slot class-variance-authority tailwind-merge zustand @radix-ui/react-alert-dialog @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-label @radix-ui/react-toast @tanstack/react-query axios react-hook-form zod react react-dom react-router-dom

echo Instalando dependencias de desarrollo...
call npm install --legacy-peer-deps -D @typescript-eslint/eslint-plugin@^5.62.0 @typescript-eslint/parser@^5.62.0 autoprefixer eslint eslint-config-prettier eslint-plugin-react eslint-plugin-react-hooks husky lint-staged postcss prettier tailwindcss typescript @types/react @types/react-dom @types/node

echo Inicializando Husky...
call npx husky install
call npx husky add .husky/pre-commit "npx lint-staged"

echo Inicializando Tailwind...
call npx tailwindcss init -p

echo Instalación completada! 