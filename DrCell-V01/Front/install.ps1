# Limpiar instalaciones anteriores
Write-Host "Limpiando instalaciones anteriores..." -ForegroundColor Yellow
Remove-Item -Path "node_modules" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path "package-lock.json" -Force -ErrorAction SilentlyContinue

# Instalar dependencias
Write-Host "Instalando dependencias..." -ForegroundColor Green
npm install

# Verificar la instalación
Write-Host "Verificando la instalación..." -ForegroundColor Green
npm run lint

Write-Host "¡Instalación completada!" -ForegroundColor Green
Write-Host "Puedes iniciar el proyecto con 'npm start'" -ForegroundColor Cyan 