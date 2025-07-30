// File: scripts.js
// This script manages employee scheduling, including adding, editing, and deleting employees,
const employees = [];

function getAvailability() {
  if (document.getElementById('openAvail').checked) {
    return 'open';
  }
  const days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
  const avail = {};
  days.forEach(day => {
    const available = document.getElementById('avail'+day).checked;
    const start = document.getElementById('start'+day).value;
    const end = document.getElementById('end'+day).value;
    avail[day] = available ? { start, end } : null;
  });
  return avail;
}

function formatTime(t) {
  if (!t) return '';
  let [h, m] = t.split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  return `${h}:${m.toString().padStart(2,'0')} ${ampm}`;
}

function saveEmployees() {
  localStorage.setItem('employees', JSON.stringify(employees));
}

function loadEmployees() {
  const saved = localStorage.getItem('employees');
  if (saved) {
    employees.length = 0;
    JSON.parse(saved).forEach(emp => employees.push(emp));
    renderEmployeeTable();
  }
}

function calcWeeklyHours(emp) {
  let total = 0;
  let totalAfterBreaks = 0;
  Object.entries(emp.availability).forEach(([day, val]) => {
    if (val) {
      const [startH, startM] = val.start.split(':').map(Number);
      const [endH, endM] = val.end.split(':').map(Number);
      let hours = (endH + endM/60) - (startH + startM/60);
      total += hours;
      if (hours > 6) {
        hours -= 0.5; // 30 min break
      }
      totalAfterBreaks += hours;
    }
  });
  return {
    total: Math.round(total * 100) / 100,
    totalAfterBreaks: Math.round(totalAfterBreaks * 100) / 100,
  };
}

function calcAvailableHours(emp) {
  if (emp.availability === 'open') {
    return { open: true };
  }
  let total = 0;
  Object.entries(emp.availability).forEach(([day, val]) => {
    if (val) {
      const [startH, startM] = val.start.split(':').map(Number);
      const [endH, endM] = val.end.split(':').map(Number);
      let hours = (endH + endM/60) - (startH + startM/60);
      total += hours;
    }
  });
  return {
    total: Math.round(total * 100) / 100
  };
}

function getRoles() {
  const gm = document.getElementById('roleGM').checked;
  const manager = document.getElementById('roleShiftLead').checked;
  const cashier = document.getElementById('roleCashier').checked;
  const foodChampion = document.getElementById('roleFoodChampion').checked;
  if (gm) {
    return ['GM']; // Only GM
  } else if (manager) {
    return ['Shift Lead', cashier ? 'Cashier' : null, foodChampion ? 'Food Champion' : null].filter(Boolean);
  } else {
    return [cashier ? 'Cashier' : null, foodChampion ? 'Food Champion' : null].filter(Boolean);
  }
}

// Disable/enable checkboxes based on GM/Manager selection
function updateRoleCheckboxes() {
  const gm = document.getElementById('roleGM').checked;
  const manager = document.getElementById('roleShiftLead').checked;
  const cashierBox = document.getElementById('roleCashier');
  const foodBox = document.getElementById('roleFoodChampion');
  if (gm) {
    cashierBox.checked = false;
    foodBox.checked = false;
    cashierBox.disabled = true;
    foodBox.disabled = true;
  } else if (manager) {
    cashierBox.disabled = false;
    foodBox.disabled = false;
  } else {
    cashierBox.disabled = false;
    foodBox.disabled = false;
  }
}
['roleGM','roleShiftLead'].forEach(id => {
  document.getElementById(id).addEventListener('change', updateRoleCheckboxes);
});

