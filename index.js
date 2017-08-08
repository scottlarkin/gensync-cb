//Scott Larkin
//Contains functionality for controlling async functions in a more synchronous manner. Only supports callbacks, not promises.
//No more deeply nested callbacks :)

(_ => {
    'use strict';

    module.exports = {
        //write asynchronous callback functions as if they were synchronous!
        syncronise: function (gen) {

            const it = gen(function () {
                let args = [...arguments];
                setTimeout(() => it.next(args), 0);
            });
            it.next();
        },

        parallel: function (logProgress, maxParallelism, funcs, cb) {

            let done = 0,
                data = new Array(funcs.length),
                total = funcs.length,
                i = 0;

            if(!funcs || !funcs.length){
                return cb();
            }
            
            maxParallelism = maxParallelism || 4;
            maxParallelism = funcs.length < maxParallelism ? funcs.length : maxParallelism;

            let todo = funcs.splice(0, maxParallelism);

            (function next(idx) {
                let f = todo.shift();
                if (!f) return;
                f(function(){
                    data[idx] = [...arguments];
                    todo.push(funcs.shift());
                    logProgress && console.log('done: ' + done, 'total: ' + total, '   %:' + ((done / total) * 100));
                    ++done === total && cb(data);
                    setImmediate(() => next(i++));
                });

                next(i++);
            })(i++);
        },

        //use this to reduce code repition when commonly called with the same starting parameters
        //eg -> parallelCurry(true)(5)([f1,f2,f3])(callback)
        parallelCurry: function(logProgress){
            return maxParallelism => functions => callback => this.parallel(logProgress, maxParallelism, functions, callback);
        }
    }
})();