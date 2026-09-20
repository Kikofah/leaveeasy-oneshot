// ─────────────────────────────────────────────────────────────
// js/leave-requests.js — หน้าที่ 1 รายการใบลา
// สัปดาห์ที่ 6: อ่านข้อมูลจริงจากโฟลเดอร์ leaveRequests บน Firestore
// (ตัว R ตัวเดียวใน CRUD — ยังไม่มีการเขียน/แก้/ลบจากหน้านี้)
// ─────────────────────────────────────────────────────────────

import { db } from "./firebase-init.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";

(async function () {
  var กล่อง = document.getElementById("ผลลัพธ์");

  // 1) อ่านใบลาทั้งหมดจาก Firestore จริง
  var ใบลาจากฐานข้อมูล = [];
  try {
    var สแนปช็อต = await getDocs(collection(db, "leaveRequests"));
    สแนปช็อต.forEach(function (เอกสาร) {
      var ใบ = เอกสาร.data();
      ใบ.id = เอกสาร.id;
      ใบลาจากฐานข้อมูล.push(ใบ);
    });
  } catch (err) {
    console.error("โหลดข้อมูลใบลาจาก Firestore ไม่สำเร็จ:", err);
    กล่อง.innerHTML = "<p>โหลดข้อมูลจากฐานข้อมูลไม่สำเร็จ กรุณาลองใหม่อีกครั้ง</p>";
    return;
  }

  // 2) ใบลาที่เพิ่งกด "บันทึก" จากหน้ายื่นใบลาใหม่ (สัปดาห์นี้ยังไม่บันทึกจริงลง Firestore
  //    เก็บไว้ใน sessionStorage ชั่วคราวก่อน จะหายเมื่อปิดเบราว์เซอร์ — แก้เป็นการบันทึกจริงสัปดาห์ที่ 7)
  var ใบลาที่ยื่นใหม่ = JSON.parse(sessionStorage.getItem("ใบลาที่ยื่นใหม่") || "[]");
  var ใบลาทั้งหมด = ใบลาจากฐานข้อมูล.concat(ใบลาที่ยื่นใหม่);

  // ถ้ามีสถานะติดมาท้าย URL ให้กรองเฉพาะสถานะนั้น
  var สถานะที่กรอง = ค่าจากURL("status");
  if (สถานะที่กรอง) {
    ใบลาทั้งหมด = ใบลาทั้งหมด.filter(function (ใบ) { return ใบ.status === สถานะที่กรอง; });
    document.querySelector(".subtitle").textContent =
      "กำลังแสดงเฉพาะใบลาที่สถานะ " + สถานะที่กรอง + " · กดเมนู รายการใบลา เพื่อดูทั้งหมด";
  }

  แสดงตาราง(ใบลาทั้งหมด);

  function แสดงตาราง(รายการ) {
    if (รายการ.length === 0) {
      กล่อง.innerHTML = "<p>ยังไม่มีใบขอลาในระบบ</p>";
      return;
    }

    var html =
      "<table><thead><tr>" +
      "<th>หัวข้อ</th>" +
      "<th>ประเภทการลา</th>" +
      "<th>สถานะ</th>" +
      '<th class="hide-mobile">ผู้ขอลา</th>' +
      '<th class="hide-mobile">วันที่ลา</th>' +
      "</tr></thead><tbody>";

    รายการ.forEach(function (ใบ) {
      html +=
        '<tr class="clickable" data-id="' + esc(ใบ.id) + '">' +
        "<td>" + esc(ใบ.title) + "</td>" +
        "<td>" + esc(ใบ.leaveTypeName) + "</td>" +
        "<td>" + ป้ายสถานะ(ใบ.status) + "</td>" +
        '<td class="hide-mobile">' + esc(ใบ.requesterName) + "</td>" +
        '<td class="hide-mobile">' + esc(ใบ.startDate) + " ถึง " + esc(ใบ.endDate) + "</td>" +
        "</tr>";
    });

    html += "</tbody></table>";
    กล่อง.innerHTML = html;

    // กดที่แถวไหน ไปหน้ารายละเอียดของใบนั้น
    กล่อง.querySelectorAll("tr.clickable").forEach(function (แถว) {
      แถว.addEventListener("click", function () {
        location.href = "leave-request-detail.html?id=" + แถว.dataset.id;
      });
    });
  }
})();
