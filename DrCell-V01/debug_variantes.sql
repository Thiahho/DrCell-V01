-- Script de diagnóstico para verificar el estado de la tabla productos_variantes

-- 1. Verificar si la tabla existe
SELECT TABLE_NAME 
FROM INFORMATION_SCHEMA.TABLES 
WHERE TABLE_NAME = 'productos_variantes';

-- 2. Verificar la estructura de la tabla
SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_NAME = 'productos_variantes'
ORDER BY ORDINAL_POSITION;

-- 3. Contar el total de registros
SELECT COUNT(*) as TotalVariantes FROM productos_variantes;

-- 4. Ver todos los registros
SELECT * FROM productos_variantes;

-- 5. Verificar productos existentes
SELECT COUNT(*) as TotalProductos FROM productos;

-- 6. Ver productos con sus variantes
SELECT 
    p.id as ProductoId,
    p.marca,
    p.modelo,
    p.categoria,
    COUNT(pv.id) as CantidadVariantes
FROM productos p
LEFT JOIN productos_variantes pv ON p.id = pv.productoId
GROUP BY p.id, p.marca, p.modelo, p.categoria
ORDER BY p.id;

-- 7. Verificar si hay variantes huérfanas (sin producto)
SELECT pv.* 
FROM productos_variantes pv
LEFT JOIN productos p ON pv.productoId = p.id
WHERE p.id IS NULL;

-- 8. Verificar la secuencia de IDs
SELECT 
    'productos' as tabla,
    MIN(id) as min_id,
    MAX(id) as max_id,
    COUNT(*) as total
FROM productos
UNION ALL
SELECT 
    'productos_variantes' as tabla,
    MIN(id) as min_id,
    MAX(id) as max_id,
    COUNT(*) as total
FROM productos_variantes; 