import type { FoundationProps } from 'src/sections/providers/provider-table-row';

import { useState } from 'react';

import { Dialog, DialogContent } from '@mui/material';

import { CreateProviderView } from 'src/sections/providers/view/provider-create-view';

interface DepartamentoData {
  departamento: string;
  ciudades: string[];
}

export function useCreateProviderDialog(
  onSave: (provider: FoundationProps) => Promise<void>
) {
  const [open, setOpen] = useState(false);
  const [departamentos, setDepartamentos] = useState<DepartamentoData[]>([]);

  // Modificar handleOpen para aceptar tanto departamentos como códigos CIIU
  const handleOpen = (
    departamentosData: DepartamentoData[],
  ) => {
    setDepartamentos(departamentosData);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const AddProductDialog = (
    <Dialog open={open} onClose={handleClose}>
      <DialogContent>
        <CreateProviderView
          onClose={handleClose}
          onSave={async (provider) => {
            await onSave(provider);
            handleClose();
          }}
          departamentosData={departamentos}
        />
      </DialogContent>
    </Dialog>
  );

  return { AddProductDialog, handleOpenAddProductModal: handleOpen };
}