const itemForm = document.getElementById("item-form");
const itemInput = document.getElementById("item-input");
const itemList = document.getElementById("item-list");
const clearBtn = document.getElementById("clear");
const filterInput = document.getElementById("filter");
const formBtn = itemForm.querySelector(".add-edit-btn");
const editCancelBtn = itemForm.querySelector("#cancel-button");
let isEditMode = false;

function displayItem() {
  const itemsFromStorage = getItemFromStorage();
  itemsFromStorage.forEach((item) => addItemToDom(item));
  checkUi();
}
function addItem(event) {
  event.preventDefault();

  // validate input
  const newItem = itemInput.value.trim();
  if (newItem === "") {
    alert("Please add any Item");
    return;
  }
  // Check for edit mode
  if (isEditMode) {
    const itemToEdit = itemList.querySelector(".edit-mode");

    removeItemFromStorage(itemToEdit.textContent);
    itemToEdit.classList.remove("edit-mode");
    itemToEdit.remove();
    isEditMode = false;
  } else {
    if (checkIfItemExists(newItem)) {
      alert(`The item "${newItem}" already exists!`);
      return;
    }
  }
  addItemToDom(newItem);
  // set the values in local storage
  addItemToStorage(newItem);
  checkUi();
  itemInput.value = "";
}
function addItemToDom(item) {
  // create list item
  const li = document.createElement("li");
  li.appendChild(document.createTextNode(item));
  const button = createButton("remove-item btn-link text-danger");
  li.appendChild(button);
  itemList.appendChild(li);
}
function addItemToStorage(item) {
  const itemsFromStorage = getItemFromStorage();
  itemsFromStorage.push(item);
  localStorage.setItem("items", JSON.stringify(itemsFromStorage));
}
function getItemFromStorage() {
  let itemsFromStorage;
  if (localStorage.getItem("items" === null)) {
    itemsFromStorage = [];
  } else {
    itemsFromStorage = JSON.parse(localStorage.getItem("items"));
  }
  return itemsFromStorage;
}
const createButton = (classes) => {
  const button = document.createElement("button");
  button.className = classes;
  const icon = createIcon("fa-solid fa-xmark");
  button.appendChild(icon);
  return button;
};

const createIcon = (classes) => {
  const icon = document.createElement("i");
  icon.className = classes;
  return icon;
};
function onClickItem(e) {
  if (e.target.parentElement.classList.contains("remove-item")) {
    removeItem(e.target.parentElement.parentElement);
  } else if (e.target.closest("li")) {
    setItemToEdit(e.target);
  }
}
function checkIfItemExists(item) {
  const itemsFromStorage = getItemFromStorage();
  return itemsFromStorage.includes(item);
}
function setItemToEdit(item) {
  isEditMode = true;
  itemList
    .querySelectorAll("li")
    .forEach((i) => i.classList.remove("edit-mode"));

  item.classList.add("edit-mode");
  formBtn.innerHTML = '<i class="fa-solid fa-pen"></i> Update Item';
  formBtn.className = "btn-dark" ? "btn btn-success" : "";
  editCancelBtn.style.display = "inline-block";
  itemInput.value = item.textContent;
}
function cancelItem(e){
    e.preventDefault();
    itemList
    .querySelectorAll("li")
    .forEach((i) => i.classList.remove("edit-mode"));
    itemInput.value = "";
    editCancelBtn.style.display ="none";
}
// clear item
function removeItem(item) {
  if (confirm(`Are you sure you want to remove "${item.textContent}"?`)) {
    // remove item from dom
    item.remove();
    // remove item from storage
    removeItemFromStorage(item.textContent);
  }
  checkUi();
}
function removeItemFromStorage(item) {
  let itemsFromStorage = getItemFromStorage();

  // Filter out item to be removed
  itemsFromStorage = itemsFromStorage.filter((i) => i !== item);
  // Re-set to localstorage
  localStorage.setItem("items", JSON.stringify(itemsFromStorage));
}
function clearItem(e) {
  if (itemList.children.length > 1) {
    if (confirm("Are you sure you want to remove all the items") == true) {
      while (itemList.firstChild) {
        itemList.removeChild(itemList.firstChild);
      }
      // Clear from localStorage
      localStorage.removeItem("items");
    }
    checkUi();
  }
}

// filter items
function filterItem(e) {
  const text = e.target.value.toLowerCase();
  const items = itemList.querySelectorAll("li");
  items.forEach((element) => {
    const itemName = element.textContent.toLowerCase();
    if (itemName.indexOf(text) != -1) {
      element.style.display = "flex";
    } else {
      element.style.display = "none";
    }
  });
}
function checkUi() {
  const items = itemList.querySelectorAll("li");

  if (items.length === 0) {
    clearBtn.style.display = "none";
    filterInput.style.display = "none";
  } else {
    clearBtn.style.display = "block";
    filterInput.style.display = "block";
  }
  formBtn.className = "btn-dark" ? " btn btn-dark" : "";
  formBtn.innerHTML = `<i class="fa-solid fa-plus me-2"></i>Add Item`;
  editCancelBtn.style.display ="none";
  isEditMode = false;
}

function init() {
  // event listener

  itemForm.addEventListener("submit", addItem);
  itemList.addEventListener("click", onClickItem);
  clearBtn.addEventListener("click", clearItem);
  filterInput.addEventListener("input", filterItem);
  editCancelBtn.addEventListener('click',cancelItem)
  document.addEventListener("DOMContentLoaded", displayItem);
  // getItems();
  checkUi();
}

init();
