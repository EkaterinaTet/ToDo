import { NoteList } from "./NoteList.js";

export class Note {
  _name = ""; //для добавления новых задач
  _done = false; //изменять статус

  //container -  куда мы хотим поместить наше созданное дело
  //name - название самого дела
  //done - статус (выполнено или нет)
  constructor(container, name = "", done = false) {
    //создаем элементы
    this.item = document.createElement("div");
    this.buttonGroup = document.createElement("div"); //блок для группы кнопок
    this.nameSpan = document.createElement("span"); //куда будем вписывать наш name
    this.doneButton = document.createElement("button"); //смена статуса
    this.deleteButton = document.createElement("button"); //удаление

    //добавляем классы (с бутстрап)
    this.item.classList.add(
      "list-group-item",
      "d-flex",
      "justify-content-between",
      "align-items-center"
    );
    this.buttonGroup.classList.add("btn-group", "btn-group-sm");
    this.doneButton.classList.add("btn", "btn-success");
    this.doneButton.textContent = "Готово";
    this.deleteButton.classList.add("btn", "btn-danger");
    this.deleteButton.textContent = "Удалить";

    //событие при клике на кнопку готово
    //стелочная ф-ция, для того чтобы можно было использовать this (иначе будте доступен this самой кнопки)
    this.doneButton.addEventListener("click", () => {
      this.done = !this.done; //меняем статус на противоположный
    });

    //событие при клике на кнопку удалить
    this.deleteButton.addEventListener("click", () => {
      if (confirm("Вы уверены?")) {
        //уточняем удаление
        this.delete();
      }
    });

    //добавляем элементы в контейнер с определенной вложенностью (append - добавить в конец элемента)
    this.buttonGroup.append(this.doneButton);
    this.buttonGroup.append(this.deleteButton);
    this.item.append(this.nameSpan);
    this.item.append(this.buttonGroup);

    //глобал. обл. видимоси
    this.name = name; //при смене данного параметра будет вызвана ф-ция set
    this.done = done; //смена статуса
    this.container = container; //перемещаем контейнер в глобальную область видимости

    if (container instanceof NoteList) {
      //если данный элемент принадлежит этому классу
      container.list.append(this.item); //добавляем в сам список
    } else {
      container.append(this.item); //добавляем в html
    }
  }

  //изменение задач
  set name(value) {
    this._name = value;
    this.nameSpan.textContent = value;
  }
  //получение значения
  get name() {
    return this._name;
  }

  //изменение статуса
  set done(value) {
    //статус находится внутри value
    this._done = value;

    if (value) {
      this.item.classList.add("list-group-item-success"); //меняем класс при изменении
    } else {
      this.item.classList.remove("list-group-item-success"); //или в противном случае удаляем класс
    }

    //чтобы при обновлении стр сохранялся и статус
    if (this.container instanceof NoteList) {
      this.container.save();
    }
  }
  //получение значения
  get done() {
    return this._done;
  }

  delete() {
    this.item.remove(); //удаляю сначала сам html элемент

    //затем удаление записи из самого списка

    //если container(экземпляр класса) это NoteList (тк container может быть и бычным html документом), то в этом контейнере вызываю метод remove
    if (this.container instanceof NoteList) {
      this.container.remove(this); //в remove передаю не сам id, а экземпляр класса. удаляю this(сам экземпляр класса)
    }
    console.log(this.container);
  }
}
