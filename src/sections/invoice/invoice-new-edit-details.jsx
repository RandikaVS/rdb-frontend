import sum from 'lodash/sum';
import { useEffect, useCallback } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';


import { fCurrency } from 'src/utils/format-number';

import { INVOICE_SERVICE_OPTIONS } from 'src/_mock';
import { DatePicker } from '@mui/x-date-pickers';


import Iconify from 'src/components/iconify';
import FormProvider, {
  RHFSwitch,
  RHFTextField,
  RHFUploadAvatar,
  RHFAutocomplete,
  RHFSelect,
} from 'src/components/hook-form';
import { civilStatus, coverList, genders } from 'src/assets/data';
import { Chip } from '@mui/material';

// ----------------------------------------------------------------------

export default function InvoiceNewEditDetails() {
  const { control, setValue, watch, resetField } = useFormContext();

  const values = watch();


  useEffect(() => {
    if(values.referanceNo){
      setValue('referanceNo',values.referanceNo);
    }
    
  }, [setValue]);

  const handleAdd = () => {
    append({
      title: '',
      description: '',
      service: '',
      quantity: 1,
      price: 0,
      total: 0,
    });
  };

  const handleRemove = (index) => {
    remove(index);
  };

  const handleClearService = useCallback(
    (index) => {
      resetField(`items[${index}].quantity`);
      resetField(`items[${index}].price`);
      resetField(`items[${index}].total`);
    },
    [resetField]
  );

  const handleSetDOB = useCallback(
    (newValue) => {
      setValue('dob',newValue);
    },
    [setValue, values]
  );

  const handleChangeQuantity = useCallback(
    (event, index) => {
      setValue(`items[${index}].quantity`, Number(event.target.value));
      setValue(
        `items[${index}].total`,
        values.items.map((item) => item.quantity * item.price)[index]
      );
    },
    [setValue, values.items]
  );

  const handleChangePrice = useCallback(
    (event, index) => {
      setValue(`items[${index}].price`, Number(event.target.value));
      setValue(
        `items[${index}].total`,
        values.items.map((item) => item.quantity * item.price)[index]
      );
    },
    [setValue, values.items]
  );

  // const renderTotal = (
  //   <Stack
  //     spacing={2}
  //     alignItems="flex-end"
  //     sx={{ mt: 3, textAlign: 'right', typography: 'body2' }}
  //   >
  //     <Stack direction="row">
  //       <Box sx={{ color: 'text.secondary' }}>Subtotal</Box>
  //       <Box sx={{ width: 160, typography: 'subtitle2' }}>{fCurrency(subTotal) || '-'}</Box>
  //     </Stack>

  //     <Stack direction="row">
  //       <Box sx={{ color: 'text.secondary' }}>Shipping</Box>
  //       <Box
  //         sx={{
  //           width: 160,
  //           ...(values.shipping && { color: 'error.main' }),
  //         }}
  //       >
  //         {values.shipping ? `- ${fCurrency(values.shipping)}` : '-'}
  //       </Box>
  //     </Stack>

  //     <Stack direction="row">
  //       <Box sx={{ color: 'text.secondary' }}>Discount</Box>
  //       <Box
  //         sx={{
  //           width: 160,
  //           ...(values.discount && { color: 'error.main' }),
  //         }}
  //       >
  //         {values.discount ? `- ${fCurrency(values.discount)}` : '-'}
  //       </Box>
  //     </Stack>

  //     <Stack direction="row">
  //       <Box sx={{ color: 'text.secondary' }}>Taxes</Box>
  //       <Box sx={{ width: 160 }}>{values.taxes ? fCurrency(values.taxes) : '-'}</Box>
  //     </Stack>

  //     <Stack direction="row" sx={{ typography: 'subtitle1' }}>
  //       <Box>Total</Box>
  //       <Box sx={{ width: 160 }}>{fCurrency(totalAmount) || '-'}</Box>
  //     </Stack>
  //   </Stack>
  // );

  return (
    <Box sx={{ p: 3 }}>

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
                Reference No : {values?.referanceNo}
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
                      variant="filled"
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

              <DatePicker label="Date Of Birth" name="dob" onChange={handleSetDOB}/>
              <RHFTextField name="mobileNumber" label="Mobile Number" />
              <RHFTextField name="bankAccount" label="Bank Account" />
              <RHFTextField name="loanAmount" label="Loan Amount" />
              <RHFTextField name="remarks" label="Remarks" />
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
              

              {/* <RHFAutocomplete
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
                      variant="filled"
                    />
                  </MenuItem>
                ))}
              </RHFSelect>

              <RHFTextField name="loanPeriod" label="Loan Period" />
              <RHFTextField name="interestRate" label="Interest Rate" />
              <RHFTextField name="profession" label="Profession" />
              <RHFTextField name="loanPurpose" label="Loan Purpose" />

            </Box>
          </Card>

      {/* {renderTotal} */}
    </Box>
  );
}
