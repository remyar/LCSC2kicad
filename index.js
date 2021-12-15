const App = require('./src');

try{
  //  console.log(process.argv[2]);
  for ( let i = 2 ; i < process.argv.length ; i++ ){
        App(process.argv[i]);
  }
} catch(ex){
    console.error(ex);
}