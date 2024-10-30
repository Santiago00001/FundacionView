import type { SelectChangeEvent } from '@mui/material/Select';

import { useState } from 'react';

import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import Tooltip from '@mui/material/Tooltip';
import Toolbar from '@mui/material/Toolbar';
import Popover from '@mui/material/Popover';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';

import { Iconify } from 'src/components/iconify';

type ProviderTableToolbarProps = {
  numSelected: number;
  filterName: string;
  onFilterName: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onClearFilter: () => void;
  onAddProduct: () => void;
  selectedIns: boolean | null; // Ahora acepta null para el estado sin seleccionar
  onSelectedIns: (event: SelectChangeEvent<string>) => void;
  selectedDat: boolean | null; // Ahora acepta null para el estado sin seleccionar
  onSelectedDat: (event: SelectChangeEvent<string>) => void;
  searchField: string;
  onSearchFieldChange: (event: SelectChangeEvent<string>) => void;
};

export function ProviderTableToolbar({
  numSelected,
  filterName,
  onFilterName,
  onClearFilter,
  onAddProduct,
  selectedIns,
  onSelectedIns,
  selectedDat,
  onSelectedDat,
  searchField,
  onSearchFieldChange,
}: ProviderTableToolbarProps) {
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
            <MenuItem value="Razon Social">Razon Social</MenuItem>
            <MenuItem value="Nit">Nit</MenuItem>
            <MenuItem value="Item">Item</MenuItem>
            <MenuItem value="Celular">Celular</MenuItem>
            <MenuItem value="Telefono">Telefono</MenuItem>
            <MenuItem value="Correo">Correo</MenuItem>
            <MenuItem value="Contacto">Contacto</MenuItem>
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
                value={selectedIns !== null ? String(selectedIns) : ""}
                onChange={onSelectedIns}
                displayEmpty
                sx={{ minWidth: 120, marginBottom: 2, fontSize: '0.875rem' }}
              >
                <MenuItem value="">
                  <em>Verificación Inspektor</em> 
                </MenuItem>
                <MenuItem value="true">Activo</MenuItem>
                <MenuItem value="false">Vencido</MenuItem>
              </Select>

              <Select
                value={selectedDat !== null ? String(selectedDat) : ""}
                onChange={onSelectedDat}
                displayEmpty
                sx={{ minWidth: 120, marginBottom: 2, fontSize: '0.875rem' }}
              >
                <MenuItem value="">
                  <em>Verificación DataCredito</em> 
                </MenuItem>
                <MenuItem value="true">Activo</MenuItem>
                <MenuItem value="false">Vencido</MenuItem>
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
