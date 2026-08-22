const asList = (value) => Array.isArray(value) ? value : value ? [value] : [];

export const isActive = (record) => Number(record?.status ?? record?.raw?.UMG_Estado) === 1;

export const groupEntries = (records, valueFor, fallback) => {
  const counts = asList(records).reduce((total, record) => {
    const value = valueFor(record) || fallback;
    total[value] = (total[value] ?? 0) + 1;
    return total;
  }, {});
  return Object.entries(counts).sort(([leftName, leftCount], [rightName, rightCount]) => rightCount - leftCount || leftName.localeCompare(rightName));
};

export const activeRatio = (records) => {
  const total = asList(records).length;
  return { active: asList(records).filter(isActive).length, total };
};

export const reservationStatusEntries = (reservations, fallback) => groupEntries(
  reservations,
  (reservation) => reservation.status ?? reservation.raw?.UMG_Estado,
  fallback
);

export const reservationLabEntries = (reservations, fallback) => groupEntries(
  reservations,
  (reservation) => reservation.labName ?? reservation.raw?.UMG_Lab_Nombre,
  fallback
);

export const userRoleEntries = (users, fallback, roleNames = { admin: "Administrator", professor: "Professor" }) => groupEntries(
  users,
  (user) => user.roleName || user.raw?.UMG_Rol_Nombre || (user.roleId === 1 ? roleNames.admin : user.roleId ? roleNames.professor : ""),
  fallback
);
