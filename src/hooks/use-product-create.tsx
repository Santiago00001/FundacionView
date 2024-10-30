import type { Category, ProductProps } from 'src/sections/product/product-table-row';

import { useState } from 'react';

import { Dialog, DialogContent } from '@mui/material';

import { CreateProductView } from 'src/sections/product/view/product-create-view';

export function useCreateProductDialog(
  onSave: (product: ProductProps) => Promise<void>,
  categories: Category[],
  existingCodes: number[]
) {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const AddProductDialog = (
    <Dialog open={open} onClose={handleClose}>
      <DialogContent>
        <CreateProductView
          onClose={handleClose}
          onSave={async (product) => {
            await onSave(product); // Llama a la función para guardar el producto
            handleClose(); // Cierra el modal
          }}
          product={{
            _id: '',
            item: 0,
            nombre: '',
            categoria_id: { _id: '', grupo_desc: '', categoria: '', cta_cont: 0 },
            codigo: 0,
            tipo: '',
            presentacion: '',
            visible: 0,
          }}
          categories={categories}
          existingCodes={existingCodes}
        />
      </DialogContent>
    </Dialog>
  );

  return { AddProductDialog, handleOpenAddProductModal: handleOpen };
}