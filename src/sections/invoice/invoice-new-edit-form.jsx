import * as Yup from 'yup';
import { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import LoadingButton from '@mui/lab/LoadingButton';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';

import { _addressBooks } from 'src/_mock';

import FormProvider from 'src/components/hook-form';

import InvoiceNewEditDetails from './invoice-new-edit-details';
import InvoiceNewEditAddress from './invoice-new-edit-address';
import InvoiceNewEditStatusDate from './invoice-new-edit-status-date';
import { coverList } from 'src/assets/data';
import { useMainContext } from 'src/context/hooks';
import { useSnackbar } from 'src/components/snackbar';
import { useAuthContext } from 'src/auth/hooks';

// ----------------------------------------------------------------------

export default function InvoiceNewEditForm({ currentQuatation }) {

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const router = useRouter();

  const {createQuatation} = useMainContext()

  const {bankAdmin} = useAuthContext();

  const loadingSave = useBoolean();

  const loadingSend = useBoolean();

  const QuatationSchema = Yup.object().shape({
    
    referanceNo: Yup.string().nullable().required('Referance No is required'),
    customerName: Yup.string().nullable().required('Customer Name is required'),
    nic: Yup.string().nullable().required('NIC is required'),
    gender: Yup.string().nullable().required('Gender is required'),
    customerAddress: Yup.string().nullable().required('Customer Address is required'),
    dob: Yup.mixed().nullable().required('Date of birth is required'),
    mobileNumber: Yup.string().nullable().required('Mobile Number is required'),
    bankAccount: Yup.number().required('Bank Account is required'),
    loanAmount: Yup.number().moreThan(0, 'Loan amount should not be 0').required('Loan Amount is required'),
    
    insurancePolicy: Yup.string().required('Insurance Policy is required'),
    coverList: Yup.array()
    .of(Yup.string())
    .required('Cover list is required')
    .min(1, 'Cover list must contain at least one item'),
    civilStatus: Yup.string().required('Civil Status is required'),
    loanPeriod: Yup.string().required('Loan Period is required'),
    interestRate: Yup.number().moreThan(0, 'Interest rate should not be 0').required('Interest Rate is required'),
    profession: Yup.string().required('Profession is required'),
    loanPurpose: Yup.string().required('Loan Purpose is required'),
    createDate: Yup.mixed().nullable().required('Create date is required'),
    refAdmin: Yup.string().nullable().required('Reference Admin is required'),
    
    // not required
    remarks: Yup.string(),
  });

  const defaultValues = useMemo(
    () => ({
      referanceNo: currentQuatation?.referanceNo || '',
      customerName: currentQuatation?.customerName || '',
      nic: currentQuatation?.nic || '',
      gender: currentQuatation?.gender || '',
      customerAddress: currentQuatation?.customerAddress || '',
      dob: currentQuatation?.dob || null,
      mobileNumber: currentQuatation?.mobileNumber || '',
      bankAccount: currentQuatation?.bankAccount || '',
      loanAmount: currentQuatation?.loanAmount || 0,
      insurancePolicy: currentQuatation?.insurancePolicy || '',
      coverList: currentQuatation?.coverList || [coverList[0]?.label,coverList[1]?.label], // Ensure it's an array with at least one empty string
      civilStatus: currentQuatation?.civilStatus || '',
      loanPeriod: currentQuatation?.loanPeriod || '',
      interestRate: currentQuatation?.interestRate || 0,
      profession: currentQuatation?.profession || '',
      loanPurpose: currentQuatation?.loanPurpose || '',
      createDate: currentQuatation?.createDate || new Date(),
      remarks: currentQuatation?.remarks || '',
      refAdmin: bankAdmin?._id || '',
    }),
    [currentQuatation]
  );
  

  const methods = useForm({
    resolver: yupResolver(QuatationSchema),
    defaultValues,
  });

  const {
    reset,

    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const handleSaveAsDraft = handleSubmit(async (data) => {
    loadingSave.onTrue();

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      reset();
      loadingSave.onFalse();
      // router.push(paths.dashboard.invoice.root);
      console.info('DATA', JSON.stringify(data, null, 2));
    } catch (error) {
      console.error(error);
      loadingSave.onFalse();
    }
  });

  const handleCreateAndSend = handleSubmit(async (data) => {
    loadingSend.onTrue();

    try {
      await createQuatation?.(data,bankAdmin)
      loadingSend.onFalse();
      enqueueSnackbar("Quatation Created")
      reset();
      router.push(paths.dashboard.quatation.list);
      
    } catch (error) {
      console.error(error);
      loadingSend.onFalse();
      enqueueSnackbar("Failed to create quatation ",{ variant: 'error' })
    }
  });

  return (
    <FormProvider methods={methods}>
      <Card>
        <InvoiceNewEditAddress />

        <InvoiceNewEditStatusDate />

        <InvoiceNewEditDetails />
      </Card>

      <Stack justifyContent="flex-end" direction="row" spacing={2} sx={{ mt: 3 }}>
        {/* <LoadingButton
          color="inherit"
          size="large"
          variant="outlined"
          loading={loadingSave.value && isSubmitting}
          onClick={handleSaveAsDraft}
        >
          Save as Draft
        </LoadingButton> */}

        <LoadingButton
          size="large"
          variant="contained"
          loading={loadingSend.value && isSubmitting}
          onClick={handleCreateAndSend}
        >
          {currentQuatation ? 'Update' : 'Create'} & Send
        </LoadingButton>
      </Stack>
    </FormProvider>
  );
}

InvoiceNewEditForm.propTypes = {
  currentQuatation: PropTypes.object,
};
