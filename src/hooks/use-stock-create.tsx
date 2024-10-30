import type { StockProps } from 'src/sections/stock/stock-table-row';
import type { AgenciaProps } from 'src/sections/agencys/agency-table-row';
import type { ProductProps } from 'src/sections/product/product-table-row';

import { useState } from 'react';

import { Dialog, DialogContent } from '@mui/material';

import { CreateStockView } from 'src/sections/stock/view/stock-create-view';

export function useCreateProductDialog(onSave: (product: StockProps) => Promise<void>) {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // Puedes definir un producto y una agencia por defecto aquí
  const defaultProduct: ProductProps = {
    _id: '',
    item: 0,
    nombre: '',
    categoria_id: { _id: '', grupo_desc: '', categoria: '', cta_cont: 0 },
    codigo: 0,
    tipo: '',
    presentacion: '',
    visible: 1,
  };

  const defaultAgencia: AgenciaProps = {
    _id: '',
    item: 0,
    nombre: '',
    cod: 0,
    coordinador: '',
    director: '',
  };

  const AddProductDialog = (
    <Dialog open={open} onClose={handleClose}>
      <DialogContent>
        <CreateStockView
          onClose={handleClose}
          onSave={async (productData) => {
            // Asegúrate de que productData contenga los objetos
            const product: StockProps = {
              _id: '', // ID del stock, puedes generarlo o dejarlo vacío si se genera en el backend
              producto: { ...defaultProduct, ...productData.producto }, // Combina el producto por defecto con el recibido
              agencia: { ...defaultAgencia, ...productData.agencia }, // Combina la agencia por defecto con la recibida
              stock: productData.stock,
              valor_unitario: productData.valor_unitario,
              valor_promedio: productData.valor_promedio,
            };

            await onSave(product); // Llama a la función para guardar el producto
            handleClose(); // Cierra el modal
          }}
          product={{
            _id: '',
            producto: defaultProduct,
            agencia: defaultAgencia,
            stock: 0,
            valor_unitario: 0,
            valor_promedio: 0,
          }}
        />
      </DialogContent>
    </Dialog>
  );

  return { AddProductDialog, handleOpenAddProductModal: handleOpen };
}