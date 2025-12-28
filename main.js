let id = 1;
let buttonPressed = null;
let PopIsHandling = false;
let scrollEnableTimer = null;

const LIST_SCROLL_DELAY_MS = 2000;

class List {
  constructor() {
    this.list = [];
  }

  getList() {
    return this.list;
  }
  
  clearList() {
    this.list = [];
  }

  addItemToList(item) {
    this.list.push(item);
  }
}

const list = new List();

function updateListScrollState() {
  const listElement = document.getElementById("list");
  const tasksElement = document.getElementById("tasks");
  if (!listElement || !tasksElement) {
    return;
  }

  const taskCount = tasksElement.querySelectorAll(".task").length;
  if (taskCount >= 2) {
    if (!listElement.classList.contains("scroll-ready") && !scrollEnableTimer) {
      scrollEnableTimer = setTimeout(() => {
        listElement.classList.add("scroll-ready");
        scrollEnableTimer = null;
      }, LIST_SCROLL_DELAY_MS);
    }
  } else {
    if (scrollEnableTimer) {
      clearTimeout(scrollEnableTimer);
      scrollEnableTimer = null;
    }
    listElement.classList.remove("scroll-ready");
  }
}

function removeItemFromList(id) {
    list.getList().forEach((item, index) => {
      if (item.id == id) {
        list.getList().splice(index, 1);
      }
    })
}

class Item {
  constructor(title, description, id) {
    this.title = title;
    this.description = description;
    this.id = id;
  }

  returnObj () {
    return {title: this.title, description: this.description, id: this.id};
  }
}

class Storage {
  static getList() {
    let list;
    if (localStorage.getItem("list") === null) {
      list = [];
    } else {
      list = JSON.parse(localStorage.getItem("list"));
    }
    return list;
  }

  static setStorage(list) {
    localStorage.setItem('list', JSON.stringify(list));
  }

  static resetStorage() {
    let list = [];
    localStorage.setItem('list', JSON.stringify(list));
  }
}

function addElement(title, description) {
  const currentStored = Storage.getList();
  let maxID = 0;
  currentStored.forEach(item => {
    if (item.id > maxID) {
      maxID = item.id;
    }
  });

  id = maxID + 1;
  const item = new Item(title, description, id);
  list.addItemToList(item.returnObj());
  Storage.setStorage(list.getList());
  displayArray(item.returnObj());
  id += 1;
}

function handlePop(numberID, elementTitle, elementDescription) {
  const popup = document.getElementById("popup");
  buttonPressed = "";
  PopIsHandling = true;
  document.getElementById("form-title_close").addEventListener("click", (e) => {
    e.preventDefault();
    handleClose(e);
  })
  if (typeof numberID != "undefined") {
    popup.classList.toggle('visible');
  } else {
    const title = document.getElementById("addBar_text").value;
    document.getElementById("form-title_text").value = title;
    popup.classList.toggle('visible');
  }

  const addBtn = document.getElementById("form-title_add");
  const newBtn = addBtn.cloneNode(true);
  addBtn.parentNode.replaceChild(newBtn, addBtn);

  // Now attach the one correct listener:
  newBtn.addEventListener("click", (e) => {
    e.preventDefault();
    handleAdd(e, numberID, elementTitle, elementDescription);
  });
}

function handleClose(e) {
  if (PopIsHandling == true && buttonPressed != "add") {
    e.preventDefault();
    document.getElementById("popup").classList.toggle('visible');
    document.getElementById("form-title_text").value = "";
    document.getElementById("form-description_text").value = "";
    buttonPressed = "close";
    PopIsHandling = false;
  }
}

function handleAdd(e, numberID, elementTitle, elementDescription) {
  if (PopIsHandling == true && buttonPressed != "close") {
    e.preventDefault();
    const popup_title = document.getElementById("form-title_text").value;
    let popup_description = document.getElementById("form-description_text").value;
    if (typeof numberID != "undefined") {
      const elementTitle_new = document.getElementById(`task_title_${numberID}`);
      const elementDescription_new = document.getElementById(`task_description_${numberID}`);
      if (elementTitle != popup_title || elementDescription != popup_description) {
        elementTitle_new.textContent = popup_title;
        elementDescription_new.textContent = popup_description;
        document.getElementById("popup").classList.toggle('visible');
        document.getElementById("form-title_text").value = "";
        document.getElementById("form-description_text").value = "";
        buttonPressed = "";
        PopIsHandling = false;
      } else {
        document.getElementById("popup").classList.toggle('visible');
        document.getElementById("form-title_text").value = "";
        document.getElementById("form-description_text").value = "";
        buttonPressed = "";
        PopIsHandling = false;
      }
    } else {
      if (popup_description != "") {
        addElement(popup_title, popup_description);
      } else {
        popup_description = "";
        addElement(popup_title, popup_description);
      }
      document.getElementById("addBar_text").value = "";
      document.getElementById("popup").classList.toggle('visible');
      document.getElementById("form-title_text").value = "";
      document.getElementById("form-description_text").value = "";
      buttonPressed = "add";
      PopIsHandling = false;
    }
  }
}

