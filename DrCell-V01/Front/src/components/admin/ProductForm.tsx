import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import axios from '@/lib/axios';
import { toast } from 'sonner';

interface ProductFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface Producto {
  marca: string;
  modelo: string;
  categoria: string;
  img: File | null;
}

interface Variante {
  ram: string;
  almacenamiento: string;
  color: string;
  precio: number;
  stock: number;
}

const toWebpBase64 = (file: File, maxWidth = 600, quality = 0.7): Promise<string> =>
  new Promise((resolve, reject) => {
    const img = new window.Image();
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e) => {
      img.src = e.target?.result as string;
    };
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const scale = Math.min(maxWidth / img.width, 1);
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      const ctx = canvas.getContext('2d');
      if (!ctx) return reject('No se pudo crear el contexto del canvas');
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(
        (blob) => {
          if (!blob) return reject('No se pudo convertir a webp');
          const reader2 = new FileReader();
          reader2.readAsDataURL(blob);
          reader2.onloadend = () => resolve(reader2.result as string);
        },
        'image/webp',
        quality
      );
    };
    img.onerror = reject;
  });

const ProductForm: React.FC<ProductFormProps> = ({ isOpen, onClose, onSuccess }) => {
  const [step, setStep] = useState(1);
  const [producto, setProducto] = useState<Producto>({
    marca: '',
    modelo: '',
    categoria: '',
    img: null
  });
  const [variantes, setVariantes] = useState<Variante[]>([]);
  const [loading, setLoading] = useState(false);

  const handleProductoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProducto(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProducto(prev => ({ ...prev, img: e.target.files![0] }));
    }
  };

  const handleAddVariante = () => {
    setVariantes(prev => [...prev, {
      ram: '',
      almacenamiento: '',
      color: '',
      precio: 0,
      stock: 0
    }]);
  };

  const handleVarianteChange = (index: number, field: keyof Variante, value: string | number) => {
    setVariantes(prev => prev.map((v, i) => 
      i === index ? { ...v, [field]: value } : v
    ));
  };

  const handleRemoveVariante = (index: number) => {
    setVariantes(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      let imgBase64 = "";
      if (producto.img) {
        imgBase64 = await toWebpBase64(producto.img, 600, 0.7);
      }

      const productoPayload = {
        marca: producto.marca,
        modelo: producto.modelo,
        categoria: producto.categoria,
        img: imgBase64,
        variantes: []
      };

      const productoResponse = await axios.post('/Producto', productoPayload);
      const productoId = productoResponse.data.id;

      if (!productoId) {
        throw new Error('No se recibió un ID válido del producto');
      }

      const variantesPromises = variantes.map(async (variante) => {
        if (!variante.ram || !variante.almacenamiento || !variante.color || !variante.precio || !variante.stock) {
          throw new Error('Todos los campos de la variante son requeridos');
        }

        const response = await axios.post(`/Producto/${productoId}/variante`, {
          ram: variante.ram,
          almacenamiento: variante.almacenamiento,
          color: variante.color,
          precio: Number(variante.precio),
          stock: Number(variante.stock)
        });

        return response.data;
      });

      await Promise.all(variantesPromises);
      
      toast.success('¡Producto creado exitosamente!', {
        description: 'El producto se ha guardado en el sistema.',
        duration: 4000,
      });
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('Error al crear el producto:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Error al crear el producto';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {step === 1 ? 'Información del Producto' : 'Variantes del Producto'}
          </DialogTitle>
        </DialogHeader>

        {step === 1 ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="marca">Marca</Label>
                <Input
                  id="marca"
                  name="marca"
                  value={producto.marca}
                  onChange={handleProductoChange}
                  placeholder="Ej: Samsung"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="modelo">Modelo</Label>
                <Input
                  id="modelo"
                  name="modelo"
                  value={producto.modelo}
                  onChange={handleProductoChange}
                  placeholder="Ej: Galaxy S21"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="categoria">Categoría</Label>
              <Select
                value={producto.categoria}
                onValueChange={(value) => setProducto(prev => ({ ...prev, categoria: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona una categoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="celular">Celular</SelectItem>
                  <SelectItem value="tablet">Tablet</SelectItem>
                  <SelectItem value="laptop">Laptop</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="img">Imagen del Producto</Label>
              <Input
                id="img"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {variantes.map((variante, index) => (
              <div key={index} className="p-4 border rounded-lg space-y-4">
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
                    <Label>RAM</Label>
                    <Input
                      value={variante.ram}
                      onChange={(e) => handleVarianteChange(index, 'ram', e.target.value)}
                      placeholder="Ej: 8GB"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Almacenamiento</Label>
                    <Input
                      value={variante.almacenamiento}
                      onChange={(e) => handleVarianteChange(index, 'almacenamiento', e.target.value)}
                      placeholder="Ej: 128GB"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Color</Label>
                    <Input
                      value={variante.color}
                      onChange={(e) => handleVarianteChange(index, 'color', e.target.value)}
                      placeholder="Ej: Negro"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Precio</Label>
                    <Input
                      type="number"
                      value={variante.precio}
                      onChange={(e) => handleVarianteChange(index, 'precio', parseFloat(e.target.value))}
                      placeholder="Ej: 999.99"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Stock</Label>
                    <Input
                      type="number"
                      value={variante.stock}
                      onChange={(e) => handleVarianteChange(index, 'stock', parseInt(e.target.value))}
                      placeholder="Ej: 10"
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
              disabled={!producto.marca || !producto.modelo || !producto.categoria}
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
                {loading ? 'Creando...' : 'Crear Producto'}
              </Button>
            </div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProductForm; 