import { useState, useEffect } from "react";

function useLocalStorage(key, initial) {
  const [val, setVal] = useState(() => {
    try { const s = localStorage.getItem(key); return s ? JSON.parse(s) : initial; }
    catch { return initial; }
  });
  useEffect(() => { try { localStorage.setItem(key, JSON.stringify(val)); } catch {} }, [key, val]);
  return [val, setVal];
}

const P = { bg:"#F5F0E8",grouped:"#EDE8DF",card:"#FFFEFB",text:"#2A1F15",label2:"rgba(42,31,21,0.6)",label3:"rgba(42,31,21,0.4)",sep:"rgba(42,31,21,0.12)",sage:"#7A9E7E",gold:"#C4956A",rose:"#C9957E",lav:"#A89CC0",sky:"#8AB4C0",sage2:"#A8C5AC",red:"#C97E7E" };
const SF = "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', 'Apple SD Gothic Neo', sans-serif";
const SERIF = "'Cormorant Garamond', Georgia, serif";

const QUOTES = ["romanticize the life you're building.","she is quietly becoming everything she dreamed of.","your rituals shape who you are.","every small act of care is love for future-you.","the girl who shows up for herself — that's you.","not a perfect life. a real, beautiful, intentional one.","one good day builds on another."];
const PROMPTS = ["What is one small thing that made today beautiful?","What would future Ann thank you for doing today?","Describe your ideal morning in Ulsan.","What are you quietly proud of lately?","What made you feel most like yourself today?","What do you want to let go of this week?","Write about a place that makes you feel completely at peace."];

const MORNING = [
  {id:"wake",emoji:"🌅",label:"Wake up 8–10am",note:"no snooze, open the blinds",color:P.gold},
  {id:"water",emoji:"💧",label:"Hydrate first",note:"big glass before anything",color:P.sky},
  {id:"skin_am",emoji:"🌿",label:"Morning skincare",note:"SPF always, no shortcuts",color:P.sage},
  {id:"sun",emoji:"☀️",label:"Get sunlight",note:"10 min outside minimum",color:P.gold},
  {id:"move",emoji:"🏃‍♀️",label:"Move your body",note:"run / pilates / gym",color:P.rose},
  {id:"jrn_am",emoji:"📔",label:"Morning pages",note:"3 pages, no filter",color:P.lav},
];
const DAYTIME = [
  {id:"cafe",emoji:"☕",label:"Café work session",note:"2hrs deep focus, no socials",color:P.gold},
  {id:"port",emoji:"💼",label:"Portfolio / job apps",note:"show up for future-you",color:P.sage},
  {id:"book",emoji:"📚",label:"Read or bookstore",note:"real book, no phone",color:P.lav},
  {id:"steps",emoji:"👟",label:"Stay active",note:"walk, don't just sit",color:P.rose},
  {id:"eat",emoji:"🥗",label:"Eat nourishing food",note:"not perfect — just real",color:P.sage2},
  {id:"detox",emoji:"📵",label:"Screen-free hour",note:"no doom scrolling",color:P.label3},
];
const EVENING = [
  {id:"stretch",emoji:"🧘‍♀️",label:"Stretch & unwind",note:"10 min is enough",color:P.sage},
  {id:"skin_pm",emoji:"🌙",label:"Evening skincare",note:"ritual, not chore",color:P.lav},
  {id:"jrn_pm",emoji:"✍️",label:"Evening reflection",note:"what went well today?",color:P.rose},
  {id:"unplug",emoji:"🕯️",label:"Unplug by 10pm",note:"let the day close gently",color:P.gold},
  {id:"sleep",emoji:"😴",label:"In bed by midnight",note:"sleep is the foundation",color:P.sky},
];
const ALL_HABITS = [...MORNING,...DAYTIME,...EVENING];

