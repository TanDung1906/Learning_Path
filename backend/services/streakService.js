const { getCompletionDates } = require("../models/studentsModel");

function ymd(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function computeStreak(dateStrings) {
  if (!dateStrings.length) return { streak: 0, hasStudiedToday: false };
  const set = new Set(dateStrings);
  const cursor = new Date();

  const todayStr = ymd(cursor);
  const hasStudiedToday = set.has(todayStr);

  if (!hasStudiedToday) {
    cursor.setDate(cursor.getDate() - 1);
    //1 ngày bất kỳ bị trống
    if (!set.has(ymd(cursor))) return { streak: 0, hasStudiedToday };
  }
  let streak = 0;
  while (set.has(ymd(cursor))) {
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }
  return { streak, hasStudiedToday };
}

async function getStreak(userId) {
  const dates = await getCompletionDates(userId);// Gọi Model lấy danh sách ngày đã hoàn thành bài học
  return computeStreak(dates);//tính toán 
}

module.exports = { getStreak };