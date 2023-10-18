import { Note } from "./Note.js";

export class NoteList {
  _notes = []; //чтобы создать список, нужна отдельная переменная(глобальная)
  _key = null; //для хранения данных
  _def = [];

  constructor(container, key = "null", def = []) {
    //container- куда будут помещены все дела(весь список дел)
    this.container = container; //создаю его в глобал. обл. видимости
    this.list = document.createElement("div"); //создаю новый элемент
    this.list.classList.add("list-group"); //добавляю класс

    this._def = def;
    this._key = key;

    this.update(); //вызываю при загрузке приложения (обновляю список, загружаю из LS)

    container.innerHTML = ""; //делаю контейнер пустым (очищаю его)
    container.append(this.list); //добавляю в контейнер list
  }

  //проверка списка на кол-во записей. Если записей нет, то показываю сообщение
  checkEmpty() {
    if (this._notes.length == 0) {
      //если длина массива с записями равна 0
      //то создаю новый html элемент
      this.empty = document.createElement("div");
      this.empty.classList.add(
        "d-flex",
        "list-group-item",
        "justify-content-center",
        "align-items-center",
        "text-secondary",
        "bg-light",
        "p-5"
      );

      this.empty.textContent = "Список дел пуст"; //добавляю текст
      this.list.append(this.empty); //добавляю в list(в список)
    } else {
      if (this.empty) {
        this.empty.remove(); //в противном случае удаляю
      }
    }
  }

  //чтобы создать уникальное айди, надо создать максимальное id из списка и прибавить к нему 1
  //ф-ция будет возвращать новое уникальное число
  getNewId() {
    let max = 0; //max число равно 0
    //циклом прохожу по всему массиву
    for (let note of this._notes) {
      if (note.id > max) max = note.id;
    } //в итоге в переменной max будет число с максимал. id
    return max + 1; //получаю уникальный id
  }

  //добавляю новый элемент в список с помощью метода
  add(name, done = false) {
    let newNote = new Note(this, name, done); //создаем экземпляр класса. this - передаем весь класс (чтобы внутри этого Note был доступен _notes)
    newNote.id = this.getNewId(); //добавляю еще один параметр (уникальное число, у каждого эл-та в списке должно быть уникальное число, по которому можно будет идентифицировать элемент,например для его поиска,удаления)
    this._notes.push(newNote); //добавляю созданную переменную

    this.checkEmpty(); //вызываю при добавлении нового дела
    this.save(); //запускаю при добавлении
    return newNote.id;
  }

  //удаляю элемент с самого массива из списка по id
  remove(value) {
    let id = value;

    if (value instanceof Note) {
      id = value.id;
    }

    //поиск элемента, чтобы его удалить по порядковому номеру(по его id) -
    //(прохожу по всему массиву с экземплярами, ищу нужный элемент по его id и удаляю его):
    for (let i = 0; i < this._notes.length; i++) {
      if (this._notes[i].id == id) {
        this._notes.splice(i, 1);
      }
    }
    this.checkEmpty(); //вызываю в случае удаления
    this.save(); //запускаю при удалении
  }

  //для сохранения данных списка
  save() {
    //если key существует,тогда сохраняю
    if (this._key) {
      let saveList = [];

      //формирую
      for (let note of this._notes) {
        saveList.push({
          id: note.id,
          name: note.name,
          done: note.done,
        });
      } // сохраняю. (передать массив нельзя, поэтому преобразую его в строчку с помощью json)
      localStorage.setItem(this._key, JSON.stringify(saveList));
    }
  }

  //возвращаю обратно этот список (получаю все данные - из localstorage или по умолчанию
  update() {
    let startList = this._def;

    this._notes = []; //очищаю список  (массив)
    this.list.innerHTML = "";

    //получаю данные из localStorage
    if (this._key) {
      let dataLS = localStorage.getItem(this._key);
      //если там что то есть(не пустая строка и не null)
      if (dataLS !== "" && dataLS !== null) startList = JSON.parse(dataLS); //преобразую в массив
    }

    //прохожусь циклом по этим данным
    if (startList.length > 0) {
      //если в этом списке что-то есть
      for (let obj of startList) {
        //прохожусь по массиву, каждый раз в obj будет помещаться объект
        let newNote = new Note(this, obj.name, obj.done); //создаю экземпляр класса
        if (obj.id) {
          //если у obj есть id
          newNote.id = obj.id;
        } else {
          newNote.id = this.getNewId(); //генерирую id
        }
        this._notes.push(newNote); //созданный экземпляр класса добавляю в массив
      }
    }

    this.save();
    this.checkEmpty(); //обновление, проверка списка (если там 0 - покажу соответствующий текст)
  }
}