const SECTIONS = [
  {id:"thisweek",title:"This Week",subtitle:"착륙 + 리듬 회복",color:P.sage,icon:"⭐"},
  {id:"us",title:"US Cleanup",subtitle:"버클리 마무리",color:P.gold,icon:"🇺🇸"},
  {id:"korea",title:"Korea Setup",subtitle:"한국 OS",color:P.rose,icon:"🇰🇷"},
  {id:"career",title:"Career",subtitle:"포트폴리오 + 취준",color:P.lav,icon:"💼"},
  {id:"routine",title:"Routine",subtitle:"이번 2주 목표",color:P.sky,icon:"☀️"},
];
const INIT_TASKS = [
  {id:"w1",text:"Unpack & set up room",note:"공간 chaos = 정신 chaos",sectionId:"thisweek"},
  {id:"w2",text:"Fix phone carrier & SIM",note:"폰 개통",sectionId:"thisweek"},
  {id:"w3",text:"Set up new phone apps",note:"",sectionId:"thisweek"},
  {id:"w4",text:"Fix sleep schedule",note:"8–10am 기상 고정",sectionId:"thisweek"},
  {id:"w5",text:"Light walk or run daily",note:"최소 30분",sectionId:"thisweek"},
  {id:"w6",text:"Reply to Berkeley people",note:"",sectionId:"thisweek"},
  {id:"w7",text:"Mom's gym + pilates check",note:"필라테스 등록",sectionId:"thisweek"},
  {id:"u1",text:"Desk — coordinate buyer pickup",note:"룸메 통해서",sectionId:"us"},
  {id:"u2",text:"Vacuum — coordinate buyer pickup",note:"룸메 통해서",sectionId:"us"},
  {id:"u3",text:"Cancel Equinox membership",note:"",sectionId:"us"},
  {id:"u4",text:"Zipcar refund request",note:"",sectionId:"us"},
  {id:"u5",text:"Confirm Xfinity returned",note:"UPS 반납 확인",sectionId:"us"},
  {id:"u6",text:"Check US card autopay",note:"자동결제 확인",sectionId:"us"},
  {id:"u7",text:"Verify Venmo / Zelle / PayPal",note:"로그인 확인",sectionId:"us"},
  {id:"u8",text:"Decide on US number",note:"유지 or 해지",sectionId:"us"},
  {id:"u9",text:"Tax files → one folder",note:"세금 파일 정리",sectionId:"us"},
  {id:"k1",text:"Set up work space",note:"충전기 + 케이블 정리",sectionId:"korea"},
  {id:"k2",text:"Unpack everyday clothes first",note:"자주 입는 것만",sectionId:"korea"},
  {id:"k3",text:"Restore skincare & shower routine",note:"",sectionId:"korea"},
  {id:"k4",text:"Find local church",note:"청년부 있는 곳",sectionId:"korea"},
  {id:"k5",text:"Look up running crews in Ulsan",note:"",sectionId:"korea"},
  {id:"k6",text:"Cafe scouting plan",note:"버스 타고 탐방",sectionId:"korea"},
  {id:"c1",text:"Polish DishFinder case study",note:"Framer 최종 손보기",sectionId:"career"},
  {id:"c2",text:"Start 3rd portfolio project",note:"",sectionId:"career"},
  {id:"c3",text:"Update LinkedIn",note:"",sectionId:"career"},
  {id:"c4",text:"Build target company list",note:"US 취업 타겟",sectionId:"career"},
  {id:"c5",text:"Set up job application pipeline",note:"",sectionId:"career"},
  {id:"r1",text:"Wake up 8–10am",note:"시차 적응",sectionId:"routine"},
  {id:"r2",text:"Get sunlight first thing",note:"",sectionId:"routine"},
  {id:"r3",text:"Run or walk (30min+)",note:"",sectionId:"routine"},
  {id:"r4",text:"1–2hr focused work session",note:"카페 or 집",sectionId:"routine"},
  {id:"r5",text:"Max 2–3 social plans/week",note:"리유니언 폭주 금지",sectionId:"routine"},
  {id:"r6",text:"Decompress time (solo)",note:"혼자 숨 고르는 시간",sectionId:"routine"},
  {id:"r7",text:"No all-nighters",note:"",sectionId:"routine"},
];
const TRANSPORT = [{id:"walk",label:"Walk",icon:"🚶‍♀️"},{id:"run",label:"Run",icon:"🏃‍♀️"},{id:"bus",label:"Bus",icon:"🚌"},{id:"taxi",label:"Taxi",icon:"🚕"},{id:"car",label:"Car",icon:"🚗"}];
const HOURS = Array.from({length:17},(_,i)=>i+7);
const DAYS_S = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
const todayDay = new Date().getDay();
const weekDays = Array.from({length:7},(_,i)=>{ const d=new Date(); d.setDate(d.getDate()-6+i); return {label:DAYS_S[d.getDay()],isToday:i===6}; });
const seedBool = (id,off) => ((id.charCodeAt(0)*7+id.charCodeAt(id.length-1)*3+off*11)%10)>2;
const pastWeek = (id) => Array.from({length:6},(_,i)=>seedBool(id,i));
const timeToMin = t => { const [h,m]=t.split(":").map(Number); return h*60+m; };
const fmtHour = h => h===12?"12 PM":h<12?`${h} AM`:`${h-12} PM`;

