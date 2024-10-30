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

import type { UserProps } from '../user/user-table-row';

export type DirectorProps = {
  _id: string;
  nombres: string;
  apellidos: string;
  cargo: string;
};

export type AgenciaProps = {
  _id: string;
  item: number;
  cod: number;
  nombre: string;
  coordinador: string;
  director: string;
};

export type AgencyTableRowProps = {
  row: AgenciaProps;
  selected: boolean;
  onSelectRow: () => void;
  onEditAgency: (agency: AgenciaProps) => void;
  onDeleteAgency: (id: string) => Promise<void>;
  users: UserProps[];
};

export function AgencyTableRow({ row, selected, users, onSelectRow, onEditAgency, onDeleteAgency }: AgencyTableRowProps) {
  const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(null);

  const handleOpenPopover = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    setOpenPopover(event.currentTarget);
  }, []);

  const handleClosePopover = useCallback(() => {
    setOpenPopover(null);
  }, []);

  const handleEdit = () => {
    onEditAgency(row);
    handleClosePopover();
  };

  const handleDelete = () => {
    onDeleteAgency(row._id);
    handleClosePopover();
  };

  const director = users.find((user) => user._id === row.director);
  console.log(director)
  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={onSelectRow} />
        </TableCell>
        <TableCell align="center">{row.item}</TableCell> {/* Celda para el número de la fila */}
        <TableCell component="th" scope="row">
          <Box gap={2} display="flex" alignItems="center">
            <Avatar alt={row.nombre} sx={{ bgcolor: 'primary.main' }}>
              {row.nombre.charAt(0)} {/* Inicial del nombre de la agencia */}
            </Avatar>
            {row.nombre}
          </Box>
        </TableCell>

        <TableCell>{row.cod}</TableCell>
        <TableCell>{row.coordinador}</TableCell>
        <TableCell>{director ? `${director.firstName} ${director.lastName}` : 'Sin director'}</TableCell>
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