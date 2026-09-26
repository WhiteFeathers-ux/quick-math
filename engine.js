(function(root){
'use strict';
const rand=(a,b)=>Math.floor(Math.random()*(b-a+1))+a;
const pick=a=>a[rand(0,a.length-1)];
const signed=n=>n<0?`− ${-n}`:`+ ${n}`;
const make=(text,answer,explanation,topic)=>({text,answer,explanation,topic});
function generate(level,operation='mixed'){
 let a,b,x,k,c;
 if(level<3){
  const max=[12,50,150][level];
  const op=operation==='mixed'?pick(['add','subtract','multiply','divide']):operation;
  a=rand(2,max); b=rand(2,max);
  if(op==='add')return make(`${a} + ${b}`,a+b,`${a} + ${b} = ${a+b}.`,'Addition');
  if(op==='subtract'){if(level<2&&a<b)[a,b]=[b,a];return make(`${a} − ${b}`,a-b,`${a} − ${b} = ${a-b}.`,'Subtraction');}
  a=rand(2,[12,15,25][level]);b=rand(2,[12,20,30][level]);
  if(op==='multiply')return make(`${a} × ${b}`,a*b,`${a} × ${b} = ${a*b}.`,'Multiplication');
  return make(`${a*b} ÷ ${b}`,a,`Think: ${b} × ${a} = ${a*b}.`,'Division');
 }
 if(level===3){
  switch(rand(0,3)){
   case 0:a=rand(2,12);b=rand(2,12);c=rand(2,9);return make(`${a} + ${b} × ${c}`,a+b*c,`Multiply first: ${b} × ${c} = ${b*c}. Then add ${a}.`,'Order of operations');
   case 1:a=pick([10,20,25,50,75]);b=rand(1,12)*20;return make(`${a}% of ${b}`,a*b/100,`Divide ${a} by 100, then multiply by ${b}.`,'Percentages');
   case 2:b=pick([2,3,4,5,8]);a=rand(1,b-1);c=b*rand(2,12);return make(`${a}/${b} of ${c}`,a*c/b,`${c} ÷ ${b} × ${a} = ${a*c/b}.`,'Fractions');
   default:a=rand(-20,-1);b=rand(1,25);return make(`${a} + ${b}`,a+b,`Start at ${a} and move ${b} places to the right.`,'Signed numbers');
  }
 }
 x=rand(-9,12);a=rand(2,9);b=rand(-12,12);
 if(level===4){
  switch(rand(0,3)){
   case 0:return make(`${a}x ${signed(b)} = ${a*x+b}`,x,`Subtract ${b} from both sides, then divide by ${a}. x = ${x}.`,'Solve for x');
   case 1:c=rand(1,a-1);return make(`${a}x ${signed(b)} = ${c}x ${signed((a-c)*x+b)}`,x,`Collect x terms: ${a-c}x = ${(a-c)*x}. Divide by ${a-c}.`,'Solve for x');
   case 2:return make(`f(x) = ${a}x ${signed(b)}; find f(${x})`,a*x+b,`Substitute ${x}: ${a} × (${x}) ${signed(b)} = ${a*x+b}.`,'Functions');
   default:k=rand(-5,5);c=rand(1,6);return make(`Slope: (0, ${b}) to (${c}, ${b+k*c})`,k,`Slope = change in y ÷ change in x = ${k*c} ÷ ${c} = ${k}.`,'Slope');
  }
 }
 switch(rand(0,5)){
  case 0:x=rand(1,12);return make(`x² = ${x*x}; find positive x`,x,`Take the positive square root of ${x*x}: ${x}.`,'Quadratics');
  case 1:a=rand(1,9);b=rand(a+1,12);return make(`x² − ${a+b}x + ${a*b} = 0; smaller root?`,a,`Factor: (x − ${a})(x − ${b}) = 0. Roots are ${a} and ${b}.`,'Quadratic factoring');
  case 2:a=pick([2,3,4,5]);x=rand(1,4);return make(`${a}ˣ = ${a**x}; find x`,x,`${a} multiplied by itself ${x} time${x===1?'':'s'} gives ${a**x}.`,'Exponential equations');
  case 3:a=pick([2,3,5,10]);x=rand(1,3);return make(`log base ${a} of ${a**x}`,x,`A logarithm asks for the exponent: ${a} raised to ${x} = ${a**x}.`,'Logarithms');
  case 4:x=rand(-5,5);a=rand(1,3);b=rand(-5,5);c=rand(-6,6);return make(`f(x) = ${a}x² ${signed(b)}x ${signed(c)}; f(${x})?`,a*x*x+b*x+c,`Substitute ${x}: ${a} × ${x*x} + (${b} × ${x}) + (${c}) = ${a*x*x+b*x+c}.`,'Polynomial functions');
  default:a=rand(2,8);x=rand(1,12);b=rand(1,8);return make(`(${a}x + ${a*b}) / ${a} = ${x+b}`,x,`Multiply by ${a}: ${a}x + ${a*b} = ${a*(x+b)}. Subtract ${a*b}, then divide by ${a}.`,'Rational equations');
 }
}
const question=generate;

function parseAnswer(value){const s=value.trim().replace(/−/g,'-');if(!/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:\s*\/\s*[+-]?(?:\d+(?:\.\d*)?|\.\d+))?$/.test(s))return null;const parts=s.split('/').map(Number);const n=parts.length===2?parts[0]/parts[1]:parts[0];return Number.isFinite(n)?n:null;}
const api={question,parseAnswer};if(typeof module!=='undefined')module.exports=api;root.MathEngine=api;
})(typeof globalThis!=='undefined'?globalThis:this);
