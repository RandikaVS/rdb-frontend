import PropTypes from 'prop-types';
import { useState, useCallback, useEffect } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import { styled } from '@mui/material/styles';
import TableRow from '@mui/material/TableRow';
import TableHead from '@mui/material/TableHead';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';

import { fDate } from 'src/utils/format-time';
import { fCurrency } from 'src/utils/format-number';

import { INVOICE_STATUS_OPTIONS } from 'src/_mock';

import Label from 'src/components/label';
import Scrollbar from 'src/components/scrollbar';

import InvoiceToolbar from './invoice-toolbar';
import { useAuthContext } from 'src/auth/hooks';
import { civilStatus, coverList, genders } from 'src/assets/data';
import { RHFAutocomplete, RHFSelect, RHFTextField } from 'src/components/hook-form';
import { DatePicker } from '@mui/x-date-pickers';
import { useFormContext } from 'react-hook-form';
import Logo from 'src/components/logo/logo';
import PickerDate from '../_examples/mui/picker-view/picker-date';
import PickerView from '../_examples/mui/picker-view';
import FileManagerNewFolderDialog from '../file-manager/file-manager-new-folder-dialog';
import FileManagerPanel from '../file-manager/file-manager-panel';
import { useBoolean } from 'src/hooks/use-boolean';
import { Button, Chip, IconButton, MenuItem, Tooltip } from '@mui/material';
import Iconify from 'src/components/iconify';
import { MultiFilePreview, SingleFilePreview, Upload } from 'src/components/upload';
import CustomPopover from 'src/components/custom-popover';
import { useMainContext } from 'src/context/hooks';
import LoadingButton from '@mui/lab/LoadingButton';
import TextField from '@mui/material/TextField';
import { useSnackbar } from 'src/components/snackbar';

// ----------------------------------------------------------------------

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '& td': {
    textAlign: 'right',
    borderBottom: 'none',
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
}));

// ----------------------------------------------------------------------

