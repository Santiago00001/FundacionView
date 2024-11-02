import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import { Tooltip } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import MenuList from '@mui/material/MenuList';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import MenuItem, { menuItemClasses } from '@mui/material/MenuItem';

import { Iconify } from 'src/components/iconify';

export type FoundationProps = {
  _id: string;
  nit: string;
  razon_social: string;
  address: string;
  departament: string;
  city: string;
  commune: string;
  email: string;
  date_create: Date;
  vision?: string;
  adminId: string;
  statusDelete?: boolean;
};


export type ProviderTableRowProps = {
  row: FoundationProps; // Datos del producto
  selected: boolean; // Estado de selección
  onSelectRow: () => void; // Función para seleccionar la fila
  onEditProduct: (provider: FoundationProps) => void; // Función para editar el producto
  onDeleteProduct: (id: string) => Promise<void>; // Función para eliminar el producto
  index: number;
};

export function ProviderTableRow({ row, index, selected, onSelectRow, onEditProduct, onDeleteProduct }: ProviderTableRowProps) {
  const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(null);

  const handleOpenPopover = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    setOpenPopover(event.currentTarget);
  }, []);

  const handleClosePopover = useCallback(() => {
    setOpenPopover(null);
  }, []);

  const handleEdit = () => {
    onEditProduct(row);
    handleClosePopover();
  };

  const handleDelete = () => {
    onDeleteProduct(row._id);
    handleClosePopover();
  };

  const formatDateToSpanish = (dateString: string) => {
    const monthsInEnglish = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthsInSpanish = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

    const utcDate = dateString.split(' ');
    const monthIndex = monthsInEnglish.indexOf(utcDate[2]); // Obtiene el índice del mes en inglés
    if (monthIndex !== -1) {
      utcDate[2] = monthsInSpanish[monthIndex]; // Reemplaza con el mes en español
    }

    return utcDate.slice(1, 4).join(' '); // Devuelve el formato 'DD MMM YYYY'
  };

  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={onSelectRow} />
        </TableCell>

        <TableCell align="center">{index}</TableCell> {/* Celda para el número de la fila */}

        <TableCell sx={{ minWidth: 130 }} >{row.nit}</TableCell>

        <TableCell component="th" scope="row">
          <Box gap={2} display="flex" alignItems="center">
            <Avatar alt={row.razon_social} />
            {row.razon_social}
          </Box>
        </TableCell>

        <TableCell sx={{ minWidth: 180 }}>{row.address}</TableCell>
        <TableCell>{row.departament}</TableCell>
        <TableCell>{row.city}</TableCell>
        <TableCell>{row.commune}</TableCell>
        <TableCell>{row.email}</TableCell>

        <TableCell sx={{ minWidth: 120 }}>
          {formatDateToSpanish(new Date(row.date_create).toUTCString())}
        </TableCell>

        <TableCell sx={{ minWidth: 50, maxWidth: 200, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          <Tooltip title={row.vision}>
            <span>{row.vision}</span>
          </Tooltip>
        </TableCell>

        <TableCell sx={{ minWidth: 150 }}>{row.adminId}</TableCell>

        {/* <TableCell align="center">
          {row.ver_ins ? (
            <Iconify width={22} icon="solar:check-circle-bold" sx={{ color: 'success.main' }} />
          ) : (
            <Iconify width={22} icon="mdi:close-circle" sx={{ color: 'error.main' }} />
          )}
        </TableCell> */}

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
            width: 200,
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
            Editar Proveedor
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