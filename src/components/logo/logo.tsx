import type { BoxProps } from '@mui/material/Box';
import { forwardRef } from 'react';
import Box from '@mui/material/Box';
import { RouterLink } from 'src/routes/components';
import { logoClasses } from './classes';

// ----------------------------------------------------------------------

export type LogoProps = BoxProps & {
  href?: string;
  isSingle?: boolean;
  disableLink?: boolean;
};

export const Logo = forwardRef<HTMLDivElement, LogoProps>(
  (
    { width, href = '/', height, isSingle = true, disableLink = false, className, sx, ...other },
    ref
  ) => {
    const baseSize = {
      width: width ?? 254,  // Establecido a 254
      height: height ?? 120, // Establecido a 120
    };

    return (
      <Box
        ref={ref}
        component={RouterLink}
        href={href}
        className={logoClasses.root.concat(className ? ` ${className}` : '')}
        aria-label="Logo"
        sx={{
          ...baseSize,
          flexShrink: 0,
          display: 'inline-flex',
          verticalAlign: 'middle',
          ...(disableLink && { pointerEvents: 'none' }),
          ...sx,
        }}
        {...other}
      >
        <img
          src="/logo.jpg" // Cambia esta ruta según sea necesario
          alt="Logo"
          style={{ width: '100%', height: '100%' }}
        />
      </Box>
    );
  }
);