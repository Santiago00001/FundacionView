import type { UserProps } from 'src/sections/user/user-table-row'; // O tu ruta correcta

import type { AgenciaProps } from 'src/sections/agencys/agency-table-row';

import { useState } from 'react';

import { Dialog, DialogContent } from '@mui/material';

import { CreateAgencyView } from 'src/sections/agencys/view/agency-create-view'; // O tu ruta correcta

export function useCreateAgencyDialog(onSave: (agencies: AgenciaProps) => Promise<void>, users: UserProps[]) {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const AddAgencyDialog = () => (
    <Dialog open={open} onClose={handleClose}>
      <DialogContent>
        <CreateAgencyView
          onClose={handleClose}
          onSave={async (agencies) => {
            await onSave(agencies);
            handleClose();
          }}
          users={users} // Pasamos la lista de usuarios para seleccionar el director
        />
      </DialogContent>
    </Dialog>
  );

  return { AddAgencyDialog, handleOpenAddAgencyModal: handleOpen };
}