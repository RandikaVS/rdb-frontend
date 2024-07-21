import * as Yup from 'yup';
import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';

import { useMockedUser } from 'src/hooks/use-mocked-user';

import { fData } from 'src/utils/format-number';

import { countries } from 'src/assets/data';

import { useSnackbar } from 'src/components/snackbar';
import FormProvider, {
  RHFSwitch,
  RHFTextField,
  RHFUploadAvatar,
  RHFAutocomplete,
  RHFSelect,
} from 'src/components/hook-form';
import { useAuthContext } from 'src/auth/hooks';
import { Badge, Chip, Divider, MenuItem } from '@mui/material';
import { ADMIN_STATUS_OPTIONS, USER_CATEGORY } from 'src/_mock';
import Label from 'src/components/label';

// ----------------------------------------------------------------------

export default function AccountGeneral() {
  const { enqueueSnackbar, } = useSnackbar();

  const { user, update_user_account } = useAuthContext()

  const createSchema = (role) => {
    const UpdateSchema = {
      email: Yup.string().required('Email is required').email('Email must be a valid email address'),
      status: Yup.string().required('Status is required'),
      role: Yup.string(),
      displayName: Yup.string(),
      branchName: Yup.string(),
      branchCode: Yup.string(),
      category: Yup.string(),
    };
  
    return Yup.object().shape(UpdateSchema);
  };
  
  const createDefaultValues = (user) => {
    const baseValues = {
      email: user?.email || '',
      status: user?.status || '',
      displayName: user?.displayName || '',
      branchName: user?.branchName || '',
      branchCode: user?.branchCode || '',
      role: user?.role || '',
      category: user?.category || '',
    };
  
    return baseValues;
  };

  const userSchema = createSchema(user?.role);
  
  const defaultValues = createDefaultValues(user);
  
  const methods = useForm({
    resolver: yupResolver(userSchema),
    defaultValues,
  });

  const {
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      console.info('DATA', data);
      await update_user_account?.(data)
      enqueueSnackbar('Update success!');
      
    } catch (error) {
      console.error(error);
      enqueueSnackbar("Failed to update",{ variant: 'error' })
    }
  });

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];

      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });

      if (file) {
        setValue('photoURL', newFile, { shouldValidate: true });
      }
    },
    [setValue]
  );

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        {/* <Grid xs={12} md={4}>
          <Card sx={{ pt: 10, pb: 5, px: 3, textAlign: 'center' }}>
            <RHFUploadAvatar
              name="photoURL"
              maxSize={3145728}
              onDrop={handleDrop}
              helperText={
                <Typography
                  variant="caption"
                  sx={{
                    mt: 3,
                    mx: 'auto',
                    display: 'block',
                    textAlign: 'center',
                    color: 'text.disabled',
                  }}
                >
                  Allowed *.jpeg, *.jpg, *.png, *.gif
                  <br /> max size of {fData(3145728)}
                </Typography>
              }
            />

            <RHFSwitch
              name="isPublic"
              labelPlacement="start"
              label="Public Profile"
              sx={{ mt: 5 }}
            />

            <Button variant="soft" color="error" sx={{ mt: 3 }}>
              Delete User
            </Button>
          </Card>
        </Grid> */}

        <Grid xs={12} md={12}>
          {user?.role === "admin"?(
            <Card sx={{ p: 3 }}>
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
            >
              <RHFTextField name="displayName" label="Name" />
              <RHFTextField name="email" label="Email Address" disabled/>

              <RHFSelect name="status" label="Status" >
                <Divider sx={{ borderStyle: 'dashed' }} />
                {ADMIN_STATUS_OPTIONS.map((status) => (
                  <MenuItem key={status.value} value={status.value}>
                    <Chip
                      key={status.value}
                      label={status.label}
                      size="small"
                      color={
                        status.value==="active" && "success"||
                        status.value==="away" && "warning"||
                        status.value==="busy" && "error"||
                        status.value==="on_leave" && "info"||
                        status.value==="undefined" && "secondary"
                      }
                      variant="filled"
                    />
                  </MenuItem>
                ))}
              </RHFSelect>
              
            </Box>

            <Stack spacing={3} alignItems="flex-end" sx={{ mt: 3 }}>

              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                Save Changes
              </LoadingButton>
            </Stack>
          </Card>
          ):(
            user?.role === "user"?(
              <Card sx={{ p: 3 }}>
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
            >
              <RHFTextField name="email" label="Email Address" disabled/>
              
              <RHFTextField name="branchName" label="Branch Name" />
              <RHFTextField name="branchCode" label="Branch Code" />

              <RHFSelect name="category" label="Category" disabled>
                <Divider sx={{ borderStyle: 'dashed' }} />
                {USER_CATEGORY.map((category) => (
                  <MenuItem key={category.value} value={category.value}>
                    <Chip
                      key={category.value}
                      label={category.label}
                      size="small"
                      color='primary'
                      variant='outlined'
                    />
                  </MenuItem>
                ))}
              </RHFSelect>

              
            </Box>

            <Stack spacing={3} alignItems="flex-end" sx={{ mt: 3 }}>

              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                Save Changes
              </LoadingButton>
            </Stack>
          </Card>
            ):(
            <></>
            )
          )}
          
        </Grid>
      </Grid>
    </FormProvider>
  );
}
