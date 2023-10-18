import { NoteList } from "./NoteList.js";

export class ToDo {
  _currentUser = "todo"; //по умолчанию текущий пользователь
  _users = []; //массив пользователей
  notes = null;

  constructor(
    container,
    currentTitle = "Список дел",
    currentKey = "todo",
    currentDef = []
  ) {
    //currentTitle , currentKey , currentDef  текущие дела по умолчанию
    this.container = container; //делаю его глобальным

    this.nav = document.createElement("nav"); //блок для навигации
    this.title = document.createElement("h2"); //заголовок списка
    this.form = document.createElement("form"); //форма
    this.input = document.createElement("input"); //для добавления нового дела
    this.buttonWrapper = document.createElement("div"); //кнопка для добавления с оберткой
    this.button = document.createElement("button");
    this.list = document.createElement("div"); //сам список

    //добавляю ко всему параметры, стили
    this.container.classList.add("pt-5", "pb-5");
    this.nav.classList.add("mb-5", "btn-group");
    this.form.classList.add("input-group", "mb-3");
    this.input.classList.add("form-control");
    this.input.placeholder = "Введите название нового дела";
    this.buttonWrapper.classList.add("input-group-append");
    this.button.classList.add("btn", "btn-primary");
    this.button.textContent = "Добавить дело";
    this.button.disabled = true; //кнопка по умолчанию не активна

    //собираю это все на стр
    this.buttonWrapper.append(this.button);
    this.form.append(this.input);
    this.form.append(this.buttonWrapper);
    this.container.append(this.nav);
    this.container.append(this.title);
    this.container.append(this.form);
    this.container.append(this.list);

    //добавляю текстовому полю событие
    //при вводе проверяю есть ли что либо в текстовом поле, если там ничего нет, то запрещаю нажатие кнопки,если есть - кнопка становится активной и меняет цвет
    this.input.addEventListener("input", () => {
      this.button.disabled = false;
      if (this.input.value.length == 0) {
        this.button.disabled = true;
      }
    });

    //добавляю нового пользователя при создании
    this.addUser(currentTitle, currentKey, currentDef);

    //устанавливаю текущего(созданного) пользователя
    this.currentUser = currentKey;

    //форме добавляю событие отправки
    this.form.addEventListener("click", (e) => {
      e.preventDefault(); //отменяю стандартное действие при отправке

      //если в текстовом поле пусто, то завершаю работу этой ф-ции
      if (!this.input.value) {
        return;
      }

      //если создавали класс заранее, то добавляю в него метод add (реализован в NoteList)
      if (this.notes) {
        this.notes.add(this.input.value); //статус не прописываю, тк новое дело по умолчанию не выполнено
      }

      //при отправке блокирую кнопку, чтобы нельзя было тыкать
      this.button.disabled = true;
      this.input.value = "";
    });
  }

  set currentUser(value) {
    this._currentUser = value;

    let currentUser = null; //текущий пользователь

    for (const user of this._users) {
      if (user.key == value) {
        //если это текущий пользователь
        currentUser = user;
        user.button.classList.add("active"); //добавляю класс
      } else {
        //если это не текущий пользователь (которого не выбрали)
        user.button.classList.remove("active"); //удаляю класс
      }
    }

    this.title.textContent = currentUser.title; //меняю заголовок

    this.notes = new NoteList(this.list, value, currentUser.def); //блок куда будет помещен список
  }
  get currentUser() {
    return this._currentUser;
  }

  //добавление нового пользователя
  //заголовок, его ключ и список дел по умолчанию(изначально будет пустым)
  addUser(title, key, def = []) {
    //создаю кнопку пользователя
    let button = document.createElement("button");
    button.classList.add("btn", "btn-outline-primary");
    button.type = "button";
    button.textContent = title;

    button.addEventListener("click", () => {
      this.currentUser = key;
    });

    //создаю нового пользователя
    this._users.push({
      title: title,
      key: key,
      def: def,
      button: button,
    });

    //добавляю в навигацию
    this.nav.append(button);
  }

  //удаление пользователя по ключу
  removeUser(key) {
    //проверка на кол-во пользователей. всегда должно быть больше 0
    if (this._users.length <= 1) {
      console.log("Количество пользователей должно быть больше нуля");
      return;
    }

    //поиск пользователя в массиве и удаление
    for (let i = 0; i < this._users.length; i++) {
      if (this._users[i].key == key) {
        this._users[i].button.remove();
        this._users.splice(i, 1);
      }
    }

    //если удаляем активного пользователя,то активным будет первый в массиве
    if (this.currentUser == key) {
      this.currentUser = this._users[0].key;
    }
  }
}