const Card = ({children,style={}}) => <div style={{background:P.card,borderRadius:"12px",margin:"0 16px",overflow:"hidden",boxShadow:"0 0.5px 2px rgba(42,31,21,0.1), 0 1px 4px rgba(42,31,21,0.06)",...style}}>{children}</div>;
const Sep = () => <div style={{height:"0.5px",background:P.sep,marginLeft:"52px"}}/>;
const SectionHeader = ({label}) => <p style={{margin:"28px 20px 8px",fontSize:"13px",fontWeight:600,color:P.label2,fontFamily:SF,textTransform:"uppercase",letterSpacing:"0.4px"}}>{label}</p>;
const Chip = ({active,color,onClick,children}) => <button onClick={onClick} style={{flexShrink:0,padding:"6px 14px",borderRadius:"20px",border:"none",cursor:"pointer",fontFamily:SF,fontSize:"13px",fontWeight:600,background:active?color:P.card,color:active?"#fff":P.label2,boxShadow:active?`0 2px 8px ${color}50`:"0 0.5px 2px rgba(42,31,21,0.12)",transition:"all 0.2s ease"}}>{children}</button>;
const IOSCheck = ({done,color,onToggle,size=24}) => <div onClick={onToggle} style={{width:size,height:size,borderRadius:size/2,flexShrink:0,cursor:"pointer",border:done?"none":`1.5px solid rgba(42,31,21,0.2)`,background:done?color:"transparent",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:done?`0 2px 8px ${color}50`:"none",transition:"all 0.22s cubic-bezier(0.4,0,0.2,1)"}}>{done&&<svg width="12" height="9" viewBox="0 0 12 9" fill="none"><path d="M1.5 4.5L4.5 7.5L10.5 1.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>}</div>;

function Sheet({type,data,onClose,onSaveTask,onSaveEvent,onDeleteTask,onDeleteEvent}) {
  const isTask=type==="addTask"||type==="editTask", isEdit=type==="editTask"||type==="editEvent";
  const [text,setText]=useState(data.text||data.title||""), [note,setNote]=useState(data.note||"");
  const [sectionId,setSec]=useState(data.sectionId||"thisweek"), [startTime,setStart]=useState(data.startTime||"09:00");
  const [duration,setDur]=useState(data.duration||60), [location,setLoc]=useState(data.location||"");
  const [transport,setTrans]=useState(data.transport||"bus"), [travelTime,setTravel]=useState(data.travelTime||15);
  const bi={background:"none",border:"none",outline:"none",fontFamily:SF,fontSize:"17px",color:P.text,padding:0,width:"100%",boxSizing:"border-box"};
  const row={padding:"14px 16px",borderBottom:`0.5px solid ${P.sep}`,display:"flex",alignItems:"center",gap:"12px"};
  const lbl={fontSize:"15px",color:P.label2,width:"100px",flexShrink:0,fontFamily:SF};
  const handleSave=()=>{ if(!text.trim())return; isTask?onSaveTask({text,note,sectionId}):onSaveEvent({title:text,note,startTime,duration:+duration,location,transport,travelTime:+travelTime}); };
  return (
    <div style={{position:"fixed",inset:0,zIndex:300}}>
      <div onClick={onClose} style={{position:"absolute",inset:0,background:"rgba(42,31,21,0.4)"}}/>
      <div style={{position:"absolute",bottom:0,left:0,right:0,background:P.bg,borderRadius:"20px 20px 0 0",paddingBottom:"44px",maxHeight:"92vh",overflowY:"auto"}}>
        <div style={{display:"flex",justifyContent:"center",padding:"12px 0 2px"}}><div style={{width:"36px",height:"5px",background:P.sep,borderRadius:"3px"}}/></div>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 20px 16px"}}>
          <button onClick={onClose} style={{background:"none",border:"none",color:P.sage,fontSize:"17px",cursor:"pointer",fontFamily:SF,padding:0}}>Cancel</button>
          <span style={{fontFamily:SF,fontSize:"17px",fontWeight:600,color:P.text}}>{isEdit?"Edit":"New"} {isTask?"Task":"Event"}</span>
          <button onClick={handleSave} style={{background:"none",border:"none",color:P.sage,fontSize:"17px",fontWeight:600,cursor:"pointer",fontFamily:SF,padding:0}}>{isEdit?"Save":"Add"}</button>
        </div>
        <Card><div style={row}><input style={{...bi,fontWeight:500}} placeholder={isTask?"Task name":"Event title"} value={text} onChange={e=>setText(e.target.value)}/></div><div style={{...row,borderBottom:"none"}}><input style={{...bi,color:P.label3,fontSize:"15px"}} placeholder="Note (선택)" value={note} onChange={e=>setNote(e.target.value)}/></div></Card>
        {isTask&&<div style={{margin:"16px 16px 0"}}><p style={{margin:"0 0 10px 2px",fontFamily:SF,fontSize:"13px",color:P.label2,textTransform:"uppercase",letterSpacing:"0.4px",fontWeight:600}}>Section</p><div style={{display:"flex",flexWrap:"wrap",gap:"8px"}}>{SECTIONS.map(s=><Chip key={s.id} active={sectionId===s.id} color={s.color} onClick={()=>setSec(s.id)}>{s.icon} {s.title}</Chip>)}</div></div>}
        {!isTask&&<><Card style={{margin:"16px 16px 0"}}><div style={row}><span style={lbl}>Start</span><input type="time" value={startTime} onChange={e=>setStart(e.target.value)} style={{...bi,width:"auto",colorScheme:"light",fontSize:"15px"}}/></div><div style={row}><span style={lbl}>Duration</span><input type="number" value={duration} onChange={e=>setDur(e.target.value)} min={5} step={5} style={{...bi,width:"60px",fontSize:"15px"}}/><span style={{fontFamily:SF,fontSize:"15px",color:P.label3}}>min</span></div><div style={{...row,borderBottom:"none"}}><span style={lbl}>Location</span><input style={{...bi,fontSize:"15px"}} placeholder="장소 이름" value={location} onChange={e=>setLoc(e.target.value)}/></div></Card><div style={{margin:"14px 16px 0"}}><p style={{margin:"0 0 10px 2px",fontFamily:SF,fontSize:"13px",color:P.label2,textTransform:"uppercase",letterSpacing:"0.4px",fontWeight:600}}>Getting There</p><div style={{display:"flex",gap:"8px",flexWrap:"wrap"}}>{TRANSPORT.map(t=><Chip key={t.id} active={transport===t.id} color={P.sage} onClick={()=>setTrans(t.id)}>{t.icon} {t.label}</Chip>)}</div></div><Card style={{margin:"14px 16px 0"}}><div style={{...row,borderBottom:"none"}}><span style={lbl}>Travel time</span><input type="number" value={travelTime} onChange={e=>setTravel(e.target.value)} min={0} step={5} style={{...bi,width:"60px",fontSize:"15px"}}/><span style={{fontFamily:SF,fontSize:"15px",color:P.label3}}>min</span></div></Card></>}
        {isEdit&&<button onClick={isTask?onDeleteTask:onDeleteEvent} style={{width:"calc(100% - 32px)",margin:"16px 16px 0",padding:"15px",background:P.card,border:"none",borderRadius:"12px",color:P.red,fontSize:"17px",cursor:"pointer",fontFamily:SF,boxShadow:"0 0.5px 2px rgba(42,31,21,0.1)"}}>Delete {isTask?"Task":"Event"}</button>}
      </div>
    </div>
  );
}

function HabitRow({habit,done,onToggle}) {
  const past=pastWeek(habit.id);
  return (
    <div style={{display:"flex",alignItems:"center",gap:"14px",padding:"12px 16px",background:done?`${habit.color}0C`:"transparent",transition:"background 0.25s"}}>
      <IOSCheck done={done} color={habit.color} onToggle={onToggle} size={26}/>
      <div style={{flex:1,minWidth:0}}>
        <p style={{margin:0,fontFamily:SF,fontSize:"15px",fontWeight:400,color:done?P.label3:P.text,textDecoration:done?"line-through":"none",letterSpacing:"-0.2px"}}>{habit.label}</p>
        {!done&&<p style={{margin:"1px 0 0",fontFamily:SF,fontSize:"12px",color:P.label3}}>{habit.note}</p>}
      </div>
      <div style={{display:"flex",gap:"3px",flexShrink:0}}>
        {[...past,done].map((v,i)=><div key={i} style={{width:i===6?"8px":"5px",height:i===6?"8px":"5px",borderRadius:"50%",background:v?habit.color:P.sep,opacity:i===6?1:0.55,transition:"background 0.25s"}}/>)}
      </div>
    </div>
  );
}

function RitualsView({checked,onToggle}) {
  const [sub,setSub]=useState("today");
  const done=ALL_HABITS.filter(h=>checked[h.id]).length, pct=Math.round((done/ALL_HABITS.length)*100);
  const msg=pct>=80?"you're glowing ✨":pct>=50?"keep going 🌿":pct>0?"one step at a time 🤍":"let's begin 🌸";
  const doneByDay=weekDays.map((_,di)=>di<6?ALL_HABITS.filter(h=>pastWeek(h.id)[di]).length:ALL_HABITS.filter(h=>checked[h.id]).length);
  const maxDone=Math.max(...doneByDay,1);
  return (
    <div>
      <div style={{display:"flex",overflowX:"auto",padding:"12px 16px",gap:"8px",scrollbarWidth:"none"}}>
        {[{id:"today",label:"🌿 Today"},{id:"week",label:"✦ Week"}].map(s=><Chip key={s.id} active={sub===s.id} color={P.sage} onClick={()=>setSub(s.id)}>{s.label}</Chip>)}
      </div>
      {sub==="today"&&<>
        <Card style={{margin:"0 16px"}}>
          <div style={{padding:"16px 20px",display:"flex",alignItems:"center",gap:"18px"}}>
            <div style={{position:"relative",width:"56px",height:"56px",flexShrink:0}}>
              <svg width="56" height="56" viewBox="0 0 56 56"><circle cx="28" cy="28" r="22" fill="none" stroke={P.sep} strokeWidth="4.5"/><circle cx="28" cy="28" r="22" fill="none" stroke={P.sage} strokeWidth="4.5" strokeDasharray={`${2*Math.PI*22}`} strokeDashoffset={`${2*Math.PI*22*(1-pct/100)}`} strokeLinecap="round" transform="rotate(-90 28 28)" style={{transition:"stroke-dashoffset 0.5s ease"}}/></svg>
              <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{fontFamily:SF,fontSize:"14px",fontWeight:600,color:P.text}}>{pct}%</span></div>
            </div>
            <div><p style={{margin:0,fontFamily:SF,fontSize:"17px",fontWeight:600,color:P.text,letterSpacing:"-0.3px"}}>Today's Rituals</p><p style={{margin:"3px 0 0",fontFamily:SF,fontSize:"13px",color:P.label2}}>{done} of {ALL_HABITS.length} — {msg}</p></div>
          </div>
        </Card>
        {[{label:"Morning Ritual",emoji:"🌅",habits:MORNING},{label:"During the Day",emoji:"☕",habits:DAYTIME},{label:"Evening Wind-Down",emoji:"🌙",habits:EVENING}].map(({label,emoji,habits})=>(
          <div key={label}><SectionHeader label={`${emoji}  ${label}`}/><Card>{habits.map((h,i)=><div key={h.id}><HabitRow habit={h} done={!!checked[h.id]} onToggle={()=>onToggle(h.id)}/>{i<habits.length-1&&<Sep/>}</div>)}</Card></div>
        ))}
      </>}
      {sub==="week"&&<>
        <SectionHeader label="This Week"/>
        <Card><div style={{padding:"20px 16px"}}><div style={{display:"flex",gap:"6px",alignItems:"flex-end"}}>{weekDays.map((d,i)=>{const barH=Math.max((doneByDay[i]/maxDone)*72,4);return(<div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:"5px"}}><div style={{width:"100%",height:"72px",display:"flex",alignItems:"flex-end"}}><div style={{width:"100%",height:`${barH}px`,borderRadius:"5px 5px 0 0",background:d.isToday?P.sage:P.sep,transition:"height 0.4s ease"}}/></div><p style={{margin:0,fontFamily:SF,fontSize:"10px",fontWeight:d.isToday?700:400,color:d.isToday?P.sage:P.label3}}>{d.label}</p><p style={{margin:0,fontFamily:SF,fontSize:"11px",color:d.isToday?P.text:P.label3,fontWeight:d.isToday?600:400}}>{doneByDay[i]}</p></div>);})}</div></div></Card>
        <SectionHeader label="🔥  Streaks"/>
        <Card>{ALL_HABITS.map((h,i)=>{const streak=[...pastWeek(h.id),!!checked[h.id]].filter(Boolean).length;return(<div key={h.id} style={{padding:"12px 16px",display:"flex",alignItems:"center",gap:"12px",borderBottom:i<ALL_HABITS.length-1?`0.5px solid ${P.sep}`:"none"}}><span style={{fontSize:"16px",width:"22px",flexShrink:0}}>{h.emoji}</span><p style={{margin:0,flex:1,fontFamily:SF,fontSize:"14px",color:P.text,letterSpacing:"-0.2px"}}>{h.label}</p><div style={{display:"flex",gap:"3px"}}>{[...pastWeek(h.id),!!checked[h.id]].map((v,di)=><div key={di} style={{width:di===6?"8px":"5px",height:di===6?"8px":"5px",borderRadius:"50%",background:v?h.color:P.sep,opacity:di===6?1:0.6}}/>)}</div><span style={{fontFamily:SF,fontSize:"15px",fontWeight:600,minWidth:"22px",textAlign:"right",color:streak>=6?P.gold:streak>=4?P.sage:streak>=2?P.label2:P.label3}}>{streak}</span></div>);})}</Card>
      </>}
      <div style={{height:"20px"}}/>
    </div>
  );
}

