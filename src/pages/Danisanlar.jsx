import { useState } from 'react';
import AppLayout from '../components/AppLayout';
import Topbar from '../components/Topbar';
import { useToast } from '../hooks/useToast';
import { clients, programs, measurements } from '../data/mockData';

const statusMap = { aktif:{label:'Aktif',bg:'var(--sage-100)',color:'var(--sage-700)'}, beklemede:{label:'Beklemede',bg:'#fef3e2',color:'var(--warning)'}, tamamlandi:{label:'Tamamlandı',bg:'var(--bej-100)',color:'var(--bej-700)'} };

function Badge({ status }) {
  const s = statusMap[status]||statusMap.aktif;
  return <span style={{padding:'3px 10px',borderRadius:99,fontSize:11,fontWeight:500,background:s.bg,color:s.color}}>{s.label}</span>;
}

function ClientCard({ c, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <div onClick={onClick} onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{background:'white',border:`1px solid ${hov?'var(--sage-200)':'var(--border-light)'}`,borderRadius:'var(--radius-lg)',padding:22,cursor:'pointer',transition:'all 0.25s',transform:hov?'translateY(-3px)':'none',boxShadow:hov?'var(--shadow-lg)':'var(--shadow-sm)',position:'relative',overflow:'hidden'}}>
      <div style={{position:'absolute',left:0,top:0,bottom:0,width:4,background:'var(--primary)',borderRadius:'0 2px 2px 0',transform:hov?'scaleY(1)':'scaleY(0)',transformOrigin:'bottom',transition:'transform 0.25s'}}/>
      <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',marginBottom:16}}>
        <div style={{position:'relative'}}>
          <div style={{width:52,height:52,borderRadius:'50%',background:c.color,color:c.colorText||'white',display:'flex',alignItems:'center',justifyContent:'center',fontSize:18,fontWeight:700}}>{c.initials}</div>
          {c.status==='aktif'&&<div style={{position:'absolute',bottom:2,right:2,width:12,height:12,borderRadius:'50%',background:'var(--success)',border:'2px solid white'}}/>}
        </div>
        <div style={{flex:1,marginLeft:12}}>
          <div style={{fontSize:15,fontWeight:600,marginBottom:2}}>{c.name}</div>
          <div style={{fontSize:11,color:'var(--muted)',fontFamily:'var(--font-mono)'}}>{c.id} · {c.age}y {c.gender}</div>
        </div>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:8,marginBottom:14}}>
        {[[c.weight+'kg','Kilo'],[c.bmi,'BMI'],[c.body_fat,'Yağ %']].map(([v,l])=>(
          <div key={l} style={{background:'var(--sage-50)',borderRadius:'var(--radius-sm)',padding:'8px',textAlign:'center'}}>
            <div style={{fontSize:15,fontWeight:700}}>{v}</div>
            <div style={{fontSize:9,color:'var(--muted)',textTransform:'uppercase',letterSpacing:'0.5px'}}>{l}</div>
          </div>
        ))}
      </div>
      <div style={{display:'flex',justifyContent:'space-between',fontSize:11,color:'var(--muted)',marginBottom:5}}>
        <span>Hedef İlerlemesi</span><span style={{fontWeight:600,color:'var(--primary)'}}>{c.progress}%</span>
      </div>
      <div style={{height:5,background:'var(--sage-100)',borderRadius:99,overflow:'hidden',marginBottom:12}}>
        <div style={{height:'100%',background:'linear-gradient(90deg,var(--primary),var(--sage-400))',width:c.progress+'%',transition:'width 0.8s'}}/>
      </div>
      <div style={{display:'flex',gap:6,flexWrap:'wrap',marginBottom:8}}>
        <Badge status={c.status}/>
        <span style={{padding:'3px 10px',borderRadius:99,fontSize:11,fontWeight:500,background:'var(--bej-100)',color:'var(--bej-700)'}}>{(programs.find(p=>p.id===c.program_id)||{}).name||'—'}</span>
      </div>
      <div style={{fontSize:11,color:'var(--muted)'}}>📅 <strong style={{color:'var(--charcoal)'}}>{c.next_appt}</strong></div>
    </div>
  );
}

