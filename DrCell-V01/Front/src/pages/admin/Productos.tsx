import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { PencilIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/outline';
import axios from '@/lib/axios';
import ProductForm from '@/components/admin/ProductForm';
import { toast } from 'sonner';

interface Producto {
  id: number;
  marca: string;
  modelo: string;
  categoria: string;
  img: string;
  variantes: ProductoVariante[];
}

interface ProductoVariante {
  id: number;
  ram: string;
  almacenamiento: string;
  color: string;
  precio: number;
  stock: number;
}

const Productos = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Función para cargar productos
  const cargarProductos = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/Producto');
      setProductos(response.data);
    } catch (err) {
      setError('Error al cargar los productos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Función para eliminar producto
  const handleEliminar = async (id: number) => {
    if (window.confirm('¿Estás seguro de eliminar este producto?')) {
      try {
        await axios.delete(`/Producto/${id}`);
        setProductos(productos.filter(p => p.id !== id));
        toast.success('Producto eliminado exitosamente');
      } catch (err) {
        toast.error('Error al eliminar el producto');
        console.error(err);
      }
    }
  };

  // Cargar productos al montar el componente
  useEffect(() => {
    cargarProductos();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header con título y botón de crear */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Gestión de Productos</h1>
        <Button 
          className="bg-blue-600 hover:bg-blue-700 text-white"
          onClick={() => setIsFormOpen(true)}
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Crear Producto
        </Button>
      </div>

      {/* Tabla de productos */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-4 text-center">Cargando productos...</div>
        ) : error ? (
          <div className="p-4 text-center text-red-600">{error}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Imagen
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Marca/Modelo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Categoría
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Variantes
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {productos.map((producto) => (
                  <tr key={producto.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <img
                        src={`data:image/jpeg;base64,${producto.img}`}
                        alt={`${producto.marca} ${producto.modelo}`}
                        className="h-12 w-12 object-cover rounded"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{producto.marca}</div>
                      <div className="text-sm text-gray-500">{producto.modelo}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{producto.categoria}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {producto.variantes.map(v => (
                          <div key={v.id} className="mb-1">
                            {v.ram} - {v.almacenamiento} - {v.color}
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        producto.variantes.reduce((acc, v) => acc + v.stock, 0) > 0 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {producto.variantes.reduce((acc, v) => acc + v.stock, 0)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {/* Aquí irá la lógica para editar */}}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEliminar(producto.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal de creación de producto */}
      <ProductForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSuccess={cargarProductos}
      />
    </div>
  );
};

export default Productos;