// ─────────────────────────────────────────────────────────────
// scripts/seed.mjs — ใส่ข้อมูลตัวอย่าง (seed) ตามหัวข้อ 7 ของ
// leaveeasy-spec.md ลง Firestore project จริง (leaveeasy-witchudakhamsom)
//
// ⚠️ นี่คือเครื่องมือ setup ที่รันครั้งเดียวจาก terminal ด้วยมือ
// ไม่ใช่ส่วนหนึ่งของเว็บแอป และห้ามเรียกจากหน้าเว็บใด ๆ ทั้งสิ้น
// (สัปดาห์ 6 ห้ามเพิ่ม/แก้/ลบลงฐานข้อมูลจากหน้าเว็บ)
//
// ⚠️⚠️ ก่อนรันสคริปต์นี้จริง ให้ตรวจสอบก่อนว่าคอลเลกชัน users /
// leaveTypes / leaveRequests ไม่มีเอกสารอื่นที่ไม่ตรงกับ ID ในหัวข้อ 7
// ค้างอยู่ — ตอนตรวจสอบรอบล่าสุด (2026-09-20) พบว่า project นี้มี
// เอกสารแปลกปลอมค้างอยู่จริง ซึ่งบางรายการมีข้อมูลจริงของบุคคล
// (ชื่อ-อีเมลจริง ไม่ใช่ข้อมูลสมมติตามสเปก) ปนอยู่ด้วย — ห้ามรันสคริปต์นี้
// จนกว่าจะตัดสินใจแล้วว่าจะจัดการเอกสารเหล่านั้นอย่างไร (ดูรายงานของ
// leaveeasy-builder ประกอบการตัดสินใจ) สคริปต์นี้ "set" เฉพาะ ID ที่ระบุ
// ไว้ด้านล่างเท่านั้น จะไม่แตะ/ไม่ลบเอกสารอื่นที่มีอยู่ก่อน
//
// วิธีรัน (หลังตัดสินใจเรื่องเอกสารแปลกปลอมแล้ว และเปิดสิทธิ์ Admin ได้แล้ว):
//   1. เตรียม credential ระดับ Admin อย่างใดอย่างหนึ่ง:
//        gcloud auth application-default login
//      หรือดาวน์โหลด service account key แล้วตั้ง
//        export GOOGLE_APPLICATION_CREDENTIALS=/path/to/key.json
//   2. npm install   (ติดตั้ง firebase-admin ครั้งแรก)
//   3. node scripts/seed.mjs
//
// ใช้ .set() กับ document id คงที่ตามสเปก (u001, lt001, lr001, ...)
// รันซ้ำได้อย่างปลอดภัย (idempotent) — เขียนทับให้ตรงสเปกทุกครั้ง ไม่สร้างซ้ำ
// ─────────────────────────────────────────────────────────────

import { initializeApp, applicationDefault } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const PROJECT_ID = "leaveeasy-witchudakhamsom";

const app = initializeApp({
  credential: applicationDefault(),
  projectId: PROJECT_ID,
});
const db = getFirestore(app);

// 📁 users — หัวข้อ 7.1
const users = [
  { id: "u001", name: "สมชาย ใจดี", email: "somchai@example.com", role: "employee" },
  { id: "u002", name: "สมหญิง รักงาน", email: "somying@example.com", role: "manager" },
  { id: "u003", name: "สมศรี ตั้งใจ", email: "somsri@example.com", role: "hr" },
];

// 📁 leaveTypes — หัวข้อ 7.2
const leaveTypes = [
  { id: "lt001", name: "ลาพักร้อน" },
  { id: "lt002", name: "ลาป่วย" },
  { id: "lt003", name: "ลากิจ" },
];

