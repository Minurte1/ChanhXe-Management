import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";

const BenXeDialog = ({
  visible,
  onHide,
  isEditing,
  formData,
  onInputChange,
  onSave,
}) => {
  return (
    <Dialog
      visible={visible}
      style={{ width: "400px" }}
      header={isEditing ? "Chỉnh sửa bến xe" : "Thêm bến xe"}
      modal
      onHide={onHide}
    >
      <div className="p-fluid">
        {" "}
        <div className="p-field">
          <label htmlFor="tenBenXe">Tên Bến Xe</label>
          <InputText
            id="tenBenXe"
            value={formData.tenBenXe}
            onChange={(e) => onInputChange("tenBenXe", e.target.value)}
          />
        </div>
        <div className="p-field">
          <label htmlFor="tenBenXe">Tên Bến Xe</label>
          <InputText
            id="tenBenXe"
            value={formData.tenBenXe}
            onChange={(e) => onInputChange("tenBenXe", e.target.value)}
          />
        </div>
      </div>
      <div className="p-dialog-footer">
        <Button
          label="Hủy"
          icon="pi pi-times"
          className="p-button-text"
          onClick={onHide}
        />
        <Button
          label="Lưu"
          icon="pi pi-check"
          className="p-button-primary"
          onClick={onSave}
        />
      </div>
    </Dialog>
  );
};

export default BenXeDialog;
