
import type { UserProps } from 'src/sections/user/user-table-row';
import type { AgenciaProps } from 'src/sections/agencys/agency-table-row';

import { useState } from 'react';
import { useSnackbar } from 'notistack';

import { Box, Card, Button, Select, MenuItem, TextField, Typography, InputLabel, FormControl } from '@mui/material';

import { Iconify } from 'src/components/iconify';

interface CreateAgencyViewProps {
  onClose: () => void;
  onSave: (agencies: AgenciaProps) => Promise<void>;
  users: UserProps[];
}

export function CreateAgencyView({ onClose, onSave, users }: CreateAgencyViewProps) {
  const {enqueueSnackbar} = useSnackbar();
  const [formData, setFormData] = useState<AgenciaProps>({
    _id: '',
    item: 0,
    nombre: '',
    cod: 0,
    coordinador: '',
    director: '',
  }
);

  const handleSave = async () => {
    if (!formData.nombre || !formData.cod || !formData.coordinador) {
      enqueueSnackbar('Por favor completa todos los campos requeridos.', { variant: 'warning' })
      return;
    }
    const updatedFormData = {
      ...formData,
      nombre: formData.nombre.toUpperCase(),
    };
    await onSave(updatedFormData);
    enqueueSnackbar('Agencia guardada correctamente!', { variant: 'success' });
    onClose();
  };

  const handleInputChange = (field: keyof AgenciaProps) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [field]: event.target.value,
    });
  };

  return (
    <Box>
      <Typography variant="h4">Crear Nueva Agencia</Typography>
      <Card sx={{ p: 3 }}>
        <TextField
          label="Nombre de la Agencia"
          value={formData.nombre}
          onChange={handleInputChange('nombre')}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Código"
          value={formData.cod}
          onChange={handleInputChange('cod')}
          fullWidth
          margin="normal"
          required
        />
        <FormControl fullWidth margin="normal" variant="outlined" required>
          <InputLabel>Coordinador</InputLabel>
          <Select
            label="Coordinador"
            value={formData.coordinador}
            onChange={(e) => setFormData({ ...formData, coordinador: e.target.value })}
          >
            <MenuItem value="C9">Coordinador 9</MenuItem>
            <MenuItem value="C5">Coordinador 5</MenuItem>
            <MenuItem value="C4">Coordinador 4</MenuItem>
            <MenuItem value="C3">Coordinador 3</MenuItem>
            <MenuItem value="C2">Coordinador 2</MenuItem>
            <MenuItem value="C1">Coordinador 1</MenuItem>
            <MenuItem value="NA">No Aplica</MenuItem>
          </Select>
        </FormControl>
        <Button
          variant="contained"
          sx={{ mr: 2 }}
          onClick={handleSave}
          startIcon={<Iconify icon="mingcute:add-line" />}
        >
          Crear Agencia
        </Button>
        <Button variant="outlined" onClick={onClose}>
          Cancelar
        </Button>
      </Card>
    </Box>
  );
}