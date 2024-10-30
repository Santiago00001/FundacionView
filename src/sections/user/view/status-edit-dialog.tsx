import { useSnackbar } from 'notistack';
import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';

import type { UserProps } from '../user-table-row';

interface EditStatusViewProps {
  user: UserProps;
  onClose: () => void;
  onSave: (user: UserProps) => Promise<void>;
}

export function EditStatusView({ user, onClose, onSave }: EditStatusViewProps) {
  const [formData, setFormData] = useState<UserProps>(user);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (user) {
      setFormData(user); // Initialize the form data with the user data
    }
  }, [user]);

  const handleSave = async () => {
    try {
      await onSave(formData); // Save the changes (only the status in this case)
      enqueueSnackbar('Estado actualizado correctamente!', { variant: 'success' });
      onClose(); // Close the modal after saving
    } catch (error) {
      console.error('Error actualizando el estado:', error);
      enqueueSnackbar('Error actualizando el estado:', { variant: 'warning' });
    }
  };

  const handleStatusChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, status: event.target.value });
  };

  if (!user) return <Typography>Cargando...</Typography>;

  return (
    <DashboardContent>
      <Box display="flex" alignItems="center" mb={5}>
        <Typography variant="h4" flexGrow={1}>
          Editar Estado del Usuario
        </Typography>
      </Box>
      <Card sx={{ p: 3 }}>
        {/* Only show the status field */}
        <TextField
          select
          label="Estado"
          value={formData.status}
          onChange={handleStatusChange}
          fullWidth
          margin="normal"
          variant="outlined"
        >
          <MenuItem value="activo">Activo</MenuItem>
          <MenuItem value="inactivo">Inactivo</MenuItem>
          <MenuItem value="suspendido">Suspendido</MenuItem>
        </TextField>

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