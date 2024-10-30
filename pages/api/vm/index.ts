// pages/api/vm/index.ts
import { NextApiRequest, NextApiResponse } from 'next';
import pool from '../../../connect/db'; 

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      try {
        const [rows] = await pool.query('SELECT * FROM server_vm');
        return res.status(200).json(rows);
      } catch (error) {
        console.error('Error fetching VMs:', error);
        return res.status(500).json({ message: 'Internal server error' });
      }

    case 'POST':
      const { ip_address, vm_name, cpu, ram, storage, additional_info, server_group_id } = req.body;

      try {
        const [result] = await pool.query(
          'INSERT INTO server_vm (ip_address, vm_name, cpu, ram, storage, additional_info, server_group_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
          [ip_address, vm_name, cpu, ram, storage, additional_info, server_group_id]
        );

        return res.status(201).json({
          ip_address,
          vm_name,
          cpu,
          ram,
          storage,
          additional_info,
          server_group_id,
        });
      } catch (error) {
        console.error('Error inserting VM:', error);
        return res.status(500).json({ message: 'Internal server error' });
      }

    default:
      return res.status(405).json({ message: 'Method not allowed' });
  }
}
