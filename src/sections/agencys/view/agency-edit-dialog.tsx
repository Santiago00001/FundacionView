import type { SelectChangeEvent } from '@mui/material';
import type { UserProps } from 'src/sections/user/user-table-row';

import { useSnackbar } from 'notistack';
import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { Select, MenuItem, InputLabel, FormControl } from '@mui/material';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';

import type { AgenciaProps } from '../agency-table-row';

interface EditAgencyViewProps {
  agency: AgenciaProps;
  onClose: () => void;
  onSave: (agency: AgenciaProps) => Promise<void>;
  users: UserProps[]; // Lista de agencias disponibles para selección
}

export function EditAgencyView({ agency, onClose, onSave, users }: EditAgencyViewProps) {
  const {enqueueSnackbar} = useSnackbar();
  const [formData, setFormData] = useState<AgenciaProps>(agency);

  useEffect(() => {
    setFormData(agency);
  }, [agency]);

  const handleSave = async () => {
    const updatedFormData = {
      ...formData,
      nombre: formData.nombre.toUpperCase(),
    };
    try {
      await onSave(updatedFormData); // Guardamos los cambios
      enqueueSnackbar('Agencia actualizada correctamente!', { variant: 'success' });
      onClose(); // Cierra el modal
    } catch (error) {
      console.error('Error updating agency:', error);
      enqueueSnackbar('Error actualizando la agencia:', { variant: 'warning' });
    }
  };

  const handleDirectorChange = (event: SelectChangeEvent<string>) => {
    const selectedDirectorId = event.target.value;
    const selectedDirector = users.find(user => user._id=== selectedDirectorId);
    if (selectedDirector) {
      setFormData({
        ...formData,
        director: selectedDirectorId,
      });
    }
  };

  if (!agency) return <Typography>Cargando...</Typography>;

  return (
    <DashboardContent>
      <Box display="flex" alignItems="center" mb={5}>
        <Typography variant="h4" flexGrow={1}>
          Editar Agencia
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
          onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Código"
          value={formData.cod}
          onChange={(e) => setFormData({ ...formData, cod: Number(e.target.value) })}
          fullWidth
          margin="normal"
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
        
        {/* Campo para seleccionar el Director 
        <FormControl fullWidth margin="normal" required>
          <InputLabel>Funcionario</InputLabel>
          <Select
            label="Funcionario"
            value={formData.director}
            onChange={handleDirectorChange}
          >
            {users.map(user => (
              <MenuItem key={user._id} value={user._id}>
                {user.nombres} {user.apellidos}
              </MenuItem>
            ))}
          </Select>
        </FormControl> */}

        {/*
        <FormControl fullWidth margin="normal" variant="outlined" required>
          <InputLabel>Estado</InputLabel>
          <Select
            label="Estado"
            value={formData.director.status}
            onChange={(e) => setFormData({ ...formData, director: { ...formData.director, status: e.target.value } })}
          >
            <MenuItem value="activo">Activo</MenuItem>
            <MenuItem value="inactivo">Inactivo</MenuItem>
            <MenuItem value="suspendido">Suspendido</MenuItem>
          </Select>
        </FormControl>

        <FormControlLabel
          control={
            <Checkbox
              checked={formData.director.verificacion}
              onChange={(e) => setFormData({ ...formData, director: { ...formData.director, verificacion: e.target.checked } })}
            />
          }
          label="Verificado"
        />
        */}

        <Button variant="contained" sx={{ mr: 2 }} onClick={handleSave} startIcon={<Iconify icon="mingcute:save-line" />}>
          Guardar
        </Button>
        <Button variant="outlined" sx={{ mr: 2 }} onClick={onClose}>Cancelar</Button>
      </Card>
    </DashboardContent>
  );
}