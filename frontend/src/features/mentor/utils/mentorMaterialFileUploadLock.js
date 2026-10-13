/** Khóa upload file toàn trang — chỉ một học liệu được upload file tại một thời điểm. */
let lockOwnerKey = null;

export function tryAcquireMaterialFileUploadLock(ownerKey) {
  if (!ownerKey) return false;
  if (lockOwnerKey && lockOwnerKey !== ownerKey) return false;
  lockOwnerKey = ownerKey;
  return true;
}

export function releaseMaterialFileUploadLock(ownerKey) {
  if (ownerKey && lockOwnerKey === ownerKey) {
    lockOwnerKey = null;
  }
}

export function isMaterialFileUploadBlocked(ownerKey) {
  return lockOwnerKey != null && lockOwnerKey !== ownerKey;
}
