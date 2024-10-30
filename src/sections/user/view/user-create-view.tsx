import type { SelectChangeEvent } from '@mui/material';
import type { AgenciaProps } from 'src/sections/agencys/agency-table-row';

import { useState } from 'react';
import { useSnackbar } from 'notistack';

import { Box, Card, Button, Select, MenuItem, TextField, Typography, InputLabel, FormControl, InputAdornment } from '@mui/material';

import { Iconify } from 'src/components/iconify';

import type { UserProps } from '../user-table-row';

interface CreateUserViewProps {
  onClose: () => void;
  onSave: (user: UserProps) => Promise<void>;
  agencies: AgenciaProps[];
}

export function CreateUserView({ onClose, onSave, agencies }: CreateUserViewProps) {
  const { enqueueSnackbar } = useSnackbar();
  const [formData, setFormData] = useState<UserProps>({
    _id: '',
    item: 0,
    nombres: '',
    apellidos: '',
    cc: '',
    cargo: '',
    correo: '',
    agencia: {
      _id: '',
      item: 0,
      cod: 0,
      nombre: '',
      coordinador: '',
      director: '',
    },
    rol: '',
    verificacion: false,
    status: '',
    visible: 0,
  });

  const handleSave = async () => {
    const formattedNombres = formData.nombres.toLowerCase().replace(/(?:^|\s)\S/g, (a) => a.toUpperCase());
    const formattedApellidos = formData.apellidos.toUpperCase();
    const formattedCargo = formData.cargo.toUpperCase();

    // Crear un nuevo objeto con los datos formateados
    const newUserData = {
      ...formData,
      nombres: formattedNombres,
      apellidos: formattedApellidos,
      cargo: formattedCargo,
      correo: `${formData.correo}@coopserp.com`, // Concatenar el dominio aquí
    };

    if (
      !newUserData.nombres ||
      !newUserData.apellidos ||
      !newUserData.cc ||
      !newUserData.cargo ||
      !newUserData.agencia._id ||
      !newUserData.rol ||
      !newUserData.status
    ) {
      enqueueSnackbar('Por favor completa todos los campos requeridos.', { variant: 'warning' })
      return;
    }

    await onSave(newUserData);
    onClose();
  };

  const handleAgencyChange = (event: SelectChangeEvent<string>) => {
    const selectedAgencyId = event.target.value; // Ahora el valor es del tipo string
    const selectedAgency = agencies.find(agency => agency._id === selectedAgencyId);
    if (selectedAgency) {
      setFormData({
        ...formData,
        agencia: {
          _id: selectedAgency._id,
          item: selectedAgency.item,
          cod: selectedAgency.cod,
          nombre: selectedAgency.nombre,
          coordinador: selectedAgency.coordinador,
          director: selectedAgency.director,
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
          value={formData.nombres}
          onChange={(e) => setFormData({ ...formData, nombres: e.target.value.toLowerCase().replace(/(?:^|\s)\S/g, (a) => a.toUpperCase()) })}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Apellidos"
          value={formData.apellidos}
          onChange={(e) => setFormData({ ...formData, apellidos: e.target.value.toUpperCase() })}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="CC"
          value={formData.cc}
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, ""); // Elimina cualquier caracter que no sea dígito
            setFormData({ ...formData, cc: value });
          }}
          fullWidth
          margin="normal"
          required
        />
        <FormControl fullWidth margin="normal" variant="outlined" required>
          <InputLabel>Cargo</InputLabel>
          <Select
            label="Cargo"
            value={formData.cargo}
            onChange={(e) => setFormData({ ...formData, cargo: e.target.value })}
          >
            {[
              "DIRECTOR DE AGENCIA",
              "JEFE ÁREA REPORTES",
              "JEFE DEPARTAMENTO",
              "DIRECTOR GENERAL",
              "OFICIAL DE CUMPLIMIENTO",
              "COORDINADOR DE AGENCIAS",
            ]
              .sort() // Ordena alfabéticamente
              .map((cargo) => (
                <MenuItem key={cargo} value={cargo}>
                  {cargo}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
        <TextField
          label="Correo"
          value={formData.correo}
          onChange={(e) => setFormData({ ...formData, correo: e.target.value })}
          fullWidth
          margin="normal"
          required
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">@coopserp.com</InputAdornment>
            ),
          }}
        />

        {/* Campo para seleccionar la Agencia */}
        <FormControl fullWidth margin="normal" required>
          <InputLabel>Agencia</InputLabel>
          <Select
            label="Agencia"
            value={formData.agencia._id}
            onChange={handleAgencyChange}
          >
            {agencies
              .sort((a, b) => a.cod - b.cod) // Ordena por código numéricamente
              .map(agency => (
                <MenuItem key={agency._id} value={agency._id}>
                  {agency.cod} {agency.nombre}
                </MenuItem>
              ))}
          </Select>
        </FormControl>

        <FormControl fullWidth margin="normal" variant="outlined" required>
          <InputLabel>Rol</InputLabel>
          <Select
            label="Rol"
            value={formData.rol}
            onChange={(e) => setFormData({ ...formData, rol: e.target.value })}
          >
            {[
              "Admin",
              "Agencia",
              "Coordinacion",
              "Jefatura",
              "Almacenista",
            ]
              .sort() // Ordena alfabéticamente
              .map((rol) => (
                <MenuItem key={rol} value={rol}>
                  {rol}
                </MenuItem>
              ))}
          </Select>
        </FormControl>

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