function handleEdit(btn) {
  const numberID = btn.getAttribute("data-number-id");
  const elementTitle = document.getElementById(`task_title_${numberID}`).textContent;
  const elementDescription = document.getElementById(`task_description_${numberID}`).textContent;
  document.getElementById("form-title_text").value = elementTitle;
  document.getElementById("form-description_text").value = elementDescription; 
  handlePop(numberID, elementTitle, elementDescription);
}

function handleDelete(btn) {
  const numberID = btn.getAttribute("data-number-id");
  const task = document.getElementById(`task_${numberID}`);
  task.style.opacity = 0;
  task.style.transform = 'scale(0.98)';
  removeItemFromList(numberID);
  console.log(list.getList());
  Storage.setStorage(list.getList());
  setTimeout(() => {
    task.remove();
    updateListScrollState();
  }, 1000);
}

function displayArray(item) {
  const tasks = document.getElementById("tasks");
  const div = document.createElement("div");
  const ID = `${item.id}`;
  div.setAttribute("data-number-id", ID);
    div.classList.add("task");
    div.id = `task_${item.id}`;
    div.innerHTML = `
      <h3 class="task_title" id="task_title_${item.id}" data-number-id="${item.id}">${item.title}</h3>
      <button class="task_btt_edit" id="task_btt_edit_${item.id}" data-number-id="${item.id}"><i class="fa-solid fa-pen-to-square"></i></button>
      <button class="task_btt_del" id="task_btt_del_${item.id}" data-number-id="${item.id}"><i class="fa-solid fa-trash"></i></button>
      <hr class="task_hr">
      <h6 class="task_description" id="task_description_${item.id}" data-number-id="${item.id}">${item.description}</h6>
    `;
    tasks.appendChild(div);
    const listElement = document.getElementById("list");
    if (listElement && listElement.classList.contains("scroll-ready")) {
      if (tasks.scrollHeight - tasks.clientHeight > 4) {
        tasks.scrollTop = tasks.scrollHeight;
      }
    }
    updateListScrollState();
}

function displayStoredArray() {
  const tasks = document.getElementById("tasks");
  const currentStored = Storage.getList();
  list.clearList();
  currentStored.forEach(obj => {
    list.addItemToList(obj);
  });
  if (currentStored != []) {
    for (let obj of currentStored) {
      const ID = `${obj.id}`;
      const div = document.createElement("div");
      div.classList.add("task");
      div.id = `task_${obj.id}`;
      div.setAttribute("data-number-id", ID);
      div.innerHTML = `
        <h3 class="task_title" id="task_title_${obj.id}" data-number-id="${obj.id}">${obj.title}</h3>
        <button class="task_btt_edit" id="task_btt_edit_${obj.id}" data-number-id="${obj.id}"><i class="fa-solid fa-pen-to-square"></i></button>
        <button class="task_btt_del" id="task_btt_del_${obj.id}" data-number-id="${obj.id}"><i class="fa-solid fa-trash"></i></button>
        <hr class="task_hr">
        <h6 class="task_description" id="task_description_${obj.id}" data-number-id="${obj.id}">${obj.description}</h6>
      `;
      tasks.appendChild(div);
    }
  }
  updateListScrollState();
}

document.addEventListener("DOMContentLoaded", () => {
  list.clearList();
    // Storage.resetStorage();

  const currentStored = Storage.getList();
  currentStored.forEach(obj => list.addItemToList(obj));

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      displayStoredArray();
    });
  });

  document.getElementById("addBar_button").addEventListener("click", (e) => {
    e.preventDefault();
    if (document.getElementById("addBar_text").value) {
      handlePop();
    } else {
      alert("Please enter the task title.");
    }
  })

  document.getElementById("tasks").addEventListener("click", (e) => {
    if (e.target.classList.contains("fa-pen-to-square")) {
      // They clicked the icon, so the parent is your button
      handleEdit(e.target.closest(".task_btt_edit"));
    } else if (e.target.classList.contains("task_btt_edit")) {
      // They clicked the button directly
      handleEdit(e.target);
    }
  })

  document.getElementById("tasks").addEventListener("click", (e) => {
    if (e.target.classList.contains("fa-trash")) {
      // They clicked the icon, so the parent is your button
      handleDelete(e.target.closest(".task_btt_del"));
    } else if (e.target.classList.contains("task_btt_del")) {
      // They clicked the button directly
      handleDelete(e.target);
    }
  })
})
