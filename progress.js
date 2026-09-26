'use strict';
let reviewIndex=0,progressTab='overview',historyPage=0;
const levelNames=['Everyday basics','Mental math','Bigger numbers','Pre-algebra','Algebra 1','Algebra 2'];
function node(tag,text,className){const e=document.createElement(tag);if(text!==undefined)e.textContent=text;if(className)e.className=className;return e;}
function saveRound(completed){
 if(!state?.total)return;
 const average=state.times.length?state.times.reduce((a,b)=>a+b,0)/state.times.length:null;
 const record={timing:'instant-v1',id:state.id,correct:state.correct,total:state.total,level:state.level,average,date:state.started,operation:state.operation,duration:state.duration,seconds:Math.min(elapsed()/1000,state.duration||Infinity),best:state.best,topics:state.topics,completed};
 const index=history.findIndex(r=>r.id===record.id);
 if(index<0)history.push(record);else history[index]=record;
 try{localStorage.setItem(storageKey,JSON.stringify(history));$('storage-warning').textContent='';}catch(e){$('storage-warning').textContent='Saving unavailable. Use Progress → Save backup before closing.';}
}
function renderReview(){
 const review=$('review');review.replaceChildren();
 if(!state.misses.length){review.append(node('h2',state.total?'A clean round.':'Ready when you are.'),node('p',state.total?'No mistakes to review. Try another round to build consistency.':'Choose a level and start with a few answers.','small'));return;}
 const q=state.misses[reviewIndex];review.append(node('h2','Learn from this one'));
 const row=node('div',undefined,'review-row');row.append(node('strong',q.text),node('p',`${q.given==='Skipped'?'Skipped':'Your answer: '+q.given} · Correct: ${q.answer}`,'correct-answer'),node('p',q.explanation));review.append(row);
 const paging=node('div',undefined,'pagination'),prev=node('button','← Previous'),nextButton=node('button','Next →');prev.disabled=reviewIndex===0;nextButton.disabled=reviewIndex===state.misses.length-1;prev.onclick=()=>{reviewIndex--;renderReview();};nextButton.onclick=()=>{reviewIndex++;renderReview();};paging.append(prev,node('span',`${reviewIndex+1} of ${state.misses.length}`),nextButton);review.append(paging);
}
function summary(rows){
 const total=rows.reduce((n,r)=>n+r.total,0),correct=rows.reduce((n,r)=>n+r.correct,0);
 const timed=rows.filter(r=>Number.isFinite(r.average)&&r.average>=0&&r.correct>0);
 const timedCorrect=timed.reduce((n,r)=>n+r.correct,0);
 return {total,correct,accuracy:total?correct/total*100:null,average:timedCorrect?timed.reduce((n,r)=>n+r.average*r.correct,0)/timedCorrect:null};
}
const percent=n=>n===null?'—':`${Math.round(n)}%`;
const seconds=n=>n===null?'—':`${n.toFixed(1)}s`;
function metric(value,label){const e=node('div',undefined,'metric');e.append(node('strong',value),node('span',label));return e;}
function chosenRows(){const level=$('progress-level').value;return history.filter(r=>r.total>0&&(level==='all'||r.level===+level));}
function renderProgress(){
 const root=$('progress-content');root.replaceChildren();$('save-status').textContent='';
 $('progress-level').disabled=progressTab==='levels';
 document.querySelectorAll('[data-progress-tab]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.progressTab===progressTab)));
 if(progressTab==='levels'){renderLevels(root);return;}
 const rows=chosenRows();
 if(progressTab==='recent'){renderHistory(root,rows);return;}
 const stats=summary(rows),days=new Set(rows.map(r=>{const d=new Date(r.date);return Number.isFinite(+d)?d.toLocaleDateString():null;}).filter(Boolean));
 const metrics=node('div',undefined,'progress-metrics');metrics.append(metric(percent(stats.accuracy),'accuracy'),metric(seconds(stats.average),'avg. correct time'),metric(String(stats.total),'answers practiced'),metric(String(days.size),'practice days'));root.append(metrics);
 const grid=node('div',undefined,'progress-grid'),chart=node('div',undefined,'chart-panel');chart.append(node('h2','Accuracy over time'),node('p',rows.length?'Last 10 rounds · oldest to newest':'Your first answers will appear here.','small'));
 const bars=node('div',undefined,'bars');bars.setAttribute('role','img');bars.setAttribute('aria-label',rows.length?'Round accuracies: '+rows.slice(-10).map(r=>percent(r.correct/r.total*100)).join(', '):'No practice data yet');
 for(const r of rows.slice(-10)){const slot=node('div',undefined,'bar-slot'),bar=node('div',undefined,'bar'),pct=r.correct/r.total*100;bar.style.height=`${Math.max(2,pct*.76)}%`;slot.append(node('span',percent(pct)),bar);slot.title=`${levelNames[r.level]||'Level'}: ${r.correct}/${r.total}`;bars.append(slot);}chart.append(bars,node('p','Skips count as misses. Speed uses correct answers only.','small'));grid.append(chart);
 const coach=node('div',undefined,'coaching');coach.append(node('h2',rows.length?'Your next step':'Build your starting point'));
 if(!rows.length){coach.append(node('p','Play one short round at a comfortable level. Aim for accurate answers first, then work toward the pace guide.'));}
 else{
  const latest=rows[rows.length-1];const peers=rows.filter(r=>r.level===latest.level&&r.operation===latest.operation&&r.duration===latest.duration&&r.timing===latest.timing).slice(-6);
  const recent=summary(peers.slice(-3));
  const ready=recent.total>=30&&recent.accuracy>=90&&recent.average!==null&&recent.average<=targets[latest.level];
  coach.append(node('p',ready?`${levelNames[latest.level]}: strong accuracy at the target pace. Try a harder level or a different focus.`:recent.accuracy<90?`Stay with ${levelNames[latest.level]}. Slow down until answers feel dependable, aiming for 90% accuracy.`:`Keep practicing ${levelNames[latest.level]}. Build at least 30 recent answers at 90% accuracy and near the pace guide before moving up.`));
  const trend=node('div',undefined,'coach-rule');trend.append(node('h2','Is it getting easier?'));
  if(peers.length>=6){const before=summary(peers.slice(0,3)),after=summary(peers.slice(3));const diff=after.accuracy-before.accuracy;let message=`Accuracy ${diff>=0?'up':'down'} ${Math.abs(diff).toFixed(1)} percentage points.`;if(before.average!==null&&after.average!==null){const speed=before.average-after.average;message+=` Correct answers ${Math.abs(speed).toFixed(1)}s ${speed>=0?'faster':'slower'}.`;}trend.append(node('p',message),node('p','Latest 3 vs previous 3 rounds at the same level, focus, and timer.','small'));}
  else trend.append(node('p',`${peers.length}/6 comparable rounds recorded. After six rounds with the same level, focus, and timer, a speed and accuracy comparison appears.`));
  coach.append(trend);
 }
 grid.append(coach);root.append(grid);
}
function table(headers){const t=node('table',undefined,'progress-table'),thead=node('thead'),tr=node('tr'),body=node('tbody');for(const h of headers)tr.append(node('th',h));thead.append(tr);t.append(thead,body);return [t,body];}
function renderLevels(root){
 const [t,body]=table(['Level','Answers','Accuracy','Speed','Practice status']);
 levelNames.forEach((name,level)=>{const rows=history.filter(r=>r.level===level),s=summary(rows),recent=summary(rows.slice(-3));let status=!s.total?'Not started':recent.total<30?'Building a baseline':recent.accuracy<90?'Accuracy first':recent.average!==null&&recent.average<=targets[level]?'Ready to stretch':'Build speed';const tr=node('tr');for(const value of [`${level+1} · ${name}`,String(s.total),percent(s.accuracy),seconds(s.average),status])tr.append(node('td',value));body.append(tr);});root.append(t,node('p','Status uses the latest 3 rounds: 30+ answers, 90% accuracy, and the level’s pace guide. Practice guidance, not a mastery score.','progress-note'));
}
function renderHistory(root,rows){
 const latest=rows.slice().reverse();const count=5,pages=Math.max(1,Math.ceil(latest.length/count));historyPage=Math.min(historyPage,pages-1);
 const [t,body]=table(['When','Level','Correct','Accuracy','Speed']);
 for(const r of latest.slice(historyPage*count,(historyPage+1)*count)){const tr=node('tr'),d=new Date(r.date);const date=Number.isFinite(+d)?d.toLocaleDateString(undefined,{month:'short',day:'numeric'})+' '+d.toLocaleTimeString(undefined,{hour:'numeric',minute:'2-digit'}):'Earlier';for(const v of [date,levelNames[r.level]||'Earlier round',`${r.correct}/${r.total}`,percent(r.correct/r.total*100),seconds(Number.isFinite(r.average)?r.average:null)])tr.append(node('td',v));body.append(tr);}
 root.append(t);if(!latest.length)root.append(node('p','No rounds yet. Start practicing to make your first entry.','progress-note'));
 const pager=node('div',undefined,'pagination'),prev=node('button','← Previous'),nextButton=node('button','Next →');prev.disabled=historyPage===0;nextButton.disabled=historyPage>=pages-1;prev.onclick=()=>{historyPage--;renderProgress();};nextButton.onclick=()=>{historyPage++;renderProgress();};pager.append(prev,node('span',`${historyPage+1} / ${pages} · ${rows.length} rounds`),nextButton);root.append(pager,node('p','Every answered question saves immediately, including unfinished rounds.','progress-note'));
}
for(const option of $('level').options)$('progress-level').append(option.cloneNode(true));
$('progress-level').onchange=()=>{historyPage=0;renderProgress();};
document.querySelectorAll('[data-progress-tab]').forEach(b=>b.onclick=()=>{progressTab=b.dataset.progressTab;historyPage=0;renderProgress();});
$('export-progress').onclick=()=>{const blob=new Blob([JSON.stringify({app:'Quick Math',version:2,exported:new Date().toISOString(),rounds:history},null,2)],{type:'application/json'});const url=URL.createObjectURL(blob),link=node('a');link.href=url;link.download='quick-math-progress-'+new Date().toISOString().slice(0,10)+'.json';link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);$('save-status').textContent='Backup downloaded. It contains only this browser’s practice records.';};
