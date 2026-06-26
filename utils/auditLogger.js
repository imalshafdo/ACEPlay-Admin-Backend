import AuditLog from '../models/AuditLog.js';

const SKIP_KEYS = new Set(['_id', '__v', 'createdAt', 'updatedAt']);

const isPlainObject = (value) =>
  value !== null && typeof value === 'object' && !Array.isArray(value) && !(value instanceof Date);

const flattenValues = (obj, prefix = '') => {
  const flat = {};
  if (obj == null || typeof obj !== 'object') return flat;

  const source = obj.toObject ? obj.toObject() : obj;

  for (const [key, value] of Object.entries(source)) {
    if (SKIP_KEYS.has(key)) continue;
    const path = prefix ? `${prefix}.${key}` : key;

    if (isPlainObject(value)) {
      Object.assign(flat, flattenValues(value, path));
    } else {
      flat[path] = value;
    }
  }
  return flat;
};

const valuesEqual = (a, b) => {
  if (a === b) return true;
  if (a == null && b == null) return true;
  try {
    return JSON.stringify(a) === JSON.stringify(b);
  } catch {
    return false;
  }
};

export const collectFieldChanges = (oldDoc, newBody) => {
  const flatOld = flattenValues(oldDoc);
  const flatNew = flattenValues(newBody);
  const keys = new Set([...Object.keys(flatOld), ...Object.keys(flatNew)]);
  const changes = [];

  for (const fieldChanged of keys) {
    const oldValue = flatOld[fieldChanged];
    const newValue = flatNew[fieldChanged];
    if (!valuesEqual(oldValue, newValue)) {
      changes.push({ fieldChanged, oldValue: oldValue ?? null, newValue: newValue ?? null });
    }
  }

  return changes;
};

export const writeCasinoAuditLogs = async ({
  adminEmail,
  brandName,
  oldDoc,
  newBody,
  action = 'UPDATE_REQUEST',
}) => {
  const changes = collectFieldChanges(oldDoc, newBody);
  if (!changes.length) return [];

  const entries = changes.map((change) => ({
    adminEmail,
    action,
    brandName,
    fieldChanged: change.fieldChanged,
    oldValue: change.oldValue,
    newValue: change.newValue,
  }));

  return AuditLog.insertMany(entries);
};
