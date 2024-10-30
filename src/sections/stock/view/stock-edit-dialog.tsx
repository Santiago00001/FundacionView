import type { StockProps } from 'src/sections/stock/stock-table-row';

import { useSnackbar } from 'notistack';
import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';

interface EditStockViewProps {
  stock: StockProps; // Cambiado de product a stock
  onClose: () => void;
  onSave: (stock: StockProps) => Promise<void>;
}

export function EditStockView({ stock, onClose, onSave }: EditStockViewProps) {
  const { enqueueSnackbar } = useSnackbar();
  const [formData, setFormData] = useState<StockProps>(stock);

  useEffect(() => {
    setFormData(stock);
  }, [stock]);

  const handleSave = async () => {
    try {
      await onSave(formData);
      enqueueSnackbar('Stock actualizado correctamente', { variant: 'success' });
      onClose();
    } catch (error) {
      console.error('Error updating stock:', error);
      enqueueSnackbar('Error al actualizar el stock. Por favor, intenta de nuevo.', { variant: 'error' });
    }
  };

  return (
    <DashboardContent>
      <Box display="flex" alignItems="center" mb={5}>
        <Typography variant="h4" flexGrow={1}>
          Editar Stock
        </Typography>
      </Box>
      <Card sx={{ p: 3 }}>
        <TextField
          label="Stock"
          type="number"
          value={formData.stock}
          onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Valor Unitario"
          type="number"
          value={formData.valor_unitario}
          onChange={(e) => setFormData({ ...formData, valor_unitario: Number(e.target.value) })}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Valor Promedio"
          type="number"
          value={formData.valor_promedio}
          onChange={(e) => setFormData({ ...formData, valor_promedio: Number(e.target.value) })}
          fullWidth
          margin="normal"
        />
        
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