export default function InvoiceDetails({ currentQuatation, handleReply, loadingReply }) {

  const {enqueueSnackbar} = useSnackbar()

  const [files, setFiles] = useState([]);

  const {bankAdmin,user} = useAuthContext()
  const {uploaded_document_state, getQuatationFile, quatation_reply_file} = useMainContext()

  // const {uploadDocumentForQuatation} = useMainContext()

  const { control, setValue, watch, resetField } = useFormContext();

  const fetchReplyFile = async() =>{

    try {
      await getQuatationFile?.(currentQuatation?.reply[0]?.document)
    } catch (error) {
      console.error(error)
      enqueueSnackbar("Failed to get quatation file ", {variant:"error"})
    }
    
  }

  useEffect(() => {
    if(currentQuatation?.reply[0]?.document && !quatation_reply_file){
      fetchReplyFile()
    }
    
    
  }, [quatation_reply_file,getQuatationFile,currentQuatation])
  

  useEffect(() => {
    setValue('document',uploaded_document_state?uploaded_document_state:null)
    setValue('confirmBy',user?._id)
    setValue('benifit','Life cover plus TPD')
  }, [setValue,uploaded_document_state,user])
  
  const [currentStatus, setCurrentStatus] = useState(currentQuatation?.status);

  const uploadDocumentModal = useBoolean();

  const handleChangeStatus = useCallback((event) => {
    setCurrentStatus(event.target.value);
  }, []);

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const newFiles = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      );

      setFiles([...files, ...newFiles]);
    },
    [files]
  );

  const handleRemoveFile = (inputFile) => {
    const filtered = files.filter((file) => file !== inputFile);
    setFiles(filtered);
  };

  // const handleUpload = async () => {

  //   try {
        
  //       const formData = new FormData();

  //       formData.append('document', files[0]);

  //       const data = {
  //         quatationId: currentQuatation?._id,
  //         filename: files[0].name,
  //         userid: currentQuatation?.user?._id,
  //       };

  //       await uploadDocumentForQuatation?.(formData, data);
  //   } 
    
  //   catch (error) {
  //     console.error(error)
  //     enqueueSnackbar("Failed to upload document",{variant:'error'})
  //   }
  // }

  const renderTotal = (
    <>
      <StyledTableRow>
        <TableCell colSpan={3} />
        <TableCell sx={{ color: 'text.secondary' }}>
          <Box sx={{ mt: 2 }} />
          Bank Account
        </TableCell>
        <TableCell width={120} sx={{ typography: 'subtitle2' }}>
          <Box sx={{ mt: 2 }} />
          {fCurrency(currentQuatation?.bankAccount)}
        </TableCell>
      </StyledTableRow>

      <StyledTableRow>
        <TableCell colSpan={3} />
        <TableCell sx={{ color: 'text.secondary' }}>Loan Amount</TableCell>
        <TableCell width={120} sx={{ color: 'error.main', typography: 'body2' }}>
          {fCurrency(currentQuatation?.loanAmount)}
        </TableCell>
      </StyledTableRow>

      <StyledTableRow>
        <TableCell colSpan={3} />
        <TableCell sx={{ color: 'text.secondary' }}>Interest Rate</TableCell>
        <TableCell width={120} sx={{ color: 'error.main', typography: 'body2' }}>
          {fCurrency(currentQuatation?.interestRate)}
        </TableCell>
      </StyledTableRow>

      <StyledTableRow>
        <TableCell colSpan={3} />
        <TableCell sx={{ color: 'text.secondary' }}>Loan Purpose</TableCell>
        <TableCell width={120}>{currentQuatation?.loanPurpose}</TableCell>
      </StyledTableRow>

      <StyledTableRow>
        <TableCell colSpan={3} />
        <TableCell sx={{ typography: 'subtitle1' }}>Mobile Number</TableCell>
        <TableCell width={140} sx={{ typography: 'subtitle1' }}>
          {currentQuatation?.mobileNumber}
        </TableCell>
      </StyledTableRow>
    </>
  );

  const renderFooter = (
    <Grid container>
      <Grid xs={12} md={9} sx={{ py: 3 }}>
        <Typography variant="subtitle2">NOTES</Typography>

        <Typography variant="body2">
        Regional Development Bank
        </Typography>
      </Grid>

      <Grid xs={12} md={3} sx={{ py: 3, textAlign: 'right' }}>
        <Typography variant="subtitle2">Have a Question?</Typography>

        <Typography variant="body2">{bankAdmin?.email}</Typography>
      </Grid>
    </Grid>
  );

  const renderList = (
    <>
    <TableContainer sx={{ overflow: 'unset', mt: 5 }}>
      <Scrollbar>
        <Table sx={{ minWidth: 960 }}>
          <TableHead>
            <TableRow>

              <TableCell>#</TableCell>

              <TableCell align="left">Benifit</TableCell>

              <TableCell align="left">Total</TableCell>
              {currentQuatation?.reply.length > 0 &&
              <TableCell align="right">Document</TableCell>
              }

            </TableRow>
          </TableHead>

          <TableBody>
            {currentQuatation?.reply.length > 0?(
              (currentQuatation?.reply?.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>

                  <TableCell>
                      <Typography variant="subtitle2">{row?.benifit?row.benifit:''}</Typography>
                  </TableCell>

                  <TableCell>
                      <Typography align="left">
                        {fCurrency(row?.totalAmount?row.totalAmount:'')}
                      </Typography>
                  </TableCell>

                  <TableCell align="right">
                    {row?.document && quatation_reply_file?(
                        <Tooltip title="View Document">
                          
                          <IconButton
                            onClick={() => {
                              window.open(quatation_reply_file, '_blank');
                            }}
                          >
                            <Iconify icon="solar:printer-minimalistic-bold" />
                          </IconButton>

                        </Tooltip>
                      ):(
                      <Chip color='warning' size='medium'>Pending</Chip>
                    )}
                  </TableCell>
                </TableRow>
              )))
            ):(
              <>
              <TableRow>
                  <TableCell>
                    {user?.role ==="admin"?
                      1:'--'
                    }
                    </TableCell>

                  <TableCell>
                      <Typography>
                      {user?.role ==="admin"?
                        <RHFTextField name="benifit" label="Benifit" />
                        :
                        '----'
                      }
                        
                      </Typography>
                  </TableCell>

                  <TableCell>
                      <Typography>

                      {user?.role ==="admin"?
                        <RHFTextField name="totalAmount" label="Total Amount" />
                        :
                        '----'
                      }
                       
                      </Typography>
                  </TableCell>
                </TableRow>
                
                </>
            )}
            

            {/* {renderTotal} */}
          </TableBody>
        </Table>
      </Scrollbar>
    </TableContainer>

    {user?.role ==="admin" && currentQuatation?.reply.length > 0 ? ( 
      <MultiFilePreview files={files} thumbnail={true} onRemove={handleRemoveFile} />
    ):(
      user?.role ==="admin" &&
      <Stack justifyContent="flex-end" direction="row" spacing={2} sx={{ mt: 3 }}>
      {files.length > 0 && uploaded_document_state?(
          <MultiFilePreview files={files} thumbnail={true} />
        ):(
          <Button
            variant="contained"
            startIcon={<Iconify icon="eva:cloud-upload-fill" />}
            onClick={uploadDocumentModal.onTrue}
          >
            Upload
          </Button>
        )}
      </Stack>
    )}

    {currentQuatation?.reply.length == 0 && user?.role ==="admin" &&
        <Stack justifyContent="flex-end" direction="row" spacing={2} sx={{ mt: 3 }}>
          <LoadingButton
            size="medium"
            variant="contained"
            loading={loadingReply.value}
            onClick={handleReply}
            >
            Send Reply
          </LoadingButton>
        </Stack>
    }
