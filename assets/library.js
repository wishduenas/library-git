var colours = {
	onshelf: [
		"linear-gradient(to right, #4b0236, #5c0242, #4b0236)",
		"linear-gradient(to right, #800600, #a50800, #800600)",
		"linear-gradient(to right, #215d5f, #297678, #215d5f)",
		"linear-gradient(to right, #40245b, #4b2b6c, #40245b)",
		"linear-gradient(to right, #69220a, #8c2d0d, #69220a)",
		"linear-gradient(to right, #0a0a29, #0f0f3e, #0a0a29)",
		"linear-gradient(to right, #093300, #0c4400, #093300)",
		"linear-gradient(to right, #06541e, #076d27, #06541e)",
		"linear-gradient(to right, #761616, #901b1b, #761616)",
	],
	inhand: ["#5c0242", "#a50800", "#297678", "#4b2b6c", "#8c2d0d", "#0f0f3e", "#0c4400", "#076d27", "#901b1b"]
};

function Topic(book) {
    this.name = book.topic;
    this.collection = [book];
}

function Branch(book) {
    this.name = book.branch;
    this.topics = [new Topic(book)];
}

function Partition(array, low, high, type = "alphabetical") {
    var i = low - 1;
    var a;
    var b;
    if (type == "size") {
        var pivot = array[high].topics.length;
        for (j = low; j <= high -1; j++) {
            if (array[j].topics.length > pivot) {
                i++;
                a = array[i];
                b = array[j];
                array[i] = b;
                array[j] = a;
            }
        }
    } else {
        var pivot = array[high].name;
        for (j = low; j <= high - 1; j++) {
            if (array[j].name.localeCompare(pivot) == -1) {
                i++;
                a = array[i];
                b = array[j];
                array[i] = b;
                array[j] = a;
            }
        }
    }
    a = array[i + 1];
    b = array [high];
    array[i + 1] = b;
    array[high] = a;
    return i + 1;
}

function Sort(array, low, high) {
    var pi;
    if (low < high) {
        pi = Partition(array, low, high);
        Sort(array, low, pi - 1);
        Sort(array, pi + 1, high);
    }
}

var onshelf;

$(document).ready(
function main() {
    var branches = [];
    var hand = document.getElementById("hand");
    var selection = document.getElementById("selection");
    var closeBtn = document.getElementById("close");
    var viewer = document.getElementById("viewer");
    var reader = document.getElementById("reader");
    var leaveBook = document.getElementById("leave");
    
    closeBtn.onclick = function() {
        selection.style.top = "-100%";
        hand.style.backgroundColor = "rgba(0, 0, 0, 0)";
        onshelf.style.animationPlayState = "paused";
        setTimeout(() => {onshelf.style.animationIterationCount ++;}, 200);
        setTimeout(() => {onshelf.style.animationPlayState = "running";}, 650);
        setTimeout(() => {hand.style.zIndex = "-1";}, 1000);
    }
    
    leaveBook.onclick = function() {
        viewer.style.top = "-100%";
        reader.data = "";
    }
//Grouping all books into their respective branches and topics within the branches array    
    for (i in books) {
        var match = false;
        var j = 0;
        while (j < branches.length) {
            if (books[i].branch == branches[j].name) {
                match = true;
                break;
            }
            j++;
        }
        if (match) {
            var matching = false;
            var k = 0;
            while (k < branches[j].topics.length) {
                if (books[i].topic == branches[j].topics[k].name) {
                    matching = true;
                    break;
                }
                k++;
            }
            if (matching) {
                branches[j].topics[k].collection.push(books[i]);
            } else {
                branches[j].topics.push(new Topic(books[i]));
            }
        } else {
            branches.push(new Branch(books[i]));
        }
    }
 //Sorting alphabetically branches, topics and books
    Sort(branches, 0, branches.length - 1, "size");
    for (x in branches) {
        Sort(branches[x].topics, 0, branches[x].topics.length - 1);
        for (y in branches[x].topics) {
            Sort(branches[x].topics[y].collection, 0, branches[x].topics[y].collection.length - 1);
        }
    }

 //Creating all the shelves to be displayed
    for (j in branches) {
        var library = document.getElementById("library");
        var cabinet = document.createElement("div");
        cabinet.className = "col-4 cabinet";
        cabinet.innerHTML = "<mark>" + branches[j].name + "</mark>";
        library.appendChild(cabinet);
        cabinet = library.children.item(library.children.length - 1);
        
        for (k in branches[j].topics) {
            var label = document.createElement("mark");
            label.className = "label"
            label.innerHTML = branches[j].topics[k].name;
            var shelf;
            shelf = document.createElement("div");
            shelf.className = "back";
            cabinet.appendChild(shelf);
            shelf = cabinet.children.item(cabinet.children.length - 1);
            shelf.appendChild(label);
            shelf.appendChild(document.createElement("br"));
            
            for (l in branches[j].topics[k].collection) {
                if (11 % l == 0 && l > 10) {
                    shelf = document.createElement("div");
                    shelf.className = "back";
                    cabinet.appendChild(shelf);
                    shelf = cabinet.children.item(cabinet.children.length - 1);
                }
                var book = document.createElement("div");
                book.className = "book";
                book.id = branches[j].name + branches[j].topics[k].name + l;
                book.branch = j;
                book.topic = k;
                book.index = l;
                book.addEventListener("click", function (e) {
                    onshelf = document.getElementById(e.target.id);
                    onshelf.style.animationPlayState = "paused";
                    setTimeout(() => {onshelf.style.animationIterationCount ++;}, 100);
                    setTimeout(() => {onshelf.style.animationPlayState = "running";}, 20);
                    hand.style.zIndex = "1";
                    hand.style.backgroundColor = "rgba(0, 0, 0, 0.4)";
                    selection.style.backgroundColor = e.target.style.backgroundColor;
                    selection.style.top = "0";
                    var selectedBook = branches[e.target.branch].topics[e.target.topic].collection[e.target.index];
                    document.getElementById("name").innerHTML = selectedBook.name;
                    document.getElementById("author").innerHTML = selectedBook.author;
                    document.getElementById("edition").innerHTML = selectedBook.edition + ". Ed.";
                    document.getElementById("read").addEventListener("click", function (ev) {
                        document.getElementById("viewer").style.top = "0";
                        var authorline = "";
                        if (selectedBook.author != "") {
                            authorline = " - " + selectedBook.author;
                        }
                        document.getElementById("reader").data = selectedBook.name + " (" + selectedBook.edition + ")" + authorline + ".pdf";
                    });
                });
                book.style.animationIterationCount = 0;
		var colourId = Math.floor(Math.random()*colours.inhand.length);
                book.style.backgroundImage = colours.onshelf[colourId];
		book.style.backgroundColor = colours.inhand[colourId];
                book.innerHTML = branches[j].topics[k].collection[l].name;
                shelf.appendChild(book);
                book = shelf.children.item(shelf.children.length - 1);
                if (book.clientHeight < 160) {
                    book.style.transform = "translateY(" + (160 - book.clientHeight) + "px)";
                }
            }
        }
    }

    //Using masonry to set layout
    $("#library").masonry({
        itemSelector: ".cabinet"
    });
}
);