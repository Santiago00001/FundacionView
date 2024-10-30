import type { AgenciaProps } from "./agency-table-row";
import type { UserProps } from "../user/user-table-row";

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
    [key in Key]: number | string;
  },
  b: {
    [key in Key]: number | string;
  }
) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// ----------------------------------------------------------------------

type ApplyFilterProps = {
  inputData: AgenciaProps[];
  filterName: string;
  selectedUser: string;
  selectedCoor: string;
  searchField: string;
  comparator: (a: any, b: any) => number;
  users: UserProps[];
};

export function applyFilter({
  inputData,
  comparator,
  searchField,
  filterName,
  selectedUser,
  selectedCoor,
  users,
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
    inputData = inputData.filter((provider) => {
      let directorName = '';
      const director = users.find(user => user._id === provider.director);
      if (director) {
        directorName = `${director.firstName} ${director.lastName}`.toLowerCase();
      }

      switch (searchField) {
        case "Nombre":
          return provider.nombre.toLowerCase().includes(filterName.toLowerCase());
        case "Codigo":
          return provider.cod.toString() === filterName; // Comparación exacta
        case "Item":
          return provider.item.toString() === filterName; // Comparación exacta
        case "Director":
          return directorName.includes(filterName.toLowerCase()); // Filtra por nombre completo del director
        default:
          return false; // Si no se selecciona un campo válido, no filtra nada
      }
    });
  }

  if (selectedCoor) {
    inputData = inputData.filter((user) => user.coordinador === selectedCoor);
  }

  console.log('Filtered Data:', inputData); // Verifica el resultado filtrado

  return inputData;
}
