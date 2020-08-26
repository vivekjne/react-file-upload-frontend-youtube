import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

export default function AlertDialog({show,onHide,children,onSave}) {

  return (
    <div>
    
      <Dialog
        open={show}
        onClose={onHide}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">File Crop Preview</DialogTitle>
        <DialogContent>
       {children}
        </DialogContent>
        <DialogActions>
          <Button onClick={onHide} color="primary">
            Cancel
          </Button>
          <Button onClick={onSave} color="primary" autoFocus>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
