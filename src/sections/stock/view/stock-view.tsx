import axios from 'axios';
import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import { type SelectChangeEvent } from '@mui/material';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination'; // Asegúrate de que está importado

import type { ProductProps } from 'src/sections/product/product-table-row';

import DialogContent from '@mui/material/DialogContent';

import { useCreateProductDialog } from 'src/hooks/use-stock-create';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

import { applyFilter, getComparator } from 'src/sections/stock/utils';

import { TableNoData } from '../stock-no-data';
import { StockTableRow } from '../stock-table-row';
import { EditStockView } from './stock-edit-dialog';
import { StockTableHead } from '../stock-table-head';
import { StockTableToolbar } from '../stock-filters';

import type { StockProps } from '../stock-table-row';

export function StockView() {
  const [filterName, setFilterName] = useState<string>('');
  const [products, setProducts] = useState<ProductProps[]>([]);
  const [stock, setStock] = useState<StockProps[]>([]);
  const [agenciaId, setAgenciaId] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedProduct, setSelectedProduct] = useState<StockProps | null>(null);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedTipo, setSelectedTipo] = useState<string>('');
  const [selectedPresentacion, setSelectedPresentacion] = useState<string>('');
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [searchField, setSearchField] = useState("item");
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [orderBy, setOrderBy] = useState<string>('item');
  const [agencies, setAgencies] = useState<any[]>([]); // Estado para almacenar agencias

  const handleSelectRow = (id: number) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]
    );
  };

  const handleSaveProduct = async (product: StockProps): Promise<void> => {
    try {
      if (product._id) {
        const response = await axios.put(`${import.meta.env.VITE_APP_API_URL}api/products/${product._id}`, product);
        const updatedProduct: StockProps = response.data;
        setStock((prev) => prev.map((p) => (p._id === updatedProduct._id ? updatedProduct : p)));
      } else {
        const response = await axios.post(`${import.meta.env.VITE_APP_API_URL}api/products`, product);
        const newProduct: StockProps = response.data;
        setStock((prev) => [...prev, newProduct]);
      }
    } catch (error) {
      console.error('Error guardando el producto:', error);
      throw new Error('Failed to save product');
    }
  };

  const fetchStock = useCallback(async () => {
    if (!agenciaId) return;
    setLoading(true);

    try {
      const stocksResponse = await axios.get(`${import.meta.env.VITE_APP_API_URL}api/stock`, {
        params: { agenciaId },
      });

      if (stocksResponse.status !== 200) {
        throw new Error('Failed to fetch products');
      }

      setStock(stocksResponse.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }, [agenciaId]);

  useEffect(() => {
    fetchStock();
  }, [fetchStock]);

  const fetchAgencies = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_APP_API_URL}api/agencys`);
      if (response.status === 200) {
        setAgencies(response.data);
      }
    } catch (error) {
      console.error('Error fetching agencies:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      const [productsResponse] = await Promise.all([
        axios.get(`${import.meta.env.VITE_APP_API_URL}api/products`),
      ]);

      if (productsResponse.status !== 200) {
        throw new Error('Failed to fetch products');
      }

      setProducts(productsResponse.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgencies();
    fetchProducts();
  }, []);

  const dataFiltered: StockProps[] = applyFilter({
    inputData: stock,
    comparator: getComparator(order, orderBy),
    filterName,
    selectedCategory,
    selectedTipo,
    selectedPresentacion,
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
    setSelectedCategory('');
    setSelectedTipo('');
    setSearchField('nombre');
    setAgenciaId('');
  };

  const handleEditProduct = (product: StockProps) => {
    setSelectedProduct(product);
    setEditMode(true);
  };

  const handleCloseEditDialog = () => {
    setEditMode(false);
    setSelectedProduct(null);
  };

  const handleSearchFieldChange = (event: SelectChangeEvent<string>) => {
    setSearchField(event.target.value);
  };

  const handleDeleteProduct = async (_id: string) => {
    const confirmDelete = window.confirm("¿Estás seguro de que deseas eliminar este producto?");
    if (confirmDelete) {
      try {
        await axios.delete(`${import.meta.env.VITE_APP_API_URL}api/products/${_id}`);
        setProducts((prev) => prev.filter(product => product._id !== _id));
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  const { AddProductDialog, handleOpenAddProductModal } = useCreateProductDialog(handleSaveProduct);

  return (
    <DashboardContent>
      <Box display="flex" alignItems="center" mb={5}>
        <Typography variant="h4" flexGrow={1}>
          Productos
        </Typography>
        <Button
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="mingcute:add-line" />}
          onClick={handleOpenAddProductModal}
        >
          Nuevo producto
        </Button>
      </Box>

      <Card>
        <StockTableToolbar
          numSelected={0}
          filterName={filterName}
          onFilterName={(event: React.ChangeEvent<HTMLInputElement>) => setFilterName(event.target.value)}
          onClearFilter={handleClearFilter}
          onAddProduct={handleOpenAddProductModal}
          selectedCategory={selectedCategory}
          onSelectedCategory={(event: SelectChangeEvent<string>) => setSelectedCategory(event.target.value)}
          selectedTipo={selectedTipo}
          onselectedTipo={(event: SelectChangeEvent<string>) => setSelectedTipo(event.target.value)}
          selectedPresentacion={selectedPresentacion}
          onselectedPresentacion={(event: SelectChangeEvent<string>) => setSelectedPresentacion(event.target.value)}
          searchField={searchField}
          onSearchFieldChange={handleSearchFieldChange}
          agenciaId={agenciaId} // Pasa el ID de la agencia
          setAgenciaId={setAgenciaId} // Pasa la función para actualizar el ID de la agencia
          agencies={agencies} // Pasa la lista de agencias
        />
        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <StockTableHead
                order={order}
                orderBy={orderBy}
                rowCount={products.length}
                numSelected={0}
                onSort={handleRequestSort} // Pasa el manejador aquí
                onSelectAllRows={() => { }}
                headLabel={[
                  { id: 'item', label: 'Item' },
                  { id: 'producto', label: 'Producto' },
                  { id: 'agencia', label: 'Agencia' },
                  { id: 'stock', label: 'Stock' },
                  { id: 'valor_unitario', label: 'Valor Unitario' },
                  { id: 'valor_promedio', label: 'Valor Promedio' },
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
                      <StockTableRow
                        key={row.producto.item}
                        row={row}
                        selected={selectedRows.includes(row.producto.item)} // Indica si la fila está seleccionada
                        onSelectRow={() => handleSelectRow(row.producto.item)} // Manejo de selección de fila
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

      {/* Modal para editar producto */}
      <Dialog open={editMode} onClose={handleCloseEditDialog}>
        <DialogContent>
          {selectedProduct && (
            <EditStockView
              stock={selectedProduct}
              onClose={handleCloseEditDialog}
              onSave={handleSaveProduct}
            />
          )}
        </DialogContent>
      </Dialog>
    </DashboardContent>
  );
}