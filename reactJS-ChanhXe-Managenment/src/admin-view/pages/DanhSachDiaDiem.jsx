import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import DiaDiemService from "../../services/diaDiemServices";
import DiaDiemDialog from "./modal/DiaDiemDialog";

const DanhSachDiaDiem = () => {
  const [diaDiemList, setDiaDiemList] = useState([]);
  const [displayDialog, setDisplayDialog] = useState(false);
  const [isNew, setIsNew] = useState(false);
  const [formData, setFormData] = useState({ tinh: "", huyen: "", xa: "" });

  const toast = useRef(null);

  useEffect(() => {
    fetchDiaDiem();
  }, []);

  const fetchDiaDiem = async () => {
    try {
      const response = await DiaDiemService.getAllLocations();
      setDiaDiemList(Array.isArray(response.DT) ? response.DT : []);
    } catch (error) {
      console.log("error", error);
      showError("Lỗi khi tải danh sách địa điểm");
    }
  };

  const showError = (message) => {
    toast.current.show({
      severity: "error",
      summary: "Lỗi",
      detail: message,
      life: 3000,
    });
  };

  const showSuccess = (message) => {
    toast.current.show({
      severity: "success",
      summary: "Thành công",
      detail: message,
      life: 3000,
    });
  };

  const openNew = () => {
    setFormData({ tinh: "", huyen: "", xa: "" });
    setIsNew(true);
    setDisplayDialog(true);
  };

  const editDiaDiem = (diaDiem) => {
    setFormData({ ...diaDiem });
    setIsNew(false);
    setDisplayDialog(true);
  };

  const deleteDiaDiem = async (id) => {
    try {
      await DiaDiemService.deleteLocation(id);
      fetchDiaDiem();
      showSuccess("Xóa địa điểm thành công");
    } catch (error) {
      showError("Lỗi khi xóa địa điểm");
    }
  };

  const saveDiaDiem = async () => {
    try {
      if (isNew) {
        await DiaDiemService.createLocation(formData);
      } else {
        await DiaDiemService.updateLocation(formData.id, formData);
      }
      fetchDiaDiem();
      setDisplayDialog(false);
      showSuccess(
        isNew ? "Thêm địa điểm thành công" : "Cập nhật địa điểm thành công"
      );
    } catch (error) {
      showError(isNew ? "Lỗi khi thêm địa điểm" : "Lỗi khi cập nhật địa điểm");
    }
  };

  const onInputChange = (e, name) => {
    const val = (e.target && e.target.value) || "";
    setFormData((prevData) => ({ ...prevData, [name]: val }));
  };

  return (
    <div className="p-grid">
      <Toast ref={toast} />
      <div className="p-col-12">
        <div className="card">
          <h1>Danh Sách Địa Điểm</h1>
          <Button
            label="Thêm mới"
            icon="pi pi-plus"
            className="p-button-success"
            onClick={openNew}
            style={{ marginBottom: "10px" }}
          />
          <DataTable
            value={diaDiemList}
            paginator
            rows={10}
            rowsPerPageOptions={[5, 10, 25]}
          >
            <Column field="tinh" header="Tỉnh"></Column>
            <Column field="huyen" header="Huyện"></Column>
            <Column field="xa" header="Xã"></Column>
            <Column
              body={(rowData) => (
                <>
                  <Button
                    icon="pi pi-pencil"
                    className="p-button-rounded p-button-success p-mr-2"
                    onClick={() => editDiaDiem(rowData)}
                  />
                  <Button
                    icon="pi pi-trash"
                    style={{ marginLeft: "5px" }}
                    className="p-button-rounded p-button-warning"
                    onClick={() => deleteDiaDiem(rowData.id)}
                  />
                </>
              )}
            />
          </DataTable>
        </div>
      </div>

      <DiaDiemDialog
        visible={displayDialog}
        onHide={() => setDisplayDialog(false)}
        isNew={isNew}
        formData={formData}
        onInputChange={onInputChange}
        onSave={saveDiaDiem}
      />
    </div>
  );
};

export default DanhSachDiaDiem;
