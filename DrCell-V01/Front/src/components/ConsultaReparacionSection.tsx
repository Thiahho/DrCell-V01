import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { Button } from './ui/button';
import { Input } from './ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

interface ReparacionInfo {
  arreglomodulo?: number;
  arreglobateria?: number;
  arreglopin?: number;
  colormodulo?: string;
  tipo?: string;
  marco?: boolean;
  version?: string;
  id?: number;
  marca?: string;
  modelo?: string;
}

const API_URL = 'http://localhost:5015';

const ConsultaReparacionSection: React.FC = () => {
  const [marcas, setMarcas] = useState<string[]>([]);
  const [modelos, setModelos] = useState<string[]>([]);
  const [marca, setMarca] = useState('');
  const [modelo, setModelo] = useState('');
  const [variantes, setVariantes] = useState<ReparacionInfo[]>([]);
  const [color, setColor] = useState('');
  const [marco, setMarco] = useState('');
  const [version, setVersion] = useState('');
  const [tipo, setTipo] = useState('');
  const [varianteSeleccionada, setVarianteSeleccionada] = useState<ReparacionInfo | null>(null);
  const [precio, setPrecio] = useState('');
  const [loading, setLoading] = useState(false);

  // Obtener marcas reales
  useEffect(() => {
    axios.get(`${API_URL}/celulares/marcas`)
      .then(res => setMarcas(res.data))
      .catch(() => setMarcas([]));
  }, []);

  // Obtener modelos según marca
  useEffect(() => {
    setModelo('');
    setVariantes([]);
    setColor('');
    setMarco('');
    setVersion('');
    setTipo('');
    setVarianteSeleccionada(null);
    setPrecio('');
    if (marca) {
      axios.get(`${API_URL}/celulares/modelos/${marca}`)
        .then(res => setModelos(res.data))
        .catch(() => setModelos([]));
    } else {
      setModelos([]);
    }
  }, [marca]);

  // Obtener variantes según marca y modelo
  useEffect(() => {
    setVariantes([]);
    setColor('');
    setMarco('');
    setVersion('');
    setTipo('');
    setVarianteSeleccionada(null);
    setPrecio('');
    if (marca && modelo) {
      setLoading(true);
      axios.get(`${API_URL}/celulares/info/${marca}/${modelo}`)
        .then(res => {
          const data: ReparacionInfo[] = res.data;
          setVariantes(data);
        })
        .catch(() => setVariantes([]))
        .finally(() => setLoading(false));
    }
  }, [marca, modelo]);

  // Opciones únicas para cada campo, filtradas según las selecciones actuales
  const coloresDisponibles = useMemo(() => {
    const set = new Set(
      variantes
        .filter(v =>
          (!marco || (v.marco ? 'Con marco' : 'Sin marco') === marco) &&
          (!version || v.version === version) &&
          (!tipo || v.tipo === tipo)
        )
        .map(v => v.colormodulo)
        .filter(Boolean)
    );
    return Array.from(set) as string[];
  }, [variantes, marco, version, tipo]);

  const marcosDisponibles = useMemo(() => {
    const set = new Set(
      variantes
        .filter(v =>
          (!color || v.colormodulo === color) &&
          (!version || v.version === version) &&
          (!tipo || v.tipo === tipo)
        )
        .map(v => (v.marco ? 'Con marco' : 'Sin marco'))
    );
    return Array.from(set) as string[];
  }, [variantes, color, version, tipo]);

  const versionesDisponibles = useMemo(() => {
    const set = new Set(
      variantes
        .filter(v =>
          (!color || v.colormodulo === color) &&
          (!marco || (v.marco ? 'Con marco' : 'Sin marco') === marco) &&
          (!tipo || v.tipo === tipo)
        )
        .map(v => v.version)
        .filter(Boolean)
    );
    return Array.from(set) as string[];
  }, [variantes, color, marco, tipo]);

  const tiposDisponibles = useMemo(() => {
    const set = new Set(
      variantes
        .filter(v =>
          (!color || v.colormodulo === color) &&
          (!marco || (v.marco ? 'Con marco' : 'Sin marco') === marco) &&
          (!version || v.version === version)
        )
        .map(v => v.tipo)
        .filter(Boolean)
    );
    return Array.from(set) as string[];
  }, [variantes, color, marco, version]);

  // Buscar la variante exacta
  useEffect(() => {
    if (!color && coloresDisponibles.length > 0) return setVarianteSeleccionada(null);
    if (!marco && marcosDisponibles.length > 0) return setVarianteSeleccionada(null);
    if (!version && versionesDisponibles.length > 0) return setVarianteSeleccionada(null);
    if (!tipo && tiposDisponibles.length > 0) return setVarianteSeleccionada(null);
    const variante = variantes.find(v =>
      (coloresDisponibles.length === 0 || v.colormodulo === color) &&
      (marcosDisponibles.length === 0 || (v.marco ? 'Con marco' : 'Sin marco') === marco) &&
      (versionesDisponibles.length === 0 || v.version === version) &&
      (tiposDisponibles.length === 0 || v.tipo === tipo)
    );
    setVarianteSeleccionada(variante || null);
  }, [color, marco, version, tipo, variantes, coloresDisponibles, marcosDisponibles, versionesDisponibles, tiposDisponibles]);

  // Actualizar precio cuando cambia la variante seleccionada
  useEffect(() => {
    if (varianteSeleccionada) {
      let precioStr = '';
      if (varianteSeleccionada.arreglomodulo) precioStr += `Módulo: $${varianteSeleccionada.arreglomodulo}  `;
      if (varianteSeleccionada.arreglobateria) precioStr += `Batería: $${varianteSeleccionada.arreglobateria}  `;
      if (varianteSeleccionada.arreglopin) precioStr += `Pin: $${varianteSeleccionada.arreglopin}`;
      setPrecio(precioStr.trim() || 'No disponible');
    } else {
      setPrecio('');
    }
  }, [varianteSeleccionada]);

  const handleConsultar = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-8 mt-8">
      <h2 className="text-2xl font-bold text-center mb-8 text-gray-900">Consulta tu reparación</h2>
      <form onSubmit={handleConsultar} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Marca</label>
            <Select value={marca} onValueChange={setMarca}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona marca" />
              </SelectTrigger>
              <SelectContent>
                {marcas.map(m => (
                  <SelectItem key={m} value={m}>{m}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Modelo</label>
            <Select value={modelo} onValueChange={setModelo} disabled={!marca}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona modelo" />
              </SelectTrigger>
              <SelectContent>
                {modelos.map(m => (
                  <SelectItem key={m} value={m}>{m}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {coloresDisponibles.length > 0 && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Color</label>
              <Select value={color} onValueChange={setColor}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona color" />
                </SelectTrigger>
                <SelectContent>
                  {coloresDisponibles.map((c, idx) => (
                    <SelectItem key={idx} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          {marcosDisponibles.length > 0 && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Marco</label>
              <Select value={marco} onValueChange={setMarco}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona marco" />
                </SelectTrigger>
                <SelectContent>
                  {marcosDisponibles.map((m, idx) => (
                    <SelectItem key={idx} value={m}>{m}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          {versionesDisponibles.length > 0 && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Versión</label>
              <Select value={version} onValueChange={setVersion}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona versión" />
                </SelectTrigger>
                <SelectContent>
                  {versionesDisponibles.map((v, idx) => (
                    <SelectItem key={idx} value={v}>{v}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          {tiposDisponibles.length > 0 && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Tipo</label>
              <Select value={tipo} onValueChange={setTipo}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona tipo" />
                </SelectTrigger>
                <SelectContent>
                  {tiposDisponibles.map((t, idx) => (
                    <SelectItem key={idx} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Módulo</label>
            <Input
              value={varianteSeleccionada?.arreglomodulo ? `$${varianteSeleccionada.arreglomodulo}` : ''}
              readOnly
              className="rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Pin de carga</label>
            <Input
              value={varianteSeleccionada?.arreglopin ? `$${varianteSeleccionada.arreglopin}` : ''}
              readOnly
              className="rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Batería</label>
            <Input
              value={varianteSeleccionada?.arreglobateria ? `$${varianteSeleccionada.arreglobateria}` : ''}
              readOnly
              className="rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition w-full"
            />
          </div>
        </div>
        <div className="mt-6">
          <label className="block text-sm font-semibold text-gray-700 mb-1">Precio total</label>
          <Input
            value={precio}
            readOnly
            className="rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition w-full"
          />
          {loading && <p className="text-sm text-muted-foreground mt-2">Consultando...</p>}
        </div>
        <Button type="submit" className="w-full mt-6 py-3 rounded-lg bg-blue-600 text-white font-bold hover:bg-blue-700 transition" disabled>
          Consultar
        </Button>
      </form>
    </div>
  );
};

export default ConsultaReparacionSection; 