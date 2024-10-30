import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Form, Button, Alert, Card } from 'react-bootstrap';
import Link from 'next/link';

const Login = () => {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        //ทดสอบ token
        localStorage.setItem('token', data.token);

        router.push('/group/ServerGroupList');
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError('Login failed. Please try again.');
      console.error('Error logging in:', error);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <Card className="p-4" style={{ width: '400px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}>
        <Card.Body>
          <h2 className="text-center mb-4">เข้าสู่ระบบ</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleLogin}>
            <Form.Group controlId="formUsername" className="mb-3">
              <Form.Label>ชื่อผู้ใช้</Form.Label>
              <Form.Control
                type="text"
                placeholder="กรุณากรอกชื่อผู้ใช้.."
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={{ borderRadius: '8px' }}
              />
            </Form.Group>

            <Form.Group controlId="formPassword" className="mb-3">
              <Form.Label>รหัสผ่าน</Form.Label>
              <Form.Control
                type="password"
                placeholder="กรุณากรอกรหัสผ่าน.."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ borderRadius: '8px' }}
              />
            </Form.Group>

            <Button
              variant="primary"
              type="submit"
              className="w-100 mt-3"
              style={{ borderRadius: '8px', backgroundColor: '#007bff', borderColor: '#007bff' }}
            >
              เข้าสู่ระบบ
            </Button>
          </Form>
          <br />
          <Link href={`/register`} passHref>
            <p style={{ marginLeft: 60 }}>สมัครสมาชิก</p>
          </Link>

        </Card.Body>
      </Card>
    </div>
  );
};

export default Login;
