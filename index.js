import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  onValue,
  remove,
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

const appSettings = {
  databaseURL:
    "https://playground-b8997-default-rtdb.asia-southeast1.firebasedatabase.app/",
};

const app = initializeApp(appSettings);
const database = getDatabase(app);
const shoppingListInDB = ref(database, "shoppingList");

const inputFieldEl = document.getElementById("input-field");
const addButtonEl = document.getElementById("add-button");
const shoppingListEl = document.getElementById("shopping-list");
const alertBox = document.getElementsByClassName("alert");

addButtonEl.addEventListener("click", function () {
  let inputValue = inputFieldEl.value;

  if (inputValue === "" || inputValue === " ") {
    alert(" BO'SH jo'natib bo'lmaydi ");

    setTimeout(function () {
      alertBox.style.display = "none";
    }, 5000);
  } else {
    push(shoppingListInDB, inputValue);

    clearInputFieldEl();
  }
});

onValue(shoppingListInDB, function (snapshot) {
  if (snapshot.exists()) {
    let itemsArray = Object.entries(snapshot.val());

    clearShoppingListEl();

    for (let i = 0; i < itemsArray.length; i++) {
      let currentItem = itemsArray[i];
      let currentItemId = currentItem[0];
      let currentItemValue = currentItem[1];
      appendItemTOShoppingListEl(currentItem);
    }
  } else {
    shoppingListEl.innerHTML = "SMS yozsa ham bo'ladi...";
  }
});

function clearShoppingListEl() {
  shoppingListEl.innerHTML = "";
}

function clearInputFieldEl() {
  inputFieldEl.value = "";
}

function appendItemTOShoppingListEl(item) {
  let itemId = item[0];
  let itemValue = item[1];

  let newEl = document.createElement("li");

  newEl.textContent = itemValue;

  newEl.addEventListener("click", function () {
    let exactLocationOfItemInDB = ref(database, `shoppingList/${itemId}`);
    remove(exactLocationOfItemInDB);
  });

  shoppingListEl.append(newEl);
}
