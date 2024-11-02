// eslint-disable-next-line import/no-extraneous-dependencies
import type { SelectChangeEvent } from '@mui/material';

// eslint-disable-next-line import/no-extraneous-dependencies
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
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination'; // Asegúrate de que está importado

import DialogContent from '@mui/material/DialogContent';

import { useCreateProviderDialog } from 'src/hooks/use-provider-dialog';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

import { applyFilter, getComparator } from 'src/sections/providers/utils';

import { TableNoData } from '../providers-no-data';
import { ProviderTableRow } from '../provider-table-row'; // Asegúrate de que sea el componente correcto

import { EditProviderView } from './provider-edit-dialog';
import { ProviderTableHead } from '../provider-table-head';
import { ProviderTableToolbar } from '../provider-filters';

import type { FoundationProps } from '../provider-table-row';

export function ProviderView() {
  const [filterName, setFilterName] = useState<string>('');
  const [providers, setProviders] = useState<FoundationProps[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedProduct, setSelectedProduct] = useState<FoundationProps | null>(null);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedIns, setSelectedIns] = useState<boolean | null>(null);
  const [selectedDat, setSelectedDat] = useState<boolean | null>(null);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [orderBy, setOrderBy] = useState<string>('item');
  const [searchField, setSearchField] = useState("Razon Social");
  const [departamentosData, setDepartamentosData] = useState<{ departamento: string; ciudades: string[]; }[]>([]);
  const [codigosCiiu, setcodigosCiiu] = useState<{ act_eco: string; cod_ciiu: number; }[]>([]);
  const [bankOptions, setbankOptions] = useState<{ cod_bank: number; banco: string; }[]>([]);
  const { enqueueSnackbar } = useSnackbar();

  const handleSelectRow = (id: string) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]
    );
  };

  // Función para comparar y obtener los campos que han cambiado
  const getUpdatedFields = (original: FoundationProps, updated: FoundationProps) => {
    const changes: Partial<FoundationProps> = {};

    Object.keys(updated).forEach(key => {
      // Compara los valores y asegúrate de que los tipos son compatibles
      const originalValue = original[key as keyof FoundationProps];
      const updatedValue = updated[key as keyof FoundationProps];

      if (originalValue !== updatedValue) {
        changes[key as keyof FoundationProps] = updatedValue as any; // Afirmar que puede ser cualquier tipo
      }
    });

    return changes;
  };

  const handleSaveProduct = async (updatedProvider: FoundationProps): Promise<void> => {
    if (updatedProvider._id) {
      try {
        const originalProvider = providers.find(p => p._id === updatedProvider._id);

        if (originalProvider) {
          const updatedFields = getUpdatedFields(originalProvider, updatedProvider);

          if (Object.keys(updatedFields).length > 0) {
            const response = await axios.put(`${import.meta.env.VITE_APP_API_URL}api/providers/${updatedProvider._id}`, updatedFields);
            const updatedProduct: FoundationProps = response.data;

            setProviders((prev) =>
              prev.map((p) => (p._id === updatedProduct._id ? updatedProduct : p))
            );
          }
          setEditMode(false);
          setSelectedProduct(null);
        }
      } catch (error) {
        console.error('Error actualizando el producto:', error);
        enqueueSnackbar(`Error al actualizar el proveedor: ${error.response?.data?.message || 'Error desconocido.'}`, { variant: 'warning' });
      }
    } else {
      // Si es un nuevo proveedor, lo creamos
      try {
        const response = await axios.post(`${import.meta.env.VITE_APP_API_URL}api/providers`, updatedProvider);
        const newProvider: FoundationProps = response.data;

        setProviders((prev) => [...prev, newProvider]);
        setEditMode(false);
      } catch (error) {
        console.error('Error creando el producto:', error);
        enqueueSnackbar(`Error al crear el proveedor: ${error.response?.data?.message || 'Error desconocido.'}`, { variant: 'warning' });
      }
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_APP_API_URL}api/foundations`);
      if (response.status !== 200) {
        throw new Error('Network response was not ok');
      }
      const { data } = response;

      setProviders(data); // Establecer los proveedores actualizados en el estado
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartamentos = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_APP_API_URL}api/citys`);
      const transformedData = response.data.map((item: any) => ({
        departamento: item.departamento,
        ciudades: item.ciudades || [],
      }));
      setDepartamentosData(transformedData); // Establece los departamentos
    } catch (error) {
      console.error('Error fetching departamentos:', error);
    }
  };

  const fetchCodigoCiiu = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_APP_API_URL}api/ciiu`);
      const transformedData = response.data.map((item: any) => ({
        act_eco: item.act_eco,
        cod_ciiu: item.cod_ciiu,
      }));
      setcodigosCiiu(transformedData); // Establece los códigos CIIU
    } catch (error) {
      console.error('Error fetching codigos CIIU:', error);
    }
  };

  const fetchBank = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_APP_API_URL}api/bank`);
      const transformedData = response.data.map((item: any) => ({
        cod_bank: item.cod_bank,
        banco: item.banco,
      }));
      setbankOptions(transformedData); // Establece los códigos CIIU
    } catch (error) {
      console.error('Error fetching bank options:', error);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchDepartamentos();
    fetchCodigoCiiu();
    fetchBank();
  }, []);

  const dataFiltered: FoundationProps[] = applyFilter({
    inputData: providers,
    comparator: getComparator(order, orderBy), // Asegúrate de usar el estado actual
    filterName,
    selectedIns,
    selectedDat,
    searchField,
  });

  const handleRequestSort = (property: string) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const notFound = !dataFiltered.length && !!filterName;

  const handleClearFilter = () => {
    setFilterName('');
    setSelectedIns(null);
    setSelectedDat(null);
    setSearchField('Razon Social');
  };

  const handleSearchFieldChange = (event: SelectChangeEvent<string>) => {
    setSearchField(event.target.value); // Asegúrate de manejar correctamente el evento
  };

  const handleEditProduct = (provider: FoundationProps) => {
    setSelectedProduct(provider);
    setEditMode(true); // Abre el diálogo al editar
  };

  const handleCloseEditDialog = () => {
    setEditMode(false);
    setSelectedProduct(null); // Limpiar el producto seleccionado
  };

  const handleDeleteProduct = async (_id: string) => {
    const confirmDelete = window.confirm("¿Estás seguro de que deseas eliminar este producto?");
    if (confirmDelete) {
      try {
        await axios.delete(`${import.meta.env.VITE_APP_API_URL}api/providers/${_id}`);
        setProviders((prev) => prev.filter(provider => provider._id !== _id));
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  const { AddProductDialog, handleOpenAddProductModal } = useCreateProviderDialog(handleSaveProduct);

  // Cambia la forma en que llamas a handleOpenAddProductModal
  const handleOpenAddProductModalWithData = () => {
    handleOpenAddProductModal(departamentosData);
  };

  return (
    <DashboardContent>
      <Box display="flex" alignItems="center" mb={5}>
        <Typography variant="h4" flexGrow={1}>
          Proveedores
        </Typography>
        <Button
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="mingcute:add-line" />}
          onClick={handleOpenAddProductModalWithData}
        >
          Nuevo proveedor
        </Button>
      </Box>

      <Card>
        <ProviderTableToolbar
          numSelected={0}
          filterName={filterName}
          onFilterName={(event: React.ChangeEvent<HTMLInputElement>) => {
            setFilterName(event.target.value);
          }}
          onClearFilter={handleClearFilter}
          onAddProduct={handleOpenAddProductModalWithData}

          selectedIns={selectedIns}
          onSelectedIns={(event: SelectChangeEvent<string>) => {
            const { value } = event.target;
            setSelectedIns(value === "" ? null : value === "true"); // Manejo de null cuando no hay selección
          }}

          selectedDat={selectedDat}
          onSelectedDat={(event: SelectChangeEvent<string>) => {
            const { value } = event.target;
            setSelectedDat(value === "" ? null : value === "true"); // Manejo de null cuando no hay selección
          }}

          searchField={searchField}
          onSearchFieldChange={handleSearchFieldChange}
        />

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <ProviderTableHead
                order={order}
                orderBy={orderBy}
                rowCount={providers.length}
                numSelected={0}
                onSort={handleRequestSort} // Pasa el manejador aquí
                onSelectAllRows={() => { }}
                headLabel={[
                  { id: 'index', label: 'ID', align: 'center' },
                  { id: 'nit', label: 'Nit' },
                  { id: 'razon_social', label: 'Razón Social' },
                  { id: 'address', label: 'Direccion' },
                  { id: 'departament', label: 'Departamento' },
                  { id: 'city', label: 'Ciudad' },
                  { id: 'commune', label: 'Comuna' },
                  { id: 'email', label: 'Correo' },
                  { id: 'date_create', label: 'Fecha Matricula' },
                  { id: 'vision', label: 'Vision' },
                  { id: 'adminId', label: 'Administrador' },
                  { id: '' },
                ]}
              />
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">Cargando...</TableCell>
                  </TableRow>
                ) : (
                  dataFiltered
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) => (
                      <ProviderTableRow
                        key={row._id}
                        row={row}
                        index={index + 1}
                        selected={selectedRows.includes(row._id)} // Indica si la fila está seleccionada
                        onSelectRow={() => handleSelectRow(row._id)} // Manejo de selección de fila
                        onEditProduct={handleEditProduct}
                        onDeleteProduct={handleDeleteProduct}
                      />
                    ))
                )}
                {notFound && (
                  <TableNoData
                    title="No hay productos encontrados"
                    searchQuery={filterName} // Aquí se pasa la propiedad requerida
                    sx={{
                      gridColumn: 'span 5',
                      textAlign: 'center',
                      color: 'text.secondary',
                    }}
                  />
                )}

              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 100, 500]}
          component="div"
          count={dataFiltered.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(event, newPage) => setPage(newPage)}
          onRowsPerPageChange={(event) => {
            setRowsPerPage(parseInt(event.target.value, 10));
            setPage(0);
          }}
        />
      </Card>
      {AddProductDialog}

      {/* Modal para editar el proveedor */}
      <Dialog open={editMode} onClose={handleCloseEditDialog}>
        <DialogContent>
          {selectedProduct && (
            <EditProviderView
              provider={selectedProduct}
              onClose={handleCloseEditDialog}
              onSave={handleSaveProduct}
              departamentosData={departamentosData}
              codigosCiiu={codigosCiiu}
              bankOptions={bankOptions}
            />
          )}
        </DialogContent>
      </Dialog>
    </DashboardContent>
  );
}