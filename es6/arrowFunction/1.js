// 箭头函数使用禁区

// 1. 对象自变量上使用
var person = {
    name: '周杰伦',
    sum: () => {
        console.log(this);
    }
}

person.sum()
// 浏览器中  => Window对象
// node.js环境中 => {} 

// 修改为普通函数可以获取此时对象的值
var person = {
    name: '周杰伦',
    sum() {
        console.log(this);
    }
}

person.sum()

// 2. 对象原型
function MyCat(name) {
    this.catName = name
}

MyCat.prototype.sayCatName = () => {
    console.log(this);
    return this.catName
}

var cat = new MyCat('Mew');  
cat.sayCatName(); // => undefined  

//  改成原有的即可正常工作

function MyCat(name) {  
    this.catName = name;
  }

MyCat.prototype.sayCatName = function() {  
    console.log(this === cat); // => true
    returnthis.catName;
};

var cat = new MyCat('Mew');  
cat.sayCatName(); // => 'Mew'  


function Timer() {
    this.s1 = 0
    this.s2 = 0

    setInterval(() => this.s1++, 1000)

    setInterval(function () {
        this.s2++
    }, 1000)

}

var timer = new Timer()

setTimeout(() => {console.log('s1: ', timer.s1);}, 3100)
setTimeout(() => {console.log('s2: ', timer.s2);}, 3100)


  