function renderRoleStats() {
  let cashier = 0, foodChampion = 0, manager = 0, gm = 0;
  employees.forEach(emp => {
    if (emp.roles.includes('GM')) {
      gm++;
    } else if (emp.roles.includes('Shift Lead')) {
      manager++;
      if (emp.roles.includes('Cashier')) cashier++;
      if (emp.roles.includes('Food Champion')) foodChampion++;
    } else {
      if (emp.roles.includes('Cashier')) cashier++;
      if (emp.roles.includes('Food Champion')) foodChampion++;
    }
  });
  document.getElementById('roleStats').textContent =
    `GM: ${gm} | Managers: ${manager} | Cashiers: ${cashier} | Food Champions: ${foodChampion}`;
}

function calcScheduledHours(empName) {
  // Placeholder: This should be replaced with real shift assignment logic
  // Find all scheduled shifts for this employee in the generated schedule
  // For now, returns 0. Replace with real logic when schedule is generated
  return { total: 0, totalAfterBreaks: 0 };
}

function renderEmployeeTable() {
  const tbody = document.querySelector('#employeeTable tbody');
  tbody.innerHTML = '';
  employees.forEach((emp, idx) => {
    const tr = document.createElement('tr');
    // Available hours
    const availResult = calcAvailableHours(emp);
    let availHoursCell = '';
    let availList = '';
    let unavailDays = '';
    if (availResult.open) {
      availHoursCell = '<span style="color:green;font-weight:bold;">Open</span>';
      availList = '<li style="color:green;font-weight:bold;">Open</li>';
      unavailDays = '';
    } else {
      availHoursCell = `${availResult.total} hrs`;
      availList = Object.entries(emp.availability).map(([day, val]) => {
        if (val) {
          const [startH, startM] = val.start.split(':').map(Number);
          const [endH, endM] = val.end.split(':').map(Number);
          let hours = (endH + endM/60) - (startH + startM/60);
          const color = hours > 6 ? 'green' : 'red';
          return `<li><strong>${day}:</strong> <span style='color:${color};font-weight:bold;'>${formatTime(val.start)} – ${formatTime(val.end)} (${hours > 6 ? 'Break' : 'No Break'})</span></li>`;
        } else {
          return `<li><strong>${day}:</strong> Off</li>`;
        }
      }).join('');
      unavailDays = Object.entries(emp.availability).filter(([_, val]) => !val).map(([day]) => day).join(', ');
    }
    // Scheduled hours
    const { total: schedTotal } = calcScheduledHours(emp.name);
    // Desired hours cell
    let desiredHoursCell = '';
    if (emp.desiredHours !== undefined && emp.desiredHours !== null) {
      desiredHoursCell = `${emp.desiredHours} hrs`;
    }
    tr.innerHTML = `
      <td>${emp.name}</td>
      <td>${emp.roles.join(', ')}</td>
      <td><ul style="padding-left:1em;margin:0;">${availList}</ul></td>
      <td>${unavailDays}</td>
      <td>${desiredHoursCell}</td>
      <td>${schedTotal} hrs</td>
      <td>
        <button onclick="editEmployee(${idx})">Edit</button>
        <button onclick="deleteEmployee(${idx})">Delete</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
  renderRoleStats();
}

function addEmployeeRow(emp) {
  renderEmployeeTable();
}

let editIdx = null;
let originalEditData = null;
const addBtn = document.getElementById('addEmployeeBtn');

function setEditMode(idx) {
  editIdx = idx;
  originalEditData = JSON.stringify(employees[idx]);
  addBtn.textContent = 'Save Changes';
  addBtn.style.width = '100%';
  addBtn.style.border = '2px solid blue';
  addBtn.style.background = '#007bff';
  addBtn.style.color = 'white';
  updateEditButtonOutline();
}

function exitEditMode() {
  editIdx = null;
  originalEditData = null;
  addBtn.textContent = 'Add Employee';
  addBtn.style.width = '';
  addBtn.style.border = '';
  addBtn.style.background = '';
  addBtn.style.color = '';
}

function updateEditButtonOutline() {
  if (editIdx !== null) {
    const name = document.getElementById('empName').value.trim();
    const availability = getAvailability();
    const currentData = JSON.stringify({ name, availability });
    if (currentData !== originalEditData) {
      addBtn.style.border = '2px solid green';
    } else {
      addBtn.style.border = '2px solid blue';
    }
  }
}

['empName',
  // Remove 'empRole' from listeners
  'availMon','startMon','endMon','availTue','startTue','endTue','availWed','startWed','endWed','availThu','startThu','endThu','availFri','startFri','endFri','availSat','startSat','endSat','availSun','startSun','endSun'
].forEach(id => {
  const el = document.getElementById(id);
  if (el) {
    el.addEventListener('input', updateEditButtonOutline);
    el.addEventListener('change', updateEditButtonOutline);
  }
});

// Update showHideDesiredHours to use HTML field
const desiredHoursInput = document.getElementById('desiredHours');
function showHideDesiredHours() {
  const roles = getRoles();
  if (roles.includes('Shift Lead') || roles.includes('Food Champion') || roles.includes('Cashier')) {
    desiredHoursInput.style.display = '';
  } else {
    desiredHoursInput.style.display = 'none';
    desiredHoursInput.value = '';
  }
}
['roleGM','roleShiftLead','roleCashier','roleFoodChampion'].forEach(id => {
  document.getElementById(id).addEventListener('change', showHideDesiredHours);
});

const shiftPrefInput = document.getElementById('shiftPref');
const shiftPrefLabel = document.getElementById('shiftPrefLabel');
function showHideShiftPref() {
  const roles = getRoles();
  if (!roles.includes('GM') && (roles.includes('Shift Lead') || roles.includes('Cashier') || roles.includes('Food Champion'))) {
    shiftPrefInput.style.display = '';
    shiftPrefLabel.style.display = '';
  } else {
    shiftPrefInput.style.display = 'none';
    shiftPrefLabel.style.display = 'none';
    shiftPrefInput.value = '';
  }
}
['roleGM','roleShiftLead','roleCashier','roleFoodChampion'].forEach(id => {
  document.getElementById(id).addEventListener('change', function() {
    showHideDesiredHours();
    showHideShiftPref();
    // If Shift Lead is selected, check open availability and disable inputs
    if (document.getElementById('roleShiftLead').checked) {
      document.getElementById('openAvail').checked = true;
      ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].forEach(day => {
        document.getElementById('avail'+day).checked = true;
        document.getElementById('start'+day).value = '08:00';
        document.getElementById('end'+day).value = '16:00';
        document.getElementById('avail'+day).disabled = true;
        document.getElementById('start'+day).disabled = true;
        document.getElementById('end'+day).disabled = true;
      });
    } else {
      document.getElementById('openAvail').checked = false;
      ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].forEach(day => {
        document.getElementById('avail'+day).disabled = false;
        document.getElementById('start'+day).disabled = false;
        document.getElementById('end'+day).disabled = false;
      });
    }
  });
});

window.editEmployee = function(idx) {
  const emp = employees[idx];
  document.getElementById('empName').value = emp.name;
  ['roleGM','roleShiftLead','roleCashier','roleFoodChampion'].forEach(roleId => {
    document.getElementById(roleId).checked = emp.roles.includes(document.getElementById(roleId).value);
  });
  updateRoleCheckboxes();
  showHideShiftPref();
  shiftPrefInput.value = emp.shiftPref || '';
  // Ensure openAvail checkbox matches actual availability
  if (emp.availability === 'open') {
    document.getElementById('openAvail').checked = true;
    ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].forEach(day => {
      document.getElementById('avail'+day).checked = true;
      document.getElementById('start'+day).value = '08:00';
      document.getElementById('end'+day).value = '16:00';
      document.getElementById('avail'+day).disabled = true;
      document.getElementById('start'+day).disabled = true;
      document.getElementById('end'+day).disabled = true;
    });
  } else {
    document.getElementById('openAvail').checked = false;
    ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].forEach(day => {
      document.getElementById('avail'+day).disabled = false;
      document.getElementById('start'+day).disabled = false;
      document.getElementById('end'+day).disabled = false;
      document.getElementById('avail'+day).checked = !!emp.availability[day];
      document.getElementById('start'+day).value = emp.availability[day] ? emp.availability[day].start : '08:00';
      document.getElementById('end'+day).value = emp.availability[day] ? emp.availability[day].end : '16:00';
    });
  }
  setEditMode(idx);
  showHideDesiredHours();
};

addBtn.onclick = function() {
  const name = document.getElementById('empName').value.trim();
  const roles = getRoles();
  let availability = getAvailability();
  let desiredHours = null;
  let shiftPref = '';
  // If adding (not editing) and manager, set availability based on openAvail checkbox
  if (editIdx === null && roles.includes('Shift Lead')) {
    if (document.getElementById('openAvail').checked) {
      availability = 'open';
      ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].forEach(day => {
        document.getElementById('avail'+day).checked = true;
        document.getElementById('start'+day).value = '08:00';
        document.getElementById('end'+day).value = '16:00';
        document.getElementById('avail'+day).disabled = true;
        document.getElementById('start'+day).disabled = true;
        document.getElementById('end'+day).disabled = true;
      });
    } else {
      // Use manual inputs
      ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].forEach(day => {
        document.getElementById('avail'+day).disabled = false;
        document.getElementById('start'+day).disabled = false;
        document.getElementById('end'+day).disabled = false;
      });
    }
  }
  if (!roles.includes('GM') && (roles.includes('Shift Lead') || roles.includes('Cashier') || roles.includes('Food Champion'))) {
    shiftPref = shiftPrefInput.value;
  }
  if (roles.includes('Shift Lead') || roles.includes('Food Champion') || roles.includes('Cashier')) {
    desiredHours = parseFloat(document.getElementById('desiredHours').value) || null;
  }
  if (!name) {
    alert('Please enter a name.');
    return;
  }
  if (roles.length === 0) {
    alert('Select at least one role.');
    return;
  }
  if (editIdx !== null) {
    // Save edit
    if (employees.some((e, i) => i !== editIdx && e.name.toLowerCase() === name.toLowerCase())) {
      alert('Employee name must be unique.');
      return;
    }
    employees[editIdx] = { name, roles, availability, desiredHours, shiftPref };
    saveEmployees();
    renderEmployeeTable();
    clearEmployeeForm();
    exitEditMode();
  } else {
    if (employees.some(e => e.name.toLowerCase() === name.toLowerCase())) {
      alert('Employee name must be unique.');
      return;
    }
    const emp = { name, roles, availability, desiredHours, shiftPref };
    employees.push(emp);
    saveEmployees();
    addEmployeeRow(emp);
    clearEmployeeForm();
  }
};

function clearEmployeeForm() {
  document.getElementById('empName').value = '';
  ['roleGM','roleShiftLead','roleCashier','roleFoodChampion'].forEach(roleId => {
    document.getElementById(roleId).checked = false;
    document.getElementById(roleId).disabled = false;
  });
  document.getElementById('openAvail').checked = false;
  ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].forEach(day => {
    document.getElementById('avail'+day).checked = true;
    document.getElementById('start'+day).value = '08:00';
    document.getElementById('end'+day).value = '16:00';
    document.getElementById('avail'+day).disabled = false;
    document.getElementById('start'+day).disabled = false;
    document.getElementById('end'+day).disabled = false;
  });
  desiredHoursInput.value = '';
  desiredHoursInput.style.display = 'none';
  shiftPrefInput.value = '';
  shiftPrefInput.style.display = 'none';
  shiftPrefLabel.style.display = 'none';
  exitEditMode();
}

window.deleteEmployee = function(idx) {
  const emp = employees[idx];
  if (!confirm(`Are you sure you want to delete ${emp.name}?`)) return;
  employees.splice(idx, 1);
  saveEmployees();
  renderEmployeeTable();
};

function generateWeeklySchedule(employees, storeHourCap, managerHourCap) {
  const days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
  const shiftTemplates = [
    { name: 'Morning', start: 6 * 60, end: 14 * 60 },
    { name: 'Afternoon', start: 14 * 60, end: 22 * 60 },
    { name: 'Night', start: 22 * 60, end: 30 * 60 }
  ];
  const gmTemplate = { start: 10 * 60, end: 18 * 60 }; // 10am–6pm

  const shifts = [];
  const warnings = [];
  const empScheduled = {};
  const roleHours = { manager: 0, employee: 0 };

  employees.forEach(emp => empScheduled[emp.name] = 0);

  function timeToMinutes(t) {
    const [h, m] = t.split(':').map(Number);
    return h * 60 + m;
  }
  function minutesToTime(m) {
    const h = Math.floor(m / 60) % 24;
    const min = m % 60;
    return `${h.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;
  }
  function isAvailable(emp, day, start, end) {
    if (emp.availability === 'open') return true;
    if (!emp.availability[day]) return false;
    const availStart = timeToMinutes(emp.availability[day].start);
    const availEnd = timeToMinutes(emp.availability[day].end);
    return availStart <= start && availEnd >= end;
  }
  function canSchedule(emp, hours) {
    if (emp.desiredHours == null) return true;
    if (emp.overtimeOk) return true;
    return empScheduled[emp.name] + hours <= emp.desiredHours;
  }
  function getQuota(emp) {
    return emp.priority == null ? 1 : (1 - emp.priority * 0.1);
  }

  // Schedule GMs for their template first (Mon–Fri, 10am–6pm)
  days.slice(0,5).forEach(day => {
    const gm = employees.find(emp =>
      emp.roles.includes('GM') &&
      isAvailable(emp, day, gmTemplate.start, gmTemplate.end) &&
      canSchedule(emp, 8)
    );
    if (gm) {
      shifts.push({
        day,
        start: minutesToTime(gmTemplate.start),
        end: minutesToTime(gmTemplate.end),
        role: 'GM',
        employeeName: gm.name
      });
      empScheduled[gm.name] += 8;
      roleHours.manager += 8;
    }
  });

  // For each day and shift, assign manager, cashier, food champion
  for (const day of days) {
    for (const shift of shiftTemplates) {
      // Manager (GM or Shift Lead)
      let manager = employees
        .filter(emp =>
          (emp.roles.includes('Shift Lead') || emp.roles.includes('GM')) &&
          isAvailable(emp, day, shift.start, shift.end) &&
          (emp.roles.includes('GM') || empScheduled[emp.name] + 8 <= managerHourCap || emp.overtimeOk) &&
          canSchedule(emp, 8)
        )
        .sort((a, b) => {
          // Prefer Shift Lead over GM, then priority, then desiredHours left, then shiftPref
          if (a.roles.includes('GM') && !b.roles.includes('GM')) return 1;
          if (!a.roles.includes('GM') && b.roles.includes('GM')) return -1;
          const quotaA = getQuota(a), quotaB = getQuota(b);
          if (quotaA !== quotaB) return quotaA > quotaB ? -1 : 1;
          const leftA = (a.desiredHours ?? Infinity) - empScheduled[a.name];
          const leftB = (b.desiredHours ?? Infinity) - empScheduled[b.name];
          if (leftA !== leftB) return leftB - leftA;
          if (a.shiftPref === shift.name && b.shiftPref !== shift.name) return -1;
          if (b.shiftPref === shift.name && a.shiftPref !== shift.name) return 1;
          return 0;
        })[0];
      if (manager) {
        shifts.push({
          day,
          start: minutesToTime(shift.start),
          end: minutesToTime(shift.end),
          role: 'Manager',
          employeeName: manager.name
        });
        empScheduled[manager.name] += 8;
        roleHours.manager += 8;
        if (manager.desiredHours != null && empScheduled[manager.name] > manager.desiredHours && !manager.overtimeOk) {
          warnings.push(`Overtime: ${manager.name} scheduled for more than desired hours.`);
        }
      } else {
        warnings.push(`Unfilled manager role on ${day} ${shift.name}`);
      }

      // Cashier
      let cashier = employees
        .filter(emp =>
          emp.roles.includes('Cashier') &&
          isAvailable(emp, day, shift.start, shift.end) &&
          canSchedule(emp, 8)
        )
        .sort((a, b) => {
          const quotaA = getQuota(a), quotaB = getQuota(b);
          if (quotaA !== quotaB) return quotaA > quotaB ? -1 : 1;
          const leftA = (a.desiredHours ?? Infinity) - empScheduled[a.name];
          const leftB = (b.desiredHours ?? Infinity) - empScheduled[b.name];
          if (leftA !== leftB) return leftB - leftA;
          if (a.shiftPref === shift.name && b.shiftPref !== shift.name) return -1;
          if (b.shiftPref === shift.name && a.shiftPref !== shift.name) return 1;
          return 0;
        })[0];
      if (cashier) {
        shifts.push({
          day,
          start: minutesToTime(shift.start),
          end: minutesToTime(shift.end),
          role: 'Cashier',
          employeeName: cashier.name
        });
        empScheduled[cashier.name] += 8;
        roleHours.employee += 8;
        if (cashier.desiredHours != null && empScheduled[cashier.name] > cashier.desiredHours && !cashier.overtimeOk) {
          warnings.push(`Overtime: ${cashier.name} scheduled for more than desired hours.`);
        }
      } else {
        warnings.push(`Unfilled cashier role on ${day} ${shift.name}`);
      }

      // Food Champion
      let foodChampion = employees
        .filter(emp =>
          emp.roles.includes('Food Champion') &&
          isAvailable(emp, day, shift.start, shift.end) &&
          canSchedule(emp, 8)
        )
        .sort((a, b) => {
          const quotaA = getQuota(a), quotaB = getQuota(b);
          if (quotaA !== quotaB) return quotaA > quotaB ? -1 : 1;
          const leftA = (a.desiredHours ?? Infinity) - empScheduled[a.name];
          const leftB = (b.desiredHours ?? Infinity) - empScheduled[b.name];
          if (leftA !== leftB) return leftB - leftA;
          if (a.shiftPref === shift.name && b.shiftPref !== shift.name) return -1;
          if (b.shiftPref === shift.name && a.shiftPref !== shift.name) return 1;
          return 0;
        })[0];
      if (foodChampion) {
        shifts.push({
          day,
          start: minutesToTime(shift.start),
          end: minutesToTime(shift.end),
          role: 'Food Champion',
          employeeName: foodChampion.name
        });
        empScheduled[foodChampion.name] += 8;
        roleHours.employee += 8;
        if (foodChampion.desiredHours != null && empScheduled[foodChampion.name] > foodChampion.desiredHours && !foodChampion.overtimeOk) {
          warnings.push(`Overtime: ${foodChampion.name} scheduled for more than desired hours.`);
        }
      } else {
        warnings.push(`Unfilled food champion role on ${day} ${shift.name}`);
      }
    }
  }

  // Check for scheduling outside availability
  shifts.forEach(shift => {
    const emp = employees.find(e => e.name === shift.employeeName);
    if (emp && !isAvailable(emp, shift.day, timeToMinutes(shift.start), timeToMinutes(shift.end))) {
      warnings.push(`Outside availability: ${emp.name} scheduled outside their availability on ${shift.day} (${shift.start}–${shift.end})`);
    }
  });

  return {
    shifts,
    roleHours,
    empScheduled,
    warnings
  };
}

function renderSchedule() {
  const tbody = document.querySelector('#output tbody');
  tbody.innerHTML = '';
  // Find all managers (GM and Shift Lead)
  const managers = employees.filter(emp => emp.roles.includes('GM') || emp.roles.includes('Shift Lead'));
  // Group managers by shift preference
  const shifts = ['Morning', 'Afternoon', 'Night'];
  shifts.forEach(shift => {
    const shiftManagers = managers.filter(emp => (emp.shiftPref || 'Morning') === shift);
    if (shiftManagers.length > 0) {
      const names = shiftManagers.map(emp => emp.name + ' (' + emp.roles.join(', ') + ')').join(', ');
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${shift}</td>
        <td>Managers Overlapping</td>
        <td>${names}</td>
        <td>Manager</td>
        <td></td>
      `;
      tbody.appendChild(tr);
    }
  });
  // Update summary (no quota logic)
  document.getElementById('maxHours').textContent = '';
  document.getElementById('quotaStatus').textContent = 'Manager overlap schedule only.';
  document.getElementById('quotaStatus').style.color = 'blue';
}

document.querySelector('button').addEventListener('click', () => {
  // Get store hour cap
  const storeHours = parseFloat(document.getElementById('storeHours').value) || 0;
  // Generate schedule using schedule.js
  const result = generateWeeklySchedule(employees, storeHours, 30);
  const tbody = document.querySelector('#output tbody');
  tbody.innerHTML = '';
  result.shifts.forEach(shift => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${shift.day}</td>
      <td>${shift.start} – ${shift.end}</td>
      <td>${shift.employee}</td>
      <td>${shift.role}</td>
      <td>${shift.role === 'Shift Lead' ? 'Yes' : ''}</td>
    `;
    tbody.appendChild(tr);
  });
  // Show warnings
  let warningDiv = document.getElementById('scheduleWarnings');
  if (!warningDiv) {
    warningDiv = document.createElement('div');
    warningDiv.id = 'scheduleWarnings';
    warningDiv.style.color = 'orange';
    // Append after the output table for reliability
    document.querySelector('#output').parentNode.appendChild(warningDiv);
  }
  warningDiv.innerHTML = result.warnings.length ? result.warnings.map(w => `<div>${w}</div>`).join('') : '';
  // Update summary
  document.getElementById('maxHours').textContent = result.storeScheduled;
  const quotaStatus = document.getElementById('quotaStatus');
  if (result.storeScheduled < storeHours) {
    quotaStatus.textContent = `Scheduled hours meet the quota. (${result.storeScheduled} / ${storeHours} hrs)`;
    quotaStatus.style.color = 'green';
  } else {
    quotaStatus.textContent = `Scheduled hours exceed the quota! (${result.storeScheduled} / ${storeHours} hrs)`;
    quotaStatus.style.color = 'red';
  }
});

function saveStoreHours() {
  const storeHours = document.getElementById('storeHours').value;
  localStorage.setItem('storeHours', storeHours);
}

document.getElementById('storeHours').addEventListener('input', saveStoreHours);

function loadStoreHours() {
  const saved = localStorage.getItem('storeHours');
  if (saved !== null) {
    document.getElementById('storeHours').value = saved;
  }
}

window.addEventListener('DOMContentLoaded', () => {
  loadEmployees();
  loadStoreHours();
});

// When openAvail is unchecked, enable manual day/time inputs
const openAvailBox = document.getElementById('openAvail');
openAvailBox.addEventListener('change', function() {
  if (openAvailBox.checked) {
    ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].forEach(day => {
      document.getElementById('avail'+day).checked = true;
      document.getElementById('start'+day).value = '08:00';
      document.getElementById('end'+day).value = '16:00';
      document.getElementById('avail'+day).disabled = true;
      document.getElementById('start'+day).disabled = true;
      document.getElementById('end'+day).disabled = true;
    });
  } else {
    ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].forEach(day => {
      document.getElementById('avail'+day).disabled = false;
      document.getElementById('start'+day).disabled = false;
      document.getElementById('end'+day).disabled = false;
    });
  }
});