import React from "react";
import { Modal, Button } from "react-bootstrap";
import Swal from "sweetalert2"; 
import guestLocationApi from "../../api/guestLocationApi"; // Đảm bảo đường dẫn tới API đúng
import { IoWarningOutline } from "react-icons/io5";

function ModalInfoMenu({ show, onClose, menuId }) {
  

  return (
    <Modal
      show={show}
      onHide={onClose}
      size="lg"
    >
      <Modal.Body className="d-flex flex-column align-items-center text-center">
        <h3 className="mb-3">Thực đơn đã đặt</h3>
        <div className="mb-3">
        </div>
      </Modal.Body>
      <Modal.Footer className="d-flex justify-content-center">
        <Button
          variant="secondary"
          className="btn-modal-delete-huy mx-2"
          onClick={onClose}
        >
          Đóng
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ModalInfoMenu;
