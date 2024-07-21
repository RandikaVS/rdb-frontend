import { Controller, useFormContext } from 'react-hook-form';

import Stack from '@mui/material/Stack';
import MenuItem from '@mui/material/MenuItem';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import { RHFSelect, RHFTextField } from 'src/components/hook-form';
import { useAuthContext } from 'src/auth/hooks';
import { useEffect, useState } from 'react';

// ----------------------------------------------------------------------

export default function InvoiceNewEditStatusDate() {

  const { control, setValue } = useFormContext();

  const {user, bankAdmin} = useAuthContext()

  const[referanceNo,setReferanceNo] = useState('########')

  useEffect(() => {

    if(user){
      const nextreferanceNo = user.quatationCount + 1;
      const paddedReferanceNo = String(nextreferanceNo).padStart(3, '0');
      const newReferanceNo = user.branchCode + paddedReferanceNo;
      setReferanceNo(newReferanceNo);
      setValue('referanceNo',newReferanceNo);
    }

  }, [user,setValue])
  


  return (
    <Stack
      spacing={2}
      direction={{ xs: 'column', sm: 'row' }}
      sx={{ p: 3, bgcolor: 'background.neutral' }}
    >
      <RHFTextField
        disabled
        name="referanceNo"
        label="Referance No"
        value={referanceNo}
      />

      {/* <RHFSelect
        fullWidth
        name="status"
        label="Status"
        InputLabelProps={{ shrink: true }}
        PaperPropsSx={{ textTransform: 'capitalize' }}
      >
        {['paid', 'pending', 'overdue', 'draft'].map((option) => (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}
      </RHFSelect> */}

      <Controller
        name="createDate"
        control={control}
        render={({ field, fieldState: { error } }) => (
          <DatePicker
            label="Date create"
            value={field.value}
            onChange={(newValue) => {
              field.onChange(newValue);
            }}
            slotProps={{
              textField: {
                fullWidth: true,
                error: !!error,
                helperText: error?.message,
              },
            }}
          />
        )}
      />

      {/* <Controller
        name="dueDate"
        control={control}
        render={({ field, fieldState: { error } }) => (
          <DatePicker
            label="Due date"
            value={field.value}
            onChange={(newValue) => {
              field.onChange(newValue);
            }}
            slotProps={{
              textField: {
                fullWidth: true,
                error: !!error,
                helperText: error?.message,
              },
            }}
          />
        )}
      /> */}
    </Stack>
  );
}
