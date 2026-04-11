import { Modal } from "rsuite";

function ModalWithoutButtons({ open, setOpen, body, title, size }) {
  function handleClose() {
    setOpen(false);
  }
  return (
    <>
      <Modal
        size={size ? size : "520px"}
        backdrop={"static"}
        keyboard={false}
        open={open}
        onClose={handleClose}
      >
        <Modal.Header
          className={`p-5 bg-[color:var(--background-light)] dark:bg-[color:var(--background-dark-light)] `}
        >
          <Modal.Title className="capitalize">{title}</Modal.Title>
        </Modal.Header>

        <Modal.Body className="p-0">{body}</Modal.Body>
      </Modal>
    </>
  );
}

export default ModalWithoutButtons;
