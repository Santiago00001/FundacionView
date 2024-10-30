import React from 'react';

import { Table, TableRow, TableBody, TableCell, TableHead, Typography, TableContainer } from '@mui/material';

import { Iconify } from 'src/components/iconify';

export type ProviderProps = {
  _id: string;
  nit: string;
  razon_social: string;
  direccion: string;
  ciudad: string;
  tel: string;
  cel: string;
  correo: string;
  contacto: string;
  act_eco: string;
  fecha_inag: Date;
  fecha_reno: Date;
  cod_ins: string;
  cod_ins_fecha: Date;
  ver_ins?: boolean;
  cod_dat: string;
  cod_dat_fecha: Date;
  ver_dat?: boolean;
  visible: number;
};

type ProviderTableProps = {
  providers: ProviderProps[];
};

export function ProviderTable({ providers }: ProviderTableProps) {
  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Item</TableCell>
            <TableCell>Nombre</TableCell>
            <TableCell>Categoría</TableCell>
            <TableCell>Grupo</TableCell>
            <TableCell>Tipo</TableCell>
            <TableCell>Precio</TableCell>
            <TableCell>Presentacion</TableCell>
            <TableCell>Proveedores</TableCell>
            <TableCell>Código</TableCell>
            <TableCell>Verificacion</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {providers.map((provider) => (
            <TableRow key={provider.nit}>
              <TableCell>
                <Typography variant="body2">{provider.razon_social}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle2">{provider.direccion}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2">{provider.ciudad}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2">{provider.tel}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2">{provider.cel}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2">{provider.correo}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2">{provider.contacto}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2">{provider.act_eco}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2">{provider.fecha_inag.toString()}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2">{provider.fecha_reno.toString()}</Typography>
              </TableCell>
              <TableCell align="center">
                {provider.ver_ins ? (
                  <Iconify width={22} icon="solar:check-circle-bold" sx={{ color: 'success.main' }} />
                ) : (
                  '-'
                )}
              </TableCell>

              <TableCell align="center">
                {provider.ver_dat ? (
                  <Iconify width={22} icon="solar:check-circle-bold" sx={{ color: 'success.main' }} />
                ) : (
                  '-'
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}