let currentRole = "";
let database = JSON.parse(localStorage.getItem("database")) ;
let fields = JSON.parse(localStorage.getItem("fields")) || ["No", "Lastname", "Firstname", "Middlename", "Age", "Phone", "Gmail"];
let nextId = database.length ? Math.max(...database.map(d => Number(d.id) || 0)) + 1 : 1;

function saveDatabase() {
  localStorage.setItem("database", JSON.stringify(database));
  localStorage.setItem("fields", JSON.stringify(fields));
}

function setRole() {
  currentRole = document.getElementById("role").value;
  document.getElementById("userForm").classList.add("hidden");
  document.getElementById("adminPanel").classList.add("hidden");
  document.getElementById("superAdminPanel").classList.add("hidden");

  if (currentRole === "user") {
    document.getElementById("userForm").classList.remove("hidden");
    renderUserForm();
  } else if (currentRole === "admin") {
    document.getElementById("adminPanel").classList.remove("hidden");
    renderAdminData();
  } else if (currentRole === "superadmin") {
    document.getElementById("superAdminPanel").classList.remove("hidden");
    renderSuperForm();
    renderSuperData();
  }
}

function renderUserForm() {
  let html = "<h3>Insert Data</h3>";
  fields.filter(f => f !== "id").forEach(f => {
    html += `<input type="text" id="${f}" placeholder="${f}"><br>`;
  });
  html += `<button onclick="insertData()">Submit</button>`;
  document.getElementById("userForm").innerHTML = html;

  // Attach Enter navigation AFTER inputs are created
  enableEnterNavigation();
}


function insertData() {
  let data = { id: nextId++ };
  fields.filter(f => f !== "id").forEach(f => {
    data[f] = document.getElementById(f).value;
  });
  database.push(data);
  saveDatabase();
  alert("Data submitted!");
  renderUserForm();
  nextId = database.length ? Math.max(...database.map(d => Number(d.id) || 0)) + 1 : 1;
}

// Attach Enter key handler to each input field in order
function enableEnterNavigation() {
  const orderedFields = fields.filter(f => f !== "id");
  orderedFields.forEach((f, i) => {
    const input = document.getElementById(f);
    input.addEventListener("keydown", e => {
      if (e.key === "Enter") {
        e.preventDefault();
        const nextFieldName = orderedFields[i + 1];
        if (nextFieldName) {
          document.getElementById(nextFieldName).focus();
        } else {
          insertData(); // last field submits
        }
      }
    });
  });
}



enableEnterNavigation();

function renderAdminData(records = database) {
  let html = "<table><tr>";
  fields.forEach(f => html += `<th>${f}</th>`);
  html += "</tr>";
  records.forEach(d => {
    html += "<tr>";
    fields.forEach(f => html += `<td>${d[f] || ""}</td>`);
    html += "</tr>";
  });
  html += "</table>";
  document.getElementById("adminData").innerHTML = html;
}

function toggleAddForm() {
  document.getElementById("editForm").classList.add("hidden");
  document.getElementById("columnManager").classList.add("hidden");
  let form = document.getElementById("superForm");
  if (form.classList.contains("hidden")) {
    renderSuperForm();
    form.classList.remove("hidden");
  } else {
    form.classList.add("hidden");
  }
}

function renderSuperForm() {
  let html = "<h3>Add New Record</h3>";
  fields.filter(f => f !== "id").forEach(f => {
    html += `<input type="text" id="s_${f}" placeholder="${f}"><br>`;
  });
  html += `<button onclick="superInsert()">Add Record</button>`;
  html += `<button onclick="document.getElementById('superForm').classList.add('hidden')">Cancel</button>`;
  document.getElementById("superForm").innerHTML = html;

  enableEnterNavigationSuper();
}

function superInsert() {
  let data = { id: nextId++ };
  fields.filter(f => f !== "id").forEach(f => {
    data[f] = document.getElementById("s_" + f).value;
  });
  database.push(data);
  saveDatabase();
  renderSuperData();
  alert("Record added!");
  document.getElementById("superForm").classList.add("hidden");
  nextId = database.length ? Math.max(...database.map(d => Number(d.id) || 0)) + 1 : 1;
}

function enableEnterNavigationSuper() {
  const orderedFields = fields.filter(f => f !== "id");
  orderedFields.forEach((f, i) => {
    const input = document.getElementById("s_" + f);
    input.addEventListener("keydown", e => {
      if (e.key === "Enter") {
        e.preventDefault();
        const nextFieldName = orderedFields[i + 1];
        if (nextFieldName) {
          document.getElementById("s_" + nextFieldName).focus();
        } else {
          superInsert();
        }
      }
    });
  });
}

