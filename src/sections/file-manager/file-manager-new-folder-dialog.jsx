import PropTypes from 'prop-types';
import { useState, useEffect, useCallback } from 'react';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import TextField from '@mui/material/TextField';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import Iconify from 'src/components/iconify';
import { MultiFilePreview, Upload } from 'src/components/upload';
import { useMainContext } from 'src/context/hooks';
import { useSnackbar } from 'src/components/snackbar';

// ----------------------------------------------------------------------

export default function FileManagerNewFolderDialog({
  title = 'Upload Files',
  open,
  onClose,
  multiple = false,
  //
  onCreate,
  onUpdate,
  onUpload,
  //
  folderName,
  currentQuatation,
  onChangeFolderName,
  setFiles,
  files,
  ...other
}) {

  const { enqueueSnackbar } = useSnackbar();
  // const [files, setFiles] = useState([]);

  const {uploadDocumentForQuatation,uploaded_document_state,quatations} = useMainContext()


  useEffect(() => {
    if (!open) {
      setFiles([]);
    }
  }, [open]);

  useEffect(() => {
    if (uploaded_document_state) {
      onClose();
      enqueueSnackbar("Document uploaded")
    }
  }, [uploaded_document_state]);

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

  const handleUpload = async() => {
    try {
        
        const formData = new FormData();

        formData.append('document', files[0]);

        const data = {
          quatationId: currentQuatation?._id,
          filename: files[0].name,
          userid: currentQuatation?.user?._id,
        };

        await uploadDocumentForQuatation?.(formData, data);
    
    } 
    
    catch (error) {
      console.error(error)
      enqueueSnackbar("Failed to upload document",{variant:'error'})
    }
  };

  const handleRemoveFile = (inputFile) => {
    const filtered = files.filter((file) => file !== inputFile);
    setFiles(filtered);
  };

  const handleRemoveAllFiles = () => {
    setFiles([]);
  };

  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={onClose} {...other}>
      <DialogTitle sx={{ p: (theme) => theme.spacing(3, 3, 2, 3) }}> {title} </DialogTitle>

      <DialogContent dividers sx={{ pt: 1, pb: 0, border: 'none' }}>
        {(onCreate || onUpdate) && (
          <TextField
            fullWidth
            label="Folder name"
            value={files}
            onChange={setFiles}
            sx={{ mb: 3 }}
          />
        )}
        {files.length > 0 ?
        <MultiFilePreview files={files} thumbnail={true} onRemove={handleRemoveFile}/>
        :
        <Upload files={files} onDrop={handleDrop} onRemove={handleRemoveFile} />
        }
        
        
      </DialogContent>

      <DialogActions>
        <Button
          variant="contained"
          startIcon={<Iconify icon="eva:cloud-upload-fill" />}
          onClick={handleUpload}
        >
          Upload
        </Button>

        {!!files.length && (
          <Button variant="outlined" color="inherit" onClick={handleRemoveAllFiles}>
            Remove all
          </Button>
        )}

        {(onCreate || onUpdate) && (
          <Stack direction="row" justifyContent="flex-end" flexGrow={1}>
            <Button variant="soft" onClick={onCreate || onUpdate}>
              {onUpdate ? 'Save' : 'Create'}
            </Button>
          </Stack>
        )}
      </DialogActions>
    </Dialog>
  );
}

FileManagerNewFolderDialog.propTypes = {
  folderName: PropTypes.string,
  onChangeFolderName: PropTypes.func,
  onClose: PropTypes.func,
  onCreate: PropTypes.func,
  onUpdate: PropTypes.func,
  open: PropTypes.bool,
  title: PropTypes.string,
  files: PropTypes.string,
  setFiles: PropTypes.string,
};
