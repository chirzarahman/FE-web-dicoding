const LIST_BOOK_UNCOMPLETED = "incompleteBookshelfList";
const LIST_BOOK_COMPLETED = "completeBookshelfList";
const ID_BUKU = "bukuId";

function makeLogBook(title, author, year, isComplete) {
  const txt_title = document.createElement("h3");
  txt_title.innerHTML = title;

  const author_view = document.createElement("p");
  const txt_author = document.createElement("p");
  txt_author.classList.add("author");
  author_view.innerHTML = "Penulis : ";
  txt_author.innerHTML = author;

  const year_view = document.createElement("p");
  const txt_year = document.createElement("p");
  txt_year.classList.add("year");
  year_view.innerHTML = "Tahun : ";
  txt_year.innerHTML = year;

  const author_wrapper = document.createElement('div');
  author_wrapper.classList.add('wrapper');
  author_wrapper.append(author_view, txt_author);

  const year_wrapper = document.createElement('div');
  year_wrapper.classList.add('wrapper');
  year_wrapper.append(year_view, txt_year);

  const container = document.createElement("article");
  container.classList.add("book_item");
  container.append(txt_title, author_wrapper, year_wrapper);
  if (isComplete) {
    container.append(createUndoButton(), createTrashButton());
  } else {
    container.append(createCheckButton(), createTrashButton());
  }
  return container;
}

function addLogBook() {
  const completeBookList = document.getElementById(LIST_BOOK_COMPLETED);
  const uncompleteBookList = document.getElementById(LIST_BOOK_UNCOMPLETED);

  const val_title_buku = document.getElementById("title").value;
  const val_author_buku = document.getElementById("author").value;
  const val_year_buku = document.getElementById("year").value;
  const checkBox = document.getElementById("check");

  if (checkBox.checked == true) {
    const book = makeLogBook(
      val_title_buku,
      val_author_buku,
      val_year_buku,
      true
    );

    const objek_buku = composeTodoObject(
      val_title_buku,
      val_author_buku,
      val_year_buku,
      true
    );

    book[ID_BUKU] = objek_buku.id;
    books.push(objek_buku);

    completeBookList.append(book);
    updateDataToStorage();
  } else {
    const book = makeLogBook(
      val_title_buku,
      val_author_buku,
      val_year_buku,
      false
    );

    const objek_buku = composeTodoObject(
      val_title_buku,
      val_author_buku,
      val_year_buku,
      false
    );

    book[ID_BUKU] = objek_buku.id;
    books.push(objek_buku);

    uncompleteBookList.append(book);
    updateDataToStorage();
  }
}

function createButton(buttonTypeClass, text, eventListener) {
  const button = document.createElement("button");
  button.classList.add(buttonTypeClass);
  button.innerText = text;
  button.addEventListener("click", function (event) {
    eventListener(event);
  });
  return button;
}
function addBookToCompleted(bookElement) {
  const listCompleted = document.getElementById(LIST_BOOK_COMPLETED);

  const el_title_buku = bookElement.querySelector(".book_item > h3").innerText;
  const el_author_buku = bookElement.querySelector(
    ".book_item > .wrapper > p.author"
  ).innerText;
  const el_year_buku = bookElement.querySelector(
    ".book_item > .wrapper > p.year"
  ).innerText;

  const buku_baru = makeLogBook(
    el_title_buku,
    el_author_buku,
    el_year_buku,
    true
  );

  const buku = findBook(bookElement[ID_BUKU]);
  buku.isComplete = true;

  buku_baru[ID_BUKU] = buku.id;
  listCompleted.append(buku_baru);

  bookElement.remove();
  updateDataToStorage();
}

function undoBookToStillRead(bookElement) {
  const listUncompleted = document.getElementById(LIST_BOOK_UNCOMPLETED);

  const el_title_buku = bookElement.querySelector(".book_item > h3").innerText;
  const el_author_buku = bookElement.querySelector(
    ".book_item > .wrapper > p.author"
  ).innerText;
  const el_year_buku = bookElement.querySelector(
    ".book_item > .wrapper > p.year"
  ).innerText;

  const buku_baru = makeLogBook(
    el_title_buku,
    el_author_buku,
    el_year_buku,
    false
  );

  const buku = findBook(bookElement[ID_BUKU]);
  buku.isComplete = false;

  buku_baru[ID_BUKU] = buku.id;
  listUncompleted.append(buku_baru);

  bookElement.remove();
  updateDataToStorage();
}

function removeBookFromCompleted(bookElement) {
  const posisi_buku = findBookIndex(bookElement[ID_BUKU]);

  books.splice(posisi_buku, 1);

  bookElement.remove();
  updateDataToStorage();
}

function createCheckButton() {
  return createButton("green", "Selesai Dibaca", function (event) {
    addBookToCompleted(event.target.parentElement);
  });
}

function createTrashButton() {
  return createButton("red", "Hapus", function (event) {
    removeBookFromCompleted(event.target.parentElement);
  });
}

function createUndoButton() {
  return createButton("green", "Belum selesai baca", function (event) {
    undoBookToStillRead(event.target.parentElement);
  });
}
