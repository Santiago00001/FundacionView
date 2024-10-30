import { lazy, Suspense } from 'react';
import { Outlet, Navigate, useRoutes } from 'react-router-dom';

import Box from '@mui/material/Box';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';

import { varAlpha } from 'src/theme/styles';
import { AuthLayout } from 'src/layouts/auth';
import { DashboardLayout } from 'src/layouts/dashboard';

import ProtectedRoute from './components/ProtectedRoute';

// ----------------------------------------------------------------------

export const HomePage = lazy(() => import('src/pages/home'));
export const BlogPage = lazy(() => import('src/pages/blog'));
export const UserPage = lazy(() => import('src/pages/user'));
export const StockPage = lazy(() => import('src/pages/stock'));
export const EditProfile = lazy(() => import('src/pages/edit-profile'));
export const SignInPage = lazy(() => import('src/pages/sign-in'));
export const ProductsPage = lazy(() => import('src/pages/products'));
export const ProviderPage = lazy(() => import('src/pages/provider'));
export const AgencyPage = lazy(() => import('src/pages/agency'));
export const Page404 = lazy(() => import('src/pages/page-not-found'));

// ----------------------------------------------------------------------

const renderFallback = (
  <Box display="flex" alignItems="center" justifyContent="center" flex="1 1 auto">
    <LinearProgress
      sx={{
        width: 1,
        maxWidth: 320,
        bgcolor: (theme) => varAlpha(theme.vars.palette.text.primaryChannel, 0.16),
        [`& .${linearProgressClasses.bar}`]: { bgcolor: 'text.primary' },
      }}
    />
  </Box>
);

export function Router() {
  const token = localStorage.getItem('token'); // Verificar si el token está presente

  return useRoutes([
    {
      path: '/',
      element: token ? ( // Si hay token, renderiza el DashboardLayout
        <Suspense fallback={renderFallback}>
          <DashboardLayout>
            <ProtectedRoute>
              <Outlet />
            </ProtectedRoute>
          </DashboardLayout>
        </Suspense>
      ) : ( // Si no hay token, redirige al sign-in
        <Navigate to="/sign-in" replace />
      ),
      children: [
        { element: <HomePage />, index: true },
        { path: 'user', element: <UserPage /> },
        { path: 'stock', element: <StockPage /> },
        { path: 'edit-profile', element: <EditProfile /> },
        { path: 'products', element: <ProductsPage /> },
        { path: 'providers', element: <ProviderPage /> },
        { path: 'agencys', element: <AgencyPage /> },
        { path: 'blog', element: <BlogPage /> },
      ],
    },
    {
      path: 'sign-in',
      element: (
        <AuthLayout>
          <Suspense fallback={renderFallback}>
            <SignInPage />
          </Suspense>
        </AuthLayout>
      ),
    },
    {
      path: '404',
      element: <Page404 />,
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);
}