// ---------------- SUPER ADMIN DATA TABLE ----------------
function renderSuperData(records = database) {
  let html = "<table><tr>";
  fields.forEach(f => html += `<th>${f}</th>`);
  html += "<th>Action</th></tr>";
  records.forEach(d => {
    html += "<tr>";
    fields.forEach(f => html += `<td>${d[f] || ""}</td>`);
    html += `<td>
      <button onclick="editRecord(${d.id})">Edit</button>
      <button onclick="deleteRecord(${d.id})">Delete</button>
    </td></tr>`;
  });
  html += "</table>";
  document.getElementById("superData").innerHTML = html;
}
function editRecord(id) {
  let record = database.find(d => d.id === id);
  if (!record) return;

  document.getElementById("superForm").classList.add("hidden");
  document.getElementById("columnManager").classList.add("hidden");

  let html = "<h3>Edit Record (Current ID: " + id + ")</h3>";
  fields.forEach(f => {
    html += `<label style="display:inline-block; width:90px;">${f}:</label>`;
    html += `<input type="text" id="edit_${f}" value="${record[f] !== undefined ? record[f] : ""}" placeholder="${f}"><br>`;
  });
  html += `<button onclick="saveEdit(${id})">Save Changes</button>`;
  html += `<button onclick="cancelEdit()">Cancel</button>`;

  let editForm = document.getElementById("editForm");
  editForm.innerHTML = html;
  editForm.classList.remove("hidden");

  // Enable Enter navigation for edit form
  enableEnterNavigationEdit(id);
}

function enableEnterNavigationEdit(id) {
  const orderedFields = fields;
  orderedFields.forEach((f, i) => {
    const input = document.getElementById("edit_" + f);
    input.addEventListener("keydown", e => {
      if (e.key === "Enter") {
        e.preventDefault();
        const nextFieldName = orderedFields[i + 1];
        if (nextFieldName) {
          document.getElementById("edit_" + nextFieldName).focus();
        } else {
          saveEdit(id); // last field saves changes
        }
      }
    });
  });
}


function saveEdit(originalId) {
  let recordIndex = database.findIndex(d => d.id === originalId);
  if (recordIndex !== -1) {
    let newIdValue = document.getElementById("edit_id").value.trim();
    let parsedNewId = isNaN(newIdValue) ? newIdValue : Number(newIdValue);

    if (parsedNewId !== originalId) {
      let idExists = database.some(d => d.id === parsedNewId);
      if (idExists) {
        alert("An item with ID " + parsedNewId + " already exists! Please pick a unique ID.");
        return;
      }
    }

    fields.forEach(f => {
      let val = document.getElementById("edit_" + f).value;
      if (f === "id") {
        database[recordIndex][f] = isNaN(val) ? val : Number(val);
      } else {
        database[recordIndex][f] = val;
      }
    });

    saveDatabase();
    renderSuperData();
    alert("Record updated!");
  }
  document.getElementById("editForm").classList.add("hidden");
  nextId = database.length ? Math.max(...database.map(d => Number(d.id) || 0)) + 1 : 1;
}

function cancelEdit() {
  document.getElementById("editForm").classList.add("hidden");
}

function deleteRecord(id) {
  let recordIndex = database.findIndex(d => d.id === id);
  if (recordIndex !== -1) {
    database.splice(recordIndex, 1);
    saveDatabase();
    renderSuperData();
    alert("Record deleted!");
    nextId = database.length ? Math.max(...database.map(d => Number(d.id) || 0)) + 1 : 1;
  }
}

function manageColumns() {
  document.getElementById("superForm").classList.add("hidden");
  document.getElementById("editForm").classList.add("hidden");

  let html = "<h3>Manage Columns</h3>";
  html += `<input type="text" id="newColumn" placeholder="New Column Name"><br>`;
  html += `<button onclick="addColumn()">Add Column</button><br><br>`;
  html += "<ul>";
  fields.forEach((f, i) => {
    html += `<li>${f} 
      <button onclick="removeColumn(${i})">Remove</button>
      <button onclick="moveUp(${i})">↑</button>
      <button onclick="moveDown(${i})">↓</button>
    </li>`;
  });
  html += "</ul>";
  html += `<button onclick="document.getElementById('columnManager').classList.add('hidden')">Close</button>`;

  let mgr = document.getElementById("columnManager");
  mgr.innerHTML = html;
  mgr.classList.remove("hidden");
}

function addColumn() {
  let newCol = document.getElementById("newColumn").value.trim();
  if (newCol && !fields.includes(newCol)) {
    fields.push(newCol);
    database.forEach(d => d[newCol] = "");
    saveDatabase();
    renderSuperData();
    manageColumns();
    alert("Column added!");
  }
}

function removeColumn(index) {
  let colName = fields[index];
  if (colName === "id") {
    alert("Cannot remove ID column!");
    return;
  }
  fields.splice(index, 1);
  database.forEach(d => delete d[colName]);
  saveDatabase();
  renderSuperData();
  manageColumns();
  alert("Column removed!");
}

function moveUp(index) {
  if (index > 0) {
    [fields[index - 1], fields[index]] = [fields[index], fields[index - 1]];
    saveDatabase();
    renderSuperData();
    manageColumns();
  }
}

function moveDown(index) {
  if (index < fields.length - 1) {
    [fields[index], fields[index + 1]] = [fields[index + 1], fields[index]];
    saveDatabase();
    renderSuperData();
    manageColumns();
  }
}

function searchRecordAdmin() {
  let value = document.getElementById("searchValueAdmin").value.trim().toLowerCase();
  if (value) {
    let results = database.filter(d => fields.some(f => String(d[f] || "").toLowerCase().includes(value)));
    renderAdminData(results);
  } else {
    renderAdminData();
  }
}

function searchRecordSuper() {
  let value = document.getElementById("searchValueSuper").value.trim().toLowerCase();
  if (value) {
    let results = database.filter(d => fields.some(f => String(d[f] || "").toLowerCase().includes(value)));
    renderSuperData(results);
  } else {
    renderSuperData();
  }
}