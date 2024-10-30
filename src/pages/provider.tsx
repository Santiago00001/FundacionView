import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { ProviderView } from 'src/sections/providers/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Proveedores - ${CONFIG.appName}`}</title>
      </Helmet>

      <ProviderView />
    </>
  );
}
