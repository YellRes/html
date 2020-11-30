var b = {
    success: () => {
        console.log(this);
    }
}

var b2 = {
    success: function() {
        console.log(this);
    }
}

console.log(this);

b.success()
b2.success()
