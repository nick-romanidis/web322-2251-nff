const doSayHello = function(name) {
    var str = "Hello " + name;
    return str;
}

function sayHello(name) {
    const lbl = document.getElementById("hello-label");
    lbl.innerText = doSayHello(name);
};

