#! /usr/bin/env node

'use strict';

const path = require('path'),
      fs = require('fs'),
      readline = require('readline'),
      colors = require('colors'),
      events = require('events'),
      eventEmitter = new events.EventEmitter();

let indexCount = 0,
    lessPaths = [],
    parentPaths = [],
    userInput = '';

const findLessInDirectory = (startPath,filter,callback) =>{
    if (!fs.existsSync(startPath)){
        throw new Error('There wasn\'t catalog on path that you provide.'.red);
    }
    const files=fs.readdirSync(startPath);
    for(let i=0;i<files.length;i++){
        const filename = path.join(startPath,files[i]);
        const stat = fs.lstatSync(filename);
        if (stat.isDirectory()){
            findLessInDirectory(filename,filter,callback);
        }
        else if (filter.test(filename)) callback(filename);
    };
};

const reWriteFile = (path)=>{
    fs.readFile(path, 'utf8', (err, data) => {
        if (err) throw err;

        fs.writeFile (path, data,(err) => {
           if (err) throw err;
           console.log('Rewriting '+ path +' for you.'.green);
        });
    });
};

const overwriteParentsOnChildChange = (children) =>{
    fs.watchFile(children, (curr, prev) => {
        console.log(children, ' has changed by you.');
        for(let j=0; j<parentPaths.length;j++){
            reWriteFile(parentPaths[j].filename);
        }
    });
};

const compileStart = () =>{
    for(let i=0; i<lessPaths.length;i++){
        let children = lessPaths[i].filename;
        overwriteParentsOnChildChange(children);
    }
};

const parentAdded = ()=>{
    return parentPaths.length;
};

const getGreatestIndex = () =>{
    let indexes = [];
    for(let k = 0; k<lessPaths.length;k++){
        for(let prop in lessPaths[k]){
            if(prop === 'index' && indexes.indexOf(lessPaths[k][prop]) === -1){
                indexes.push(lessPaths[k][prop]);
            }
        }
    }
    let greatestIndex = Math.max.apply(Math, indexes);
    return greatestIndex;
};

const extractExisted = (targetIndex)=>{
    for(let j = 0; j<lessPaths.length;j++){
        for(let prop in lessPaths[j]){
            if(lessPaths[j][prop] === targetIndex){
                const deleteIdx = lessPaths.indexOf(lessPaths[j]);
                console.log("Parent checked: ".green, lessPaths[j].filename);
                parentPaths.push(lessPaths[j]);
                const deletedItem = lessPaths.splice(deleteIdx,1);
            }
        }
    }
};

const extractParentPaths =()=>{
    let parentIds = userInput.split(',');
    for(let i = 0; i<parentIds.length;i++){
        let parentId = Number(parentIds[i]);
        if(parentId > getGreatestIndex()){
            console.log('Parent with id: '.yellow + parentId + ' not found.'.yellow);
        }
        extractExisted(parentId);
    }
    if(parentAdded()){
        console.log('Watching for file changes...'.green);
        eventEmitter.emit('readyForCompile');
    }else{
        throw new Error('There wasn\'t path with index that you provide.'.red);
    }
};

const isUserProvidedNumbers = (userInput)=>{
    let parentIds = userInput.split(',');
    for(let i = 0; i<parentIds.length;i++){
        let shouldBeNumber = Number(parentIds[i]);
        if(parentIds[i] === '' || isNaN(shouldBeNumber)){
            return false;
        }
    }
    return true;
};

const getParentLessIndexFromUser = ()=>{
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    console.log('Choose indexes from list below: '.green);
    for(let i=0; i<lessPaths.length;i++){
        console.log(colors.cyan(lessPaths[i].filename) + ' : ' + colors.yellow(lessPaths[i].index) + '\n');
    }
    rl.question('Give me ids of parent files that you want to save after each change,\n like this: 1,12,43 : '.green, (answer) => {
    userInput = answer;
    if(isUserProvidedNumbers(userInput)){
        eventEmitter.emit('validUserInput');
    }else{
        throw new Error('Wrong input:\''+ userInput +'\''+' You should provide only numbers. Beware of letters and white spaces'.red);
    }
    rl.close();
    });
};

const lessProcessing = ()=>{
    getParentLessIndexFromUser();
    eventEmitter.on('validUserInput', extractParentPaths);
    eventEmitter.on('readyForCompile', compileStart);
};

findLessInDirectory('less',/\.less$/,(filename)=>{
    const fileData = {
        filename: filename,
        index:indexCount
    };
    indexCount++;
    lessPaths.push(fileData);
});
lessProcessing();


module.exports.isUserProvidedNumbers = isUserProvidedNumbers;