function TasksView({tasks,checked,onToggle,activeSection,setActiveSection,onEdit,onAdd}) {
  const sec=SECTIONS.find(s=>s.id===activeSection), items=tasks.filter(t=>t.sectionId===activeSection), done=items.filter(t=>checked[t.id]).length;
  return (
    <div>
      <div style={{display:"flex",overflowX:"auto",padding:"12px 16px",gap:"8px",scrollbarWidth:"none"}}>
        {SECTIONS.map(s=>{const d=tasks.filter(t=>t.sectionId===s.id&&checked[t.id]).length,tot=tasks.filter(t=>t.sectionId===s.id).length;return(<Chip key={s.id} active={activeSection===s.id} color={s.color} onClick={()=>setActiveSection(s.id)}>{s.icon} {s.title}{d>0?` · ${d}/${tot}`:""}</Chip>);})}
      </div>
      <div style={{padding:"0 20px 12px",display:"flex",justifyContent:"space-between",alignItems:"flex-end"}}>
        <div><h2 style={{margin:0,fontFamily:SF,fontSize:"20px",fontWeight:700,color:P.text,letterSpacing:"-0.4px"}}>{sec.icon} {sec.title}</h2><p style={{margin:"2px 0 0",fontFamily:SF,fontSize:"13px",color:P.label3}}>{sec.subtitle}</p></div>
        <span style={{fontFamily:SF,fontSize:"13px",fontWeight:600,color:done===items.length&&items.length>0?P.sage:sec.color}}>{done===items.length&&items.length>0?"All done ✓":`${done}/${items.length}`}</span>
      </div>
      <Card>
        {items.length===0&&<div style={{padding:"28px",textAlign:"center",fontFamily:SF,fontSize:"15px",color:P.label3}}>No tasks yet — tap + to add one.</div>}
        {items.map((task,i)=>{const isDone=checked[task.id];return(<div key={task.id} style={{display:"flex",alignItems:"center",gap:"14px",padding:"12px 16px",borderBottom:i<items.length-1?`0.5px solid ${P.sep}`:"none",background:isDone?`${sec.color}08`:P.card}}><IOSCheck done={isDone} color={sec.color} onToggle={()=>onToggle(task.id)}/><div onClick={()=>onToggle(task.id)} style={{flex:1,cursor:"pointer",minWidth:0}}><p style={{margin:0,fontFamily:SF,fontSize:"15px",color:isDone?P.label3:P.text,textDecoration:isDone?"line-through":"none",letterSpacing:"-0.2px"}}>{task.text}</p>{task.note&&<p style={{margin:"1px 0 0",fontFamily:SF,fontSize:"12px",color:isDone?P.sep:P.label3}}>{task.note}</p>}</div><button onClick={()=>onEdit(task)} style={{background:"none",border:"none",cursor:"pointer",padding:"4px 2px",opacity:0.4}}><svg width="18" height="4" viewBox="0 0 18 4"><circle cx="2" cy="2" r="1.5" fill={P.text}/><circle cx="9" cy="2" r="1.5" fill={P.text}/><circle cx="16" cy="2" r="1.5" fill={P.text}/></svg></button></div>);})}
      </Card>
      <button onClick={onAdd} style={{position:"fixed",bottom:"96px",right:"20px",width:"52px",height:"52px",borderRadius:"26px",background:sec.color,border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:`0 4px 16px ${sec.color}55`,zIndex:40}}>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 3V17M3 10H17" stroke="white" strokeWidth="2.2" strokeLinecap="round"/></svg>
      </button>
      <div style={{height:"20px"}}/>
    </div>
  );
}

