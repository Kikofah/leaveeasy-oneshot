// ─────────────────────────────────────────────────────────────
// js/firebase-init.js — เปิดใช้งาน Firebase App + Firestore (สัปดาห์ที่ 6)
//
// โหลด SDK จาก CDN แบบ ES module ตรง ๆ ไม่มี build step / ไม่มี framework
// เวอร์ชันถูกล็อกไว้ (12.19.0) เพื่อไม่ให้พังเงียบ ๆ ตอน CDN อัปเดตเวอร์ชันใหม่
// ─────────────────────────────────────────────────────────────

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";
import { firebaseConfig } from "./firebase-config.js";

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
