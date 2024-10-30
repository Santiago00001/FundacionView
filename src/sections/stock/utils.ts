import type { StockProps } from "./stock-table-row";

// ----------------------------------------------------------------------

type ApplyFilterProps = {
  inputData: StockProps[];
  filterName: string;
  selectedCategory: string;
  selectedTipo: string; // Agregar el filtro para el estado
  selectedPresentacion: string;
  searchField: string;
  comparator: (a: any, b: any) => number;
};

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

export function getComparator<Key extends keyof any>(
  order: 'asc' | 'desc',
  orderBy: Key
): (a: { [key in Key]: number | string }, b: { [key in Key]: number | string }) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

export function applyFilter({
  inputData,
  comparator,
  filterName,
  selectedCategory,
  selectedTipo,
  selectedPresentacion,
  searchField, // Nuevo parámetro
}: ApplyFilterProps) {
  const stabilizedThis = inputData.map((el, index) => [el, index] as const);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  // Filtrado por el término de búsqueda basado en el campo seleccionado
  if (filterName) {
    inputData = inputData.filter((product) => {
      switch (searchField) {
        case "item":
          return product.producto.item.toString() === filterName; // Comparación exacta
        case "nombre":
          return product.producto.nombre.toLowerCase().includes(filterName.toLowerCase());
        case "codigo":
          return product.producto.codigo.toString().includes(filterName.toLowerCase());
        default:
          return false; // Si no se selecciona un campo válido, no filtra nada
      }
    });
  }

  if (selectedCategory) {
    inputData = inputData.filter((product) => product.producto.categoria_id.categoria === selectedCategory);
  }

  if (selectedTipo) {
    inputData = inputData.filter((product) => product.producto.tipo === selectedTipo);
  }

  if (selectedPresentacion) {
    inputData = inputData.filter((product) => product.producto.presentacion === selectedPresentacion);
  }

  return inputData;
}