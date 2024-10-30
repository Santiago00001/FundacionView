import type { ProviderProps } from 'src/sections/providers/provider-table-row';

import { useState } from 'react';

import { Dialog, DialogContent } from '@mui/material';

import { CreateProviderView } from 'src/sections/providers/view/provider-create-view';

interface DepartamentoData {
  departamento: string;
  ciudades: string[];
}

interface CodigoCiiuData {
  act_eco: string;
  cod_ciiu: number;
}

interface BankOptionsData {
  cod_bank: number;
  banco: string;
}

export function useCreateProviderDialog(
  onSave: (provider: ProviderProps) => Promise<void>
) {
  const [open, setOpen] = useState(false);
  const [departamentos, setDepartamentos] = useState<DepartamentoData[]>([]);
  const [codigosCiiu, setCodigosCiiu] = useState<CodigoCiiuData[]>([]);
  const [bankOptions, setbankOptions] = useState<BankOptionsData[]>([]);

  // Modificar handleOpen para aceptar tanto departamentos como códigos CIIU
  const handleOpen = (
    departamentosData: DepartamentoData[],
    codigosCiiuData: CodigoCiiuData[],
    bankOptionsData: BankOptionsData[]
  ) => {
    setDepartamentos(departamentosData);
    setCodigosCiiu(codigosCiiuData);
    setbankOptions(bankOptionsData);
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
          codigosCiiu={codigosCiiu}
          bankOptions={bankOptions}
        />
      </DialogContent>
    </Dialog>
  );

  return { AddProductDialog, handleOpenAddProductModal: handleOpen };
}