function ScheduleView({events,onAddEvent,onEditEvent}) {
  const HOUR_H=64, evColors=[P.sage,P.lav,P.gold,P.rose,P.sky];
  const getColor=e=>evColors[Math.abs(e.id.charCodeAt(2)||0)%evColors.length];
  const getTrans=e=>TRANSPORT.find(t=>t.id===e.transport)||TRANSPORT[2];
  return (
    <div>
      <div style={{padding:"12px 20px 10px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <h2 style={{margin:0,fontFamily:SF,fontSize:"20px",fontWeight:700,color:P.text,letterSpacing:"-0.4px"}}>{new Date().toLocaleDateString("en-US",{weekday:"long",month:"short",day:"numeric"})}</h2>
        <button onClick={()=>onAddEvent("09:00")} style={{padding:"7px 16px",background:P.sage,border:"none",borderRadius:"20px",cursor:"pointer",color:"#fff",fontSize:"13px",fontWeight:600,fontFamily:SF,boxShadow:`0 2px 8px ${P.sage}50`}}>+ Add</button>
      </div>
      <div style={{margin:"0 16px",position:"relative"}}>
        {HOURS.map(h=><div key={h} onClick={()=>onAddEvent(`${String(h).padStart(2,"0")}:00`)} style={{display:"flex",alignItems:"flex-start",height:`${HOUR_H}px`,borderTop:`0.5px solid ${P.sep}`,cursor:"pointer",position:"relative"}}><span style={{fontSize:"11px",color:P.label3,width:"44px",paddingTop:"4px",flexShrink:0,fontFamily:SF,fontWeight:500}}>{fmtHour(h)}</span></div>)}
        {events.map(ev=>{const top=(timeToMin(ev.startTime)-7*60)*(HOUR_H/60),height=Math.max(ev.duration*(HOUR_H/60),36),color=getColor(ev),trans=getTrans(ev);return(<div key={ev.id} onClick={()=>onEditEvent(ev)} style={{position:"absolute",top:`${top}px`,left:"52px",right:0,height:`${height}px`,background:`${color}18`,border:`1.5px solid ${color}55`,borderLeft:`3px solid ${color}`,borderRadius:"8px",padding:"5px 10px",cursor:"pointer",overflow:"hidden",zIndex:5}}><p style={{margin:0,fontFamily:SF,fontSize:"13px",fontWeight:600,color,letterSpacing:"-0.2px",lineHeight:1.2}}>{ev.title}</p>{height>44&&ev.location&&<p style={{margin:"2px 0 0",fontFamily:SF,fontSize:"11px",color:P.label3}}>📍 {ev.location}</p>}{height>58&&<p style={{margin:"2px 0 0",fontFamily:SF,fontSize:"11px",color:P.label3}}>{trans.icon} {trans.label} · {ev.travelTime}min away</p>}</div>);})}
      </div>
      {events.length===0&&<div style={{textAlign:"center",padding:"48px 20px",color:P.label3}}><p style={{margin:0,fontFamily:SF,fontSize:"17px",letterSpacing:"-0.3px"}}>Your day, beautifully open</p><p style={{margin:"6px 0 0",fontFamily:SF,fontSize:"13px"}}>Tap a time slot or "+ Add" to plan it</p></div>}
      <div style={{height:"20px"}}/>
    </div>
  );
}

function JournalView() {
  const [entry,setEntry]=useState(""), [saved,setSaved]=useState(false);
  const prompt=PROMPTS[todayDay%PROMPTS.length];
  return (
    <div>
      <SectionHeader label="✍️  Today's Reflection"/>
      <Card><div style={{padding:"18px 20px"}}><p style={{margin:"0 0 8px",fontFamily:SF,fontSize:"12px",color:P.label3,textTransform:"uppercase",letterSpacing:"1px",fontWeight:600}}>Prompt</p><p style={{margin:0,fontFamily:SERIF,fontSize:"21px",color:P.text,lineHeight:1.45,fontStyle:"italic"}}>"{prompt}"</p></div></Card>
      <div style={{margin:"12px 16px 0"}}><textarea value={entry} onChange={e=>setEntry(e.target.value)} placeholder="write freely, no rules here..." style={{width:"100%",minHeight:"200px",boxSizing:"border-box",background:P.card,border:`0.5px solid ${P.sep}`,borderRadius:"12px",padding:"16px 18px",fontFamily:SF,fontSize:"16px",color:P.text,lineHeight:1.6,resize:"none",outline:"none",letterSpacing:"-0.2px",boxShadow:"0 0.5px 2px rgba(42,31,21,0.08)"}}/></div>
      <div style={{margin:"10px 16px 0"}}><button onClick={()=>{if(entry.trim()){setSaved(true);setTimeout(()=>setSaved(false),2000);}}} style={{width:"100%",padding:"15px",background:saved?P.sage:P.text,border:"none",borderRadius:"12px",fontFamily:SF,fontSize:"16px",fontWeight:600,color:"#fff",cursor:"pointer",letterSpacing:"-0.2px",transition:"background 0.3s ease"}}>{saved?"Saved ✓":"Save Entry"}</button></div>
      <SectionHeader label="🤍  Reminders"/>
      <Card>{[["You don't have to earn rest.",P.sage],["Progress > perfection, always.",P.gold],["The version of you 6 months from now will be grateful.",P.lav],["One good day builds on another.",P.rose],["Ulsan is just the setting. You are the story.",P.sky]].map(([text,color],i,arr)=><div key={i} style={{padding:"14px 16px 14px 20px",display:"flex",gap:"14px",alignItems:"flex-start",borderBottom:i<arr.length-1?`0.5px solid ${P.sep}`:"none"}}><div style={{width:"3px",borderRadius:"2px",background:color,flexShrink:0,alignSelf:"stretch",minHeight:"18px"}}/><p style={{margin:0,fontFamily:SF,fontSize:"15px",color:P.text,lineHeight:1.5,letterSpacing:"-0.2px"}}>{text}</p></div>)}</Card>
      <div style={{height:"20px"}}/>
    </div>
  );
}

const Icons = {
  rituals:({a})=><svg width="26" height="26" viewBox="0 0 26 26" fill="none"><path d="M13 3C9 3 6 7 6 11c0 5.5 7 13 7 13s7-7.5 7-13c0-4-3-8-7-8z" stroke={a?P.sage:P.label3} strokeWidth="1.5" fill={a?`${P.sage}22`:"none"}/></svg>,
  tasks:({a})=><svg width="26" height="26" viewBox="0 0 26 26" fill="none"><rect x="3" y="3" width="20" height="20" rx="5" stroke={a?P.sage:P.label3} strokeWidth="1.5"/><path d="M8.5 13l3 3 6-6" stroke={a?P.sage:P.label3} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  schedule:({a})=><svg width="26" height="26" viewBox="0 0 26 26" fill="none"><rect x="3" y="5" width="20" height="18" rx="3" stroke={a?P.sage:P.label3} strokeWidth="1.5"/><path d="M8 3v4M18 3v4M3 11h20" stroke={a?P.sage:P.label3} strokeWidth="1.5" strokeLinecap="round"/></svg>,
  journal:({a})=><svg width="26" height="26" viewBox="0 0 26 26" fill="none"><rect x="4" y="2" width="15" height="22" rx="2" stroke={a?P.sage:P.label3} strokeWidth="1.5"/><path d="M8 8h8M8 12h8M8 16h5" stroke={a?P.sage:P.label3} strokeWidth="1.5" strokeLinecap="round"/></svg>,
};

export default function AnnPlanner() {
  const [tasks,setTasks]=useLocalStorage("ann_tasks",INIT_TASKS);
  const [checked,setChecked]=useLocalStorage("ann_checked",{});
  const [habits,setHabits]=useLocalStorage("ann_habits",{});
  const [events,setEvents]=useLocalStorage("ann_events",[]);
  const [tab,setTab]=useLocalStorage("ann_tab","rituals");
  const [activeSection,setSection]=useLocalStorage("ann_section","thisweek");
  const [sheet,setSheet]=useState(null), [sheetData,setSheetData]=useState({});

  const toggleTask=id=>setChecked(p=>({...p,[id]:!p[id]}));
  const toggleHabit=id=>setHabits(p=>({...p,[id]:!p[id]}));
  const addTask=d=>setTasks(p=>[...p,{id:`t_${Date.now()}`,...d}]);
  const updateTask=(id,d)=>setTasks(p=>p.map(t=>t.id===id?{...t,...d}:t));
  const deleteTask=id=>{setTasks(p=>p.filter(t=>t.id!==id));setChecked(p=>{const n={...p};delete n[id];return n;});};
  const addEvent=d=>setEvents(p=>[...p,{id:`e_${Date.now()}`,...d}].sort((a,b)=>a.startTime.localeCompare(b.startTime)));
  const updateEvent=(id,d)=>setEvents(p=>p.map(e=>e.id===id?{...e,...d}:e).sort((a,b)=>a.startTime.localeCompare(b.startTime)));
  const deleteEvent=id=>setEvents(p=>p.filter(e=>e.id!==id));
  const openSheet=(type,data={})=>{setSheet(type);setSheetData(data);};
  const closeSheet=()=>{setSheet(null);setSheetData({});};

  const tasksDone=tasks.filter(t=>checked[t.id]).length;
  const quoteStr=QUOTES[todayDay%QUOTES.length];
  const TABS=[{id:"rituals",label:"Rituals"},{id:"tasks",label:"Tasks"},{id:"schedule",label:"Schedule"},{id:"journal",label:"Journal"}];

  return (
    <div style={{minHeight:"100vh",background:P.bg,fontFamily:SF,WebkitFontSmoothing:"antialiased",MozOsxFontSmoothing:"grayscale",paddingBottom:"84px"}}>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@1,400;1,500&display=swap" rel="stylesheet"/>
      <div style={{background:"rgba(245,240,232,0.94)",backdropFilter:"blur(20px)",WebkitBackdropFilter:"blur(20px)",padding:"52px 20px 0",position:"sticky",top:0,zIndex:50,borderBottom:`0.5px solid ${P.sep}`}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
          <div style={{flex:1}}>
            <p style={{margin:0,fontSize:"13px",color:P.sage,fontWeight:600}}>{new Date().toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric"})}</p>
            <h1 style={{margin:"2px 0 2px",fontSize:"28px",fontWeight:700,color:P.text,letterSpacing:"-0.5px",lineHeight:1.15}}>Ann's Planner</h1>
            <p style={{margin:"0 0 12px",fontFamily:SERIF,fontSize:"14px",color:P.label2,fontStyle:"italic"}}>"{quoteStr}"</p>
          </div>
          {tab==="tasks"&&<div style={{paddingTop:"4px",display:"flex",flexDirection:"column",alignItems:"flex-end",gap:"4px"}}><span style={{fontSize:"12px",color:P.label3,fontWeight:500}}>{tasksDone}/{tasks.length}</span><div style={{width:"56px",height:"3px",background:P.sep,borderRadius:"2px",overflow:"hidden"}}><div style={{height:"100%",width:`${tasks.length?(tasksDone/tasks.length)*100:0}%`,background:P.sage,borderRadius:"2px",transition:"width 0.4s ease"}}/></div></div>}
        </div>
        <div style={{display:"flex",borderTop:`0.5px solid ${P.sep}`}}>
          {TABS.map(t=>{const Icon=Icons[t.id],isActive=tab===t.id;return(<button key={t.id} onClick={()=>setTab(t.id)} style={{flex:1,padding:"8px 0 6px",background:"none",border:"none",borderBottom:isActive?`2px solid ${P.sage}`:"2px solid transparent",cursor:"pointer",fontFamily:SF,fontSize:"10px",fontWeight:isActive?600:400,color:isActive?P.sage:P.label3,display:"flex",flexDirection:"column",alignItems:"center",gap:"3px",transition:"all 0.2s",letterSpacing:"0.1px"}}><Icon a={isActive}/>{t.label}</button>);})}
        </div>
      </div>

      {tab==="rituals"&&<RitualsView checked={habits} onToggle={toggleHabit}/>}
      {tab==="tasks"&&<TasksView tasks={tasks} checked={checked} onToggle={toggleTask} activeSection={activeSection} setActiveSection={setSection} onEdit={t=>openSheet("editTask",t)} onAdd={()=>openSheet("addTask",{sectionId:activeSection})}/>}
      {tab==="schedule"&&<ScheduleView events={events} onAddEvent={t=>openSheet("addEvent",{startTime:t})} onEditEvent={ev=>openSheet("editEvent",ev)}/>}
      {tab==="journal"&&<JournalView/>}

      <div style={{position:"fixed",bottom:0,left:0,right:0,background:"rgba(245,240,232,0.96)",backdropFilter:"blur(20px)",WebkitBackdropFilter:"blur(20px)",borderTop:`0.5px solid ${P.sep}`,display:"flex",height:"82px",alignItems:"flex-start",paddingTop:"10px",zIndex:50}}>
        {TABS.map(t=>{const Icon=Icons[t.id],isActive=tab===t.id;return(<button key={t.id} onClick={()=>setTab(t.id)} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:"3px",background:"none",border:"none",cursor:"pointer",fontFamily:SF,fontSize:"10px",fontWeight:isActive?600:400,color:isActive?P.sage:P.label3,letterSpacing:"0.1px"}}><Icon a={isActive}/>{t.label}</button>);})}
      </div>

      {sheet&&<Sheet type={sheet} data={sheetData} onClose={closeSheet} onSaveTask={d=>{sheet==="addTask"?addTask(d):updateTask(sheetData.id,d);closeSheet();}} onSaveEvent={d=>{sheet==="addEvent"?addEvent(d):updateEvent(sheetData.id,d);closeSheet();}} onDeleteTask={()=>{deleteTask(sheetData.id);closeSheet();}} onDeleteEvent={()=>{deleteEvent(sheetData.id);closeSheet();}}/>}
    </div>
  );
}
