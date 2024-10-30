import { NextApiRequest, NextApiResponse } from 'next';
import pool from '../../../connect/db';
// import fs from 'fs';
// import path from 'path';

export const config = {
  api: {
    bodyParser: true, 
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      const [rows] = await pool.query('SELECT * FROM server_group WHERE id = ?', [id])as any[];
      if (rows.length === 0) return res.status(404).json({ message: 'Server group not found' });
      res.status(200).json(rows[0]);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching server group', error });
    }
  } else if (req.method === 'PUT') {
    const { server_group_name, cpu, ram, storage, additional_info, image_base64 } = req.body;

    try {
        const [oldData] = await pool.query('SELECT * FROM server_group WHERE id = ?', [id])as any[];
        if (oldData.length === 0) return res.status(404).json({ message: 'Server group not found' });

        let imageUrl = oldData[0].image_url;

        if (image_base64) {
            imageUrl = image_base64;
        }

        await pool.query(
            'UPDATE server_group SET server_group_name = ?, cpu = ?, ram = ?, storage = ?, additional_info = ?, image_url = ? WHERE id = ?',
            [
                server_group_name || oldData[0].server_group_name,
                cpu || oldData[0].cpu,
                ram || oldData[0].ram,
                storage || oldData[0].storage,
                additional_info || oldData[0].additional_info,
                imageUrl,
                id,
            ]
        );

        res.status(200).json({ message: 'Server group updated' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating server group', error });
    }
} else if (req.method === 'DELETE') {
    try {
      const [oldData] = await pool.query('SELECT image_url FROM server_group WHERE id = ?', [id])as any[];
      if (oldData.length === 0) return res.status(404).json({ message: 'Server group not found' });

      await pool.query('DELETE FROM server_group WHERE id = ?', [id]);
      res.status(200).json({ message: 'Server group deleted' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting server group', error });
    }
  } else {
    res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} not allowed`);
  }
}
