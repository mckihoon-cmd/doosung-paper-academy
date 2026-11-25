import {test} from 'node:test';import assert from 'node:assert/strict';import {weight,cut} from '../core.mjs';
test('A4 150gsm 500 sheets gives 4.67775kg',()=>{assert.equal(weight(150,210,297,500).total,4.67775)});
test('reject invalid weight and fractional counts',()=>{for(const args of [[0,210,297,500],[150,-1,297,500],[150,210,297,1.5],[NaN,210,297,500]])assert.equal(weight(...args),null)});
test('A3 fits two A4 only when all pieces rotate',()=>{assert.equal(cut(297,420,210,297,0,0,false).count,1);assert.equal(cut(297,420,210,297,0,0,true).count,2)});
test('gap and edge allowance reduce yield',()=>{assert.equal(cut(297,420,210,297,0,0,true).count,2);assert.equal(cut(297,420,210,297,3,10,true).count,1);assert.equal(cut(788,1091,210,297,3,10,true).count,10)});
test('oversize pieces and excessive margins yield zero',()=>{assert.equal(cut(100,100,200,200).count,0);assert.equal(cut(100,100,10,10,0,100).count,0)});
test('reject negative spacing',()=>assert.equal(cut(100,100,20,20,-1),null));
