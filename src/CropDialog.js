import React from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";

export default function CropDialog({ open, onClose, children, onSave }) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle id="crop-dialog-title">File Crop Preview</DialogTitle>
      <DialogContent>{children}</DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>

        <Button onClick={onSave} color="primary" autoFocus>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
