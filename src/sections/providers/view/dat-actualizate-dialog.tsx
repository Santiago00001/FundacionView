import { useSnackbar } from 'notistack';
import { useState, useEffect } from 'react';

import { Box, Card, Button, Checkbox, TextField, Typography, FormControlLabel } from '@mui/material';

import { Iconify } from 'src/components/iconify';

interface DATModalProps {
    open: boolean;
    onClose: () => void;
    initialData: {
        cod_dat: string;
        cod_dat_fecha: Date;
        ver_dat: boolean;
    };
    onSave: (updatedDATData: { cod_dat: string; cod_dat_fecha: Date; ver_dat: boolean }) => void;
}

export function DATModal({ open, onClose, initialData, onSave }: DATModalProps) {
    const { enqueueSnackbar } = useSnackbar();
    const [errors, setErrors] = useState<Record<string, boolean>>({});
    const [datData, setDatData] = useState({
        cod_dat: '',
        cod_dat_fecha: new Date(),
        ver_dat: true,
    });
    const [isModified, setIsModified] = useState(false);

    useEffect(() => {
        if (initialData) {
            setDatData({
                ...initialData,
                cod_dat: '',
                cod_dat_fecha: new Date(),
                ver_dat: true,
            });
            setIsModified(false); // Resetear el estado de modificación al abrir
        }
    }, [initialData]);    

    const handleInputChange = (field: string, value: any) => {
        setDatData((prevData) => ({ ...prevData, [field]: value }));
        setIsModified(true); // Marcar que se han realizado cambios
    };

    const validateForm = () => {
        const newErrors: Record<string, boolean> = {};
        if (!datData.cod_dat) newErrors.cod_dat = true;
        if (!datData.cod_dat_fecha) newErrors.cod_dat_fecha = true;

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = () => {
        if (!validateForm()) {
            enqueueSnackbar('Por favor, completa todos los campos requeridos.', { variant: 'error' });
            return;
        }

        const currentDate = new Date();
        const datExpirationDate = new Date(datData.cod_dat_fecha);
        datExpirationDate.setMonth(datExpirationDate.getMonth() + 6);

        if (currentDate > datExpirationDate) {
            enqueueSnackbar('El código Datacredito ha expirado. Por favor, actualiza la fecha.', { variant: 'warning' });
            return;
        }

        onSave(datData);
        enqueueSnackbar('Datacredito actualizado correctamente!', { variant: 'success' });
        onClose();
    };

    const isFormModifiedAndValid = isModified && Object.keys(errors).length === 0;

    return (
        <Box>
            <Card sx={{ p: 3, maxWidth: 400, margin: 'auto' }}>
                <Typography variant="h6" mb={2}>Actualizar Datos DAT</Typography>

                <TextField
                    label="Código DAT"
                    value={datData.cod_dat}
                    onChange={(e) => {
                        const { value } = e.target;
                        if (/^\d{0,3}$/.test(value)) {
                            handleInputChange('cod_dat', value);
                        }
                    }}
                    fullWidth
                    margin="normal"
                    required
                    inputProps={{ maxLength: 3 }}
                    error={!!errors.cod_dat}
                    helperText={errors.cod_dat ? 'El campo Código DAT es requerido' : ''}
                />

                <TextField
                    label="Fecha de Verificacion"
                    type="date"
                    InputLabelProps={{
                        shrink: true,
                    }}
                    value={datData.cod_dat_fecha instanceof Date ? datData.cod_dat_fecha.toISOString().split('T')[0] : ''}
                    onChange={(e) => {
                        const selectedDate = new Date(e.target.value);
                        handleInputChange('cod_dat_fecha', selectedDate);
                    }}
                    fullWidth
                    margin="normal"
                    required
                    error={!!errors.cod_dat_fecha}
                    helperText={errors.cod_dat_fecha ? 'La fecha de verificación es requerida' : ''}
                />

                <FormControlLabel
                    control={
                        <Checkbox
                            checked // Mostrar siempre como checked
                            disabled // Deshabilitar la casilla para evitar edición
                        />
                    }
                    label="Verificado DAT"
                />

                <Box mt={2} display="flex" justifyContent="space-between">
                    <Button
                        variant="contained"
                        onClick={handleSave}
                        startIcon={<Iconify icon="mingcute:save-line" />}
                        disabled={!isFormModifiedAndValid} // Solo habilitado si hay cambios y no hay errores
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