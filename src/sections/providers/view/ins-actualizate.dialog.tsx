import { useSnackbar } from 'notistack';
import { useState, useEffect } from 'react';

import { Box, Card, Button, Checkbox, TextField, Typography, FormControlLabel } from '@mui/material';

import { Iconify } from 'src/components/iconify';

interface INSInspectorDialogProps {
    open: boolean;
    onClose: () => void;
    initialData: {
        cod_ins: string;
        cod_ins_fecha: Date;
        ver_ins: boolean;
    };
    onSave: (updatedINSData: { cod_ins: string; cod_ins_fecha: Date; ver_ins: boolean }) => void;
    existingCodes: string[]; // Nueva prop para recibir los códigos existentes
}

export function INSInspectorDialog({ open, onClose, initialData, onSave, existingCodes }: INSInspectorDialogProps) {
    const { enqueueSnackbar } = useSnackbar();
    const [insData, setInsData] = useState({
        cod_ins: '',
        cod_ins_fecha: new Date(),
        ver_ins: true, // Siempre iniciar como true
    });
    const [isModified, setIsModified] = useState(false); // Para rastrear si se han realizado modificaciones

    useEffect(() => {
        if (initialData) {
            // Inicializar con datos, pero asegurarse de que cod_ins esté vacío
            setInsData({
                cod_ins: '', 
                cod_ins_fecha: new Date(),
                ver_ins: true, 
            });
            setIsModified(false); // Resetear el estado de modificación al abrir
        }
    }, [initialData]);

    const handleInputChange = (field: string, value: any) => {
        setInsData((prevData) => ({ ...prevData, [field]: value }));
        setIsModified(true); // Marcar que se han realizado cambios
    };

    const handleSave = () => {
        const currentDate = new Date();
        const insExpirationDate = new Date(insData.cod_ins_fecha);
        insExpirationDate.setMonth(insExpirationDate.getMonth() + 3); // Añadir 3 meses para la validación de vencimiento

        if (currentDate > insExpirationDate) {
            enqueueSnackbar('El código Inspektor ha expirado. Por favor, actualiza la fecha.', { variant: 'warning' });
            return;
        }

        if (!isModified) {
            enqueueSnackbar('Por favor, realiza cambios antes de guardar.', { variant: 'error' });
            return;
        }

        // Validar si el código ya existe
        if (existingCodes.includes(insData.cod_ins)) {
            enqueueSnackbar('El código INS ya existe. Por favor, ingresa un código diferente.', { variant: 'error' });
            return;
        }

        onSave(insData); // Guardar los datos actualizados
        enqueueSnackbar('Inspektor actualizado correctamente!', { variant: 'success' });
        onClose();
    };

    return (
        <Box>
            <Card sx={{ p: 3, maxWidth: 400, margin: 'auto' }}>
                <Typography variant="h6" mb={2}>Actualizar Datos del INS</Typography>

                <TextField
                    label="Código INS"
                    value={insData.cod_ins} // Este campo siempre estará vacío
                    onChange={(e) => handleInputChange('cod_ins', e.target.value)}
                    fullWidth
                    type="number"
                    margin="normal"
                    required
                />
                <TextField
                    label="Fecha de Verificacion"
                    type="date"
                    InputLabelProps={{
                        shrink: true,
                    }}
                    value={insData.cod_ins_fecha instanceof Date ? insData.cod_ins_fecha.toISOString().split('T')[0] : ''}
                    onChange={(e) => {
                        const selectedDate = new Date(e.target.value);
                        handleInputChange('cod_ins_fecha', selectedDate);
                    }}
                    fullWidth
                    margin="normal"
                    required
                />
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={insData.ver_ins} // Siempre como checked
                            disabled // Deshabilitar la casilla para evitar edición
                        />
                    }
                    label="Verificado INS"
                />

                <Box mt={2} display="flex" justifyContent="space-between">
                    <Button
                        variant="contained"
                        onClick={handleSave}
                        startIcon={<Iconify icon="mingcute:save-line" />}
                        disabled={!isModified} // Solo habilitado si hay cambios
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