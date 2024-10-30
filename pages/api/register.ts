import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcrypt';
import pool from '../../connect/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { username, password, status } = req.body;

    try {
      // เช็คดู
      const [existingUser] = await pool.query('SELECT * FROM user WHERE username = ?', [username]) as any[];
      if (existingUser.length > 0) {
        return res.status(400).json({ message: 'ชื่อผู้ใช้ถูกใช้งานแล้ว' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      await pool.query(
        'INSERT INTO user (username, password, status) VALUES (?, ?, ?)',
        [username, hashedPassword, status || 2]
      );

      res.status(201).json({ message: 'ลงทะเบียนเสร็จสิ้น' });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ message: 'เกิดข้อผิดพลาดในการลงทะเบียน' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
