import { Modal, Box } from '@mui/material';

function CenteredModal({ open, onClose, children }) {
  return (
    <Modal open={open} onClose={onClose}>
		<Box
			sx={{
			  position: 'absolute',
			  top: '50%',
			  left: '50%',
			  transform: 'translate(-50%, -50%)',
			  width: { xs: '100%', sm: '50vw' },
			  height: 'auto',
			  bgcolor: 'background.contrast',
			  borderRadius: {xs: 0, md: 1 },
			  outline: 'none',
			  margin: 0,
			  overflow: 'hidden',

			  paddingTop: '0 !important',
			  paddingBottom: '0 !important',
			  paddingLeft: '0 !important',
			  paddingRight: '0 !important',
			}}
		>
			{children}
		</Box>
    </Modal>
  );
}

export default CenteredModal;
