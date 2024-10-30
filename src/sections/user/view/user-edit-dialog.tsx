import type { SelectChangeEvent } from '@mui/material';
import type { AgenciaProps } from 'src/sections/agencys/agency-table-row';

import { useSnackbar } from 'notistack';
import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { Select, MenuItem, InputLabel, FormControl, InputAdornment } from '@mui/material';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';

import type { RoleProps, UserProps } from '../user-table-row';

interface EditUserViewProps {
  user: UserProps;
  onClose: () => void;
  onSave: (user: UserProps) => Promise<void>;
  role: RoleProps[]; // Lista de agencias disponibles
}

export function EditUserView({ user, onClose, onSave, role }: EditUserViewProps) {
  const [formData, setFormData] = useState<UserProps>(user);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (user) {
      // Separar el nombre del correo del dominio al cargar el usuario
      setFormData({
        ...user,
        email: user.email.split('@')[0], // Obtener solo la parte antes de @
      });
    }
  }, [user]);

  const handleSave = async () => {
    try {
      // Desestructuramos "status" para no incluirlo en la actualización
      const { status, ...formDataWithoutStatus } = formData;

      // Creamos una copia de formDataWithoutStatus y concatenamos el dominio en el campo "correo"
      const updatedUserData = {
        ...formDataWithoutStatus,
        correo: `${formDataWithoutStatus.email}@coopserp.com`, // Concatenar el dominio
      };

      // Guardamos los cambios (sin "status" y con el correo actualizado)
      await onSave(updatedUserData);

      // Cierra el modal
      onClose();
    } catch (error) {
      console.error('Error actualizando el usuario:', error);
      enqueueSnackbar('Error al actualizar el usuario. Por favor, intenta de nuevo.', {variant: 'success'});
    }
  };

  const handleAgencyChange = (event: SelectChangeEvent<string>) => {
    const selectedAgencyId = event.target.value;
    const selectedAgency = role.find(agency => agency._id === selectedAgencyId);
  
    if (selectedAgency) {
      setFormData(prevFormData => ({
        ...prevFormData,
        agencia: selectedAgency, // Solo asignar el objeto de agencia
      }));
    }
  };  

  if (!user) return <Typography>Cargando...</Typography>;

  return (
    <DashboardContent>
      <Box display="flex" alignItems="center" mb={5}>
        <Typography variant="h4" flexGrow={1}>
          Editar Usuario
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
          label="Nombres"
          value={formData.firstName}
          onChange={(e) => setFormData({ ...formData, firstName: e.target.value.toLowerCase().replace(/(?:^|\s)\S/g, (a) => a.toUpperCase()) })}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Apellidos"
          value={formData.lastName}
          onChange={(e) => setFormData({ ...formData, lastName: e.target.value.toUpperCase()  })}
          fullWidth
          margin="normal"
        />
        <TextField
          label="CC"
          value={formData.phoneNumber}
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, ""); // Elimina cualquier caracter que no sea dígito
            setFormData({ ...formData, phoneNumber: value });
          }}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Correo (sin @coopserp.com)"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value.toLowerCase().replace(/(?:^|\s)\S/g, (a) => a.toUpperCase()) })}
          fullWidth
          margin="normal"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">@coopserp.com</InputAdornment>
            ),
          }}
        />

        {/* Campo para seleccionar la Agencia 
        <FormControl fullWidth margin="normal" required>
          <InputLabel>Agencia</InputLabel>
          <Select
            label="Agencia"
            value={formData.roleId._id}
            onChange={handleAgencyChange}
          >
            {agencies
              .sort((a, b) => a.cod - b.cod) // Ordena por código numéricamente
              .map(role => (
                <MenuItem key={role._id} value={role._id}>
                  {role.name}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
        */}
        
        <Button variant="contained" sx={{ mr: 2 }} onClick={handleSave} startIcon={<Iconify icon="mingcute:save-line" />}>
          Guardar
        </Button>
        <Button variant="outlined" sx={{ mr: 2 }} onClick={onClose}>Cancelar</Button>
      </Card>
    </DashboardContent>
  );
}