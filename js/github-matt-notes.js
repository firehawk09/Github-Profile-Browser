// =====================================================================================



functionA(){
    var numbers = [1, 2, 3, 4],
    self = this;

    numbers.forEach(function(num){
        self.message = num;
        self.log();
    })

    this.log();
}
A.prototype.log = function(){
    console.log(this.message)
}

var test = new A();
test.log();












//=======================================================================================