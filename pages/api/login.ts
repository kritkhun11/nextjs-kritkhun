import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../../connect/db';

const SECRET_KEY = 'testkeykrit';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { username, password } = req.body;

    try {
      const [rows] = await pool.query('SELECT * FROM user WHERE username = ?', [username])as any[];
      if (rows.length === 0) {
        return res.status(401).json({ message: 'กรุณากรอก ชื่อผู้ใช้และรหัสผ่านให้ถูกต้อง' });
      }

      const user = rows[0];
      const passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch) {
        return res.status(401).json({ message: 'กรุณากรอก ชื่อผู้ใช้และรหัสผ่านให้ถูกต้อง' });
      }
      //ทดสอบโทเคนไว้ใช้บล็อค หน้า url วันที่ 29/10/2024
      const token = jwt.sign( { userId: user.id, status: user.status }, SECRET_KEY, { expiresIn: '1h' });

      return res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
      console.error('Error logging in:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ message: 'Method not allowed' });
  }
}
