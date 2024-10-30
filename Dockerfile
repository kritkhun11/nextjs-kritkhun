# ยังไม่สมบูรณ์ ศึกษาไม่ทัน

# ใช้ Node.js เป็น base image
FROM node:14

# ตั้งค่า working directory ใน container
WORKDIR /app

# คัดลอกไฟล์ package.json และ package-lock.json เพื่อรัน npm install
COPY package*.json ./

# ติดตั้ง dependencies
RUN npm install

# คัดลอกโค้ดทั้งหมดลงใน container
COPY . .

# เปิดพอร์ตที่ต้องการ
EXPOSE 3001

# คำสั่งเพื่อรันแอปพลิเคชัน
CMD ["npm", "start"]
