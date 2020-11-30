function foo() {
    setTimeout( () => {
       console.log("id:", this.id);
    },100);
 }
 
 foo.call( { id: 42 } );


 var a = {
     name: 'a',
     success: () => {
         console.log(this);
     }
 }

 console.log(this);
 a.success()
 console.log(this);

 function foo() {
     return () => {
         console.trace(this);
     }
 }

 foo.call('周杰伦')()