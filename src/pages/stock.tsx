import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { StockView } from 'src/sections/stock/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Usuarios - ${CONFIG.appName}`}</title>
      </Helmet>

      <StockView />
    </>
  );
}
