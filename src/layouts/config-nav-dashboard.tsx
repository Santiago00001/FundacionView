import { SvgColor } from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name: string) => (
  <SvgColor width="100%" height="100%" src={`/assets/icons/navbar/${name}.svg`} />
);

export const navData = [
  {
    title: 'Estadisticas',
    path: '/',
    icon: icon('ic-analytics'),
  },
  {
    title: 'Stock',
    path: '/stock',
    icon: icon('ic-stock'),
  },
  {
    title: 'Usuarios',
    path: '/user',
    icon: icon('ic-user'),
  },
  {
    title: 'Productos',
    path: '/products',
    icon: icon('ic-cart'),
  },
  {
    title: 'Proveedores',
    path: '/providers',
    icon: icon('ic-equipo'),
  },
  {
    title: 'Dependencias',
    path: '/agencys',
    icon: icon('ic-shop2'),
  }
  /*
  {
    title: 'Blog',
    path: '/blog',
    icon: icon('ic-blog'),
  },
  */
  /* 
  {
    title: 'Sign in',
    path: '/sign-in',
    icon: icon('ic-lock'),
  },
  */
  /*  
  {
      title: 'Not found',
      path: '/404',
      icon: icon('ic-disabled'),
    },
    */
];