// 📁 leaveRequests (+ 📁 approvals) — หัวข้อ 7.3 และ 7.4
const leaveRequests = [
  {
    id: "lr001",
    title: "ลาพักร้อนไปเที่ยวกับครอบครัว",
    reason: "วางแผนเดินทางไปต่างจังหวัดกับครอบครัว จองที่พักไว้ล่วงหน้าแล้ว",
    status: "รอพิจารณา",
    requesterId: "u001", requesterName: "สมชาย ใจดี",
    approverId: "u002", approverName: "สมหญิง รักงาน",
    leaveTypeId: "lt001", leaveTypeName: "ลาพักร้อน",
    startDate: "2026-09-07", endDate: "2026-09-09",
    createdAt: "2026-09-01 09:15",
    approvals: [
      { id: "ap001", authorId: "u002", authorName: "สมหญิง รักงาน",
        message: "รับเรื่องแล้ว ขอดูตารางงานของทีมช่วงนั้นก่อนนะครับ",
        createdAt: "2026-09-01 13:40" },
      { id: "ap002", authorId: "u003", authorName: "สมศรี ตั้งใจ",
        message: "ตรวจแล้ว วันลาพักร้อนคงเหลือครอบคลุมช่วงที่ขอ ไม่ติดขัดฝั่งฝ่ายบุคคล",
        createdAt: "2026-09-02 10:05" },
    ],
  },
  {
    id: "lr002",
    title: "ลาป่วยไข้หวัดใหญ่",
    reason: "มีไข้สูงและไอมาก แพทย์แนะนำให้พักอยู่บ้าน 2 วัน",
    status: "อนุมัติ",
    requesterId: "u001", requesterName: "สมชาย ใจดี",
    approverId: "u002", approverName: "สมหญิง รักงาน",
    leaveTypeId: "lt002", leaveTypeName: "ลาป่วย",
    startDate: "2026-08-24", endDate: "2026-08-25",
    createdAt: "2026-08-24 08:05",
    approvals: [
      { id: "ap003", authorId: "u002", authorName: "สมหญิง รักงาน",
        message: "อนุมัติแล้ว พักผ่อนให้เต็มที่ งานที่ค้างไว้เดี๋ยวทีมช่วยดูให้",
        createdAt: "2026-08-24 09:20" },
    ],
  },
  {
    id: "lr003",
    title: "ลากิจไปทำบัตรประชาชน",
    reason: "บัตรประชาชนหมดอายุ ต้องไปทำที่สำนักงานเขตในวันทำการ",
    status: "รอพิจารณา",
    requesterId: "u003", requesterName: "สมศรี ตั้งใจ",
    approverId: "", approverName: "",
    leaveTypeId: "lt003", leaveTypeName: "ลากิจ",
    startDate: "2026-09-15", endDate: "2026-09-15",
    createdAt: "2026-09-10 16:30",
    approvals: [],
  },
  {
    id: "lr004",
    title: "ลาพักร้อนช่วงวันหยุดยาว",
    reason: "อยากต่อวันหยุดยาวไปพักผ่อนกับครอบครัวอีก 3 วัน",
    status: "ไม่อนุมัติ",
    requesterId: "u003", requesterName: "สมศรี ตั้งใจ",
    approverId: "u002", approverName: "สมหญิง รักงาน",
    leaveTypeId: "lt001", leaveTypeName: "ลาพักร้อน",
    startDate: "2026-10-12", endDate: "2026-10-16",
    createdAt: "2026-09-20 11:00",
    approvals: [
      { id: "ap004", authorId: "u002", authorName: "สมหญิง รักงาน",
        message: "ช่วงนั้นทีมมีงานส่งมอบพอดี ขอเลื่อนเป็นสัปดาห์ถัดไปได้ไหมครับ",
        createdAt: "2026-09-20 15:10" },
    ],
  },
  {
    id: "lr005",
    title: "ลาป่วยไปพบแพทย์ตามนัด",
    reason: "มีนัดตรวจติดตามอาการกับแพทย์ในช่วงเช้า",
    status: "รอพิจารณา",
    requesterId: "u001", requesterName: "สมชาย ใจดี",
    approverId: "u002", approverName: "สมหญิง รักงาน",
    leaveTypeId: "lt002", leaveTypeName: "ลาป่วย",
    startDate: "2026-09-22", endDate: "2026-09-22",
    createdAt: "2026-09-18 14:45",
    approvals: [],
  },
];

async function main() {
  console.log("กำลังใส่ข้อมูลตัวอย่างลง Firestore project:", PROJECT_ID);

  for (const u of users) {
    const { id, ...data } = u;
    await db.collection("users").doc(id).set(data);
    console.log("users/" + id + " ✔");
  }

  for (const lt of leaveTypes) {
    const { id, ...data } = lt;
    await db.collection("leaveTypes").doc(id).set(data);
    console.log("leaveTypes/" + id + " ✔");
  }

  for (const lr of leaveRequests) {
    const { id, approvals, ...data } = lr;
    await db.collection("leaveRequests").doc(id).set(data);
    console.log("leaveRequests/" + id + " ✔");

    for (const ap of approvals) {
      const { id: apId, ...apData } = ap;
      await db.collection("leaveRequests").doc(id).collection("approvals").doc(apId).set(apData);
      console.log("  leaveRequests/" + id + "/approvals/" + apId + " ✔");
    }
  }

  console.log("เสร็จแล้ว ✔ ใส่ข้อมูลตัวอย่างครบตามหัวข้อ 7 ของ leaveeasy-spec.md");
}

main().catch((err) => {
  console.error("seed ล้มเหลว:", err);
  process.exit(1);
});
