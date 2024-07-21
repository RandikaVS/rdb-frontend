import * as Yup from 'yup';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Container from '@mui/material/Container';


import PropTypes from 'prop-types';
import { paths } from 'src/routes/paths';

import { _invoices } from 'src/_mock';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import InvoiceDetails from '../invoice-details';
import { useMainContext } from 'src/context/hooks';
import FormProvider from 'src/components/hook-form/form-provider';
import { useAuthContext } from 'src/auth/hooks';
import { parseISO } from 'date-fns';
import { useBoolean } from 'src/hooks/use-boolean';
import { useSnackbar } from 'src/components/snackbar';
import { useRouter } from 'src/routes/hooks';
import { coverList } from 'src/assets/data';

// ----------------------------------------------------------------------

export default function InvoiceDetailsView({ id }) {
  const settings = useSettingsContext();

  const loadingReply = useBoolean()

  const router = useRouter();

  const {enqueueSnackbar} = useSnackbar()

  const {quatations,replyQuatation,reply_quatation_state,resetReplyQuatation} = useMainContext();

  const {user} = useAuthContext()

  const [currentQuatation, setCurrentQuatation] = useState(quatations?.filter((quatation) => quatation._id === id)[0])

  useEffect(() => {
    
    if(!currentQuatation){
      let quatation = quatations?.filter((quatation) => quatation._id === id)[0]
      if(!quatation){
        router.push(paths.dashboard.quatation.list);
      }
      else{
        setCurrentQuatation(quatation)
      }
      
    }
  }, [currentQuatation,setCurrentQuatation])


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
    
    // not required
    remarks: Yup.string(),
    reply: Yup.array()
  });

  const defaultValues = useMemo(
    () => ({
      referanceNo: currentQuatation?.referanceNo || '',
      customerName: currentQuatation?.customerName || '',
      nic: currentQuatation?.nic || '',
      gender: currentQuatation?.gender || '',
      customerAddress: currentQuatation?.customerAddress || '',
      dob: new Date(currentQuatation?.dob) || null,
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
      reply: currentQuatation?.reply || [
        {
          benifit: 'Life cover plus TPD',
          totalAmount: 0,
          document: null,
          confirmBy:user?._id
        }
      ]
    }),
    [currentQuatation]
  );
  
  const methods = useForm({
    resolver: yupResolver(QuatationSchema),
    defaultValues,
    disabled: user?.role === "user"?true:false,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const handleResetReplyQuatation = async()=>{
    try {
      await resetReplyQuatation?.()
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    
    if(reply_quatation_state?.success){
      loadingReply.onFalse();
      enqueueSnackbar("Reply send")
      reset();
      handleResetReplyQuatation()
      router.push(paths.dashboard.quatation.list);
    }
  }, [reply_quatation_state])

  const handleReply = handleSubmit(async (data) => {
    loadingReply.onTrue();

    if(!data?.benifit){
      enqueueSnackbar("Please fill the Benifit", {variant:"error"})
      loadingReply.onFalse();
      return
    }
    if(!data?.totalAmount){
      enqueueSnackbar("Please fill the Total Amount", {variant:"error"})
      loadingReply.onFalse();
      return
    }
    if(!data.document?.link){
      enqueueSnackbar("Please upload the Document", {variant:"error"})
      loadingReply.onFalse();
      return
    }
    
    const reply = 
      {
        benifit:data?.benifit || "Life cover plus TPD",
        totalAmount: data?.totalAmount,
        document: data.document?.link,
        confirmBy: data?.confirmBy?data?.confirmBy:user?._id
      }
    
    const quatationid = currentQuatation?._id
    

    try {
      await replyQuatation?.(reply,quatationid)
      
    } catch (error) {
      console.error(error);
      loadingReply.onFalse();
      enqueueSnackbar("Failed to reply quatation ",{ variant: 'error' })
    }
  });

  return (
    <FormProvider methods={methods}>
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading={currentQuatation?.customerName}
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'Quatation',
            href: paths.dashboard.quatation.list,
          },
          { name: currentQuatation?.referanceNo },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      {currentQuatation &&
      <InvoiceDetails currentQuatation={currentQuatation} handleReply={handleReply} loadingReply={loadingReply}/>
      }
    </Container>
    </FormProvider>
  );
}

InvoiceDetailsView.propTypes = {
  id: PropTypes.string,
};
