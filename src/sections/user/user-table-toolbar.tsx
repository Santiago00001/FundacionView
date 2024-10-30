import type { SelectChangeEvent } from '@mui/material/Select';

import { useState } from 'react';

import Select from '@mui/material/Select';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Toolbar from '@mui/material/Toolbar';
import Popover from '@mui/material/Popover';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';

import { Iconify } from 'src/components/iconify';

type UserTableToolbarProps = {
  numSelected: number;
  filterName: string;
  onFilterName: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onClearFilter: () => void;
  onAddUser: () => void;
  selectedRol: string;
  onSelectRol: (event: SelectChangeEvent<string>) => void;
  selectedStatus: string;
  onSelectStatus: (event: SelectChangeEvent<string>) => void;
  selectedCargo: string;
  onSelectCargo: (event: SelectChangeEvent<string>) => void;
  searchField: string;
  onSearchFieldChange: (event: SelectChangeEvent<string>) => void;
};

export function UserTableToolbar({
  numSelected,
  filterName,
  onFilterName,
  onClearFilter,
  onAddUser,
  selectedRol,
  onSelectRol,
  selectedStatus,
  onSelectStatus,
  selectedCargo,
  onSelectCargo,
  searchField,
  onSearchFieldChange,
}: UserTableToolbarProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClearFilters = () => {
    onClearFilter();
    handleClose(); // Cerrar el popover después de limpiar
  };

  const open = Boolean(anchorEl);

  return (
    <Toolbar
      sx={{
        height: 96,
        display: 'flex',
        justifyContent: 'space-between',
        p: (theme) => theme.spacing(0, 1, 0, 3),
        ...(numSelected > 0 && {
          color: 'primary.main',
          bgcolor: 'primary.lighter',
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography component="div" variant="subtitle1">
          {numSelected} seleccionados
        </Typography>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {/* Select para escoger el campo de búsqueda */}
          <Select
            value={searchField}
            onChange={onSearchFieldChange} // Cambiar el campo de búsqueda
            displayEmpty
            sx={{ marginRight: 2, minWidth: 120 }}
          >
            <MenuItem value="nombres">Nombres</MenuItem>
            <MenuItem value="cc">Cedula</MenuItem>
            <MenuItem value="item">Item</MenuItem>
            <MenuItem value="agencia">Agencia</MenuItem>
          </Select>

          {/* Input para escribir el valor de búsqueda */}
          <OutlinedInput
            fullWidth
            value={filterName}
            onChange={onFilterName}
            placeholder={`Buscar por ${searchField}...`}
            startAdornment={
              <InputAdornment position="start">
                <Iconify width={20} icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
              </InputAdornment>
            }
            sx={{ maxWidth: 320 }}
          />
        </div>
      )}

      {numSelected > 0 ? (
        <Tooltip title="Eliminar">
          <IconButton>
            <Iconify icon="solar:trash-bin-trash-bold" />
          </IconButton>
        </Tooltip>
      ) : (
        <>
          <Tooltip title="Filtrar lista">
            <IconButton onClick={handleClick}>
              <Iconify icon="ic:round-filter-list" />
            </IconButton>
          </Tooltip>
          <Popover
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
          >
            <div style={{ padding: '16px', display: 'flex', flexDirection: 'column' }}>
              <Select
                value={selectedRol}
                onChange={onSelectRol}
                displayEmpty
                sx={{ minWidth: 120, marginBottom: 2, fontSize: '0.875rem' }}
              >
                <MenuItem value="">
                  <em>Rol</em>
                </MenuItem>
                <MenuItem value="Admin">Admin</MenuItem>
                <MenuItem value="Agencia">Agencia</MenuItem>
                <MenuItem value="Coordinacion">Coordinacion</MenuItem>
                <MenuItem value="Jefatura">Jefatura</MenuItem>
                <MenuItem value="Almacenista">Almacenista</MenuItem>
              </Select>
              <Select
                value={selectedStatus}
                onChange={onSelectStatus}
                displayEmpty
                sx={{ minWidth: 120, marginBottom: 2, fontSize: '0.875rem' }}
              >
                <MenuItem value="">
                  <em>Estado</em>
                </MenuItem>
                <MenuItem value="activo">Activo</MenuItem>
                <MenuItem value="inactivo">Inactivo</MenuItem>
              </Select>
              <Select
                value={selectedCargo}
                onChange={onSelectCargo}
                displayEmpty
                sx={{ minWidth: 120, marginBottom: 2, fontSize: '0.875rem' }}
              >
                <MenuItem value="">
                  <em>Cargo</em>
                </MenuItem>
                <MenuItem value="DIRECTOR DE AGENCIA">DIRECTOR DE AGENCIA</MenuItem>
                <MenuItem value="JEFE ÁREA REPORTES">JEFE ÁREA REPORTES</MenuItem>
                <MenuItem value="JEFE DEPARTAMENTO">JEFE DEPARTAMENTO</MenuItem>
                <MenuItem value="DIRECTOR GENERAL">DIRECTOR GENERAL</MenuItem>
                <MenuItem value="OFICIAL DE CUMPLIMIENTO">OFICIAL DE CUMPLIMIENTO</MenuItem>
                <MenuItem value="COORDINADOR DE AGENCIAS">COORDINADOR DE AGENCIAS</MenuItem>
              </Select>
              <Button
                variant="contained"
                onClick={handleClearFilters}
                sx={{ marginTop: 2, fontSize: '0.875rem' }}
              >
                Borrar Filtros
              </Button>
            </div>
          </Popover>
        </>
      )}
    </Toolbar>
  );
}