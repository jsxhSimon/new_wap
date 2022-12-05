var fs = require('fs');

function writeFile(path, content, callback){
    try {
        var fd = fs.openSync(path,'w');
        fs.writeSync(fd, content, {
            encoding: 'utf8',
        });
        fs.closeSync(fd);
        console.log(`写入${path}  文件成功`);
        if(callback){
            callback();
        }
    } catch (error) {
        console.log(`写入文件失败，错误信息：${error}`);
        if(callback){
            callback();
        }
    }
}

module.exports = writeFile;
