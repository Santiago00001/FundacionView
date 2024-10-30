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

export type ProductProps = {
  _id: string;
  item: number;
  nombre: string;
  categoria_id: Category;
  codigo: number;
  tipo: string;
  presentacion: string;
  visible: number;
};

export type Category = {
  _id: string;
  grupo_desc: string;
  categoria: string;
  cta_cont: number;
}

export type ProductTableRowProps = {
  row: ProductProps; // Datos del producto
  selected: boolean; // Estado de selección
  onSelectRow: () => void; // Función para seleccionar la fila
  onEditProduct: (product: ProductProps) => void; // Función para editar el producto
  onDeleteProduct: (id: string) => Promise<void>; // Función para eliminar el producto
};

export function ProductTableRow({ row, selected, onSelectRow, onEditProduct, onDeleteProduct }: ProductTableRowProps) {
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
        <TableCell align="center">{row.item}</TableCell> {/* Celda para el número de la fila */}
        <TableCell component="th" scope="row">
          <Box gap={2} display="flex" alignItems="center">
            <Avatar alt={row.nombre} />
            {row.nombre}
          </Box>
        </TableCell>
        <TableCell>{row.categoria_id?.cta_cont}</TableCell>
        <TableCell>{row.codigo}</TableCell>
        <TableCell>{row.categoria_id?.categoria}</TableCell>
        <TableCell>{row.categoria_id?.grupo_desc}</TableCell>
        <TableCell>{row.tipo}</TableCell>
        <TableCell>{row.presentacion}</TableCell>
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