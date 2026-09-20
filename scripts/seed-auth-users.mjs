// ─────────────────────────────────────────────────────────────
// scripts/seed-auth-users.mjs — สร้างบัญชี Firebase Authentication
// ที่ผูก uid ตรงกับเอกสาร users/u002 (manager) และ users/u003 (hr)
// ที่มีอยู่แล้วจาก scripts/seed.mjs (ดูหัวข้อ 7.1 ของ leaveeasy-spec.md)
//
// ทำไมต้องมีสคริปต์นี้แยกจาก seed.mjs:
// seed.mjs สร้างแค่ "เอกสาร" ในโฟลเดอร์ users บน Firestore เท่านั้น
// ไม่ได้สร้าง "บัญชีล็อกอินจริง" ใน Firebase Authentication คู่กัน
// จึงไม่มีใครล็อกอินเป็น manager (u002) หรือ hr (u003) เพื่อทดสอบ
// เคสกดอนุมัติ/ไม่อนุมัติ (US-04) ได้จริง
//
// สคริปต์นี้สร้าง/อัปเดตบัญชี Auth โดย "ตั้ง uid เองตรงๆ" ให้ตรงกับ
// document id เดิม (u002 / u003) เพื่อให้ js/leave-request-detail.js,
// js/dashboard.js ฯลฯ ที่อ่าน role จาก users/{ผู้ใช้.uid} ทำงานถูกทันที
// โดยไม่ต้องแก้ seed data หรือ leaveRequests ที่อ้างอิง approverId/authorId
// เป็น "u002"/"u003" อยู่แล้วแม้แต่ช่องเดียว
//
// ⚠️ นี่คือเครื่องมือ setup ที่รันครั้งเดียวจาก terminal ด้วยมือ (เหมือน
// seed.mjs) ไม่ใช่ส่วนหนึ่งของเว็บแอป และห้ามเรียกจากหน้าเว็บใดๆ ทั้งสิ้น
//
// วิธีรัน:
//   0. cd ไปที่โฟลเดอร์โปรเจกต์นี้ + source ~/.nvm/nvm.sh && nvm use 22
//   1. เตรียม credential ระดับ Admin (แบบเดียวกับที่ seed.mjs ใช้):
//        gcloud auth application-default login
//   2. ตั้งรหัสผ่านทดสอบผ่าน environment variable ก่อนรัน (ไม่ hardcode
//      รหัสผ่านไว้ในไฟล์นี้ เพื่อไม่ให้รหัสผ่านหลุดไปกับ git):
//        SEED_AUTH_PASSWORD='รหัสผ่านที่ตกลงกันไว้' npm run seed:auth
//      (หรือ node scripts/seed-auth-users.mjs)
//
// รันซ้ำได้อย่างปลอดภัย (idempotent) — ถ้า uid นั้นมีบัญชีอยู่แล้ว จะ
// อัปเดตรหัสผ่าน/ชื่อ/อีเมลให้ตรงชุดนี้แทนการสร้างซ้ำ/error
//
// ⚠️ อีเมลด้านล่างเป็น "ข้อมูลทดสอบ" สำหรับ manager/hr ตามชื่อสมมติใน
// หัวข้อ 7.1 ของสเปกเท่านั้น ไม่ใช่บัญชีจริงของใคร ส่วนรหัสผ่านต้องส่งผ่าน
// SEED_AUTH_PASSWORD เสมอ ห้าม hardcode ไว้ในไฟล์นี้ — สคริปต์จะพิมพ์
// credential ออกทาง console เท่านั้น ไม่เขียนลงไฟล์ใดๆ
// ─────────────────────────────────────────────────────────────

import { initializeApp, applicationDefault } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

const PROJECT_ID = "leaveeasy-witchudakhamsom";
const TEST_PASSWORD = process.env.SEED_AUTH_PASSWORD;

if (!TEST_PASSWORD) {
  console.error(
    "ไม่พบ SEED_AUTH_PASSWORD — ต้องตั้งรหัสผ่านทดสอบผ่าน environment variable ก่อนรัน เช่น:\n" +
    "  SEED_AUTH_PASSWORD='รหัสผ่านที่ตกลงกันไว้' npm run seed:auth"
  );
  process.exit(1);
}

const app = initializeApp({
  credential: applicationDefault(),
  projectId: PROJECT_ID,
});
const auth = getAuth(app);

// ต้องตรงกับ users/u002, users/u003 ใน scripts/seed.mjs (หัวข้อ 7.1)
const accounts = [
  { uid: "u002", email: "somying@example.com", displayName: "สมหญิง รักงาน", role: "manager" },
  { uid: "u003", email: "somsri@example.com", displayName: "สมศรี ตั้งใจ", role: "hr" },
];

async function upsertAccount({ uid, email, displayName, role }) {
  const payload = {
    email,
    emailVerified: true,
    password: TEST_PASSWORD,
    displayName,
  };

  try {
    await auth.getUser(uid);
    await auth.updateUser(uid, payload);
    console.log(`บัญชี ${uid} (${role}) มีอยู่แล้ว — อัปเดตรหัสผ่าน/ชื่อให้ตรงชุดทดสอบแล้ว ✔`);
  } catch (err) {
    if (err.code === "auth/user-not-found") {
      await auth.createUser({ uid, ...payload });
      console.log(`สร้างบัญชี ${uid} (${role}) ใหม่แล้ว ✔`);
    } else {
      throw err;
    }
  }
}

async function main() {
  console.log("กำลังสร้าง/อัปเดตบัญชี Firebase Auth สำหรับทดสอบ manager/hr ใน project:", PROJECT_ID);

  for (const acc of accounts) {
    await upsertAccount(acc);
  }

  console.log("\nเสร็จแล้ว ✔ ใช้ credential ต่อไปนี้ล็อกอินทดสอบได้ทันที (จดจากหน้าจอนี้ ไม่ถูกเก็บไว้ที่ไหนอีก):\n");
  accounts.forEach((acc) => {
    console.log(`  ${acc.role.padEnd(8)} uid=${acc.uid}  email=${acc.email}  password=${TEST_PASSWORD}`);
  });
}

main().catch((err) => {
  console.error("seed-auth-users ล้มเหลว:", err);
  process.exit(1);
});
