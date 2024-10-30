import type { ProviderProps } from "./provider-table-row";

// ----------------------------------------------------------------------

type ApplyFilterProps = {
  inputData: ProviderProps[];
  filterName: string;
  selectedIns: boolean | null;
  selectedDat: boolean | null;
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
  selectedIns,
  selectedDat,
  searchField,
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
      switch (searchField) {
        case "Razon Social":
          return provider.razon_social.toLowerCase().includes(filterName.toLowerCase());
        case "Nit":
          return provider.nit.toLowerCase().includes(filterName.toLowerCase());
        case "Item":
          return provider.item.toString() === filterName; // Comparación exacta
        case "Celular":
          return provider.cel.toString().includes(filterName.toLowerCase());
        case "Telefono":
          return provider.tel.toString().includes(filterName.toLowerCase());
        case "Correo":
          return provider.correo.toString().includes(filterName.toLowerCase());
        case "Contacto":
          return provider.contacto.toLowerCase().includes(filterName.toLowerCase());
        default:
          return false; // Si no se selecciona un campo válido, no filtra nada
      }
    });
  }

  // Filtrado por verificación Inspektor (solo si no es null)
  if (selectedIns !== null) {
    inputData = inputData.filter((provider) => provider.ver_ins === selectedIns);
  }

  // Filtrado por verificación DataCredito (solo si no es null)
  if (selectedDat !== null) {
    inputData = inputData.filter((provider) => provider.ver_dat === selectedDat);
  }

  return inputData;
}