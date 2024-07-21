import PropTypes from 'prop-types';
import {useMemo, useReducer, useCallback, useEffect} from 'react';

import axios, {endpoints} from 'src/utils/axios';

import {MainContext} from './main-context';

const initialState = {
  loading: false,
  quatations:null,
  new_quatation:null,
  uploaded_document_state:null,
  reply_quatation_state:null,
  quatation_reply_file:null

};

const reducer = (state, action) => {

  if (action.type === 'INITIAL') {
    return {
      loading: action.payload.loading, 
      quatations:action.payload.quatations,
      new_quatation:action.payload.new_quatation,
      quatation_reply_file:null,
      uploaded_document_state:null
    };
  }
  if (action.type === 'CREATE_QUATATION') {
    return {
      ...state,
      new_quatation:action.payload.new_quatation.data
    };
  }
  if (action.type === 'GET_QUATATION_BY_USER') {
    return {
      ...state,
      quatations:action.payload.quatations.data
    };
  }
  if (action.type === 'GET_QUATATION_BY_ADMIN') {
    return {
      ...state,
      quatations:action.payload.quatations.data
    };
  }
  if (action.type === 'GET_QUATATION_BY_STAFF') {
    return {
      ...state,
      quatations:action.payload.quatations.data
    };
  }
  if (action.type === 'UPLOAD_DOCUMENT_FOR_QUATATION') {
    return {
      ...state,
      uploaded_document_state: action.payload.uploaded_document_state.data,
    };
  }
  if (action.type === 'REPLY_FOR_QUATATION') {
    return {
      ...state,
      reply_quatation_state: action.payload.reply_quatation_state,
    };
  }
  if (action.type === 'GET_QUATATION_REPLY_FILE') {
    return {
      ...state,
      quatation_reply_file: action.payload.quatation_reply_file.data,
    };
  }
  if (action.type === 'RESET_REPLY_QUATATION_STATE') {
    return {
      ...state,
      reply_quatation_state: null,
      uploaded_document_state:null
    };
  }
  return state;

};

// ----------------------------------------------------------------------

export function MainContextProvider({children}) {

  const [state, dispatch] = useReducer(reducer, initialState);


  // REGISTER
  const createQuatation = useCallback(async (quatation,bankAdmin) => {


    const newQuatation = {
      civilStatus: quatation.civilStatus,
      coverList: quatation.coverList,
      createDate: quatation.createDate,
      customerAddress: quatation.customerAddress,
      customerName: quatation.customerName,
      dob: quatation.dob,
      gender: quatation.gender,
      bankAccount: quatation.bankAccount,
      insurancePolicy: quatation.insurancePolicy,
      interestRate: quatation.interestRate,
      loanAmount: quatation.loanAmount,
      loanPeriod: quatation.loanPeriod,
      loanPurpose: quatation.loanPurpose,
      mobileNumber: quatation.mobileNumber,
      nic: quatation.nic,
      profession: quatation.profession,
      referanceNo: quatation.referanceNo,
      remarks: quatation.remarks,
      refAdmin:bankAdmin?._id
  };

    const response = await axios.post(endpoints.quatation.create, newQuatation);

    const { success, message,data } = response.data;
    
    dispatch({
      type: 'CREATE_QUATATION',
      payload: {
        new_quatation: {
          success,
          message,
          data
        },
      },
    });
  }, []);
  
  const getQuatationByUserId = useCallback(async () => {

    const response = await axios.get(endpoints.quatation.get_by_user_id);

    const { success, message,data } = response.data;
    
    dispatch({
      type: 'GET_QUATATION_BY_USER',
      payload: {
        quatations: {
          data,
          success,
          message
        },
      },
    });
  }, []);

  const getQuatationByAdminId = useCallback(async () => {

    const response = await axios.get(endpoints.quatation.get_by_admin_id);

    const { success, message,data } = response.data;
    
    dispatch({
      type: 'GET_QUATATION_BY_ADMIN',
      payload: {
        quatations: {
          data,
          success,
          message
        },
      },
    });
  }, []);

  const getQuatationByStaffId = useCallback(async () => {

    const response = await axios.get(endpoints.quatation.get_by_staff_id);

    const { success, message,data } = response.data;
    
    dispatch({
      type: 'GET_QUATATION_BY_STAFF',
      payload: {
        quatations: {
          data,
          success,
          message
        },
      },
    });
  }, []);

  const uploadDocumentForQuatation = useCallback(async (payload, more_items) => {

    const response = await axios.post(endpoints.document.create_new_document, payload, {
      headers: {
        'Content-Type': 'multipart/form-data', ...more_items
      }
    });
    const {success, message, data} = response.data;

    dispatch({
      type: 'UPLOAD_DOCUMENT_FOR_QUATATION', 
      payload: {
        uploaded_document_state: {
          success, message, data,
        },
      },
    });

  }, []);

  const replyQuatation = useCallback(async (reply,quatationid) => {

    const response = await axios.post(`${endpoints.quatation.reply}/${quatationid}`,reply);

    const { success, message,data } = response.data;
    
    dispatch({
      type: 'REPLY_FOR_QUATATION',
      payload: {
        reply_quatation_state: {
          success,
          message,
          data
        },
      },
    });
  }, []);

  const getQuatationFile = useCallback(async (url) => {
    

    const response = await axios.get(url);

    const { success, message,data } = response.data;

    
    dispatch({
      type: 'GET_QUATATION_REPLY_FILE',
      payload: {
        quatation_reply_file: {
          success, message,data
        },
      },
    });
  }, []);

  const resetReplyQuatation = useCallback(async () => {

    dispatch({
      type: 'RESET_REPLY_QUATATION_STATE',
      payload: {
        reply_quatation_state: null
      },
    });
  }, []);


  // ----------------------------------------------------------------------

  const memoizedValue = useMemo(
    () => ({
      quatations: state.quatations,
      new_quatation: state.new_quatation,
      uploaded_document_state: state.uploaded_document_state,
      reply_quatation_state: state.reply_quatation_state,
      quatation_reply_file: state.quatation_reply_file,

      createQuatation,
      getQuatationByUserId,
      getQuatationByAdminId,
      getQuatationByStaffId,
      uploadDocumentForQuatation,
      replyQuatation,
      resetReplyQuatation,
      getQuatationFile,
    
    }), [
          createQuatation, 
          getQuatationByUserId, 
          getQuatationByAdminId, 
          getQuatationByStaffId,
          uploadDocumentForQuatation, 
          replyQuatation, 
          resetReplyQuatation,
          getQuatationFile,

          state.quatations, 
          state.new_quatation, 
          state.uploaded_document_state, 
          state.reply_quatation_state, 
          state.quatation_reply_file,
          state
        ]);

  return <MainContext.Provider value={memoizedValue}>{children}</MainContext.Provider>;
}

MainContextProvider.propTypes = {
  children: PropTypes.node,
};
