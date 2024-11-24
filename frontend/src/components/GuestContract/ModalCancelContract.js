import React from "react";
import { Modal, Button } from "react-bootstrap";
import { IoWarningOutline } from "react-icons/io5";

const ConfirmCancelModal = ({ show, onHide, onConfirm }) => {
  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Body className="d-flex flex-column align-items-center text-center">
        <h3 className="mb-3">Cảnh báo</h3>
        <div className="mb-3">
          <IoWarningOutline size={92} color="orange" />
        </div>
        <p>Xác nhận hủy hợp đồng và xóa thực đơn đã tạo?</p>
      </Modal.Body>
      <Modal.Footer className="d-flex justify-content-center">
        <Button
          variant="secondary"
          className="btn-modal-delete-huy mx-2"
          onClick={onHide}
        >
          Hủy
        </Button>
        <Button
          variant="danger"
          className="btn-modal-delete mx-2"
          onClick={onConfirm}
        >
          Đồng ý
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ConfirmCancelModal;
