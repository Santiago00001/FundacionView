import type { UserProps } from './user-table-row';

// ----------------------------------------------------------------------

export const visuallyHidden = {
  border: 0,
  margin: -1,
  padding: 0,
  width: '1px',
  height: '1px',
  overflow: 'hidden',
  position: 'absolute',
  whiteSpace: 'nowrap',
  clip: 'rect(0 0 0 0)',
} as const;

// ----------------------------------------------------------------------

export function emptyRows(page: number, rowsPerPage: number, arrayLength: number) {
  return page ? Math.max(0, (1 + page) * rowsPerPage - arrayLength) : 0;
}

// ----------------------------------------------------------------------

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  // Verificar si estamos ordenando por agencia
  if (orderBy === 'agencia') {
    const agencyA = a[orderBy] && typeof a[orderBy] === 'object' ? (a[orderBy] as unknown as { cod: number }).cod.toString() : '';
    const agencyB = b[orderBy] && typeof b[orderBy] === 'object' ? (b[orderBy] as unknown as { cod: number }).cod.toString() : '';
    return agencyA < agencyB ? -1 : agencyA > agencyB ? 1 : 0;
  }

  // Comparaciones para otros campos
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

// ----------------------------------------------------------------------

export function getComparator<Key extends keyof any>(
  order: 'asc' | 'desc',
  orderBy: Key
): (
  a: {
    [key in Key]: number | string | { nombre: string }; // Actualizar para incluir el objeto de agencia
  },
  b: {
    [key in Key]: number | string | { nombre: string }; // Actualizar para incluir el objeto de agencia
  }
) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}


// ----------------------------------------------------------------------

type ApplyFilterProps = {
  inputData: UserProps[];
  filterName: string;
  selectedRol: string;
  selectedStatus: string;
  selectedCargo: string;
  searchField: string;
  comparator: (a: any, b: any) => number;
};

export function applyFilter({
  inputData,
  searchField,
  comparator,
  filterName,
  selectedRol,
  selectedStatus,
  selectedCargo,
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
        case "nombres": {
          const searchTerm = filterName.toLowerCase();
          return (
            product.firstName.toLowerCase().includes(searchTerm) ||
            product.lastName.toLowerCase().includes(searchTerm)
          );
        }
        case "apellidos":
          return product.lastName.toLowerCase().includes(filterName.toLowerCase());
        case "item":
          return product.item.toString() === filterName;
        case "agencia": {
          const agenciaStr = `${product.roleid.name}`.toLowerCase();
          return agenciaStr.includes(filterName.toLowerCase());
        }
        default:
          return false;
      }
    });
  }

  if (selectedRol) {
    inputData = inputData.filter((user) => user.roleid._id === selectedRol);
  }

  if (selectedStatus) {
    inputData = inputData.filter((user) => user.status === selectedStatus);
  }

  return inputData;
}
