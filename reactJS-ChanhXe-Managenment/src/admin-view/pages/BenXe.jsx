import { useEffect, useState, useRef } from "react";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import BenXeService from "../../services/benXeServices";
import BenXeDialog from "./modal/BenXeDialog";

const BenXe = () => {
  const [benXeList, setBenXeList] = useState([]);
  const [benXe, setBenXe] = useState({ id: null, tenBenXe: "" });
  const [dialogVisible, setDialogVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const toast = useRef(null);

  useEffect(() => {
    loadBenXe();
  }, []);

  const loadBenXe = async () => {
    const response = await BenXeService.getAllBenXe();
    setBenXeList(response.data);
  };

  const openNew = () => {
    setBenXe({ id: null, tenBenXe: "" });
    setIsEditing(false);
    setDialogVisible(true);
  };

  const editBenXe = (rowData) => {
    setBenXe({ ...rowData });
    setIsEditing(true);
    setDialogVisible(true);
  };

  const hideDialog = () => {
    setDialogVisible(false);
  };

  const saveBenXe = async () => {
    if (isEditing) {
      await BenXeService.updateBenXe(benXe.id, benXe);
      toast.current.show({
        severity: "success",
        summary: "Thành công",
        detail: "Cập nhật bến xe thành công",
      });
    } else {
      await BenXeService.createBenXe(benXe);
      toast.current.show({
        severity: "success",
        summary: "Thành công",
        detail: "Thêm bến xe thành công",
      });
    }
    setDialogVisible(false);
    loadBenXe();
  };

  const deleteBenXe = async (rowData) => {
    await BenXeService.deleteBenXe(rowData.id);
    toast.current.show({
      severity: "warn",
      summary: "Đã xóa",
      detail: "Bến xe đã bị xóa",
    });
    loadBenXe();
  };

  return (
    <div>
      {" "}
      <h1>Danh Sách Bến Xe</h1>
      <Toast ref={toast} />
      <Button
        label="Thêm Bến Xe"
        icon="pi pi-plus"
        className="p-button-success mb-3"
        onClick={openNew}
      />
      <DataTable
        value={benXeList}
        paginator
        rows={10}
        responsiveLayout="scroll"
      >
        <Column field="id" header="ID" sortable></Column>
        <Column field="tenBenXe" header="Tên Bến Xe" sortable></Column>
        <Column
          body={(rowData) => (
            <>
              <Button
                icon="pi pi-pencil"
                className="p-button-rounded p-button-info mr-2"
                onClick={() => editBenXe(rowData)}
              />
              <Button
                icon="pi pi-trash"
                className="p-button-rounded p-button-danger"
                onClick={() => deleteBenXe(rowData)}
              />
            </>
          )}
        ></Column>
      </DataTable>
      <BenXeDialog
        visible={dialogVisible}
        onHide={hideDialog}
        isEditing={isEditing}
        formData={benXe}
        onInputChange={(field, value) => setBenXe({ ...benXe, [field]: value })}
        onSave={saveBenXe}
      />
    </div>
  );
};

export default BenXe;
