import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Button, Table, Modal, Form } from 'react-bootstrap';
// import { table } from 'console';
import Swal from 'sweetalert2';

const vm = () => {
  const router = useRouter();
  const { id } = router.query;
  const [vms, setVms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editVmId, setEditVmId] = useState(null);
  const [newVm, setNewVm] = useState({
    ip_address: '',
    vm_name: '',
    cpu: '',
    ram: '',
    storage: '',
    additional_info: '',
    server_group_id: id,
  });

  useEffect(() => {
    if (id) {
      fetchVMs();
    }
  }, [id]);

  const fetchVMs = async () => {
    try {
      const response = await fetch(`/api/vm/${id}`);
      if (response.status === 404) {
        console.warn('No VM found for this ID');
        setVms([]); // *** เซ็ทเช็ค 1 ตั้งค่าเป็น array ว่างหากไม่พบข้อมูล
        return;
      }

      if (!response.ok) throw new Error('Failed to fetch VM data');

      const data = await response.json();
      setVms(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching VMs:', error);
      setVms([]);
    } finally {
      setLoading(false);
    }
  };


  const addVM = async () => {
    try {
      if (!newVm.ip_address || !newVm.vm_name || !newVm.cpu || !newVm.ram || !newVm.storage) {
        Swal.fire("กรุณากรอกข้อมูลให้ครบถ้วน", "", "warning");
        return;
      }

      const response = await fetch('/api/vm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newVm),
      });

      if (response.ok) {
        const addedVm = await response.json();
        setVms(prev => [...prev, addedVm]);
        setShowModal(false);
        resetNewVm();
        fetchVMs();
        Swal.fire("สำเร็จ", "เพิ่ม VM สำเร็จ", "success");
      } else {
        Swal.fire("เกิดข้อผิดพลาด", "ไม่สามารถเพิ่ม VM ได้", "error");
      }
    } catch (error) {
      console.error('Error adding VM:', error);
      Swal.fire("เกิดข้อผิดพลาด", "การเพิ่ม VM ล้มเหลว", "error");
    }
  };

  const updateVM = async () => {
    try {
      if (!newVm.ip_address || !newVm.vm_name || !newVm.cpu || !newVm.ram || !newVm.storage) {
        Swal.fire("กรุณากรอกข้อมูลให้ครบถ้วน", "", "warning");
        return;
      }

      const response = await fetch(`/api/vm/${editVmId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newVm),
      });

      if (response.ok) {
        fetchVMs();
        setShowModal(false);
        resetNewVm();
        Swal.fire("สำเร็จ", "อัปเดต VM สำเร็จ", "success");
      } else {
        Swal.fire("เกิดข้อผิดพลาด", "ไม่สามารถอัปเดต VM ได้", "error");
      }
    } catch (error) {
      console.error('Error updating VM:', error);
      Swal.fire("เกิดข้อผิดพลาด", "การอัปเดต VM ล้มเหลว", "error");
    }
  };

  const deleteVM = async (id: number) => {
    try {
      const result = await Swal.fire({
        title: "ยืนยันการลบ?",
        text: "คุณต้องการลบ VM นี้หรือไม่?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "ใช่, ลบเลย!",
        cancelButtonText: "ยกเลิก",
      });

      if (result.isConfirmed) {
        const response = await fetch(`/api/vm/${id}`, { method: 'DELETE' });

        if (response.ok) {
          fetchVMs();
          Swal.fire("สำเร็จ", "ลบ VM สำเร็จ", "success");
        } else {
          Swal.fire("เกิดข้อผิดพลาด", "ไม่สามารถลบ VM ได้", "error");
        }
      }
    } catch (error) {
      console.error('Error deleting VM:', error);
      Swal.fire("เกิดข้อผิดพลาด", "การลบ VM ล้มเหลว", "error");
    }
  };

  const resetNewVm = () => {
    setNewVm({
      ip_address: '',
      vm_name: '',
      cpu: '',
      ram: '',
      storage: '',
      additional_info: '',
      server_group_id: id,
    });
    setIsEdit(false);
    setEditVmId(null);
  };

  const handleEdit = (vm: any) => {
    setNewVm(vm);
    setIsEdit(true);
    setEditVmId(vm.id);
    setShowModal(true);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: 'auto', backgroundColor: '#f7f9fc', borderRadius: '10px', boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)' }}>
      <h1 style={{ textAlign: 'center', margin: '20px', color: '#007bff', fontWeight: 'bold' }}>หน้ารายการ VM Server </h1>

      <Button variant="primary" onClick={() => { setShowModal(true); resetNewVm(); }} style={{
        padding: '12px 24px',
        fontSize: '18px',
        minWidth: '150px',
        margin: '10px auto',
        display: 'block'
      }}>
        {isEdit ? 'เพิ่ม VM Server' : 'เพิ่ม VM Server'}
      </Button>
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{isEdit ? 'แก้ไข VM Server' : 'เพิ่ม VM Server'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formIpAddress">
              <Form.Label>IP Address</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter IP Address"
                value={newVm.ip_address}
                onChange={(e) => setNewVm({ ...newVm, ip_address: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group controlId="formVmName">
              <Form.Label>VM Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter VM Name"
                value={newVm.vm_name}
                onChange={(e) => setNewVm({ ...newVm, vm_name: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group controlId="formCpu">
              <Form.Label>CPU</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter CPU"
                value={newVm.cpu}
                onChange={(e) => setNewVm({ ...newVm, cpu: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group controlId="formRam">
              <Form.Label>RAM</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter RAM"
                value={newVm.ram}
                onChange={(e) => setNewVm({ ...newVm, ram: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group controlId="formStorage">
              <Form.Label>Storage</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Storage"
                value={newVm.storage}
                onChange={(e) => setNewVm({ ...newVm, storage: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group controlId="formAdditionalInfo">
              <Form.Label>Additional Info</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Additional Info"
                value={newVm.additional_info}
                onChange={(e) => setNewVm({ ...newVm, additional_info: e.target.value })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="success" onClick={isEdit ? updateVM : addVM}>
            {isEdit ? 'บันทึก' : 'บันทึก'}
          </Button>
          <Button variant="danger" onClick={() => setShowModal(false)}>
            ยกเลิก
          </Button>

        </Modal.Footer>
      </Modal>
      <br />
      {loading ? (
        <p style={{ textAlign: 'center', color: '#888' }}>Loading...</p>
      ) : (
        <>
          {vms.length === 0 ? (
            <Table striped bordered hover style={{ marginTop: '20px', textAlign: 'center' }}>
              <thead>
                <tr style={{ backgroundColor: '#007bff', color: 'white' }}>
                  <th>ลำดับ</th>
                  <th>ไอพี</th>
                  <th>ชื่อ</th>
                  <th>ซีพียู</th>
                  <th>แรม</th>
                  <th>ความจำ</th>
                  <th>รายละเอียดเพิ่มเติม</th>
                  <th>เซิฟเวอร์กรุ๊ป</th>
                  <th>จัดการ</th>
                </tr>
              </thead>
            </Table>
          ) : (
            <Table striped bordered hover style={{ marginTop: '20px', textAlign: 'center' }}>
              <thead>
                <tr style={{ backgroundColor: '#007bff', color: 'white' }}>
                  <th>ลำดับ</th>
                  <th>ไอพี</th>
                  <th>ชื่อ</th>
                  <th>ซีพียู</th>
                  <th>แรม</th>
                  <th>ความจำ</th>
                  <th>รายละเอียดเพิ่มเติม</th>
                  <th>เซิฟเวอร์กรุ๊ป</th>
                  <th>จัดการ</th>
                </tr>
              </thead>
              <tbody>
                {vms.map(vm => (
                  <tr key={vm.id}>
                    <td>{vm.id}</td>
                    <td>{vm.ip_address}</td>
                    <td>{vm.vm_name}</td>
                    <td>{vm.cpu}</td>
                    <td>{vm.ram}</td>
                    <td>{vm.storage}</td>
                    <td>{vm.additional_info}</td>
                    <td>{vm.server_group_id}</td>
                    <td>
                      <Button variant="warning" onClick={() => handleEdit(vm)}>แก้ไข</Button>{' '}
                      <Button variant="danger" onClick={() => deleteVM(vm.id)}>ลบ</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </>
      )}
    </div>

  );
};

export default vm;
