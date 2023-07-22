function output() {
    var title = document.getElementById("title");
    var author = document.getElementById("author");
    var branch = document.getElementById("branch");
    var topic = document.getElementById("topic");
    var edition = document.getElementById("edition");
    var editionText = edition.value;
    if (editionText == "") {
        editionText = "1";
    }
    var text =
        "books.push(new Book(<br>&#9;'" +
        title.value + "',<br>&#9;'" +
        author.value + "',<br>&#9;'" +
        branch.value + "',<br>&#9;'" +
        topic.value + "',<br>&#9;'" +
        editionText + "'<br>));";
    document.getElementById("output").innerHTML = text;
}