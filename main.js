import { ToDo } from "./ToDo.js";

let main = new ToDo(document.getElementById("main"));
main.addUser("Мои дела по дому", "my");
main.addUser("Покупки", "shop");
main.addUser("Работа", "Job");
// main.addUser("Покупки", "shop", [
//   { name: "Купить хлеб" },
//   { name: "Купить молоко" },
// ]);

// main.currentUser = "my"; //по умолчанию при открытии стр
console.log(main);
// let newList = new NoteList(document.getElementById("main"), "my"); //my, чтобы не было null

//создаю еще одно такое приложение
// let main2 = new ToDo(document.getElementById("main2"));

document.getElementById("action").addEventListener("click", function () {
  main.addUser(prompt("Категория"), "sad");
});

// let newNote = new Note(document.getElementById("main"), "Название дела");
// //добавляю дела через кнопку действия
// document.getElementById("action").addEventListener("click", function () {
//   let newNote = new Note(document.getElementById("main"), prompt("Ваше дело:"));
// });
