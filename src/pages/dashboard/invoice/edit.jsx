import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { InvoiceEditView } from 'src/sections/invoice/view';

// ----------------------------------------------------------------------

export default function InvoiceEditPage() {
  const params = useParams();

  const { id } = params;

  return (
    <>
      <Helmet>
        <title> Dashboard: Quatation Edit</title>
      </Helmet>

      <InvoiceEditView id={`${id}`} />
    </>
  );
}
