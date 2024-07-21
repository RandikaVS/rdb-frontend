import PropTypes from 'prop-types';
import { useCallback } from 'react';
import { PDFViewer, PDFDownloadLink } from '@react-pdf/renderer';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import DialogActions from '@mui/material/DialogActions';
import CircularProgress from '@mui/material/CircularProgress';
import { styled } from '@mui/material/styles';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';

import Iconify from 'src/components/iconify';

import InvoicePDF from './invoice-pdf';

// ----------------------------------------------------------------------

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});


export default function InvoiceToolbar({ isReport, invoice, currentStatus, role='user', statusOptions, onChangeStatus }) {
  const router = useRouter();

  const view = useBoolean();

  const handleEdit = useCallback(() => {
    router.push(paths.dashboard.invoice.edit(invoice.id));
  }, [invoice.id, router]);

  return (
    <>
      <Stack
        spacing={3}
        direction={{ xs: 'column', sm: 'row' }}
        alignItems={{ xs: 'flex-end', sm: 'center' }}
        sx={{ mb: { xs: 3, md: 5 } }}
      >
        <Stack direction="row" spacing={1} flexGrow={1} sx={{ width: 1 }}>
          {/* <Tooltip title="Edit">
            <IconButton onClick={handleEdit}>
              <Iconify icon="solar:pen-bold" />
            </IconButton>
          </Tooltip>

          <Tooltip title="View">
            <IconButton onClick={view.onTrue}>
              <Iconify icon="solar:eye-bold" />
            </IconButton>
          </Tooltip> */}

          {isReport && 
          <>
          <PDFDownloadLink
            // document={<InvoicePDF invoice={invoice} currentStatus={currentStatus} />}
            fileName={isReport?"Quatation Report":invoice.referanceNo}
            style={{ textDecoration: 'none' }}
          >
            {({ loading }) => (
              <Tooltip title="Download">
                <IconButton size='large' >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    <>
                    {/* <Iconify icon="eva:cloud-download-fill" /> */}
                    <Iconify icon="solar:printer-minimalistic-bold" />
                    </>
                  )}
                  
                </IconButton>
              </Tooltip>
            )}
            
          </PDFDownloadLink>
          <Tooltip title={isReport?"Generate Report":"Print"}>
            {/* <IconButton>
              <Iconify icon="solar:printer-minimalistic-bold" />
              Generate Report
            </IconButton> */}

          <Button
            component="label"
            role={undefined}
            variant="contained"
            tabIndex={-1}
            startIcon={<Iconify icon="solar:printer-minimalistic-bold" />}
            sx={{
              bottom: { md: -20 },
            }}
          >
            Report
            <VisuallyHiddenInput type="file" />
          </Button>
          </Tooltip>
          </>
          }

          {/* <Tooltip title="Print">
            <IconButton>
              <Iconify icon="solar:printer-minimalistic-bold" />
            </IconButton>
          </Tooltip>

          <Tooltip title="Send">
            <IconButton>
              <Iconify icon="iconamoon:send-fill" />
            </IconButton>
          </Tooltip>

          <Tooltip title="Share">
            <IconButton>
              <Iconify icon="solar:share-bold" />
            </IconButton>
          </Tooltip> */}
        </Stack>

        {!isReport &&
        <TextField
          fullWidth
          select
          label="Status"
          value={currentStatus}
          onChange={onChangeStatus}
          sx={{
            maxWidth: 160,
            display: role ==="admin"?"block":"none"
          }}
        >
          {statusOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
        }
      </Stack>

      <Dialog fullScreen open={view.value}>
        <Box sx={{ height: 1, display: 'flex', flexDirection: 'column' }}>
          <DialogActions
            sx={{
              p: 1.5,
            }}
          >
            <Button color="inherit" variant="contained" onClick={view.onFalse}>
              Close
            </Button>
          </DialogActions>

          <Box sx={{ flexGrow: 1, height: 1, overflow: 'hidden' }}>
            pfg view
            {/* <PDFViewer width="100%" height="100%" style={{ border: 'none' }}>
              <InvoicePDF invoice={invoice} currentStatus={currentStatus} />
            </PDFViewer> */}
          </Box>
        </Box>
      </Dialog>
    </>
  );
}

InvoiceToolbar.propTypes = {
  currentStatus: PropTypes.string,
  role: PropTypes.string,
  invoice: PropTypes.object,
  onChangeStatus: PropTypes.func,
  statusOptions: PropTypes.array,
  isReport: PropTypes.bool,
};
