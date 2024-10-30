// UserView.tsx
import type { SelectChangeEvent } from '@mui/material';

import axios from 'axios';
import { useSnackbar } from 'notistack';
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

import { useCreateUserDialog } from 'src/hooks/use-create-dialog';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

import { TableNoData } from '../table-no-data';
import { UserTableRow } from '../user-table-row';
import { EditUserView } from './user-edit-dialog';
import { UserTableHead } from '../user-table-head';
import { EditStatusView } from './status-edit-dialog';
import { applyFilter, getComparator } from '../utils';
import { UserTableToolbar } from '../user-table-toolbar';

import type { RoleProps, UserProps } from '../user-table-row';

export function UserView() {
  const [filterName, setFilterName] = useState<string>('');
  const [selectedRol, setSelectedRol] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [selectedCargo, setSelectedCargo] = useState<string>('');
  const [users, setUsers] = useState<UserProps[]>([]);
  const [role, setRole] = useState<RoleProps[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedUser, setSelectedUser] = useState<UserProps | null>(null);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [editModeStatus, setEditModeStatus] = useState<boolean>(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [orderBy, setOrderBy] = useState<string>('item');
  const [searchField, setSearchField] = useState("nombres");
  const { enqueueSnackbar } = useSnackbar();


  const [openConfirmDialog, setOpenConfirmDialog] = useState<boolean>(false); // Controla la apertura del modal
  const [userToDelete, setUserToDelete] = useState<UserProps | null>(null); // Almacena el usuario que se va a eliminar

  const handleSaveUser = async (user: UserProps): Promise<void> => {
    if (user._id) {
      // Usuario existente
      try {
        if (user.status) {
          // Actualizar solo el estado del usuario
          await axios.put(`${import.meta.env.VITE_APP_API_URL}api/users/${user._id}/status`, { status: user.status });
          enqueueSnackbar('Estado actualizado correctamente!', { variant: 'success' });
          // Actualizar el estado del usuario en el estado local
          setUsers((prev) =>
            prev.map((u) => (u._id === user._id ? { ...u, status: user.status } : u))
          );
        } else {
          // Actualizar toda la información del usuario
          const response = await axios.put(`${import.meta.env.VITE_APP_API_URL}api/users/${user._id}`, user);
          enqueueSnackbar('Usuario actualizado correctamente!', { variant: 'success' });
          const updatedUser: UserProps = response.data;

          // Actualizar el usuario en el estado local
          setUsers((prev) =>
            prev.map((u) => (u._id === updatedUser._id ? updatedUser : u))
          );
        }

        setEditMode(false);
        setSelectedUser(null);
      } catch (error) {
        console.error('Error actualizando el usuario:', error);
        enqueueSnackbar('Hubo un error actualizando el usuario, por favor intente de nuevo.', { variant: 'warning' })
      }
    } else {
      // Crear nuevo usuario
      try {
        const response = await axios.post(`${import.meta.env.VITE_APP_API_URL}api/users`, user);
        enqueueSnackbar('Usuario guardado correctamente!', { variant: 'success' });
        const newUser: UserProps = response.data;

        setUsers((prev) => [...prev, newUser]);
        setEditMode(false);
      } catch (error) {
        console.error('Error creando el usuario:', error);
        enqueueSnackbar('Hubo un error creando el usuario, por favor intente de nuevo.', { variant: 'warning' })
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

  const { AddUserDialog, handleOpenAddUserModal } = useCreateUserDialog(handleSaveUser, role);

  useEffect(() => {
    const controller = new AbortController();

    // Ejecutar las llamadas directamente en el useEffect
    (async () => {
      try {
        const usersResponse = await axios.get(`${import.meta.env.VITE_APP_API_URL}api/users`, { signal: controller.signal });
        const roleResponse = await axios.get(`${import.meta.env.VITE_APP_API_URL}api/roles`, { signal: controller.signal });

        setUsers(usersResponse.data);
        setRole(roleResponse.data);
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('Error fetching users or agencies:', error);
        }
      } finally {
        setLoading(false);
      }
    })();

    return () => {
      controller.abort(); // Cancela la solicitud al desmontar
    };
  }, []);


  const dataFiltered: UserProps[] = applyFilter({
    inputData: users,
    comparator: getComparator(order, orderBy), // Asegúrate de usar el estado actual
    filterName,
    selectedRol,
    selectedStatus,
    selectedCargo,
    searchField,
  });

  const notFound = !dataFiltered.length && !!filterName;

  const handleClearFilter = () => {
    setFilterName('');
    setSelectedRol('');
    setSelectedStatus('');
    setSelectedCargo('');
    setSearchField('nombres');
  };

  const handleEditUser = (user: UserProps) => {
    setSelectedUser(user);
    setEditMode(true);
  };

  const handleEditUserStatus = (user: UserProps) => {
    setSelectedUser(user);
    setEditModeStatus(true);
  };

  const handleDeleteUser = async () => {
    if (userToDelete) {
      try {
        await axios.delete(`${import.meta.env.VITE_APP_API_URL}api/users/${userToDelete._id}`);
        setUsers((prev) => prev.filter(user => user._id !== userToDelete._id));
        handleCloseConfirmDialog(); // Cerrar el modal después de eliminar
      } catch (error) {
        console.error('Error eliminando el usuario:', error);
      }
    }
  };

  // Función para abrir el modal de confirmación
  const handleOpenConfirmDialog = (user: UserProps) => {
    setUserToDelete(user);
    setOpenConfirmDialog(true);
  };

  // Función para cerrar el modal de confirmación
  const handleCloseConfirmDialog = () => {
    setOpenConfirmDialog(false);
    setUserToDelete(null);
  };

  const handleRequestSort = (property: string) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSearchFieldChange = (event: SelectChangeEvent<string>) => {
    setSearchField(event.target.value); // Asegúrate de manejar correctamente el evento
  };

  return (
    <DashboardContent>
      <Box display="flex" alignItems="center" mb={5}>
        <Typography variant="h4" flexGrow={1}>
          Fundaciones
        </Typography>
        <Button
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="mingcute:add-line" />}
          onClick={handleOpenAddUserModal} // Abrir modal para agregar nuevo usuario
        >
          Nuevo usuario
        </Button>
      </Box>

      <Card>
        <UserTableToolbar
          numSelected={0} // Ajustar según tu implementación
          filterName={filterName}
          onFilterName={(event: React.ChangeEvent<HTMLInputElement>) => {
            setFilterName(event.target.value);
          }}
          onClearFilter={handleClearFilter}
          onAddUser={handleOpenAddUserModal} // Vinculado a la función de abrir el modal
          selectedRol={selectedRol}
          onSelectRol={(event) => setSelectedRol(event.target.value as string)}
          selectedStatus={selectedStatus}
          onSelectStatus={(event) => setSelectedStatus(event.target.value as string)}
          selectedCargo={selectedCargo}
          onSelectCargo={(event) => setSelectedCargo(event.target.value as string)}
          searchField={searchField}
          onSearchFieldChange={handleSearchFieldChange}
        />
        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <UserTableHead
                order={order}
                orderBy={orderBy}
                rowCount={dataFiltered.length}
                numSelected={0}
                onSort={handleRequestSort} // Pasa el manejador aquí
                onSelectAllRows={() => { }}
                headLabel={[
                  { id: 'item', label: 'Id', align: 'center' },
                  { id: 'firstName', label: 'Nombres' },
                  { id: 'lastName', label: 'Apellidos' },
                  { id: 'phoneNumber', label: 'Celular' },
                  { id: 'email', label: 'Correo' },
                  { id: 'roleId', label: 'Rol' },
                  { id: 'status', label: 'Estado' },
                  { id: '' },
                ]}
              />
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center">Cargando...</TableCell>
                  </TableRow>
                ) : (
                  dataFiltered
                    .slice(table.page * table.rowsPerPage, table.page * table.rowsPerPage + table.rowsPerPage)
                    .map((row) => (
                      <UserTableRow
                        key={row._id}
                        row={row}
                        selected={table.selected.includes(row._id.toString())}
                        onSelectRow={() => table.onSelectRow(row._id.toString())}
                        onEditUser={handleEditUser}
                        onEditStatus={() => handleEditUserStatus(row)} // Si quieres solo editar el estado
                        onDeleteUser={async () => handleOpenConfirmDialog(row)} // Abrir modal al eliminar
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
          page={table.page} // Asegúrate de que 'table.page' está definido
          count={users.length}
          rowsPerPage={table.rowsPerPage}
          onPageChange={table.onChangePage} // Asegúrate de que esta función está definida
          rowsPerPageOptions={[5, 10, 25, 100, 500]}
          onRowsPerPageChange={table.onChangeRowsPerPage} // Asegúrate de que esta función está definida
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
            ¿Estás seguro de que deseas eliminar a {userToDelete?.firstName} {userToDelete?.lastName}? Esta acción no se puede deshacer.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmDialog} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleDeleteUser} color="secondary">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>


      {/* Modal para editar usuario */}
      <Dialog open={editMode} onClose={() => setEditMode(false)}>
        <DialogContent>
          {selectedUser && (
            <EditUserView
              user={selectedUser}
              onClose={() => setEditMode(false)}
              onSave={handleSaveUser}
              role={role}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Modal para editar estado del usuario */}
      <Dialog open={editModeStatus} onClose={() => setEditModeStatus(false)}>
        <DialogContent>
          {selectedUser && (
            <EditStatusView
              user={selectedUser}
              onClose={() => setEditModeStatus(false)}
              onSave={handleSaveUser}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Modal para agregar usuario */}
      {AddUserDialog()}

    </DashboardContent>
  );
}