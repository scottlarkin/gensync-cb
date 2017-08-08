# gensync-cb

Small module for writing async callback code in a more syncrinous way using generator functions.  

useage example:  

``` 
(()=>{
  'use strict';
  
  let gensync = require('gensync-cb'),
      fs = require('fs');
  
  function processFile(filePath, callback){
    
    gensync.syncronise(function*(resume){
    
      var [exists] = yield fs.exsts(path, resume);
      
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

})();

```	


