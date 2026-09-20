// ─────────────────────────────────────────────────────────────
// scripts/reset-demo-status.mjs — รีเซ็ตช่อง status ของใบลาสาธิต
// (lr001, lr005) กลับเป็น "รอพิจารณา" ตามข้อมูลตัวอย่างเดิมในหัวข้อ 7
// ของ leaveeasy-spec.md
//
// ทำไมต้องมีสคริปต์นี้แทนการรัน scripts/seed.mjs ใหม่ทั้งชุด:
// เดิมทีตอนแก้บั๊กแล้วให้ leaveeasy-tester ทดสอบเคสกดอนุมัติ (US-04)
// ด้วยบัญชี manager/hr จริง การกดอนุมัติทำให้ lr001 และ lr005 เปลี่ยน
// สถานะถาวรจาก "รอพิจารณา" เป็น "อนุมัติ" (ผลข้างเคียงที่คาดไว้ของการ
// ทดสอบด้วยข้อมูลจริง) — ถ้ารัน scripts/seed.mjs ใหม่ทั้งชุดตามขั้นตอน
// เดิม (ลบทั้งโฟลเดอร์ leaveRequests ด้วย firestore:delete --recursive
// แล้วค่อย seed ใหม่) จะ**ลบใบลาทดสอบของ leaveeasy-tester ไปด้วย**
// (เอกสาร requesterId ของบัญชี leaveeasy.tester.retest1@example.com)
// ซึ่งขัดกับคำสั่งก่อนหน้านี้ที่ให้เก็บบัญชี/ใบลานั้นไว้ก่อน ไม่ต้องลบ
//
// สคริปต์นี้จึงแก้เฉพาะช่อง status ของ lr001/lr005 กลับเป็นค่าตั้งต้น
// (แก้เฉพาะช่องเดียว ไม่แตะช่องอื่น ตามกฎในหัวข้อ 6 ของสเปก) โดยไม่ลบ/
// แตะเอกสารอื่นใดเลยในระบบ ปลอดภัยกับข้อมูลทดสอบที่มีอยู่แล้ว
//
// วิธีรัน:
//   0. cd ไปที่โฟลเดอร์โปรเจกต์นี้ + source ~/.nvm/nvm.sh && nvm use 22
//   1. เตรียม credential ระดับ Admin (แบบเดียวกับ seed.mjs):
//        gcloud auth application-default login
//   2. node scripts/reset-demo-status.mjs
// ─────────────────────────────────────────────────────────────

import { initializeApp, applicationDefault } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const PROJECT_ID = "leaveeasy-witchudakhamsom";

// ตรงกับค่าตั้งต้นของ lr001/lr005 ในหัวข้อ 7.3 ของสเปกเป๊ะ
const TARGETS = ["lr001", "lr005"];
const ORIGINAL_STATUS = "รอพิจารณา";

const app = initializeApp({ credential: applicationDefault(), projectId: PROJECT_ID });
const db = getFirestore(app);

async function main() {
  console.log("กำลังรีเซ็ตสถานะใบลาสาธิตกลับเป็น \"" + ORIGINAL_STATUS + "\" ใน project:", PROJECT_ID);

  for (const id of TARGETS) {
    const ref = db.collection("leaveRequests").doc(id);
    const snap = await ref.get();
    if (!snap.exists) {
      console.warn(`  ${id}: ไม่พบเอกสารนี้ ข้ามไป`);
      continue;
    }
    const ก่อนหน้า = snap.data().status;
    await ref.update({ status: ORIGINAL_STATUS });
    console.log(`  ${id}: ${ก่อนหน้า} → ${ORIGINAL_STATUS} ✔`);
  }

  console.log("เสร็จแล้ว ✔ ไม่ได้แตะเอกสารอื่นใดในระบบ (รวมถึงใบลาทดสอบของ leaveeasy-tester)");
}

main().catch((err) => {
  console.error("reset-demo-status ล้มเหลว:", err);
  process.exit(1);
});
