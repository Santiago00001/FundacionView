import type { SelectChangeEvent } from '@mui/material/Select';
import type { StockProps } from 'src/sections/stock/stock-table-row';
import type { Category } from 'src/sections/product/product-table-row';

import { useSnackbar } from 'notistack';
import { useState, useEffect } from 'react';

import { Box, Card, Button, Select, MenuItem, TextField, Typography, InputLabel, FormControl } from '@mui/material';

import { Iconify } from 'src/components/iconify';

interface CreateStockViewProps {
  product: StockProps;
  onClose: () => void;
  onSave: (product: StockProps) => Promise<void>;
}

// New function to fetch categories from the backend
async function fetchCategories(): Promise<Category[]> {
  const response = await fetch(`${import.meta.env.VITE_APP_API_URL}api/categories`);
  if (!response.ok) {
    throw new Error('Failed to fetch categories');
  }
  return response.json();
}

export function CreateStockView({ product, onClose, onSave }: CreateStockViewProps) {
  const { enqueueSnackbar } = useSnackbar();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isCustomGroup, setIsCustomGroup] = useState(false);
  
  const [formData, setFormData] = useState<StockProps>({
    _id: '',
    producto: {
      _id: '',
      item: 0,
      nombre: '',
      categoria_id: { _id: '', grupo_desc: '', categoria: '', cta_cont: 0 },
      codigo: 0,
      tipo: '',
      presentacion: '',
      visible: 0,
    },
    agencia: {
      _id: '',
      item: 0,
      cod: 0,
      nombre: '',
      coordinador: '',
      director: '',
    },
    stock: 0,
    valor_unitario: 0,
    valor_promedio: 0,
  });

  useEffect(() => {
    fetchCategories()
      .then((fetchedCategories) => setCategories(fetchedCategories))
      .catch((error) => console.error('Error fetching categories:', error));
  }, []);

  useEffect(() => {
    setFormData(product);
  }, [product]);

  const handleSave = async () => {
    if (!formData.producto.nombre || !formData.producto.categoria_id.categoria || !formData.producto.categoria_id.grupo_desc || 
        !formData.producto.tipo || !formData.producto.presentacion || !formData.producto.categoria_id.cta_cont) {
      enqueueSnackbar('Por favor completa todos los campos requeridos.', { variant: 'warning' });
      return;
    }
  
    try {
      await onSave(formData);
      enqueueSnackbar('Stock guardado correctamente!', { variant: 'success' });
      onClose();
    } catch (error) {
      console.error('Error guardando el stock:', error);
      enqueueSnackbar('Error al guardar el stock. Inténtalo de nuevo.', { variant: 'error' });
    }
  };

  const handleGroupChange = (event: SelectChangeEvent<string>) => {
    const selectedGroup = event.target.value;

    if (selectedGroup === 'OTRO') {
      setIsCustomGroup(true);
      setFormData((prevFormData) => ({
        ...prevFormData,
        producto: {
          ...prevFormData.producto,
          grupo_desc: '',
          categoria: '',
          cta_cont: 0,
        },
      }));
    } else {
      setIsCustomGroup(false);
      const groupData = categories.find((category) => category.grupo_desc === selectedGroup);
      setFormData((prevFormData) => ({
        ...prevFormData,
        producto: {
          ...prevFormData.producto,
          grupo_desc: selectedGroup,
          categoria: groupData?.categoria ?? '',
          cta_cont: groupData?.cta_cont ?? 0,
        },
      }));
    }
  };

  return (
    <Box>
      <Typography variant="h4">Crear Nuevo Stock</Typography>
      <Card sx={{ p: 3 }}>
        <TextField
          label="Nombre del producto"
          value={formData.producto.nombre}
          onChange={(e) => setFormData({ ...formData, producto: { ...formData.producto, nombre: e.target.value.toUpperCase() } })}
          fullWidth
          margin="normal"
          required
        />
        
        <FormControl fullWidth margin="normal" variant="outlined" required>
          <InputLabel>Grupo</InputLabel>
          <Select
            label="Grupo"
            value={formData.producto.categoria_id.grupo_desc}
            onChange={handleGroupChange}
          >
            {categories.map((category) => (
              <MenuItem key={category.grupo_desc} value={category.grupo_desc}>
                {category.grupo_desc}
              </MenuItem>
            ))}
            <MenuItem value="OTRO">OTRO</MenuItem>
          </Select>
        </FormControl>

        {/* Mostrar campos si selecciona "OTRO" */}
        {isCustomGroup && (
          <>
            <TextField
              label="Nombre del grupo nuevo"
              value={formData.producto.categoria_id.grupo_desc}
              onChange={(e) => setFormData({ ...formData, producto: { ...formData.producto, categoria_id: { ...formData.producto.categoria_id, grupo_desc: e.target.value.toUpperCase() } } })}
              fullWidth
              margin="normal"
            />
            {/* Aquí puedes agregar campos para categoría y código contable si es necesario */}
          </>
        )}
        
        <FormControl fullWidth margin="normal" variant="outlined" required>
          <InputLabel>Tipo</InputLabel>
          <Select
            label="Tipo"
            value={formData.producto.tipo}
            onChange={(e) => setFormData({ ...formData, producto: { ...formData.producto, tipo: e.target.value } })}
          >
            <MenuItem value="I">Interno</MenuItem>
            <MenuItem value="E">Externo</MenuItem>
          </Select>
        </FormControl>
        
        <FormControl fullWidth margin="normal" variant="outlined" required>
          <InputLabel>Presentación</InputLabel>
          <Select
            label="Presentación"
            value={formData.producto.presentacion}
            onChange={(e) => setFormData({ ...formData, producto: { ...formData.producto, presentacion: e.target.value } })}
          >
            <MenuItem value="UND">Unidad</MenuItem>
            <MenuItem value="GAL">Galón</MenuItem>
            <MenuItem value="PAQ">Paquete</MenuItem>
            <MenuItem value="FCO">Frasco</MenuItem>
            <MenuItem value="CAJ">Caja</MenuItem>
            <MenuItem value="BOL">Bolsa</MenuItem>
          </Select>
        </FormControl>

        <TextField
          label="Código"
          value={formData.producto.codigo}
          onChange={(e) => setFormData({ ...formData, producto: { ...formData.producto, codigo: Number(e.target.value) } })}
          fullWidth
          margin="normal"
          required
        />

        <TextField
          label="Stock"
          type="number"
          value={formData.stock}
          onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
          fullWidth
          margin="normal"
          required
        />
        
        <TextField
          label="Valor Unitario"
          type="number"
          value={formData.valor_unitario}
          onChange={(e) => setFormData({ ...formData, valor_unitario: Number(e.target.value) })}
          fullWidth
          margin="normal"
          required
        />

        <TextField
          label="Valor Promedio"
          type="number"
          value={formData.valor_promedio}
          onChange={(e) => setFormData({ ...formData, valor_promedio: Number(e.target.value) })}
          fullWidth
          margin="normal"
          required
        />

        <Button variant="contained" sx={{ mr: 2 }} onClick={handleSave} startIcon={<Iconify icon="mingcute:add-line" />}>
          Crear Stock
        </Button>
        <Button variant="outlined" sx={{ mr: 2 }} onClick={onClose}>Cancelar</Button>
      </Card>
    </Box>
  );
}