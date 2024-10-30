import type { SelectChangeEvent } from '@mui/material';
import type { UserProps } from 'src/sections/user/user-table-row';

import axios from 'axios';
import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import DialogContentText from '@mui/material/DialogContentText';

import { useCreateAgencyDialog } from 'src/hooks/age-create-dialog';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

import { TableNoData } from '../table-no-data';
import { applyFilter, getComparator } from '../utils';
import { EditAgencyView } from './agency-edit-dialog';
import { AgencyTableHead } from '../agency-table-head';
import { AgencyTableToolbar } from '../agency-table-toolbar';
import { AgencyTableRow, type AgenciaProps } from '../agency-table-row';

export function AgencyView() {
  const [filterName, setFilterName] = useState<string>('');
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [selectedCoor, setSelectedCoor] = useState<string>('');
  const [agencies, setAgencies] = useState<AgenciaProps[]>([]); // Estado para agencias
  const [users, setUsers] = useState<UserProps[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedAgency, setSelectedAgency] = useState<AgenciaProps | null>(null);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openConfirmDialog, setOpenConfirmDialog] = useState<boolean>(false);
  const [agencyToDelete, setAgencyToDelete] = useState<AgenciaProps | null>(null);
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [orderBy, setOrderBy] = useState<string>('item');
  const [searchField, setSearchField] = useState("Codigo");

  const handleSaveAgency = async (agency: AgenciaProps): Promise<void> => {
    if (agency._id) {
      // Actualizar agencia existente
      try {
        const response = await axios.put(`${import.meta.env.VITE_APP_API_URL}api/agencys/${agency._id}`, agency);
        const updatedAgency: AgenciaProps = response.data;

        setAgencies((prev) =>
          prev.map((a) => (a._id === updatedAgency._id ? updatedAgency : a))
        );

        setEditMode(false);
        setSelectedAgency(null);
      } catch (error) {
        console.error('Error actualizando la agencia:', error);
        alert('Hubo un error actualizando la agencia, por favor intente de nuevo.');
      }
    } else {
      // Crear nueva agencia
      try {
        const response = await axios.post(`${import.meta.env.VITE_APP_API_URL}api/agencys`, agency);
        const newAgency: AgenciaProps = response.data;

        setAgencies((prev) => [...prev, newAgency]);
        setEditMode(false);
      } catch (error) {
        console.error('Error creando la agencia:', error);
        alert('Hubo un error creando la agencia, por favor intente de nuevo.');
      }
    }
  };

  const handleSelectRow = (id: string) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected: string[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  const table = {
    selected,
    page,
    rowsPerPage,
    onSelectRow: handleSelectRow,
    onResetPage: () => setPage(0),
    onChangePage: (event: unknown, newPage: number) => setPage(newPage),
    onChangeRowsPerPage: (event: React.ChangeEvent<HTMLInputElement>) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      setPage(0);
    },
  };

  const { AddAgencyDialog, handleOpenAddAgencyModal } = useCreateAgencyDialog(handleSaveAgency, users); // Cambia a `useCreateAgencyDialog`

  useEffect(() => {
    const fetchUsersAndAgencies = async () => {
      try {
        const [usersResponse, agenciesResponse] = await Promise.all([
          axios.get(`${import.meta.env.VITE_APP_API_URL}api/users`),
          axios.get(`${import.meta.env.VITE_APP_API_URL}api/agencys`),
        ]);
        setUsers(usersResponse.data);
        setAgencies(agenciesResponse.data); // Guardar agencias en el estado
      } catch (error) {
        console.error('Error fetching users or agencies:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsersAndAgencies();
  }, []);

   const dataFiltered: AgenciaProps[] = applyFilter({
    inputData: agencies,
    comparator: getComparator(order, orderBy), // Asegúrate de usar el estado actual
    filterName,
    selectedUser,
    selectedCoor,
    searchField,
    users,
  });

  const handleRequestSort = (property: string) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const notFound = !dataFiltered.length && !!filterName;

  const handleClearFilter = () => {
    setFilterName('');
    setSelectedUser('');
    setSelectedCoor('');
    setSearchField('Codigo');
  };

  const handleSearchFieldChange = (event: SelectChangeEvent<string>) => {
    setSearchField(event.target.value); // Asegúrate de manejar correctamente el evento
  };

  const handleEditAgency = (agency: AgenciaProps) => {
    setSelectedAgency(agency);
    setEditMode(true);
  };

  const handleDeleteAgency = async () => {
    if (agencyToDelete) {
      try {
        await axios.delete(`${import.meta.env.VITE_APP_API_URL}api/agencys/${agencyToDelete._id}`);
        setAgencies((prev) => prev.filter(a => a._id !== agencyToDelete._id));
        handleCloseConfirmDialog(); // Cerrar el modal después de eliminar
      } catch (error) {
        console.error('Error eliminando la agencia:', error);
      }
    }
  };

  const handleOpenConfirmDialog = (agency: AgenciaProps) => {
    setAgencyToDelete(agency);
    setOpenConfirmDialog(true);
  };

  const handleCloseConfirmDialog = () => {
    setOpenConfirmDialog(false);
    setAgencyToDelete(null);
  };

  return (
    <DashboardContent>
      <Box display="flex" alignItems="center" mb={5}>
        <Typography variant="h4" flexGrow={1}>
          Dependencias
        </Typography>
        <Button
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="mingcute:add-line" />}
          onClick={handleOpenAddAgencyModal} // Abrir modal para agregar nueva agencia
        >
          Nueva Dependencia
        </Button>
      </Box>

      <Card>
        <AgencyTableToolbar
          numSelected={0} // Ajustar según tu implementación
          filterName={filterName}
          onFilterName={(event: React.ChangeEvent<HTMLInputElement>) => {
            setFilterName(event.target.value);
          }}
          onClearFilter={handleClearFilter}
          onAddAgency={handleOpenAddAgencyModal} // Vinculado a la función de abrir el modal
          selectedCoor={selectedCoor}
          onSelectCoor={(event) => setSelectedCoor(event.target.value as string)}
          agencies={agencies} 
          searchField={searchField}
          onSearchFieldChange={handleSearchFieldChange}
          />
        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <AgencyTableHead
                order={order}
                orderBy={orderBy}
                rowCount={users.length}
                numSelected={0}
                onSort={handleRequestSort} // Pasa el manejador aquí
                onSelectAllRows={() => { }}
                headLabel={[
                  { id: 'item', label: 'Id', align: 'center' }, // Puede ser un string, pero no colidir con UserProps
                  { id: 'nombre', label: 'Nombre' },
                  { id: 'cod', label: 'Codigo' },
                  { id: 'coordinador', label: 'Coordinador' },
                  { id: 'director', label: 'Funcionario' },
                  { id: ''},
                ]}
              />
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center">Cargando...</TableCell>
                  </TableRow>
                ) : (
                  dataFiltered
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) => (
                      <AgencyTableRow
                        key={row._id}
                        row={row}
                        selected={false} // Ajustar selección si es necesario
                        onSelectRow={() => handleSelectRow(row._id)}
                        onEditAgency={handleEditAgency}
                        onDeleteAgency={async () => handleOpenConfirmDialog(row)}
                        users={users}
                      />
                    ))
                )}
                {notFound && <TableNoData searchQuery={filterName} />}
              </TableBody>

            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          component="div"
          count={dataFiltered.length}
          page={page}
          onPageChange={table.onChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={table.onChangeRowsPerPage}
        />
      </Card>

      {/* Modal de confirmación para eliminar usuario */}
      <Dialog
        open={openConfirmDialog}
        onClose={handleCloseConfirmDialog}
      >
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Estás seguro de que deseas eliminar a {agencyToDelete?.nombre}? Esta acción no se puede deshacer.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmDialog} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleDeleteAgency} color="secondary">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal para editar la agencia */}
      <Dialog open={editMode} onClose={() => setEditMode(false)}>
        <DialogContent>
          {selectedAgency && (
            <EditAgencyView
              agency={selectedAgency}
              onClose={() => setEditMode(false)}
              onSave={handleSaveAgency}
              users={users}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Modal para agregar usuario */}
      {AddAgencyDialog()}

    </DashboardContent>
  );
}