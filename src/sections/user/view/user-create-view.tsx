import type { SelectChangeEvent } from '@mui/material';
import type { AgenciaProps } from 'src/sections/agencys/agency-table-row';

import { useState } from 'react';
import { useSnackbar } from 'notistack';

import { Box, Card, Button, Select, MenuItem, TextField, Typography, InputLabel, FormControl, InputAdornment } from '@mui/material';

import { Iconify } from 'src/components/iconify';

import type { RoleProps, UserProps } from '../user-table-row';

interface CreateUserViewProps {
  onClose: () => void;
  onSave: (user: UserProps) => Promise<void>;
  role: RoleProps[];
}

export function CreateUserView({ onClose, onSave, role }: CreateUserViewProps) {
  const { enqueueSnackbar } = useSnackbar();
  const [formData, setFormData] = useState<UserProps>({
    _id: '',
    item: 0,
    firstName: '',
    lastName: '',
    phoneNumber: '',
    email: '',
    roleid: {
      _id: '',
      name: '',
      status: '',
    },
    verificacion: false,
    status: '',
    visible: 0,
  });

  const handleSave = async () => {
    const formattedNombres = formData.firstName.toLowerCase().replace(/(?:^|\s)\S/g, (a) => a.toUpperCase());
    const formattedApellidos = formData.lastName.toUpperCase();

    // Crear un nuevo objeto con los datos formateados
    const newUserData = {
      ...formData,
      nombres: formattedNombres,
      apellidos: formattedApellidos,
      correo: `${formData.email}@coopserp.com`, // Concatenar el dominio aquí
    };

    if (
      !newUserData.firstName ||
      !newUserData.lastName ||
      !newUserData.phoneNumber ||
      !newUserData.roleid._id ||
      !newUserData.status
    ) {
      enqueueSnackbar('Por favor completa todos los campos requeridos.', { variant: 'warning' })
      return;
    }

    await onSave(newUserData);
    onClose();
  };

  const handleAgencyChange = (event: SelectChangeEvent<string>) => {
    const selectedroleId = event.target.value; // Ahora el valor es del tipo string
    const selectedRole = role.find(roles => roles._id === selectedroleId);
    if (selectedRole) {
      setFormData({
        ...formData,
        roleid: {
          _id: selectedRole._id,
          name: selectedRole.name,
          status: selectedRole.status,
        },
      });
    }
  };

  return (
    <Box>
      <Typography variant="h4">Crear Nuevo Usuario</Typography>
      <Card sx={{ p: 3 }}>
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
          onChange={(e) => setFormData({ ...formData, lastName: e.target.value.toUpperCase() })}
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

        <FormControl fullWidth margin="normal" variant="outlined" required>
          <InputLabel>Estado</InputLabel>
          <Select
            label="Estado"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
          >
            <MenuItem value="activo">Activo</MenuItem>
            <MenuItem value="inactivo">Inactivo</MenuItem>
            <MenuItem value="suspendido">Suspendido</MenuItem>
          </Select>
        </FormControl>

        <Button variant="contained" sx={{ mr: 2 }} onClick={handleSave} startIcon={<Iconify icon="mingcute:add-line" />}>
          Crear Usuario
        </Button>
        <Button variant="outlined" sx={{ mr: 2 }} onClick={onClose}>Cancelar</Button>
      </Card>
    </Box>
  );
}