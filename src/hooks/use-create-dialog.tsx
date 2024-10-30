import type { RoleProps, UserProps } from 'src/sections/user/user-table-row';

import { useState } from 'react';

import { Dialog, DialogContent } from '@mui/material';

import { CreateUserView } from 'src/sections/user/view/user-create-view';

export function useCreateUserDialog(onSave: (user: UserProps) => Promise<void>, role: RoleProps[]) {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const AddUserDialog = () => (
    <Dialog open={open} onClose={handleClose}>
      <DialogContent>
        <CreateUserView
          onClose={handleClose}
          onSave={async (user) => {
            await onSave(user);
            handleClose();
          }}
          role={role} // Pasar agencias aquí
        />
      </DialogContent>
    </Dialog>
  );

  return { AddUserDialog, handleOpenAddUserModal: handleOpen };
}