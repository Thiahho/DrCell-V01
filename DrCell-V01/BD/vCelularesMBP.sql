-- Vista para obtener información completa de reparaciones
-- Módulos, Baterías y Pines por marca y modelo
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