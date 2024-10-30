import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import MenuList from '@mui/material/MenuList';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import MenuItem, { menuItemClasses } from '@mui/material/MenuItem';

import { Iconify } from 'src/components/iconify';

import type { AgenciaProps } from '../agencys/agency-table-row';
import type { ProductProps } from '../product/product-table-row';

export type StockProps = {
  _id: string;
  producto: ProductProps;
  agencia: AgenciaProps;
  stock: number;
  valor_unitario: number;
  valor_promedio: number;
};

export type StockTableRowProps = {
  row: StockProps; // Datos del producto
  selected: boolean; // Estado de selección
  onSelectRow: () => void; // Función para seleccionar la fila
  onEditProduct: (product: StockProps) => void; // Función para editar el producto
  onDeleteProduct: (id: string) => Promise<void>; // Función para eliminar el producto
};

export function StockTableRow({ row, selected, onSelectRow, onEditProduct, onDeleteProduct }: StockTableRowProps) {
  const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(null);

  const handleOpenPopover = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    setOpenPopover(event.currentTarget);
  }, []);

  const handleClosePopover = useCallback(() => {
    setOpenPopover(null);
  }, []);

  const handleEdit = () => {
    onEditProduct(row); // Llama al callback para editar el producto
    handleClosePopover();
  };

  const handleDelete = () => {
    onDeleteProduct(row._id); // Llama al callback para eliminar el producto por "item"
    handleClosePopover();
  };

  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={onSelectRow} />
        </TableCell>
        <TableCell align="center">{row.producto.item}</TableCell> {/* Celda para el número de la fila */}
        <TableCell component="th" scope="row">
          <Box gap={2} display="flex" alignItems="center">
            <Avatar alt={row.producto.nombre} />
            {row.producto.nombre}
          </Box>
        </TableCell>
        <TableCell>{row.agencia.nombre}</TableCell>
        <TableCell>{row.stock}</TableCell>
        <TableCell>{row.valor_unitario}</TableCell>
        <TableCell>{row.valor_promedio}</TableCell>
        <TableCell align="right">
          <IconButton onClick={handleOpenPopover}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <Popover
        open={!!openPopover}
        anchorEl={openPopover}
        onClose={handleClosePopover}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuList
          disablePadding
          sx={{
            p: 0.5,
            gap: 0.5,
            width: 140,
            display: 'flex',
            flexDirection: 'column',
            [`& .${menuItemClasses.root}`]: {
              px: 1,
              gap: 2,
              borderRadius: 0.75,
              [`&.${menuItemClasses.selected}`]: { bgcolor: 'action.selected' },
            },
          }}
        >
          <MenuItem onClick={handleEdit}>
            <Iconify icon="solar:pen-bold" />
            Editar
          </MenuItem>

          <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
            <Iconify icon="solar:trash-bin-trash-bold" />
            Eliminar
          </MenuItem>
        </MenuList>
      </Popover>
    </>
  );
}