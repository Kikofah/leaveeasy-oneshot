// ─────────────────────────────────────────────────────────────
// js/firebase-config.js — ค่าตั้งต้นของ Firebase project (สัปดาห์ที่ 6)
//
// ค่าพวกนี้ (apiKey ฯลฯ) เป็นตัวระบุ project แบบสาธารณะที่ฝังใน
// หน้าเว็บได้ตามปกติ (ไม่ใช่รหัสลับ/ไม่ใช่ service account key)
// ความปลอดภัยจริงมาจาก Security Rules (สัปดาห์ที่ 7-8) ไม่ใช่การซ่อนค่านี้
//
// ดึงมาจาก: firebase apps:sdkconfig WEB <appId> --project leaveeasy-witchudakhamsom
// ─────────────────────────────────────────────────────────────

export const firebaseConfig = {
  apiKey: "AIzaSyAp_Z5RIad500ihCo9HZ2vHpmDs87Q7qu8",
  authDomain: "leaveeasy-witchudakhamsom.firebaseapp.com",
  projectId: "leaveeasy-witchudakhamsom",
  storageBucket: "leaveeasy-witchudakhamsom.firebasestorage.app",
  messagingSenderId: "940858551147",
  appId: "1:940858551147:web:18e8799fd33668d97cba2e",
  measurementId: "G-FETR1PWLR8"
};
