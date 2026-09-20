// ─────────────────────────────────────────────────────────────
// playwright.config.js — ตั้งค่าการทดสอบอัตโนมัติของ LeaveEasy
//
// เป้าหมายการทดสอบตอนนี้คือ localhost (เครื่องตัวเอง) ไม่ใช่เว็บที่ deploy
// จริงบน Firebase Hosting เพราะ URL ที่ deploy อยู่ตอนนี้เป็นโค้ดคนละ
// เวอร์ชันจากการทดลองครั้งก่อน ยังไม่ใช่โค้ดสัปดาห์ 6 ปัจจุบัน
// (เปลี่ยน baseURL ด้านล่างเป็น URL จริงได้ทันทีหลัง deploy สัปดาห์ 7)
// ─────────────────────────────────────────────────────────────

const { defineConfig, devices } = require("@playwright/test");

module.exports = defineConfig({
  testDir: "./tests",

  // เปิดเซิร์ฟเวอร์ static ให้เองก่อนรันเทสต์ (เท่ากับคำสั่ง npm run dev)
  // ถ้ามีเซิร์ฟเวอร์เปิดอยู่แล้วที่พอร์ตนี้ จะใช้ตัวที่เปิดอยู่แทน ไม่เปิดซ้ำ
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: true,
    timeout: 30_000,
  },

  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",     // เก็บ trace ไว้ดูย้อนหลังเฉพาะตอนเทสต์รันซ้ำเพราะพัง
    screenshot: "only-on-failure",
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
