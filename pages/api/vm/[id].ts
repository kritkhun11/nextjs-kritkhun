import { NextApiRequest, NextApiResponse } from 'next';
import pool from '../../../connect/db'; 

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  switch (req.method) {
    case 'GET':
      try {
        const [rows] = await pool.query('SELECT server_vm.*, server_group.server_group_name FROM server_vm LEFT JOIN server_group ON server_vm.server_group_id = server_group.id WHERE server_vm.server_group_id = ?' , [id])as any[];
        if (rows.length > 0) {
          return res.status(200).json(rows); 
        }
        return res.status(404).json({ message: 'VM not found' });
      } catch (error) {
        console.error('Error fetching VM:', error);
        return res.status(500).json({ message: 'Internal server error' });
      }

    case 'POST': 
      const { ip_address, vm_name, cpu, ram, storage, additional_info } = req.body;
      try {
        const [result] = await pool.query(
          'INSERT INTO server_vm (ip_address, vm_name, cpu, ram, storage, additional_info, server_group_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
          [ip_address, vm_name, cpu, ram, storage, additional_info, id]
        );
        return res.status(201).json({ 
          ip_address, 
          vm_name, 
          cpu, 
          ram, 
          storage, 
          additional_info, 
          server_group_id: id 
        });
      } catch (error) {
        console.error('Error inserting VM:', error);
        return res.status(500).json({ message: 'Internal server error' });
      }

    case 'PUT':
      const updateData = req.body;
      try {
        await pool.query(
          'UPDATE server_vm SET ip_address = ?, vm_name = ?, cpu = ?, ram = ?, storage = ?, additional_info = ? WHERE id = ?',
          [updateData.ip_address, updateData.vm_name, updateData.cpu, updateData.ram, updateData.storage, updateData.additional_info, id]
        );
        return res.status(200).json({ message: 'VM updated successfully' });
      } catch (error) {
        console.error('Error updating VM:', error);
        return res.status(500).json({ message: 'Internal server error' });
      }

    case 'DELETE':
      try {
        await pool.query('DELETE FROM server_vm WHERE id = ?', [id]);
        return res.status(204).end();
      } catch (error) {
        console.error('Error deleting VM:', error);
        return res.status(500).json({ message: 'Internal server error' });
      }

    default:
      return res.status(405).json({ message: 'Method not allowed' });
  }
}
