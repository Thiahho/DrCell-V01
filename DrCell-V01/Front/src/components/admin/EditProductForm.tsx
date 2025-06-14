import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import axios from '@/lib/axios';
import { toWebpBase64 } from '@/lib/utils';

interface EditProductFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  producto: {
    id: number;
    marca: string;
    modelo: string;
    categoria: string;
    img: string;
    variantes: Array<{
      id: number;
      ram: string;
      almacenamiento: string;
      color: string;
      precio: number;
      stock: number;
    }>;
  };
}

interface Variante {
  id?: number;
  ram: string;
  almacenamiento: string;
  color: string;
  precio: number;
  stock: number;
}

const EditProductForm: React.FC<EditProductFormProps> = ({ isOpen, onClose, onSuccess, producto }) => {
  const [step, setStep] = useState(1);
  const [editedProducto, setEditedProducto] = useState({
    marca: producto.marca,
    modelo: producto.modelo,
    categoria: producto.categoria,
    img: null as File | null
  });
  const [variantes, setVariantes] = useState<Variante[]>(producto.variantes);
  const [loading, setLoading] = useState(false);

  const handleProductoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedProducto(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setEditedProducto(prev => ({ ...prev, img: e.target.files![0] }));
    }
  };

  const handleAddVariante = () => {
    setVariantes(prev => [
      ...prev,
      {
        tempId: Date.now(),
        ram: '',
        almacenamiento: '',
        color: '',
        precio: 0,
        stock: 0
      }
    ]);
  };

  const handleVarianteChange = (index: number, field: keyof Variante, value: string | number) => {
    setVariantes(prev => prev.map((v, i) => 
      i === index ? { ...v, [field]: value } : v
    ));
  };

  const handleRemoveVariante = async (index: number) => {
    const variante = variantes[index];
    if (variante.id) {
      try {
        await axios.delete(`/Producto/${producto.id}/variante/${variante.id}`);
        toast.success('Variante eliminada exitosamente');
        onSuccess();
        onClose();
      } catch (error) {
        toast.error('Error al eliminar la variante');
        return;
      }
    }
    setVariantes(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      // Actualizar producto
      let imgBase64 = producto.img;
      if (editedProducto.img) {
        imgBase64 = await toWebpBase64(editedProducto.img, 600, 0.7);
      }

      await axios.put(`/Producto/${producto.id}`, {
        id: producto.id,
        marca: editedProducto.marca,
        modelo: editedProducto.modelo,
        categoria: editedProducto.categoria,
        img: imgBase64
      });

      // Actualizar variantes
      const variantesPromises = variantes.map(async (variante) => {
        if (!variante.ram || !variante.almacenamiento || !variante.color || !variante.precio || !variante.stock) {
          throw new Error('Todos los campos de la variante son requeridos');
        }

        if (typeof variante.id === 'number' && variante.id > 0) {
          // Actualizar variante existente
          await axios.put(`/Producto/${producto.id}/variante/${variante.id}`, {
            ...variante,
            productoId: producto.id
          });
        } else {
          // Crear nueva variante (no enviar id)
          const { id, ...varianteSinId } = variante;
          await axios.post(`/Producto/${producto.id}/variante`, {
            ...varianteSinId,
            productoId: producto.id
          });
        }
      });

      await Promise.all(variantesPromises);
      
      // Refrescar variantes después de crear/editar
      // Opcional: puedes llamar a onSuccess() para que el padre recargue los datos
      toast.success('¡Producto actualizado exitosamente!', {
        description: 'Los cambios han sido guardados.',
        duration: 4000,
      });
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('Error al actualizar el producto:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Error al actualizar el producto';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Editar Producto</DialogTitle>
        </DialogHeader>

        {step === 1 ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="marca">Marca</Label>
              <Input
                id="marca"
                name="marca"
                value={editedProducto.marca}
                onChange={handleProductoChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="modelo">Modelo</Label>
              <Input
                id="modelo"
                name="modelo"
                value={editedProducto.modelo}
                onChange={handleProductoChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="categoria">Categoría</Label>
              <Input
                id="categoria"
                name="categoria"
                value={editedProducto.categoria}
                onChange={handleProductoChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="img">Imagen del Producto</Label>
              <Input
                id="img"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
              {!editedProducto.img && (
                <img
                  src={`data:image/jpeg;base64,${producto.img}`}
                  alt={`${producto.marca} ${producto.modelo}`}
                  className="h-32 w-32 object-cover rounded mt-2"
                />
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {variantes.map((variante, index) => (
              <div key={variante.id ?? variante.tempId} className="p-4 border rounded-lg space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">Variante {index + 1}</h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveVariante(index)}
                    className="text-red-600"
                  >
                    Eliminar
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`ram-${index}`}>RAM</Label>
                    <Input
                      id={`ram-${index}`}
                      value={variante.ram}
                      onChange={(e) => handleVarianteChange(index, 'ram', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`almacenamiento-${index}`}>Almacenamiento</Label>
                    <Input
                      id={`almacenamiento-${index}`}
                      value={variante.almacenamiento}
                      onChange={(e) => handleVarianteChange(index, 'almacenamiento', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`color-${index}`}>Color</Label>
                    <Input
                      id={`color-${index}`}
                      value={variante.color}
                      onChange={(e) => handleVarianteChange(index, 'color', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`precio-${index}`}>Precio</Label>
                    <Input
                      id={`precio-${index}`}
                      type="number"
                      min="0"
                      step="0.01"
                      value={variante.precio}
                      onChange={(e) => handleVarianteChange(index, 'precio', parseFloat(e.target.value))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`stock-${index}`}>Stock</Label>
                    <Input
                      id={`stock-${index}`}
                      type="number"
                      min="0"
                      value={variante.stock}
                      onChange={(e) => handleVarianteChange(index, 'stock', parseInt(e.target.value))}
                    />
                  </div>
                </div>
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              onClick={handleAddVariante}
              className="w-full"
            >
              Agregar Variante
            </Button>
          </div>
        )}

        <DialogFooter>
          {step === 1 ? (
            <Button
              onClick={() => setStep(2)}
              disabled={!editedProducto.marca || !editedProducto.modelo || !editedProducto.categoria}
            >
              Siguiente
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setStep(1)}
              >
                Anterior
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={loading || variantes.length === 0}
              >
                {loading ? 'Actualizando...' : 'Actualizar Producto'}
              </Button>
            </div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditProductForm; 