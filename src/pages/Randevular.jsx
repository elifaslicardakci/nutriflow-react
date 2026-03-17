import { useState } from 'react';
import AppLayout from '../components/AppLayout';
import Topbar from '../components/Topbar';
import { useToast } from '../hooks/useToast';
import { appointments, clients, programs } from '../data/mockData';

const MONTHS = ['Ocak','Şubat','Mart','Nisan','Mayıs','Haziran','Temmuz','Ağustos','Eylül','Ekim','Kasım','Aralık'];
const DAYS = ['Pzt','Sal','Çar','Per','Cum','Cmt','Paz'];
const HOURS = Array.from({length:12},(_,i)=>i+8);
const evColors = { 'ev-green':{bg:'#e8f0e4',color:'#2f5227',border:'#548a48'}, 'ev-bej':{bg:'#f8f1e0',color:'#7a5b2a',border:'#b8924a'}, 'ev-blue':{bg:'#e2f0f8',color:'#0c4a6e',border:'#3b82f6'}, 'ev-red':{bg:'#fde8e8',color:'#7f1d1d',border:'#ef4444'} };
const statusColors = { onaylı:'var(--success)', bekliyor:'var(--warning)', iptal:'var(--danger)' };

export default function Randevular() {
  const toast = useToast();
  const [weekOffset, setWeekOffset] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ client_id:'P001', date:'2026-03-24', time:'10:00', duration:'45', mode:'Yüz yüze', type:'Kontrol' });

  // Week dates starting Monday 17 Mar 2026
  const baseDate = new Date(2026,2,17);
  const weekDates = Array.from({length:7},(_,i)=>{
    const d = new Date(baseDate); d.setDate(baseDate.getDate()+weekOffset*7+i); return d;
  });

  const upcomingList = [
    {time:'17 Mar · 14:00', name:'Selin Çelik', type:'Ölçüm Güncellemesi'},
    {time:'18 Mar · 09:00', name:'Kerem Şahin', type:'Kontrol · 1. ay'},
    {time:'19 Mar · 10:00', name:'Neslihan Baş', type:'Kontrol'},
    {time:'20 Mar · 11:00', name:'Ayşe Yılmaz', type:'Kontrol'},
    {time:'21 Mar · 09:30', name:'Yeni Danışan', type:'İlk Görüşme'},
  ];

  // Mini calendar
  const [miniMonth, setMiniMonth] = useState(new Date(2026,2,1));
  const miniYear = miniMonth.getFullYear(), miniMon = miniMonth.getMonth();
  const firstDay = new Date(miniYear,miniMon,1).getDay();
  const daysInMonth = new Date(miniYear,miniMon+1,0).getDate();
  const startOffset = firstDay===0?6:firstDay-1;
  const apptDays = [17,18,19,20,22,24];

  const saveAppt = () => { setShowModal(false); toast('Randevu oluşturuldu ✅','success'); };

  return (
    <AppLayout>
      <Topbar title="Randevu Takvimi" subtitle="Mart 2026"
        actions={<button onClick={()=>setShowModal(true)} style={{padding:'8px 16px',borderRadius:99,background:'var(--primary)',color:'white',border:'none',fontSize:13,fontWeight:500,cursor:'pointer'}}>➕ Yeni Randevu</button>}
      />
      <div style={{display:'flex',flex:1,overflow:'hidden'}}>
        {/* Left panel */}
        <div style={{width:280,flexShrink:0,background:'var(--surface)',borderRight:'1px solid var(--border-light)',display:'flex',flexDirection:'column',overflowY:'auto'}}>
          {/* Mini calendar */}
          <div style={{padding:20,borderBottom:'1px solid var(--border-light)'}}>
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:14}}>
              <span style={{fontSize:15,fontWeight:600}}>{MONTHS[miniMon]} {miniYear}</span>
              <div style={{display:'flex',gap:4}}>
                <button onClick={()=>setMiniMonth(d=>{const n=new Date(d);n.setMonth(d.getMonth()-1);return n;})} style={{width:26,height:26,borderRadius:'50%',background:'var(--sage-50)',border:'none',cursor:'pointer',fontSize:12}}>‹</button>
                <button onClick={()=>setMiniMonth(d=>{const n=new Date(d);n.setMonth(d.getMonth()+1);return n;})} style={{width:26,height:26,borderRadius:'50%',background:'var(--sage-50)',border:'none',cursor:'pointer',fontSize:12}}>›</button>
              </div>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(7,1fr)',gap:2}}>
              {['Pt','Sa','Ça','Pe','Cu','Ct','Pz'].map(d=><div key={d} style={{fontSize:9,fontWeight:600,textAlign:'center',color:'var(--muted)',padding:'3px 0',textTransform:'uppercase'}}>{d}</div>)}
              {Array.from({length:startOffset},(_,i)=>{
                const prev = new Date(miniYear,miniMon,0).getDate();
                return <div key={'p'+i} style={{aspectRatio:1,display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,color:'var(--border)',borderRadius:'50%'}}>{prev-startOffset+i+1}</div>;
              })}
              {Array.from({length:daysInMonth},(_,i)=>{
                const d=i+1, isToday=d===17&&miniMon===2&&miniYear===2026, hasAppt=apptDays.includes(d)&&miniMon===2&&miniYear===2026;
                return (
                  <div key={d} onClick={()=>toast(`${d} ${MONTHS[miniMon]} seçildi`,'info')} style={{aspectRatio:1,display:'flex',alignItems:'center',justifyContent:'center',fontSize:12,cursor:'pointer',borderRadius:'50%',background:isToday?'var(--primary)':'transparent',color:isToday?'white':'var(--charcoal)',fontWeight:isToday?700:400,border:!isToday&&hasAppt?'1.5px solid var(--primary)':'none',transition:'all 0.15s',position:'relative'}}
                    onMouseEnter={e=>{if(!isToday)e.currentTarget.style.background='var(--sage-100)'}} onMouseLeave={e=>{if(!isToday)e.currentTarget.style.background='transparent'}}>
                    {d}
                    {hasAppt&&!isToday&&<div style={{position:'absolute',bottom:1,left:'50%',transform:'translateX(-50%)',width:4,height:4,borderRadius:'50%',background:'var(--primary)'}}/>}
                  </div>
                );
              })}
            </div>
          </div>
          {/* Upcoming */}
          <div style={{padding:16,flex:1}}>
            <div style={{fontSize:11,fontWeight:600,textTransform:'uppercase',letterSpacing:1,color:'var(--muted)',marginBottom:12}}>Yaklaşan Randevular</div>
            {upcomingList.map((u,i)=>(
              <div key={i} onClick={()=>toast(`${u.name} · ${u.type}`,'info')} style={{display:'flex',gap:10,padding:10,borderRadius:'var(--radius-md)',cursor:'pointer',marginBottom:4,transition:'background 0.15s'}}
                onMouseEnter={e=>e.currentTarget.style.background='var(--sage-50)'} onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                <div style={{width:3,borderRadius:2,background:'var(--primary)',flexShrink:0}}/>
                <div>
                  <div style={{fontSize:11,fontFamily:'var(--font-mono)',color:'var(--muted)',marginBottom:1}}>{u.time}</div>
                  <div style={{fontSize:13,fontWeight:500}}>{u.name}</div>
                  <div style={{fontSize:11,color:'var(--muted)'}}>{u.type}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Calendar main */}
        <div style={{flex:1,display:'flex',flexDirection:'column',overflow:'hidden'}}>
          {/* Toolbar */}
          <div style={{background:'white',borderBottom:'1px solid var(--border-light)',padding:'12px 24px',display:'flex',alignItems:'center',gap:12,flexShrink:0}}>
            <div style={{display:'flex',gap:6}}>
              <button onClick={()=>setWeekOffset(p=>p-1)} style={{padding:'6px 12px',borderRadius:'var(--radius-md)',background:'var(--sage-50)',border:'1px solid var(--border-light)',cursor:'pointer',fontSize:14}}>‹</button>
              <button onClick={()=>setWeekOffset(0)} style={{padding:'6px 12px',borderRadius:'var(--radius-md)',background:'var(--sage-50)',border:'1px solid var(--border-light)',cursor:'pointer',fontSize:13,fontWeight:500}}>Bugün</button>
              <button onClick={()=>setWeekOffset(p=>p+1)} style={{padding:'6px 12px',borderRadius:'var(--radius-md)',background:'var(--sage-50)',border:'1px solid var(--border-light)',cursor:'pointer',fontSize:14}}>›</button>
            </div>
            <span style={{fontSize:17,fontWeight:600,minWidth:200}}>
              {weekDates[0].getDate()}–{weekDates[6].getDate()} {MONTHS[weekDates[6].getMonth()]} {weekDates[6].getFullYear()}
            </span>
            <div style={{marginLeft:'auto',display:'flex',background:'var(--sage-50)',border:'1px solid var(--border-light)',borderRadius:99,overflow:'hidden'}}>
              {['Gün','Hafta','Ay'].map(v=>(
                <button key={v} onClick={()=>toast(`${v} görünümüne geçildi`,'info')} style={{padding:'6px 14px',fontSize:13,fontWeight:500,border:'none',background:v==='Hafta'?'var(--primary)':'transparent',color:v==='Hafta'?'white':'var(--muted)',cursor:'pointer',transition:'all 0.15s'}}>{v}</button>
              ))}
            </div>
          </div>

          {/* Week grid */}
          <div style={{flex:1,overflowY:'auto'}}>
            <div style={{display:'grid',gridTemplateColumns:'52px repeat(7,1fr)',minWidth:700}}>
              {/* Header */}
              <div style={{gridColumn:'1/-1',display:'grid',gridTemplateColumns:'52px repeat(7,1fr)',borderBottom:'1px solid var(--border-light)',background:'white',position:'sticky',top:0,zIndex:10}}>
                <div style={{borderRight:'1px solid var(--border-light)'}}/>
                {weekDates.map((d,i)=>{
                  const isToday = d.getDate()===17&&d.getMonth()===2&&d.getFullYear()===2026;
                  return (
                    <div key={i} style={{padding:'10px 8px',textAlign:'center',borderRight:'1px solid var(--border-light)'}}>
                      <div style={{fontSize:10,fontWeight:600,textTransform:'uppercase',color:'var(--muted)',letterSpacing:'0.8px'}}>{DAYS[i]}</div>
                      <div style={{fontSize:isToday?15:20,fontWeight:600,color:isToday?'white':'var(--charcoal)',...( isToday?{background:'var(--primary)',width:32,height:32,borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',margin:'2px auto 0'}:{})}}>{d.getDate()}</div>
                    </div>
                  );
                })}
              </div>

              {/* Time col */}
              <div style={{borderRight:'1px solid var(--border-light)',background:'white'}}>
                {HOURS.map(h=><div key={h} style={{height:60,borderBottom:'1px solid var(--border-light)',display:'flex',alignItems:'flex-start',padding:'4px 6px',fontSize:10,color:'var(--muted)',fontFamily:'var(--font-mono)',flexShrink:0}}>{String(h).padStart(2,'0')}:00</div>)}
              </div>

              {/* Day cols */}
              {weekDates.map((d,di)=>{
                const isToday = d.getDate()===17&&d.getMonth()===2&&d.getFullYear()===2026;
                const dayAppts = appointments.filter(a=>a.day===di+1);
                return (
                  <div key={di} style={{borderRight:'1px solid var(--border-light)',background:isToday?'rgba(84,138,72,0.02)':'white',position:'relative'}}>
                    {HOURS.map(h=><div key={h} onClick={()=>{toast(`${d.getDate()} ${MONTHS[d.getMonth()]} ${h}:00 seçildi`,'info');setShowModal(true);}} style={{height:60,borderBottom:'1px solid var(--border-light)',cursor:'pointer',transition:'background 0.1s'}} onMouseEnter={e=>e.currentTarget.style.background='var(--sage-50)'} onMouseLeave={e=>e.currentTarget.style.background='transparent'}/>)}
                    {/* Events */}
                    {dayAppts.map(a=>{
                      const top = (a.startH-8)*60+a.startM;
                      const height = (a.dur/60)*60-4;
                      const ec = evColors[a.color]||evColors['ev-green'];
                      return (
                        <div key={a.id} onClick={()=>toast(`${a.client_name} · ${String(a.startH).padStart(2,'0')}:${String(a.startM).padStart(2,'0')} · ${a.type} · ${a.mode}`,'info')}
                          style={{position:'absolute',left:3,right:3,top:top,height:height,background:ec.bg,color:ec.color,borderLeft:`3px solid ${ec.border}`,borderRadius:'var(--radius-sm)',padding:'3px 6px',fontSize:11,cursor:'pointer',overflow:'hidden',zIndex:5,transition:'all 0.15s'}}
                          onMouseEnter={e=>{e.currentTarget.style.transform='scale(1.02)';e.currentTarget.style.zIndex=10;e.currentTarget.style.boxShadow='var(--shadow-md)';}}
                          onMouseLeave={e=>{e.currentTarget.style.transform='scale(1)';e.currentTarget.style.zIndex=5;e.currentTarget.style.boxShadow='none';}}>
                          <div style={{fontWeight:600,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{a.client_name}</div>
                          <div style={{opacity:0.8,fontSize:9,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{String(a.startH).padStart(2,'0')}:{String(a.startM).padStart(2,'0')} · {a.type}</div>
                        </div>
                      );
                    })}
                    {/* Time indicator */}
                    {isToday&&<div style={{position:'absolute',left:0,right:0,top:(10-8)*60+45,height:2,background:'var(--danger)',zIndex:6,pointerEvents:'none'}}><div style={{position:'absolute',left:-4,top:-4,width:10,height:10,borderRadius:'50%',background:'var(--danger)'}}/></div>}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* New appointment modal */}
      {showModal&&(
        <div onClick={e=>{if(e.target===e.currentTarget)setShowModal(false);}} style={{position:'fixed',inset:0,background:'rgba(30,42,26,0.5)',backdropFilter:'blur(4px)',zIndex:200,display:'flex',alignItems:'center',justifyContent:'center'}}>
          <div style={{background:'white',borderRadius:'var(--radius-xl)',padding:32,width:480,maxWidth:'95vw',boxShadow:'var(--shadow-xl)',animation:'scaleIn 0.3s cubic-bezier(0.34,1.56,0.64,1)'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:24}}>
              <span style={{fontFamily:'var(--font-display)',fontSize:22,fontWeight:500}}>Yeni Randevu</span>
              <button onClick={()=>setShowModal(false)} style={{width:32,height:32,borderRadius:'50%',background:'var(--sage-50)',border:'none',cursor:'pointer'}}>✕</button>
            </div>
            <div style={{marginBottom:14}}>
              <label style={{fontSize:11,fontWeight:600,textTransform:'uppercase',letterSpacing:'0.8px',color:'var(--muted)',display:'block',marginBottom:5}}>Danışan</label>
              <select value={form.client_id} onChange={e=>setForm(p=>({...p,client_id:e.target.value}))} style={{width:'100%',padding:'10px 14px',border:'1px solid var(--border)',borderRadius:'var(--radius-md)',fontSize:14,outline:'none'}}>
                {clients.map(c=><option key={c.id} value={c.id}>{c.name} ({c.id})</option>)}
              </select>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:14}}>
              {[['Tarih','date','date'],['Saat','time','time']].map(([l,k,t])=>(
                <div key={k}>
                  <label style={{fontSize:11,fontWeight:600,textTransform:'uppercase',letterSpacing:'0.8px',color:'var(--muted)',display:'block',marginBottom:5}}>{l}</label>
                  <input type={t} value={form[k]} onChange={e=>setForm(p=>({...p,[k]:e.target.value}))} style={{width:'100%',padding:'10px 14px',border:'1px solid var(--border)',borderRadius:'var(--radius-md)',fontSize:14,outline:'none'}}/>
                </div>
              ))}
            </div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:14}}>
              <div>
                <label style={{fontSize:11,fontWeight:600,textTransform:'uppercase',letterSpacing:'0.8px',color:'var(--muted)',display:'block',marginBottom:5}}>Süre</label>
                <select value={form.duration} onChange={e=>setForm(p=>({...p,duration:e.target.value}))} style={{width:'100%',padding:'10px 14px',border:'1px solid var(--border)',borderRadius:'var(--radius-md)',fontSize:14,outline:'none'}}>
                  {['30','45','60','90'].map(v=><option key={v} value={v}>{v} dakika</option>)}
                </select>
              </div>
              <div>
                <label style={{fontSize:11,fontWeight:600,textTransform:'uppercase',letterSpacing:'0.8px',color:'var(--muted)',display:'block',marginBottom:5}}>Tür</label>
                <select value={form.mode} onChange={e=>setForm(p=>({...p,mode:e.target.value}))} style={{width:'100%',padding:'10px 14px',border:'1px solid var(--border)',borderRadius:'var(--radius-md)',fontSize:14,outline:'none'}}>
                  <option>Yüz yüze</option><option>Online</option>
                </select>
              </div>
            </div>
            <div style={{marginBottom:14}}>
              <label style={{fontSize:11,fontWeight:600,textTransform:'uppercase',letterSpacing:'0.8px',color:'var(--muted)',display:'block',marginBottom:5}}>Randevu Tipi</label>
              <select value={form.type} onChange={e=>setForm(p=>({...p,type:e.target.value}))} style={{width:'100%',padding:'10px 14px',border:'1px solid var(--border)',borderRadius:'var(--radius-md)',fontSize:14,outline:'none'}}>
                {['İlk Görüşme','Kontrol','Ölçüm Güncellemesi','Program Revizyonu','Takip'].map(v=><option key={v}>{v}</option>)}
              </select>
            </div>
            <div style={{display:'flex',justifyContent:'flex-end',gap:10,marginTop:24,paddingTop:20,borderTop:'1px solid var(--border-light)'}}>
              <button onClick={()=>setShowModal(false)} style={{padding:'9px 20px',borderRadius:99,border:'1px solid var(--border)',background:'white',fontSize:13,fontWeight:500,cursor:'pointer'}}>İptal</button>
              <button onClick={saveAppt} style={{padding:'9px 20px',borderRadius:99,background:'var(--primary)',color:'white',border:'none',fontSize:13,fontWeight:500,cursor:'pointer'}}>✅ Kaydet</button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
