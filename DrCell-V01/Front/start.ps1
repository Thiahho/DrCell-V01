# Verificar si node_modules existe
if (-not (Test-Path "node_modules")) {
    Write-Host "Instalando dependencias por primera vez..."
    npm install
}

# Iniciar la aplicación
Write-Host "Iniciando la aplicación..."
npm start 