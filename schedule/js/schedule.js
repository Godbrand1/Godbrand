function generateWeeklySchedule(employees, storeHourCap, bufferMinutes = 30) {
  const days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
  const shifts = [];
  const warnings = [];
  const empScheduled = {};
  employees.forEach(emp => empScheduled[emp.name] = 0);
  let storeScheduled = 0;

  function timeToMinutes(t) {
    const [h, m] = t.split(':').map(Number);
    return h * 60 + m;
  }
  function minutesToTime(m) {
    const h = Math.floor(m / 60);
    const min = m % 60;
    return `${h.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;
  }

  // Manager shift blocks
  const managerShifts = [
    { start: 6 * 60, end: 14 * 60, pref: 'Morning' },   // 6am–2pm
    { start: 14 * 60, end: 22 * 60, pref: 'Afternoon' },// 2pm–10pm
    { start: 22 * 60, end: 30 * 60, pref: 'Night' }     // 10pm–6am (next day)
  ];

  // Only managers (Shift Lead) -- ignore GM
  const managers = employees.filter(e => e.roles.includes('Shift Lead'));

  for (const day of days) {
    const scheduledManagers = new Set();
    for (const shiftBlock of managerShifts) {
      let shiftStart = shiftBlock.start;
      let shiftEnd = shiftBlock.end;
      if (shiftEnd > 24 * 60) shiftEnd -= 24 * 60;
      // Find available manager with matching shiftPref, not already scheduled for another block today
      const availableManager = managers.find(emp => {
        if (scheduledManagers.has(emp.name)) return false;
        if (emp.shiftPref !== shiftBlock.pref) return false;
        if (emp.desiredHours && empScheduled[emp.name] + 8 > emp.desiredHours) return false;
        if (emp.availability === 'open') return true;
        if (!emp.availability[day]) return false;
        const availStart = timeToMinutes(emp.availability[day].start);
        const availEnd = timeToMinutes(emp.availability[day].end);
        // Allow partial overlap
        return availEnd > shiftStart && availStart < shiftEnd;
      });
      if (availableManager) {
        let actualStart = shiftStart;
        let actualEnd = shiftEnd;
        if (availableManager.availability !== 'open') {
          const availStart = timeToMinutes(availableManager.availability[day].start);
          const availEnd = timeToMinutes(availableManager.availability[day].end);
          actualStart = Math.max(shiftStart, availStart);
          actualEnd = Math.min(shiftEnd, availEnd);
          if (actualEnd <= actualStart) {
            warnings.push(`Warning: ${availableManager.name} cannot cover any part of ${shiftBlock.pref} shift on ${day}.`);
            continue;
          }
        }
        shifts.push({
          day,
          start: minutesToTime(actualStart),
          end: minutesToTime(actualEnd),
          employee: availableManager.name,
          role: 'Shift Lead'
        });
        empScheduled[availableManager.name] += (actualEnd - actualStart) / 60;
        storeScheduled += (actualEnd - actualStart) / 60;
        scheduledManagers.add(availableManager.name);
      } else {
        warnings.push(`Warning: No manager available for ${day} ${minutesToTime(shiftStart)}–${minutesToTime(shiftEnd)} (${shiftBlock.pref})`);
      }
    }
  }

  return {
    shifts,
    storeScheduled,
    empScheduled,
    warnings
  };
}