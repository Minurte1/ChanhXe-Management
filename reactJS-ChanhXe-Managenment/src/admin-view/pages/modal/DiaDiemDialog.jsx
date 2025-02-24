import React from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";

const DiaDiemDialog = ({
  visible,
  onHide,
  isNew,
  formData,
  onInputChange,
  onSave,
}) => {
  return (
    <Dialog
      visible={visible}
      onHide={onHide}
      header={isNew ? "Thêm Địa Điểm" : "Chỉnh Sửa Địa Điểm"}
      modal
      footer={
        <>
          <Button
            label="Hủy"
            icon="pi pi-times"
            onClick={onHide}
            className="p-button-text"
          />
          <Button label="Lưu" icon="pi pi-check" onClick={onSave} autoFocus />
        </>
      }
    >
      <div className="p-fluid">
        <div className="p-field">
          <label htmlFor="tinh">Tỉnh</label>
          <InputText
            id="tinh"
            value={formData.tinh}
            onChange={(e) => onInputChange(e, "tinh")}
          />
        </div>
        <div className="p-field">
          <label htmlFor="huyen">Huyện</label>
          <InputText
            id="huyen"
            value={formData.huyen}
            onChange={(e) => onInputChange(e, "huyen")}
          />
        </div>
        <div className="p-field">
          <label htmlFor="xa">Xã</label>
          <InputText
            id="xa"
            value={formData.xa}
            onChange={(e) => onInputChange(e, "xa")}
          />
        </div>
      </div>
    </Dialog>
  );
};

export default DiaDiemDialog;
