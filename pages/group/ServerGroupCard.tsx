// ServerGroupCard.tsx
import React from 'react';
import { Button } from 'react-bootstrap';
import styles from '../../styles/ServerGroupCard.module.css';
import Link from 'next/link';

interface ServerGroupProps {
  id: number;
  ip_address: string;
  server_group_name: string;
  cpu: string;
  ram: string;
  storage: string;
  additional_info: string;
  image_url: string;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

const ServerGroupCard: React.FC<ServerGroupProps> = ({
  id,
  ip_address,
  server_group_name,
  cpu,
  ram,
  storage,
  additional_info,
  image_url,
  onEdit,
  onDelete
}) => {
  return (
    <div className={styles.cardContainer}>
      <div className={styles.serverGroupCard}>
        <h2>{server_group_name}</h2>
        <img style={{width: 150 , height:150}} src={image_url} alt={server_group_name} />
        <p>ไอพี: {ip_address}</p>
        <p>ซีพียู: {cpu} </p>
        <p>แรม: {ram} gb</p>
        <p>ความจำ: {storage} gb</p>
        <p>รายละเอียดเพิ่มเติม: {additional_info}</p>
        <Link href={`/vm/${id}`} passHref>
          <Button variant="info">ดู</Button>
        </Link>
        <Button variant="warning" onClick={() => onEdit(id)}>แก้ไข</Button>
        <Button variant="danger" onClick={() => onDelete(id)}>ลบ</Button>
      </div>
    </div>
  );
  
};

export default ServerGroupCard;
