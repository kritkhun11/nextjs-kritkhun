import { useState } from 'react';
import Swal from 'sweetalert2';
import { useRouter } from 'next/router';

export default function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, status }),
    });

    if (res.ok) {
      Swal.fire({
        title: 'สำเร็จ!',
        text: 'ลงทะเบียนเสร็จสิ้น',
        icon: 'success',
        confirmButtonText: 'ตกลง'
      }).then(() => {
        router.push('/'); // พาไปหน้า Login
      });
    } else {
      const errorData = await res.json();
      Swal.fire({
        title: 'เกิดข้อผิดพลาด',
        text: errorData.message || 'ไม่สำเร็จ',
        icon: 'error',
        confirmButtonText: 'ลองใหม่'
      }).then(() => {
        router.reload(); // เทสรีโหลด
      });
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        <h2>สมัครสมาชิก</h2>
        <div className="form-group">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="กรุณากรอกชื่อผู้ใช้.."
            required
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="กรุณากรอกรหัสผ่าน.."
            required
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            placeholder="ผู้ใช้ทั่วไป"
            disabled
          />
        </div>
        <button type="submit">สมัครสมาชิก</button>
      </form>

      <style jsx>{`
        .form-container {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          background-color: #f4f4f9;
        }
        form {
          background-color: #ffffff;
          padding: 2rem;
          border-radius: 8px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          width: 100%;
          max-width: 400px;
          text-align: center;
        }
        h2 {
          color: #333;
          margin-bottom: 1.5rem;
        }
        .form-group {
          margin-bottom: 1.2rem;
        }
        input {
          width: 100%;
          padding: 0.8rem;
          font-size: 1rem;
          border: 1px solid #ddd;
          border-radius: 4px;
          outline: none;
          transition: border-color 0.3s;
        }
        input:focus {
          border-color: #0070f3;
        }
        button {
          width: 100%;
          padding: 0.8rem;
          font-size: 1rem;
          color: #fff;
          background-color: #0070f3;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          transition: background-color 0.3s;
        }
        button:hover {
          background-color: #005bb5;
        }
      `}</style>
    </div>
  );
}
