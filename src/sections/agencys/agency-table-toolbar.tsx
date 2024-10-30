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

import type { AgenciaProps } from './agency-table-row';

type AgencyTableToolbarProps = {
  numSelected: number;
  filterName: string;
  onFilterName: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onClearFilter: () => void;
  onAddAgency: () => void;
  agencies: AgenciaProps[]; // Añadir la lista de agencias como prop
  selectedCoor: string;
  onSelectCoor: (event: SelectChangeEvent<string>) => void;
  searchField: string;
  onSearchFieldChange: (event: SelectChangeEvent<string>) => void;
};

export function AgencyTableToolbar({
  numSelected,
  filterName,
  onFilterName,
  onClearFilter,
  onAddAgency,
  agencies, // Recibir la lista de agencias
  selectedCoor,
  onSelectCoor,
  searchField,
  onSearchFieldChange,
}: AgencyTableToolbarProps) {
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
            <MenuItem value="Nombre">Nombre</MenuItem>
            <MenuItem value="Item">Item</MenuItem>
            <MenuItem value="Codigo">Codigo</MenuItem>
            <MenuItem value="Director">Director</MenuItem>
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
                value={selectedCoor}
                onChange={onSelectCoor}
                displayEmpty
                sx={{ minWidth: 120, marginBottom: 2, fontSize: '0.875rem' }}
              >
                <MenuItem value="">
                  <em>Coordinador</em>
                </MenuItem>
                <MenuItem value="C9">Coordinador 9</MenuItem>
                <MenuItem value="C5">Coordinador 5</MenuItem>
                <MenuItem value="C4">Coordinador 4</MenuItem>
                <MenuItem value="C3">Coordinador 3</MenuItem>
                <MenuItem value="C2">Coordinador 2</MenuItem>
                <MenuItem value="C1">Coordinador 1</MenuItem>
                <MenuItem value="NA">No Aplica</MenuItem>
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