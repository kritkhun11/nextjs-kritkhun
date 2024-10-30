import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import pool from '../../../connect/db';


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { ip_address, server_group_name, cpu, ram, storage, additional_info, image_url } = req.body;

    if (!ip_address || !server_group_name || !cpu || !ram || !storage) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    let imagePath = image_url ? image_url : '/img/default.jpg';

    try {
        const [result] = await pool.query(
            'INSERT INTO server_group (ip_address, server_group_name, cpu, ram, storage, additional_info, image_url) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [ip_address, server_group_name, cpu, ram, storage, additional_info, imagePath]
        );

        res.status(201).json({ message: 'Server group created', imagePath });
    } catch (error) {
        console.error('Error creating server group:', error);
        res.status(500).json({ message: 'Error creating server group', error });
    }
}
 else if (req.method === 'GET') {
        try {
            const [rows] = await pool.query('SELECT * FROM server_group');
            res.status(200).json(rows);
        } catch (error) {
            console.error('Error fetching server groups:', error);
            res.status(500).json({ message: 'Error fetching server groups', error });
        }
    } else {
        res.setHeader('Allow', ['POST', 'GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
