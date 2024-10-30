import type { SelectChangeEvent } from '@mui/material';

import { useState } from 'react';
import { useSnackbar } from 'notistack';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { Select, MenuItem, InputLabel, FormControl } from '@mui/material';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';

import type { Category, ProductProps } from '../product-table-row';

interface EditProductViewProps {
  product: ProductProps;
  onClose: () => void;
  onSave: (product: ProductProps) => Promise<void>;
  categories: Category[];
}

export function EditProductView({ product, onClose, onSave, categories }: EditProductViewProps) {
  const { enqueueSnackbar } = useSnackbar();
  const [formData, setFormData] = useState<ProductProps>(product);
  const [customGroup, setCustomGroup] = useState('');
  const [customCategory, setCustomCategory] = useState('');
  const [customCtaCont, setCustomCtaCont] = useState<number | ''>('');
  const [isCustomGroup, setIsCustomGroup] = useState(false);

  const handleSave = async () => {
    const updatedFormData = {
      ...formData,
      nombre: formData.nombre.toUpperCase(),
      categoria_id: {
        ...formData.categoria_id,
        categoria: formData.categoria_id.categoria.toUpperCase(),
        grupo_desc: formData.categoria_id.grupo_desc.toUpperCase(),
      },
    };
    try {
      await onSave(updatedFormData);
      enqueueSnackbar('Producto actualizado correctamente', { variant: 'success' });
      onClose();
    } catch (error) {
      console.error('Error updating product:', error);
      enqueueSnackbar('Error al actualizar el producto. Por favor, intenta de nuevo.', { variant: 'error' });
    }
  };

  const handleGroupChange = (event: SelectChangeEvent<string>) => {
    const selectedGroup = event.target.value;

    if (selectedGroup === 'OTRO') {
      setIsCustomGroup(true);
      setFormData((prevFormData) => ({
        ...prevFormData,
        categoria_id: {
          _id: '', // Puedes asignar un valor adecuado o dejarlo vacío
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
        categoria_id: {
          _id: groupData?._id || '',
          grupo_desc: selectedGroup,
          categoria: groupData?.categoria || '',
          cta_cont: groupData?.cta_cont || 0,
        },
      }));
    }
  };

  const handleAddCustomGroup = async () => {
    if (customGroup && customCategory && customCtaCont && !categories.some((cat) => cat.grupo_desc === customGroup)) {
      const newCategory = {
        grupo_desc: customGroup,
        categoria: customCategory,
        cta_cont: Number(customCtaCont),
      };

      try {
        const response = await fetch(`${import.meta.env.VITE_APP_API_URL}api/categories`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newCategory),
        });

        if (!response.ok) {
          throw new Error('Failed to save category');
        }

        setFormData({
          ...formData,
          categoria_id: {
            _id: '', // Debes obtener el nuevo ID de la respuesta si es necesario
            grupo_desc: customGroup,
            categoria: customCategory,
            cta_cont: Number(customCtaCont),
          },
        });

        setIsCustomGroup(false);
        setCustomGroup('');
        setCustomCategory('');
        setCustomCtaCont('');

        enqueueSnackbar('Nuevo grupo agregado correctamente', { variant: 'success' });
      } catch (error) {
        console.error('Error saving category:', error);
        enqueueSnackbar('Error al guardar la categoría. Por favor, intenta de nuevo.', { variant: 'error' });
      }
    }
  };

  if (!product) return <Typography>Cargando...</Typography>;

  return (
    <DashboardContent>
      <Box display="flex" alignItems="center" mb={5}>
        <Typography variant="h4" flexGrow={1}>
          Editar Producto
        </Typography>
      </Box>
      <Card sx={{ p: 3 }}>
        <TextField
          label="ID"
          value={formData.item}
          disabled
          fullWidth
          margin="normal"
        />
        <TextField
          label="Nombre"
          value={formData.nombre}
          onChange={(e) => setFormData({ ...formData, nombre: e.target.value.toUpperCase() })}
          fullWidth
          margin="normal"
        />
        <FormControl fullWidth margin="normal" variant="outlined" required>
          <InputLabel>Grupo</InputLabel>
          <Select
            label="Grupo"
            value={formData.categoria_id.grupo_desc || 'OTRO'}
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
        {isCustomGroup && (
          <>
            <TextField
              label="Nombre del grupo nuevo"
              value={customGroup}
              onChange={(e) => setCustomGroup(e.target.value.toUpperCase())}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Letra de la categoría"
              value={customCategory}
              onChange={(e) => setCustomCategory(e.target.value.toUpperCase())}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Código contable (CTA CONT)"
              value={customCtaCont}
              onChange={(e) => setCustomCtaCont(Number(e.target.value) || '')}
              fullWidth
              margin="normal"
              type="number"
            />
            <Button
              variant="contained"
              sx={{ mr: 2 }}
              onClick={handleAddCustomGroup}
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              Agregar nuevo grupo
            </Button>
          </>
        )}

        <FormControl fullWidth margin="normal" variant="outlined" required>
          <InputLabel>Tipo</InputLabel>
          <Select
            label="Tipo"
            value={formData.tipo}
            onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
          >
            <MenuItem value="I">Interno</MenuItem>
            <MenuItem value="E">Externo</MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth margin="normal" variant="outlined" required>
          <InputLabel>Presentación</InputLabel>
          <Select
            label="Presentación"
            value={formData.presentacion}
            onChange={(e) => setFormData({ ...formData, presentacion: e.target.value })}
          >
            <MenuItem value="UND">Unidad</MenuItem>
            <MenuItem value="GAL">Galón</MenuItem>
            <MenuItem value="PAQ">Paquete</MenuItem>
            <MenuItem value="FCO">Fco</MenuItem>
            <MenuItem value="CAJ">Caja</MenuItem>
            <MenuItem value="BOL">Bolsa</MenuItem>
          </Select>
        </FormControl>
        <TextField
          label="Código"
          value={formData.codigo}
          onChange={(e) => setFormData({ ...formData, codigo: Number(e.target.value) })}
          fullWidth
          margin="normal"
        />
        <Button
          variant="contained"
          sx={{ mr: 2 }}
          onClick={handleSave}
          startIcon={<Iconify icon="mingcute:save-line" />}
        >
          Guardar
        </Button>
        <Button variant="outlined" sx={{ mr: 2 }} onClick={onClose}>
          Cancelar
        </Button>
      </Card>
    </DashboardContent>
  );
}