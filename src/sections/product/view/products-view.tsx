// eslint-disable-next-line import/no-extraneous-dependencies
import type { SelectChangeEvent } from '@mui/material';

// eslint-disable-next-line import/no-extraneous-dependencies
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
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination'; // Asegúrate de que está importado

import DialogContent from '@mui/material/DialogContent';

import { useCreateProductDialog } from 'src/hooks/use-product-create';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

import { applyFilter, getComparator } from 'src/sections/product/utils';

import { ProductTableRow } from '../product-table-row'; // Asegúrate de que sea el componente correcto


import { TableNoData } from '../product-no-data';
import { EditProductView } from './product-edit-dialog';
import { ProductTableHead } from '../product-table-head';
import { ProductTableToolbar } from '../product-filters';

import type { Category, ProductProps } from '../product-table-row';

export function ProductsView() {
  const [filterName, setFilterName] = useState<string>('');
  const [products, setProducts] = useState<ProductProps[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedProduct, setSelectedProduct] = useState<ProductProps | null>(null);
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

  const handleSelectRow = (id: number) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]
    );
  };

  const handleSaveProduct = async (product: ProductProps): Promise<void> => {
    try {
      if (product._id) {
        const response = await axios.put(`${import.meta.env.VITE_APP_API_URL}api/products/${product._id}`, product);
        const updatedProduct: ProductProps = response.data;
        setProducts((prev) => prev.map((p) => (p._id === updatedProduct._id ? updatedProduct : p)));
      } else {
        const response = await axios.post(`${import.meta.env.VITE_APP_API_URL}api/products`, product);
        const newProduct: ProductProps = response.data;
        setProducts((prev) => [...prev, newProduct]);
      }
    } catch (error) {
      console.error('Error guardando el producto:', error);
      throw new Error('Failed to save product'); // Lanzar error para manejarlo en el componente padre
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    (async () => {
      try {
        const productsResponse = await axios.get(`${import.meta.env.VITE_APP_API_URL}api/products`, { signal: controller.signal });
        const categoriesResponse = await axios.get(`${import.meta.env.VITE_APP_API_URL}api/categories`, { signal: controller.signal });

        setProducts(productsResponse.data);
        setCategories(categoriesResponse.data);
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

  const dataFiltered: ProductProps[] = applyFilter({
    inputData: products,
    comparator: getComparator(order, orderBy), // Asegúrate de usar el estado actual
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
  };

  const handleEditProduct = (product: ProductProps) => {
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

  const { AddProductDialog, handleOpenAddProductModal } = useCreateProductDialog(
    handleSaveProduct,
    categories,
    products.map(product => product.codigo) // Pasa los códigos de los productos existentes
  );
  
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
        <ProductTableToolbar
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
          categories={categories}
        />
        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <ProductTableHead
                order={order}
                orderBy={orderBy}
                rowCount={products.length}
                numSelected={0}
                onSort={handleRequestSort} // Pasa el manejador aquí
                onSelectAllRows={() => { }}
                headLabel={[
                  { id: 'item', label: 'Item', align: 'center' },
                  { id: 'nombre', label: 'Nombre' },
                  { id: 'cta_cont', label: 'CTA' },
                  { id: 'codigo', label: 'COD' },
                  { id: 'categoria', label: 'Categoría' },
                  { id: 'grupo_desc', label: 'Grupo' },
                  { id: 'tipo', label: 'Tipo' },
                  { id: 'presentacion', label: 'Presentación' },
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
                    .map((row) => (
                      <ProductTableRow
                        key={row.item}
                        row={row}
                        selected={selectedRows.includes(row.item)} // Indica si la fila está seleccionada
                        onSelectRow={() => handleSelectRow(row.item)} // Manejo de selección de fila
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
            <EditProductView
              product={selectedProduct}
              onClose={handleCloseEditDialog}
              onSave={handleSaveProduct}
              categories={categories}
            />
          )}
        </DialogContent>
      </Dialog>
    </DashboardContent>
  );
}