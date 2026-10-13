import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "star_saved_course_ids";

/** TODO: thay bằng API khi có backend */
const DEFAULT_SAVED_IDS = [2, 4, 6];

function readSavedIds() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw == null) return DEFAULT_SAVED_IDS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.map(Number).filter(Number.isFinite) : DEFAULT_SAVED_IDS;
  } catch {
    return DEFAULT_SAVED_IDS;
  }
}

function writeSavedIds(ids) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
}

export default function useSavedCourses() {
  const [savedIds, setSavedIds] = useState(() => new Set(readSavedIds()));

  useEffect(() => {
    writeSavedIds([...savedIds]);
  }, [savedIds]);

  const isSaved = useCallback((courseId) => savedIds.has(Number(courseId)), [savedIds]);

  const toggleSave = useCallback((courseId) => {
    const id = Number(courseId);
    setSavedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const unsave = useCallback((courseId) => {
    const id = Number(courseId);
    setSavedIds((prev) => {
      if (!prev.has(id)) return prev;
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }, []);

  return { savedIds, isSaved, toggleSave, unsave };
}
