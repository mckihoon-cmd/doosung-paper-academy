export function weight(gsm,w,h,n){
  if(![gsm,w,h,n].every(Number.isFinite)||gsm<=0||w<=0||h<=0||n<1||!Number.isInteger(n)) return null;
  const sheet=gsm*w*h/1e6; return {sheet,total:sheet*n/1000};
}
export function cut(sw,sh,w,h,gap=0,margin=0,rotate=true){
  if(![sw,sh,w,h,gap,margin].every(Number.isFinite)||Math.min(sw,sh,w,h)<=0||gap<0||margin<0) return null;
  const aw=sw-2*margin,ah=sh-2*margin;
  const layout=(cw,ch,rotated)=>{const cols=Math.max(0,Math.floor((aw+gap)/(cw+gap))),rows=Math.max(0,Math.floor((ah+gap)/(ch+gap)));return {cols,rows,count:cols*rows,w:cw,h:ch,rotated};};
  let result=layout(w,h,false),other=layout(h,w,true);
  if(rotate&&other.count>result.count) result=other;
  return {...result,utilization:result.count*w*h/(sw*sh)*100};
}
