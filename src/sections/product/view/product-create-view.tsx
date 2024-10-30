import type { SelectChangeEvent } from '@mui/material/Select';

import { useState } from 'react';
import { useSnackbar } from 'notistack';

import { Box, Card, Button, Select, MenuItem, TextField, Typography, InputLabel, FormControl, FormHelperText } from '@mui/material';

import { Iconify } from 'src/components/iconify';

import type { Category, ProductProps } from '../product-table-row';

interface CreateProductViewProps {
  product: ProductProps;
  onClose: () => void;
  onSave: (product: ProductProps) => Promise<void>;
  categories: Category[];
  existingCodes: number[];
}

export function CreateProductView({ product, onClose, onSave, categories, existingCodes }: CreateProductViewProps) {
  const { enqueueSnackbar } = useSnackbar();
  const [customGroup, setCustomGroup] = useState('');
  const [customCategory, setCustomCategory] = useState('');
  const [customCtaCont, setCustomCtaCont] = useState<number | ''>('');
  const [isCustomGroup, setIsCustomGroup] = useState(false);
  const [errors, setErrors] = useState({ nombre: '', categoria: '', grupo_desc: '', tipo: '', presentacion: '', codigo: '' });
  const [formData, setFormData] = useState<ProductProps>({
    _id: '',
    item: 0,
    nombre: '',
    categoria_id: { _id: '', grupo_desc: '', categoria: '', cta_cont: 0 }, // Asegúrate de inicializar correctamente aquí
    codigo: 0,
    tipo: '',
    presentacion: '',
    visible: 1,
  });

  const handleSave = async () => {
    let hasErrors = false;
    const newErrors = { nombre: '', categoria: '', grupo_desc: '', tipo: '', presentacion: '', codigo: '' };

    // Validación de campos requeridos
    if (!formData.nombre) {
      newErrors.nombre = 'El nombre es requerido';
      hasErrors = true;
    }
    if (!formData.categoria_id.categoria) {
      newErrors.categoria = 'La categoría es requerida';
      hasErrors = true;
    }
    if (!formData.categoria_id.grupo_desc) {
      newErrors.grupo_desc = 'El grupo descriptivo es requerido';
      hasErrors = true;
    }
    if (!formData.tipo) {
      newErrors.tipo = 'El tipo es requerido';
      hasErrors = true;
    }
    if (!formData.presentacion) {
      newErrors.presentacion = 'La presentación es requerida';
      hasErrors = true;
    }
    if (!formData.codigo) {
      newErrors.codigo = 'El código es requerido';
      hasErrors = true;
    } else if (existingCodes.includes(formData.codigo)) {
      newErrors.codigo = 'El código ya existe. Por favor ingresa uno nuevo.';
      hasErrors = true;
    }

    setErrors(newErrors);

    if (hasErrors) {
      enqueueSnackbar('Por favor completa todos los campos requeridos.', { variant: 'warning' });
      return;
    }

    try {
      await onSave(formData);
      enqueueSnackbar('Producto guardado correctamente!', { variant: 'success' });
      onClose();
    } catch (error: any) {
      console.error('Error guardando el producto:', error);

      if (error.response && error.response.data) {
        const backendError = error.response.data;

        if (backendError.field === "codigo") {
          setErrors((prev) => ({ ...prev, codigo: backendError.message }));
        } else {
          enqueueSnackbar(backendError.message || 'Error al guardar el producto. Inténtalo nuevamente.', { variant: 'error' });
        }
      } else {
        enqueueSnackbar('Error al guardar el producto. Inténtalo nuevamente.', { variant: 'error' });
      }
    }
  };

  const handleGroupChange = (event: SelectChangeEvent<string>) => {
    const selectedGroup = event.target.value;

    if (selectedGroup === 'OTRO') {
      setIsCustomGroup(true);
      setFormData((prevFormData) => ({
        ...prevFormData,
        categoria_id: {
          _id: '',
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
        categoria_id: groupData ?? { _id: '', grupo_desc: selectedGroup, categoria: '', cta_cont: 0 }, // Asignar el objeto Category completo
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
            _id: '', // Aquí puedes asignar un ID si lo deseas
            grupo_desc: customGroup,
            categoria: customCategory,
            cta_cont: Number(customCtaCont),
          },
        });

        setIsCustomGroup(false);
        setCustomGroup('');
        setCustomCategory('');
        setCustomCtaCont('');

        enqueueSnackbar('Grupo personalizado agregado exitosamente!', { variant: 'success' });

      } catch (error) {
        console.error('Error saving category:', error);
        enqueueSnackbar('Error al guardar la categoría. Inténtalo de nuevo.', { variant: 'error' });
      }
    }
  };

  return (
    <Box>
      <Typography variant="h4">Crear Nuevo Producto</Typography>
      <Card sx={{ p: 3 }}>
        <TextField
          label="Nombre del producto"
          value={formData.nombre}
          onChange={(e) => setFormData({ ...formData, nombre: e.target.value.toUpperCase() })}
          fullWidth
          margin="normal"
          required
          error={!!errors.nombre}
          helperText={errors.nombre}
        />
        <FormControl fullWidth margin="normal" variant="outlined" required>
          <InputLabel>Grupo</InputLabel>
          <Select
            label="Grupo"
            value={formData.categoria_id.grupo_desc}
            onChange={handleGroupChange}
            error={!!errors.grupo_desc}
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
        <FormControl fullWidth margin="normal" variant="outlined" required error={!!errors.tipo}>
          <InputLabel>Tipo</InputLabel>
          <Select
            label="Tipo"
            value={formData.tipo}
            onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
          >
            <MenuItem value="I">Interno</MenuItem>
            <MenuItem value="E">Externo</MenuItem>
          </Select>
          <FormHelperText>{errors.tipo}</FormHelperText>
        </FormControl>

        <FormControl fullWidth margin="normal" variant="outlined" required error={!!errors.presentacion}>
          <InputLabel>Presentacion</InputLabel>
          <Select
            label="Presentacion"
            value={formData.presentacion}
            onChange={(e) => setFormData({ ...formData, presentacion: e.target.value })}
          >
            <MenuItem value="UND">Unidad</MenuItem>
            <MenuItem value="GAL">Galon</MenuItem>
            <MenuItem value="PAQ">Paquete</MenuItem>
            <MenuItem value="FCO">Frasco</MenuItem>
            <MenuItem value="CAJ">Caja</MenuItem>
            <MenuItem value="BOL">Bolsa</MenuItem>
          </Select>
          <FormHelperText>{errors.presentacion}</FormHelperText>
        </FormControl>

        <TextField
          label="Código"
          value={formData.codigo}
          onChange={(e) => setFormData({ ...formData, codigo: Number(e.target.value) })}
          fullWidth
          margin="normal"
          required
          error={!!errors.codigo}
          helperText={errors.codigo}
        />

        <Button variant="contained" sx={{ mr: 2 }} onClick={handleSave} startIcon={<Iconify icon="mingcute:add-line" />}>
          Crear Producto
        </Button>
        <Button variant="outlined" sx={{ mr: 2 }} onClick={onClose}>Cancelar</Button>
      </Card>
    </Box>
  );
}