import React from 'react';

import { Table, TableRow, TableBody, TableCell, TableHead, Typography, TableContainer } from '@mui/material';

import type { StockProps } from './stock-table-row';

type StockTableProps = {
  products: StockProps[];
};

export function StockTable({ products }: StockTableProps) {
  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Item</TableCell>
            <TableCell>Producto</TableCell>
            <TableCell>Agencia</TableCell>
            <TableCell>Stock</TableCell>
            <TableCell>Valor Unitario</TableCell>
            <TableCell>Valor Promedio</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.producto.codigo}>
              <TableCell>
                <Typography variant="body2">{product.producto.item}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle2">{product.producto.nombre}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2">{product.agencia.nombre}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2">{product.stock}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2">{product.valor_unitario}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2">{product.valor_promedio}</Typography>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}