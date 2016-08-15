'use strict';

const chai = require('chai');
const expect = require('chai').expect;
const app = require('../less-parent-problems.js');
const sinon = require("sinon");

describe('.isUserProvidedNumbers', function() {
    it('return true when user provided only numbers', function() {
        const possibleInputs = ['0','0,','0,g',''];

        const acceptableInput = app.isUserProvidedNumbers(possibleInputs[0]),
              wrongInput1 = app.isUserProvidedNumbers(possibleInputs[1]),
              wrongInput2 = app.isUserProvidedNumbers(possibleInputs[2]),
              wrongInput3 = app.isUserProvidedNumbers(possibleInputs[3]);

        expect(acceptableInput).to.equal(true);
        expect(wrongInput1).to.equal(false);
        expect(wrongInput2).to.equal(false);
        expect(wrongInput3).to.equal(false);
    });
});

describe('.getGreatestIndex', function() {
    it('should return greatest index from array.', function() {
        const getGreatestIndexTest = () =>{
            let testPaths = [{filename:"/test/path/1", index:0},{filename:"/test/path/2",index:1}];
            let indexes = [];
            for(let k = 0; k<testPaths.length;k++){
                for(let prop in testPaths[k]){
                    if(prop === 'index' && indexes.indexOf(testPaths[k][prop]) === -1){
                        indexes.push(testPaths[k][prop]);
                    }
                }
            }
            let greatestIndex = Math.max.apply(Math, indexes);
            return greatestIndex;
        };
        expect(getGreatestIndexTest()).to.equal(1);
    });
});

describe('.parentAdded', function() {
    it('should return true if parentPaths isn\'t empty.', function() {
        let parentPaths = [1,2,3];
        const parentAdded = ()=>{
            return parentPaths.length;
        };
        expect(parentPaths).to.satisfy(parentAdded);
    });
    it('should return false if parentPaths is empty.', function() {
        let parentPaths = [];
        const parentAdded = ()=>{
            return parentPaths.length;
        };
        expect(parentPaths).to.not.satisfy(parentAdded);
    });
});
