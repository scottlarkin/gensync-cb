# gensync-cb

Small module for writing async callback code in a more syncrinous way using generator functions.  

useage example:  

```  
  let gensync = require('gensync-cb'),
      fs = require('fs');
  
  function processFile(filePath, callback){
    
    gensync.syncronise(function*(resume){
    
      var [exists] = yield fs.exists(filePath, resume);
      
      if(!exists) return callback('file not found');
        
      var [error, fileContent] = yield fs.readFile(filePath, 'utf8', resume);
      
      if(error) return callback(error);
      
      //do some processing
      
      var newFileContent = '';
      
      var [error] = yield fs.writeFile(filePath, newFileContent, resume);
      
      if(error) return callback(error);

      callback(null, `processed file ${filePath}`);
   
    });
  }
  
  processFile('file.txt', console.log);

```	

Also includes a helper function for running multiple async functions in parallel, with the option to limit the number of functions running simultaniously.

```	

let funcs = [cb=>processFile('file.txt', cb), cb=>processFile('file2.txt', cb)];

gensync.parallel(5, false, funcs, () => console.log('done processing files'));

//same as above, curried
gensync.parallelCurry(5)(false)(funcs)(() => console.log('done processing files'));

```	
