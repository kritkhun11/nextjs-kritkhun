import React, { useEffect, useState } from 'react';
import ServerGroupCard from './ServerGroupCard';
import { Modal, Button, Form, Image } from 'react-bootstrap';
import styles from '../../styles/ServerGroupCard.module.css';
import Swal from 'sweetalert2';
import useAuth from '../้hooks/useAuth';

import { jwtDecode } from "jwt-decode";
interface ServerGroup {
    id: number;
    ip_address: string;
    server_group_name: string;
    cpu: string;
    ram: string;
    storage: string;
    additional_info: string;
    image_url: string;
}


interface UserPayload {
    userId: number;
    status: number;
}
const ServerGroupList: React.FC = () => {
    useAuth();
    const [serverGroups, setServerGroups] = useState<ServerGroup[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingGroup, setEditingGroup] = useState<Partial<ServerGroup> | null>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const decoded = jwtDecode<UserPayload>(token);
            setIsAdmin(decoded.status === 1);
        }
        fetchServerGroups();
    }, []);

    const fetchServerGroups = async () => {
        try {
            const response = await fetch('/api/server-groups');
            const data = await response.json();
            setServerGroups(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error:', error);
            setServerGroups([]);
        }
    };

    const handleDelete = async (id: number) => {
        if (!isAdmin) {
            Swal.fire({
                title: 'คุณไม่ใช่ผู้ดูแลระบบ',
                text: 'ไม่สามารถดำเนินการได้',
                icon: 'error',
                confirmButtonText: 'ตกลง'
            });
            return;
        }
        const result = await Swal.fire({
            title: 'คุณแน่ใจหรือไม่?',
            text: 'คุณต้องการลบ?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'ลบ',
            cancelButtonText: 'ยกเลิก'
        });
        if (result.isConfirmed) {
            try {
                const response = await fetch(`/api/server-groups/${id}`, { method: 'DELETE' });
                if (response.ok) {
                    setServerGroups((prevGroups) => prevGroups.filter((group) => group.id !== id));

                    Swal.fire({
                        title: 'ลบสำเร็จ!',
                        text: 'server group ถูกลบเรียบร้อยแล้ว',
                        icon: 'success',
                        confirmButtonText: 'ตกลง'
                    });
                } else {
                    const errorData = await response.json();
                    Swal.fire({
                        title: 'เกิดข้อผิดพลาด',
                        text: errorData.message || 'ไม่สามารถลบ server group ได้',
                        icon: 'error',
                        confirmButtonText: 'ตกลง'
                    });
                }
            } catch (error) {
                console.error('Error:', error);
                Swal.fire({
                    title: 'เกิดข้อผิดพลาด',
                    text: 'การเชื่อมต่อมีปัญหา',
                    icon: 'error',
                    confirmButtonText: 'ตกลง'
                });
            }
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setEditingGroup((prev) => ({
                    ...prev,
                    image_url: reader.result as string,
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAddGroup = async () => {
        if (!editingGroup) return;

        try {
            const response = await fetch("/api/server-groups", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(editingGroup),
            });

            if (response.ok) {
                const addedGroup = await response.json();
                setServerGroups((prevGroups) => [...prevGroups, addedGroup]);
                setIsModalOpen(false);
                setEditingGroup(null);
                setPreviewImage(null);

                Swal.fire({
                    title: 'สำเร็จ!',
                    text: 'สร้าง server group ใหม่เรียบร้อยแล้ว',
                    icon: 'success',
                    confirmButtonText: 'ตกลง'
                });
            } else {
                const errorData = await response.json();
                Swal.fire({
                    title: 'เกิดข้อผิดพลาด',
                    text: errorData.message || 'ไม่สามารถสร้าง server group ได้',
                    icon: 'error',
                    confirmButtonText: 'ลองใหม่'
                });
            }
        } catch (error) {
            console.error("Error:", error);
            Swal.fire({
                title: 'เกิดข้อผิดพลาด',
                text: 'การเชื่อมต่อมีปัญหา',
                icon: 'error',
                confirmButtonText: 'ตกลง'
            });
        }
    };

    const handleEdit = async (id: number) => {
        if (!isAdmin) {
            Swal.fire({
                title: 'คุณไม่ใช่ผู้ดูแลระบบ',
                text: 'ไม่สามารถดำเนินการได้',
                icon: 'error',
                confirmButtonText: 'ตกลง'
            });
            return;
        }
        try {
            const response = await fetch(`/api/server-groups/${id}`);
            if (response.ok) {
                const data = await response.json();
                setEditingGroup(data);
                setPreviewImage(data.image_url);
                setIsModalOpen(true);
            }
        } catch (error) {
            console.error('Error fetching edit data:', error);
        }
    };

    const handleSaveEdit = async () => {
        if (!editingGroup || !editingGroup.id) return;

        try {
            const response = await fetch(`/api/server-groups/${editingGroup.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...editingGroup,
                    image_base64: editingGroup.image_url
                }),
            });

            if (response.ok) {
                setServerGroups((prevGroups) =>
                    prevGroups.map((group) =>
                        group.id === editingGroup.id ? { ...group, ...editingGroup } : group
                    )
                );
                setIsModalOpen(false);
                setEditingGroup(null);
                setPreviewImage(null);

                Swal.fire({
                    title: 'บันทึกสำเร็จ!',
                    text: 'การแก้ไข server group เสร็จสิ้น',
                    icon: 'success',
                    confirmButtonText: 'ตกลง'
                });
            } else {
                const errorData = await response.json();
                Swal.fire({
                    title: 'เกิดข้อผิดพลาด',
                    text: errorData.message || 'ไม่สามารถบันทึก server group ได้',
                    icon: 'error',
                    confirmButtonText: 'ตกลง'
                });
            }
        } catch (error) {
            console.error('Error updating:', error);
            Swal.fire({
                title: 'เกิดข้อผิดพลาด',
                text: 'การเชื่อมต่อมีปัญหา',
                icon: 'error',
                confirmButtonText: 'ตกลง'
            });
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '1200px', margin: 'auto', backgroundColor: '#f7f9fc', borderRadius: '10px', boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)' }}>
            <h1 style={{ textAlign: 'center', margin: '20px', color: '#007bff', fontWeight: 'bold' }}>หน้ารายการ Groups Server </h1>
            <div className="row">
                <div className="col-10"></div>
                <div className="col-2">
                    <Button
                        className="button-41"
                        variant="primary"
                        onClick={() => {
                            setEditingGroup({
                                ip_address: '',
                                server_group_name: '',
                                cpu: '',
                                ram: '',
                                storage: '',
                                additional_info: '',
                                image_url: '',
                            });
                            setIsModalOpen(true);
                        }}
                        style={{
                            padding: '12px 24px',
                            fontSize: '18px',
                            minWidth: '150px',
                            margin: '10px auto',
                            display: 'block'
                        }}
                    >
                        เพิ่ม
                    </Button>
                </div>
            </div>

            <Modal show={isModalOpen} onHide={() => setIsModalOpen(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>{editingGroup?.id ? 'Edit Server Group' : 'Add Server Group'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formIpAddress">
                            <Form.Label>IP Address</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter IP address"
                                value={editingGroup?.ip_address || ''}
                                onChange={(e) =>
                                    setEditingGroup((prev) => ({ ...prev, ip_address: e.target.value }))
                                }
                                required
                                disabled={!!editingGroup?.id}
                            />
                        </Form.Group>
                        <Form.Group controlId="formGroupName">
                            <Form.Label>Group Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter Group Name"
                                value={editingGroup?.server_group_name || ''}
                                onChange={(e) =>
                                    setEditingGroup((prev) => ({ ...prev, server_group_name: e.target.value }))
                                }
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="formCpu">
                            <Form.Label>CPU</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter CPU"
                                value={editingGroup?.cpu || ''}
                                onChange={(e) =>
                                    setEditingGroup((prev) => ({ ...prev, cpu: e.target.value }))
                                }
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="formRam">
                            <Form.Label>RAM</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter RAM"
                                value={editingGroup?.ram || ''}
                                onChange={(e) =>
                                    setEditingGroup((prev) => ({ ...prev, ram: e.target.value }))
                                }
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="formStorage">
                            <Form.Label>Storage</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter Storage"
                                value={editingGroup?.storage || ''}
                                onChange={(e) =>
                                    setEditingGroup((prev) => ({ ...prev, storage: e.target.value }))
                                }
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="formAdditionalInfo">
                            <Form.Label>Additional Info</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter Additional Info"
                                value={editingGroup?.additional_info || ''}
                                onChange={(e) =>
                                    setEditingGroup((prev) => ({ ...prev, additional_info: e.target.value }))
                                }
                            />
                        </Form.Group>
                        <Form.Group controlId="formImageUrl">
                            <Form.Label>Image URL</Form.Label>
                            {previewImage && (
                                <Image src={previewImage} alt="Preview" fluid className="mb-3" />
                            )}
                            <Form.Control
                                type="file"
                                onChange={(e) => {
                                    const target = e.target as HTMLInputElement;
                                    const file = target.files?.[0];
                                    if (file) {
                                        setPreviewImage(URL.createObjectURL(file));

                                        // ใช้ FileReader เพื่อแปลงเป็น base64
                                        const reader = new FileReader();
                                        reader.onloadend = () => {
                                            setEditingGroup((prev) => ({
                                                ...prev,
                                                image_url: reader.result as string, // กำหนดให้ image_url เป็น base64
                                            }));
                                        };
                                        reader.readAsDataURL(file); // แปลงเป็น base64
                                    }
                                }}
                            />
                        </Form.Group>

                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="success" onClick={editingGroup?.id ? handleSaveEdit : handleAddGroup}>
                        บันทึก
                    </Button>
                    <Button variant="danger" onClick={() => setIsModalOpen(false)}>
                        ยกเลิก
                    </Button>

                </Modal.Footer>
            </Modal>

            <div className={styles.cardContainer}>
                {serverGroups.map((group, index) => (
                    <ServerGroupCard
                        key={`${group.id}-${index}`}
                        {...group}
                        onEdit={() => handleEdit(group.id)}
                        onDelete={() => handleDelete(group.id)}
                    />
                ))}

            </div>

        </div>
    );
};

export default ServerGroupList;
