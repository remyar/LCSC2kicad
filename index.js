const App = require('./src');

try{
  //  console.log(process.argv[2]);
    App(process.argv[2]);
} catch(ex){
    console.error(ex);
}