</>
  );

  return (
    <>
      <InvoiceToolbar
        invoice={currentQuatation}
        currentStatus={currentStatus || ''}
        role={user?.role}
        onChangeStatus={handleChangeStatus}
        statusOptions={INVOICE_STATUS_OPTIONS}
        isReport={false}
      />

      <Card sx={{ pt: 5, px: 5 }}>
        <Box
          rowGap={5}
          display="grid"
          alignItems="center"
          gridTemplateColumns={{
            xs: 'repeat(1, 1fr)',
            sm: 'repeat(2, 1fr)',
          }}
        >
          <Box
            component="img"
            alt="logo"
            src="/logo/logo_single.png"
            sx={{ width: 120, height: 100 }}
          />

          <Stack spacing={1} alignItems={{ xs: 'flex-start', md: 'flex-end' }}>
            <Label
              variant="soft"
              color={
                (currentStatus === 'paid' && 'success') ||
                (currentStatus === 'pending' && 'warning') ||
                (currentStatus === 'expired' && 'error') ||
                (currentStatus === 'approved' && 'info') ||
                'default'
              }
            >
              {currentStatus}
            </Label>

            <Typography variant="h6">{currentQuatation?.referanceNo}</Typography>
          </Stack>

          <Box spacing={1} sx={{ p: 3, gridColumn: '1 / -1' }}>
            <Typography variant="subtitle1" sx={{ mb: 0.5, textAlign: 'center' }}>
                    Regional Development Bank
            </Typography>
            <Typography
                    variant="subtitle2"
                    sx={{
                      textAlign: 'center',
                    }}
                  >
                    Bancassurance Unit
            </Typography>
            <Typography
                          variant="body2"
                          sx={{
                            mt: 3,
                            mx: 'auto',
                            display: 'block',
                            textAlign: 'center',
                            color:'text.disabled'
                          }}
                        >
                          
                          No. 933, Kandy road, Wedamulla, Kelaniya
                          <br/>
                          Tel. 011 2035454 / 417		Fax. 011 2906875 
                          <br/>
                          E-mail. insurance@rdb.lk
            </Typography>


            <Divider sx={{ my: 3, borderStyle: 'dashed' }} />

            <Card sx={{ p: 3 }}>
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
              alignItems="center"
              justifyContent="center"
            >
              <Typography
                variant="h5"
                sx={{ textDecorationLine: 'underline', textAlign: 'center', gridColumn: '1 / -1' }}
              >
                Proposal Request
              </Typography>
            
              <Typography variant="subtitle1" >
                Reference No : {currentQuatation?.referanceNo}
              </Typography>
              <Typography variant="caption" sx={{mt: 0.5,textAlign:'left',color: 'text.disabled' }}>
                
              </Typography>
                
              <RHFTextField name="customerName" label="Customer Name" />
              <RHFTextField name="nic" label="NIC" />

              <RHFSelect name="gender" label="Gender" >
                <Divider sx={{ borderStyle: 'dashed' }} />
                {genders.map((gender) => (
                  <MenuItem key={gender.code} value={gender.code}>
                    <Chip
                      key={gender.code}
                      label={gender.label}
                      size="small"
                      color='info'
                      variant='outlined'
                    />
                  </MenuItem>
                ))}
              </RHFSelect>

              {/* <RHFAutocomplete
                name="gender"
                type="gender"
                label="Gender"
                placeholder="Choose a gender"
                fullWidth
                options={genders.map((option) => option.label)}
                getOptionLabel={(option) => option}
                renderOption={(props, option) => (
                  <li {...props} key={option.code}>
                    {option.label}
                  </li>
                )}
                renderTags={(selected, getTagProps) =>
                  selected.map((option, index) => (
                    <Chip
                      {...getTagProps({ index })}
                      key={option.code}
                      label={option.label}
                      size="small"
                      color="info"
                      variant="soft"
                    />
                  ))
                }
              /> */}

              <RHFTextField name="customerAddress" label="Customer Address" multiline rows={2}/>  

              <DatePicker label="Date Of Birth" name="dob" value={new Date(currentQuatation?.dob)}/>
              <RHFTextField name="mobileNumber" label="Mobile Number"/>
              <RHFTextField name="bankAccount" label="Bank Account" />
              <RHFTextField name="loanAmount" label="Loan Amount" />
              <RHFTextField name="remarks" label="Remarks"/>
              <RHFTextField name="insurancePolicy" label="Insurance Policy" />

              <RHFAutocomplete
                name="coverList"
                type="coverList"
                label="Cover List"
                placeholder="Cover List"
                fullWidth
                options={coverList.map((option) => option.label)}
                getOptionLabel={(option) => option}
                multiple
              />

              <Typography variant="h5" >
              </Typography>

              <Typography variant="h5"sx={{textDecorationLine:'underline', textAlign:'center',gridColumn: '1 / -1'}} >
                Additional Details
              </Typography>
              
{/* 
              <RHFAutocomplete
                name="civilStatus"
                type="civilStatus"
                label="Civil Status"
                placeholder="Civil Status"
                fullWidth
                options={civilStatus.map((option) => option.label)}
                getOptionLabel={(option) => option}
              /> */}

              <RHFSelect name="civilStatus" label="Civil Status" >
                <Divider sx={{ borderStyle: 'dashed' }} />
                {civilStatus.map((status) => (
                  <MenuItem key={status.code} value={status.code}>
                    <Chip
                      key={status.code}
                      label={status.label}
                      size="small"
                      color='default'
                      variant="outlined"
                    />
                  </MenuItem>
                ))}
              </RHFSelect>

              <RHFTextField name="loanPeriod" label="Loan Period" />
              <RHFTextField name="interestRate" label="Interest Rate" />
              <RHFTextField name="profession" label="Profession" />
              <RHFTextField name="loanPurpose" label="Loan Purpose"/>

            </Box>
          </Card>

          </Box>

        </Box>
        <Typography
                variant="h5"
                sx={{ textDecorationLine: 'underline', textAlign: 'center', gridColumn: '1 / -1' }}
              >
                Reply
              </Typography>
        {renderList}


        <Divider sx={{ mt: 5, borderStyle: 'dashed' }} />

        {renderFooter}
      </Card>

      {uploadDocumentModal.value && 
      <FileManagerNewFolderDialog
        open={uploadDocumentModal.value}
        onClose={uploadDocumentModal.onFalse}
        multiple={false}
        currentQuatation={currentQuatation}
        setFiles={setFiles}
        files={files}
      />
    }
    </>
  );
}

InvoiceDetails.propTypes = {
  invoice: PropTypes.object,
};
