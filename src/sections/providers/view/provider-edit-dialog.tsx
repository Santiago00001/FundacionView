import { useSnackbar } from 'notistack';
import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { Grid, Select, MenuItem, InputLabel, FormControl, Autocomplete, InputAdornment } from '@mui/material';

import { Iconify } from 'src/components/iconify';

import type { FoundationProps } from '../provider-table-row';

interface EditProviderViewProps {
  departamentosData: { departamento: string; ciudades: string[] }[];
  codigosCiiu: { act_eco: string; cod_ciiu: number }[];
  bankOptions: { cod_bank: number; banco: string }[];
  provider: FoundationProps;
  onClose: () => void;
  onSave: (provider: FoundationProps) => Promise<void>;
}

export function EditProviderView({
  provider,
  onClose,
  onSave,
  departamentosData,
  codigosCiiu,
  bankOptions,
}: EditProviderViewProps) {
  const { enqueueSnackbar } = useSnackbar();
  const [errors, setErrors] = useState<Record<string, boolean>>({});  // Estado para los errores
  const [formData, setFormData] = useState<FoundationProps>({
    ...provider,
    date_create: new Date(provider.date_create), // Convierte a Date
  });

  const [direccionData, setDireccionData] = useState({
    tipoCalle: '',
    numero1: '',
    letra1: 'Sin Letra',
    numero2: '',
    letra2: 'Sin Letra',
    numero3: '',
    complemento: '',
    barrio: ''
  });

  useEffect(() => {
    if (provider && provider.address) {
      const address = typeof provider.address === 'string' ? convertirDireccion(provider.address) : provider.address;

      setDireccionData({
        tipoCalle: address.tipoCalle || '',
        numero1: address.numero1 || '',
        letra1: address.letra1 || 'Sin Letra',
        numero2: address.numero2 || '',
        letra2: address.letra2 || 'Sin Letra',
        numero3: address.numero3 || '',
        complemento: address.complemento || '',
        barrio: address.barrio || '',
      });
    }
  }, [provider]);

  const isValidNIT = (nit: string) => {
    const nitBase = nit.split('-')[0];
    if (nitBase.length < 9 || nitBase.length > 10) {
      return false;
    }

    const invalidSequences = ['123456', '111111', '000000'];
    if (invalidSequences.some(seq => nitBase.includes(seq))) {
      return false;
    }

    return true;
  };

  function convertirDireccion(direccionString: string) {
    const regex = /^(Calle|Carrera|Transversal|Avenida|Diagonal)?\s*(\d+)([A-D]?)\s*#\s*(\d+)([A-D]?)\s*-\s*(\d+)(?:\s+(.+))?$/i;
    const match = direccionString.match(regex);

    if (match) {
      // Separa complemento y barrio si están unidos por " - "
      const [complemento, barrio] = (match[7] || '').split(' - ');

      return {
        tipoCalle: match[1] || '',
        numero1: match[2] || '',
        letra1: match[3] || 'Sin Letra',
        numero2: match[4] || '',
        letra2: match[5] || 'Sin Letra',
        numero3: match[6] || '',
        complemento: complemento || '',
        barrio: barrio || '',
      };
    }

    return {};
  }

  const validateForm = () => {
    const newErrors: Record<string, boolean> = {};

    if (!formData.nit) newErrors.nit = true;
    if (!formData.razon_social) newErrors.razon_social = true;
    if (!formData.address) newErrors.address = true;
    if (!formData.departament) newErrors.departament = true;
    if (!formData.city) newErrors.city = true;
    if (!formData.commune) newErrors.commune = true;
    if (!formData.email) newErrors.email = true;
    if (!formData.date_create) newErrors.date_create = true;
    if (!formData.vision) newErrors.vision = true;
    if (!formData.adminId) newErrors.adminId = true;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;  // Retorna true si no hay errores
  };

  const handleSave = async () => {
    if (!validateForm()) {
      enqueueSnackbar('Por favor completa todos los campos requeridos.', { variant: 'warning' });
      return;
    }

    if (!isValidNIT(formData.nit)) {
      enqueueSnackbar('NIT inválido. Por favor revisa la longitud o secuencia.', { variant: 'error' });
      return;
    }

    // Crear dirección completa
    const direccionCompleta = `${direccionData.tipoCalle} ${direccionData.numero1}${direccionData.letra1 && direccionData.letra1 !== 'Sin Letra' ? direccionData.letra1 : ''} #${direccionData.numero2}${direccionData.letra2 && direccionData.letra2 !== 'Sin Letra' ? direccionData.letra2 : ''} - ${direccionData.numero3} ${direccionData.complemento} - ${direccionData.barrio}`;

    // Actualizar el formData con la nueva dirección
    const updatedProvider = {
      ...formData,
      direccion: direccionCompleta,
    };

    // Convertir fechas a formato 'YYYY-MM-DD' para compararlas
    const fechaInagOriginal = new Date(provider.date_create).toISOString().split('T')[0];
    const fechaInagForm = formData.date_create.toISOString().split('T')[0];

    // Verificar si las fechas o algún otro campo ha cambiado
    const datosHanCambiado = (
      fechaInagOriginal !== fechaInagForm ||
      JSON.stringify(provider) !== JSON.stringify(updatedProvider)
    );

    if (!datosHanCambiado) {
      enqueueSnackbar('No se realizaron cambios en los datos.', { variant: 'info' });
      return;
    }

    try {
      await onSave(updatedProvider); // Guardamos los cambios
      enqueueSnackbar('Proveedor actualizado correctamente!', { variant: 'success' });
      onClose(); // Cierra el modal
    } catch (error) {
      console.error('Error updating provider:', error);
      enqueueSnackbar('Error actualizando el proveedor:', { variant: 'warning' });
    }
  };


  const [ciudadesFiltradas, setCiudadesFiltradas] = useState<string[]>([]);

  // Filtrar ciudades basadas en el departamento seleccionado
  useEffect(() => {
    if (formData.departament) {
      const departamentoSeleccionado = departamentosData.find(
        (dep) => dep.departamento === formData.departament
      );
      if (departamentoSeleccionado) {
        setCiudadesFiltradas(departamentoSeleccionado.ciudades);
      } else {
        setCiudadesFiltradas([]);
      }
    }
  }, [formData.departament, departamentosData]);

  if (!provider) return <Typography>Cargando...</Typography>;

  return (
    <Box>
      <Typography variant="h4">Editar Proveedor</Typography>
      <Card sx={{ p: 3 }}>
        <Box display="flex" alignItems="center" gap={2} marginBottom={2}>
          <TextField
            label="NIT"
            value={formData.nit.split('-')[0]} // Mostramos solo la parte del NIT
            onChange={(e) => {
              const updatedNIT = e.target.value;
              setFormData({
                ...formData,
                nit: `${updatedNIT}-${formData.nit.split('-')[1] || ''}` // Actualizamos el NIT y mantenemos el DV
              });
            }}
            fullWidth
            required
            type="number"
            inputProps={{ min: 0 }}
            error={!!errors.nit} // Muestra error si el campo está vacío
            helperText={errors.nit ? 'El campo NIT es requerido' : ''}
          />
          <TextField
            label="DV"
            value={formData.nit.split('-')[1] || ''} // Mostramos solo el DV
            onChange={(e) => {
              const updatedDV = e.target.value;
              setFormData({
                ...formData,
                nit: `${formData.nit.split('-')[0]}-${updatedDV}` // Actualizamos el DV y mantenemos el NIT
              });
            }}
            required
            type="number"
            inputProps={{ min: 0, max: 9 }}
            sx={{ width: '100px' }}
            error={!!errors.nit} // Muestra error si el campo está vacío
            helperText={errors.nit ? 'El campo DV es requerido' : ''}
          />
        </Box>
        <TextField
          label="Razón Social"
          value={formData.razon_social}
          onChange={(e) => setFormData({ ...formData, razon_social: e.target.value.toUpperCase() })}
          fullWidth
          margin="normal"
          error={!!errors.fecha_inag}
          helperText={errors.fecha_inag ? 'El campo Razon Social es requerido' : ''}
        />

        <Grid container spacing={2} marginTop={1}>
          {/* Select para el tipo de calle */}
          <Grid item xs={12} sm={4}>
            <TextField
              label="Tipo de Calle"
              value={direccionData.tipoCalle}
              onChange={(e) => setDireccionData({ ...direccionData, tipoCalle: e.target.value })}
              fullWidth
              required
              select
            >
              {['Calle', 'Carrera', 'Transversal', 'Avenida', 'Diagonal'].map((tipo) => (
                <MenuItem key={tipo} value={tipo}>
                  {tipo}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* Número principal con letra */}
          <Grid item xs={12} sm={4}>
            <TextField
              label="Número"
              value={direccionData.numero1}
              onChange={(e) => {
                const { value } = e.target;
                // Filtrar para permitir solo números
                if (/^\d*$/.test(value)) {
                  setDireccionData({ ...direccionData, numero1: value });
                }
              }}
              fullWidth
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    {direccionData.letra1 !== 'Sin Letra' && direccionData.letra1}
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          {/* Campo para seleccionar la Letra */}
          <Grid item xs={12} sm={4}>
            <TextField
              label="Letra"
              value={direccionData.letra1}
              onChange={(e) => setDireccionData({ ...direccionData, letra1: e.target.value })}
              fullWidth
              select
            >
              {['Sin Letra', 'A', 'B', 'C', 'D'].map((letra) => (
                <MenuItem key={letra} value={letra}>
                  {letra}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* Número y letra después del # */}
          <Grid item xs={12} sm={4}>
            <TextField
              label="Número"
              value={direccionData.numero2}
              onChange={(e) => {
                const { value } = e.target;
                // Filtrar para permitir solo números
                if (/^\d*$/.test(value)) {
                  setDireccionData({ ...direccionData, numero2: value });
                }
              }}
              fullWidth
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    {direccionData.letra2 !== 'Sin Letra' && direccionData.letra2} {/* No mostrar 'Sin Letra' */}
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          {/* Campo para seleccionar la Letra */}
          <Grid item xs={12} sm={4}>
            <TextField
              label="Letra"
              value={direccionData.letra2}
              onChange={(e) => setDireccionData({ ...direccionData, letra2: e.target.value })}
              fullWidth
              select
            >
              {['Sin Letra', 'A', 'B', 'C', 'D'].map((letra) => (
                <MenuItem key={letra} value={letra}>
                  {letra}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* Número final con letra */}
          <Grid item xs={12} sm={4}>
            <TextField
              label="Número"
              value={direccionData.numero3}
              onChange={(e) => {
                const { value } = e.target;
                // Filtrar para permitir solo números
                if (/^\d*$/.test(value)) {
                  setDireccionData({ ...direccionData, numero3: value });
                }
              }}
              fullWidth
              required
            />
          </Grid>

          {/* Complemento y Barrio */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="Complemento (Oficina/Bodega)"
              value={direccionData.complemento}
              onChange={(e) => setDireccionData({ ...direccionData, complemento: e.target.value })}
              fullWidth
              InputProps={{
                endAdornment: <InputAdornment position="end">-</InputAdornment>,
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Barrio"
              value={direccionData.barrio}
              onChange={(e) => setDireccionData({ ...direccionData, barrio: e.target.value })}
              fullWidth
              required
            />
          </Grid>
        </Grid>

        {/* Campo que concatena la dirección completa */}
        <TextField
          label="Dirección completa"
          value={`${direccionData.tipoCalle} ${direccionData.numero1}${direccionData.letra1 && direccionData.letra1 !== 'Sin Letra' ? direccionData.letra1 : ''} #${direccionData.numero2}${direccionData.letra2 && direccionData.letra2 !== 'Sin Letra' ? direccionData.letra2 : ''} - ${direccionData.numero3} ${direccionData.complemento} - ${direccionData.barrio}`}
          fullWidth
          margin="normal"
          required
          disabled
        />

        {/* Autocomplete para el Departamento */}
        <Autocomplete
          options={departamentosData.map((dep) => dep.departamento)}
          value={formData.departament}
          onChange={(event, newValue) => {
            setFormData({ ...formData, departament: newValue || '', city: '' }); // Limpia la ciudad al cambiar el departamento
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Departamento"
              margin="normal"
              required
              fullWidth
              error={!!errors.fecha_inag}
              helperText={errors.fecha_inag ? 'El campo departamento es requerido' : ''}
            />
          )}
        />
        {/* Autocomplete para la Ciudad, filtrada por el Departamento */}
        <Autocomplete
          options={ciudadesFiltradas}
          value={formData.city}
          onChange={(event, newValue) => setFormData({ ...formData, city: newValue || '' })}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Ciudad"
              margin="normal"
              required
              fullWidth
              error={!!errors.fecha_inag}
              helperText={errors.fecha_inag ? 'El campo ciudad es requerido' : ''}
            />
          )}
          disabled={!formData.departament} // Deshabilitar si no se ha seleccionado un departamento
        />
        <TextField
          label="Correo"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          fullWidth
          margin="normal"
          required
          error={!!errors.fecha_inag}
          helperText={errors.fecha_inag ? 'El campo fecha de matricula es requerido' : ''}
        />
        <TextField
          label="Contacto"
          value={formData.vision}
          onChange={(e) => setFormData({ ...formData, vision: e.target.value })}
          fullWidth
          margin="normal"
          required
          error={!!errors.vision}
          helperText={errors.vision ? 'El campo fecha de renovacion es requerido' : ''}
        />

        <TextField
          label="Fecha de Matricula"
          type="date"
          InputLabelProps={{
            shrink: true,
          }}
          value={formData.date_create.toISOString().split('T')[0]} // Convierte la fecha a formato 'YYYY-MM-DD'
          onChange={(e) => {
            const selectedDate = new Date(e.target.value); // Convierte el valor de string a objeto Date
            setFormData({ ...formData, date_create: selectedDate }); // Actualiza el estado
          }}
          fullWidth
          margin="normal"
          required
          error={!!errors.date_create}
          helperText={errors.date_create ? 'El campo Fecha de Matricula es requerido' : ''}
        />

        {/* ...Otros campos... */}
        <Box display="flex" justifyContent="center" mt={2}>
          <Button
            variant="contained"
            sx={{ mr: 2 }}
            onClick={handleSave}
            startIcon={<Iconify icon="mingcute:save-line" />}
          >
            Guardar
          </Button>
          <Button variant="outlined" onClick={onClose}>
            Cancelar
          </Button>
        </Box>
      </Card>
    </Box>
  );
}