function ClientModal({ c, onClose }) {
  const toast = useToast();
  const [tab, setTab] = useState('genel');
  const prog = programs.find(p=>p.id===c.program_id)||{};
  const meas = measurements.filter(m=>m.client_id===c.id);
  if (!c) return null;
  const tabs = [['genel','Genel'],['olcumler','Ölçümler'],['program','Program'],['gecmis','Geçmiş']];
  return (
    <div onClick={e=>{if(e.target===e.currentTarget)onClose();}} style={{position:'fixed',inset:0,background:'rgba(30,42,26,0.5)',backdropFilter:'blur(4px)',zIndex:200,display:'flex',alignItems:'center',justifyContent:'flex-end',animation:'fadeIn 0.2s'}}>
      <div style={{width:480,maxWidth:'95vw',height:'100vh',background:'white',overflowY:'auto',boxShadow:'var(--shadow-xl)',animation:'slideRight 0.3s cubic-bezier(0.34,1.56,0.64,1)'}}>
        {/* Header */}
        <div style={{padding:'24px 24px 0',position:'sticky',top:0,background:'white',zIndex:1,borderBottom:'1px solid var(--border-light)',paddingBottom:16}}>
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:14}}>
            <Badge status={c.status}/>
            <button onClick={onClose} style={{width:32,height:32,borderRadius:'50%',background:'var(--sage-50)',border:'none',cursor:'pointer',fontSize:14}}>✕</button>
          </div>
          <div style={{display:'flex',alignItems:'center',gap:14,marginBottom:12}}>
            <div style={{width:60,height:60,borderRadius:'50%',background:c.color,color:c.colorText||'white',display:'flex',alignItems:'center',justifyContent:'center',fontSize:22,fontWeight:700}}>{c.initials}</div>
            <div>
              <div style={{fontFamily:'var(--font-display)',fontSize:20,fontWeight:500,marginBottom:3}}>{c.name}</div>
              <div style={{fontSize:12,color:'var(--muted)',display:'flex',gap:10,flexWrap:'wrap'}}>
                <span>👤 {c.age} yaş · {c.gender==='K'?'Kadın':'Erkek'}</span>
                <span>⚖️ {c.weight} kg</span>
                <span>📏 {c.height} cm</span>
              </div>
            </div>
          </div>
          <div style={{display:'flex',gap:4,overflowX:'auto'}}>
            {tabs.map(([k,l])=>(
              <button key={k} onClick={()=>setTab(k)} style={{padding:'7px 14px',borderRadius:99,fontSize:13,fontWeight:500,cursor:'pointer',border:'none',background:tab===k?'var(--sage-100)':'transparent',color:tab===k?'var(--primary)':'var(--muted)',transition:'all 0.15s',whiteSpace:'nowrap'}}>{l}</button>
            ))}
          </div>
        </div>

        <div style={{padding:24}}>
          {tab==='genel'&&(
            <>
              <div style={{marginBottom:20}}>
                <div style={{fontSize:11,fontWeight:600,textTransform:'uppercase',letterSpacing:1,color:'var(--muted)',marginBottom:10}}>Kişisel Bilgiler</div>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
                  {[['Telefon',c.phone],['E-posta',c.email],['Program',prog.name||'—'],['Sonraki Randevu',c.next_appt]].map(([l,v])=>(
                    <div key={l} style={{background:'var(--sage-50)',borderRadius:'var(--radius-md)',padding:12}}>
                      <div style={{fontSize:11,color:'var(--muted)',marginBottom:3}}>{l}</div>
                      <div style={{fontSize:14,fontWeight:600}}>{v}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{marginBottom:20}}>
                <div style={{fontSize:11,fontWeight:600,textTransform:'uppercase',letterSpacing:1,color:'var(--muted)',marginBottom:10}}>Hedef Durumu</div>
                <div style={{background:'var(--sage-50)',borderRadius:'var(--radius-md)',padding:14}}>
                  <div style={{display:'flex',justifyContent:'space-between',fontSize:12,marginBottom:6}}><span>Hedef: {c.goal}</span><span style={{fontWeight:600,color:'var(--primary)'}}>{c.progress}%</span></div>
                  <div style={{height:8,background:'white',borderRadius:99,overflow:'hidden'}}>
                    <div style={{height:'100%',background:'linear-gradient(90deg,var(--primary),var(--sage-400))',width:c.progress+'%',transition:'width 0.8s'}}/>
                  </div>
                  <div style={{fontSize:11,color:'var(--muted)',marginTop:6}}>{c.progress>=100?'🎉 Hedefe ulaşıldı!':`Hedefe ${100-c.progress}% kaldı`}</div>
                </div>
              </div>
              <div>
                <div style={{fontSize:11,fontWeight:600,textTransform:'uppercase',letterSpacing:1,color:'var(--muted)',marginBottom:10}}>Notlar</div>
                <textarea defaultValue="Laktoz intoleransı mevcut. Sabah kahvaltısını atladığını belirtti. Egzersiz düzensiz." style={{width:'100%',border:'1px solid var(--border)',borderRadius:'var(--radius-md)',padding:12,fontSize:13,color:'var(--charcoal)',resize:'vertical',minHeight:80,background:'var(--sage-50)',outline:'none',fontFamily:'var(--font-body)'}}/>
              </div>
            </>
          )}
          {tab==='olcumler'&&(
            <>
              <div style={{marginBottom:20}}>
                <div style={{fontSize:11,fontWeight:600,textTransform:'uppercase',letterSpacing:1,color:'var(--muted)',marginBottom:10}}>Son Ölçümler</div>
                <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:10}}>
                  {[[c.weight+' kg','Kilo','↓ -2.3'],[c.bmi,'BMI','↓ -0.8'],[c.body_fat,'Yağ %','↓ -1.5'],[c.muscle,'Kas Kütlesi','↑ +0.4'],[c.height+' cm','Boy','—'],[String(Math.round(c.weight*0.6))+' ml','Su','—']].map(([v,l,tr])=>(
                    <div key={l} style={{background:'var(--sage-50)',borderRadius:'var(--radius-md)',padding:12,textAlign:'center'}}>
                      <div style={{fontFamily:'var(--font-display)',fontSize:22,fontWeight:700,color:'var(--primary-dark)'}}>{v}</div>
                      <div style={{fontSize:11,color:'var(--muted)'}}>{l}</div>
                      {tr!=='—'&&<div style={{fontSize:10,color:'var(--success)'}}>{tr}</div>}
                    </div>
                  ))}
                </div>
              </div>
              {meas.length>0&&(
                <div>
                  <div style={{fontSize:11,fontWeight:600,textTransform:'uppercase',letterSpacing:1,color:'var(--muted)',marginBottom:10}}>Ölçüm Geçmişi</div>
                  <table style={{width:'100%',borderCollapse:'collapse'}}>
                    <thead><tr>{['Tarih','Kilo','BMI','Yağ%','Kas'].map(h=><th key={h} style={{fontSize:11,fontWeight:600,padding:'8px 10px',textAlign:'left',background:'var(--sage-50)',color:'var(--muted)'}}>{h}</th>)}</tr></thead>
                    <tbody>{meas.map(m=><tr key={m.id}>{[m.date,m.weight+' kg',m.bmi,m.body_fat+'%',m.muscle+' kg'].map((v,i)=><td key={i} style={{padding:'10px',fontSize:13,borderBottom:'1px solid var(--border-light)'}}>{v}</td>)}</tr>)}</tbody>
                  </table>
                </div>
              )}
            </>
          )}
          {tab==='program'&&(
            <>
              <div style={{background:'var(--sage-50)',borderRadius:'var(--radius-md)',padding:16,marginBottom:16}}>
                <div style={{fontSize:15,fontWeight:600,marginBottom:8}}>{prog.name||'Program Atanmamış'}</div>
                {prog.calories&&<div style={{display:'flex',gap:12,flexWrap:'wrap',fontSize:12,color:'var(--muted)'}}>
                  <span>🔥 <strong>{prog.calories} kcal</strong>/gün</span>
                  <span>🥩 <strong>{prog.protein}g</strong> protein</span>
                  <span>🍚 <strong>{prog.carbs}g</strong> karbonhidrat</span>
                  <span>🥑 <strong>{prog.fat}g</strong> yağ</span>
                </div>}
              </div>
              {[['🌅 Kahvaltı (07:00)','2 yumurta, 1 dilim tam tahıllı ekmek, 1 çorba kaşığı zeytinyağı, salatalık-domates'],['☀️ Öğle (12:30)','120g tavuk göğsü (ızgara), 1 kase yeşil salata, 3 yemek kaşığı esmer pirinç'],['🌆 Akşam (19:00)','1 porsiyon sebze çorbası, 100g balık, buharda brokoli'],['🌙 Ara Öğün','1 adet meyve veya 30g yulaf + 200ml süt']].map(([t,d])=>(
                <div key={t} style={{background:'white',border:'1px solid var(--border-light)',borderRadius:'var(--radius-md)',padding:12,marginBottom:8}}>
                  <div style={{fontSize:12,fontWeight:600,color:'var(--primary)',marginBottom:4}}>{t}</div>
                  <div style={{fontSize:13,color:'var(--charcoal)'}}>{d}</div>
                </div>
              ))}
            </>
          )}
          {tab==='gecmis'&&(
            <div style={{display:'flex',flexDirection:'column',gap:8}}>
              {[['17 Mar 2026','Kontrol · 3. ay değerlendirme'],['17 Şub 2026','Kontrol · 2. ay ölçüm güncellemesi'],['20 Oca 2026','Program revizyonu · Kalori ayarı'],['10 Oca 2026','İlk görüşme · Anamnez ve program hazırlama']].map(([d,t])=>(
                <div key={d} style={{display:'flex',alignItems:'center',gap:12,padding:10,background:'var(--sage-50)',borderRadius:'var(--radius-md)'}}>
                  <div style={{fontSize:12,fontFamily:'var(--font-mono)',color:'var(--muted)',minWidth:90}}>{d}</div>
                  <div style={{flex:1,fontSize:13}}>{t}</div>
                  <span style={{padding:'2px 8px',borderRadius:99,fontSize:10,fontWeight:500,background:'var(--sage-100)',color:'var(--sage-700)'}}>Tamamlandı</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div style={{display:'flex',gap:8,flexWrap:'wrap',padding:'14px 24px',borderTop:'1px solid var(--border-light)',background:'var(--sage-50)',position:'sticky',bottom:0}}>
          <button onClick={()=>toast('Randevu oluşturuluyor...','success')} style={{padding:'8px 16px',borderRadius:99,background:'var(--primary)',color:'white',border:'none',fontSize:13,fontWeight:500,cursor:'pointer'}}>📅 Randevu Oluştur</button>
          <button onClick={()=>toast('Program düzenleniyor...','info')} style={{padding:'8px 16px',borderRadius:99,background:'transparent',border:'1px solid var(--border)',fontSize:13,fontWeight:500,cursor:'pointer'}}>🥗 Programı Düzenle</button>
          <button onClick={()=>toast('Ölçüm girişi açılıyor...','info')} style={{padding:'8px 16px',borderRadius:99,background:'transparent',border:'1px solid var(--border)',fontSize:13,fontWeight:500,cursor:'pointer'}}>📏 Ölçüm Gir</button>
          <button onClick={()=>toast('Danışan arşivlendi','warning')} style={{marginLeft:'auto',padding:'8px 12px',borderRadius:99,background:'transparent',border:'none',fontSize:13,color:'var(--danger)',cursor:'pointer'}}>🗑</button>
        </div>
      </div>
    </div>
  );
}

export default function Danisanlar() {
  const toast = useToast();
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterProgram, setFilterProgram] = useState('');
  const [view, setView] = useState('grid');
  const [selected, setSelected] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newClient, setNewClient] = useState({ name:'', age:'', gender:'K', phone:'', email:'', program_id:1, goal:'' });

  const filtered = clients.filter(c => {
    const q = search.toLowerCase();
    return (!q || c.name.toLowerCase().includes(q) || c.email.includes(q) || c.phone.includes(q))
      && (!filterStatus || c.status === filterStatus)
      && (!filterProgram || c.program_id === Number(filterProgram));
  });

  const inputStyle = { padding:'10px 18px', border:'1px solid var(--border)', borderRadius:99, fontSize:13, outline:'none', background:'white', color:'var(--charcoal)', cursor:'pointer' };

  return (
    <AppLayout>
      <Topbar title="Danışan Yönetimi" subtitle={`${clients.length} aktif danışan`}
        actions={<button onClick={()=>setShowAddModal(true)} style={{padding:'8px 16px',borderRadius:99,background:'var(--primary)',color:'white',border:'none',fontSize:13,fontWeight:500,cursor:'pointer'}}>➕ Yeni Danışan</button>}
      />
      <div style={{padding:28,flex:1}}>
        {/* Toolbar */}
        <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:20,flexWrap:'wrap'}}>
          <div style={{display:'flex',alignItems:'center',gap:8,background:'white',border:'1px solid var(--border)',borderRadius:99,padding:'10px 18px',flex:1,minWidth:200,maxWidth:360}}>
            <span>🔍</span>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="İsim, e-posta veya telefon ara..." style={{border:'none',outline:'none',fontSize:14,color:'var(--charcoal)',background:'transparent',width:'100%'}}/>
          </div>
          <select value={filterStatus} onChange={e=>setFilterStatus(e.target.value)} style={inputStyle}>
            <option value="">Tüm Durumlar</option>
            <option value="aktif">Aktif</option>
            <option value="beklemede">Beklemede</option>
            <option value="tamamlandi">Tamamlandı</option>
          </select>
          <select value={filterProgram} onChange={e=>setFilterProgram(e.target.value)} style={inputStyle}>
            <option value="">Tüm Programlar</option>
            {programs.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          <div style={{marginLeft:'auto',display:'flex',gap:8,alignItems:'center'}}>
            <div style={{display:'flex',background:'white',border:'1px solid var(--border)',borderRadius:99,overflow:'hidden'}}>
              {[['grid','⊞'],['list','☰']].map(([v,icon])=>(
                <button key={v} onClick={()=>setView(v)} style={{padding:'8px 14px',border:'none',background:view===v?'var(--primary)':'transparent',color:view===v?'white':'var(--muted)',cursor:'pointer',fontSize:14,transition:'all 0.15s'}}>{icon}</button>
              ))}
            </div>
          </div>
        </div>

        {/* Grid */}
        {view==='grid'&&(
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))',gap:16}}>
            {filtered.map(c=><ClientCard key={c.id} c={c} onClick={()=>setSelected(c)}/>)}
            {filtered.length===0&&<div style={{gridColumn:'1/-1',textAlign:'center',padding:60,color:'var(--muted)',fontSize:15}}>Danışan bulunamadı.</div>}
          </div>
        )}

        {/* List */}
        {view==='list'&&(
          <div style={{background:'white',border:'1px solid var(--border-light)',borderRadius:'var(--radius-lg)',overflow:'hidden'}}>
            <table style={{width:'100%',borderCollapse:'collapse'}}>
              <thead><tr>{['Danışan','Yaş/Cinsiyet','Program','Başlangıç','Kilo','İlerleme','Durum',''].map(h=><th key={h} style={{fontSize:11,fontWeight:600,textTransform:'uppercase',letterSpacing:'0.8px',color:'var(--muted)',padding:'12px 14px',textAlign:'left',background:'var(--sage-50)',whiteSpace:'nowrap'}}>{h}</th>)}</tr></thead>
              <tbody>
                {filtered.map(c=>{
                  const p = programs.find(x=>x.id===c.program_id)||{};
                  return (
                    <tr key={c.id} onClick={()=>setSelected(c)} style={{cursor:'pointer'}} onMouseEnter={e=>e.currentTarget.style.background='var(--sage-50)'} onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                      <td style={{padding:'12px 14px',borderBottom:'1px solid var(--border-light)'}}><div style={{display:'flex',alignItems:'center',gap:10}}>
                        <div style={{width:34,height:34,borderRadius:'50%',background:c.color,color:c.colorText||'white',display:'flex',alignItems:'center',justifyContent:'center',fontSize:12,fontWeight:700,flexShrink:0}}>{c.initials}</div>
                        <div><div style={{fontWeight:500,fontSize:13}}>{c.name}</div><div style={{fontSize:11,color:'var(--muted)'}}>{c.id}</div></div>
                      </div></td>
                      <td style={{padding:'12px 14px',fontSize:13,borderBottom:'1px solid var(--border-light)'}}>{c.age}y · {c.gender}</td>
                      <td style={{padding:'12px 14px',borderBottom:'1px solid var(--border-light)'}}><span style={{padding:'2px 8px',borderRadius:99,fontSize:11,background:'var(--sage-100)',color:'var(--sage-700)'}}>{p.name}</span></td>
                      <td style={{padding:'12px 14px',fontSize:12,color:'var(--muted)',borderBottom:'1px solid var(--border-light)'}}>{c.since}</td>
                      <td style={{padding:'12px 14px',fontSize:13,borderBottom:'1px solid var(--border-light)'}}>{c.weight} kg</td>
                      <td style={{padding:'12px 14px',borderBottom:'1px solid var(--border-light)'}}><div style={{display:'flex',alignItems:'center',gap:8}}><div style={{width:80,height:5,background:'var(--sage-100)',borderRadius:99,overflow:'hidden'}}><div style={{height:'100%',background:'var(--primary)',width:c.progress+'%'}}/></div><span style={{fontSize:12,fontWeight:600,color:'var(--primary)'}}>{c.progress}%</span></div></td>
                      <td style={{padding:'12px 14px',borderBottom:'1px solid var(--border-light)'}}><Badge status={c.status}/></td>
                      <td style={{padding:'12px 14px',borderBottom:'1px solid var(--border-light)'}}><button onClick={e=>{e.stopPropagation();setSelected(c);}} style={{padding:'5px 12px',borderRadius:99,border:'none',background:'transparent',fontSize:12,color:'var(--primary)',fontWeight:500,cursor:'pointer'}}>Detay →</button></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div style={{padding:'14px 20px',display:'flex',justifyContent:'space-between',alignItems:'center',fontSize:13,color:'var(--muted)'}}>
              <span>{filtered.length} danışan gösteriliyor</span>
            </div>
          </div>
        )}
      </div>

      {/* Detail modal */}
      {selected&&<ClientModal c={selected} onClose={()=>setSelected(null)}/>}

      {/* Add modal */}
      {showAddModal&&(
        <div onClick={e=>{if(e.target===e.currentTarget)setShowAddModal(false);}} style={{position:'fixed',inset:0,background:'rgba(30,42,26,0.5)',backdropFilter:'blur(4px)',zIndex:200,display:'flex',alignItems:'center',justifyContent:'center'}}>
          <div style={{background:'white',borderRadius:'var(--radius-xl)',padding:32,width:480,maxWidth:'95vw',boxShadow:'var(--shadow-xl)',animation:'scaleIn 0.3s cubic-bezier(0.34,1.56,0.64,1)'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:24}}>
              <span style={{fontFamily:'var(--font-display)',fontSize:22,fontWeight:500}}>Yeni Danışan</span>
              <button onClick={()=>setShowAddModal(false)} style={{width:32,height:32,borderRadius:'50%',background:'var(--sage-50)',border:'none',cursor:'pointer'}}>✕</button>
            </div>
            {[['Ad Soyad','name','text'],['Yaş','age','number'],['Telefon','phone','tel'],['E-posta','email','email'],['Hedef','goal','text']].map(([l,k,t])=>(
              <div key={k} style={{marginBottom:14}}>
                <label style={{fontSize:11,fontWeight:600,textTransform:'uppercase',letterSpacing:'0.8px',color:'var(--muted)',display:'block',marginBottom:5}}>{l}</label>
                <input type={t} value={newClient[k]} onChange={e=>setNewClient(p=>({...p,[k]:e.target.value}))} style={{width:'100%',padding:'10px 14px',border:'1px solid var(--border)',borderRadius:'var(--radius-md)',fontSize:14,outline:'none'}}/>
              </div>
            ))}
            <div style={{marginBottom:14}}>
              <label style={{fontSize:11,fontWeight:600,textTransform:'uppercase',letterSpacing:'0.8px',color:'var(--muted)',display:'block',marginBottom:5}}>Cinsiyet</label>
              <select value={newClient.gender} onChange={e=>setNewClient(p=>({...p,gender:e.target.value}))} style={{width:'100%',padding:'10px 14px',border:'1px solid var(--border)',borderRadius:'var(--radius-md)',fontSize:14,outline:'none'}}>
                <option value="K">Kadın</option><option value="E">Erkek</option>
              </select>
            </div>
            <div style={{marginBottom:14}}>
              <label style={{fontSize:11,fontWeight:600,textTransform:'uppercase',letterSpacing:'0.8px',color:'var(--muted)',display:'block',marginBottom:5}}>Program</label>
              <select value={newClient.program_id} onChange={e=>setNewClient(p=>({...p,program_id:Number(e.target.value)}))} style={{width:'100%',padding:'10px 14px',border:'1px solid var(--border)',borderRadius:'var(--radius-md)',fontSize:14,outline:'none'}}>
                {programs.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            <div style={{display:'flex',justifyContent:'flex-end',gap:10,marginTop:24,paddingTop:20,borderTop:'1px solid var(--border-light)'}}>
              <button onClick={()=>setShowAddModal(false)} style={{padding:'9px 20px',borderRadius:99,border:'1px solid var(--border)',background:'white',fontSize:13,fontWeight:500,cursor:'pointer'}}>İptal</button>
              <button onClick={()=>{toast('Danışan eklendi ✅','success');setShowAddModal(false);}} style={{padding:'9px 20px',borderRadius:99,background:'var(--primary)',color:'white',border:'none',fontSize:13,fontWeight:500,cursor:'pointer'}}>Kaydet</button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
