import { useState } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Tooltip, Legend, Filler } from 'chart.js';
import AppLayout from '../components/AppLayout';
import Topbar from '../components/Topbar';
import { useToast } from '../hooks/useToast';

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Tooltip, Legend, Filler);

// ─── GELİR & GİDER ─────────────────────────────────────
const transactions = [
  { id:1,  date:'17 Mar 2026', type:'gelir', desc:'Ayşe Yılmaz - Kontrol randevusu',     amount:500,  cat:'Randevu' },
  { id:2,  date:'17 Mar 2026', type:'gelir', desc:'Mert Kaya - İlk görüşme',             amount:800,  cat:'Randevu' },
  { id:3,  date:'16 Mar 2026', type:'gider', desc:'Ofis kira Mart',                      amount:3500, cat:'Kira' },
  { id:4,  date:'15 Mar 2026', type:'gelir', desc:'Neslihan Baş - Kontrol',              amount:500,  cat:'Randevu' },
  { id:5,  date:'15 Mar 2026', type:'gelir', desc:'Online program satışı × 3',           amount:1500, cat:'Program' },
  { id:6,  date:'14 Mar 2026', type:'gider', desc:'Terazi kalibrasyon servisi',          amount:450,  cat:'Ekipman' },
  { id:7,  date:'13 Mar 2026', type:'gelir', desc:'Can Doğan - Aylık paket',             amount:1200, cat:'Paket' },
  { id:8,  date:'12 Mar 2026', type:'gelir', desc:'Zeynep Arslan - Kontrol',             amount:500,  cat:'Randevu' },
  { id:9,  date:'12 Mar 2026', type:'gider', desc:'Ofis malzemeleri',                   amount:280,  cat:'Sarf' },
  { id:10, date:'11 Mar 2026', type:'gelir', desc:'Kerem Şahin - İlk görüşme',          amount:800,  cat:'Randevu' },
  { id:11, date:'10 Mar 2026', type:'gider', desc:'NutriFlow Pro abonelik',             amount:890,  cat:'Yazılım' },
  { id:12, date:'09 Mar 2026', type:'gelir', desc:'Emre Öztürk - Spor beslenme paketi', amount:1400, cat:'Paket' },
];

export function GelirGider() {
  const toast = useToast();
  const [filter, setFilter] = useState('tumu');
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ type:'gelir', desc:'', amount:'', cat:'Randevu', date:'' });

  const totalGelir = transactions.filter(t=>t.type==='gelir').reduce((s,t)=>s+t.amount,0);
  const totalGider = transactions.filter(t=>t.type==='gider').reduce((s,t)=>s+t.amount,0);
  const filtered = transactions.filter(t=>filter==='tumu'||t.type===filter);

  const monthlyData = { labels:['Eyl','Eki','Kas','Ara','Oca','Şub','Mar'], datasets:[
    { label:'Gelir', data:[14200,16800,15400,19200,21000,20400,24000], backgroundColor:'rgba(84,138,72,0.7)', borderRadius:5 },
    { label:'Gider', data:[5200,5800,5500,6100,5900,6200,5120], backgroundColor:'rgba(184,146,74,0.5)', borderRadius:5 },
  ]};
  const chartOpts = { responsive:true, maintainAspectRatio:false, plugins:{ legend:{position:'top'}, tooltip:{ backgroundColor:'#1e2a1a', callbacks:{ label:ctx=>`${ctx.dataset.label}: ₺${ctx.raw.toLocaleString('tr-TR')}` } } }, scales:{ x:{grid:{display:false},ticks:{color:'#6b7a65',font:{size:11}}}, y:{grid:{color:'rgba(0,0,0,0.04)'},ticks:{color:'#6b7a65',font:{size:11},callback:v=>'₺'+(v/1000)+'k'}} } };

  return (
    <AppLayout>
      <Topbar title="Gelir & Gider" subtitle="Finansal takip paneli"
        actions={<button onClick={()=>setShowAdd(true)} style={{padding:'8px 16px',borderRadius:99,background:'var(--primary)',color:'white',border:'none',fontSize:13,fontWeight:500,cursor:'pointer'}}>➕ İşlem Ekle</button>}
      />
      <div style={{padding:28,flex:1}}>
        {/* KPI */}
        <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:16,marginBottom:24}}>
          {[['💰','Mart Geliri','₺'+totalGelir.toLocaleString('tr-TR'),'↑ %18','#ecfdf5'],['📉','Mart Gideri','₺'+totalGider.toLocaleString('tr-TR'),'↑ %5','#fef2f2'],['📈','Net Kâr','₺'+(totalGelir-totalGider).toLocaleString('tr-TR'),'↑ %22','#e2f0f8'],['🎯','Kâr Marjı','%'+(((totalGelir-totalGider)/totalGelir)*100).toFixed(0),'stabil','var(--bej-100)']].map(([ic,l,v,tr,bg])=>(
            <div key={l} style={{background:'white',border:'1px solid var(--border-light)',borderRadius:'var(--radius-lg)',padding:22}}>
              <div style={{width:42,height:42,background:bg,borderRadius:'var(--radius-md)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:18,marginBottom:12}}>{ic}</div>
              <div style={{fontFamily:'var(--font-display)',fontSize:28,fontWeight:600,marginBottom:4}}>{v}</div>
              <div style={{fontSize:13,color:'var(--muted)',marginBottom:2}}>{l}</div>
              <div style={{fontSize:12,color:'var(--success)'}}>{tr}</div>
            </div>
          ))}
        </div>

        {/* Chart */}
        <div style={{background:'white',border:'1px solid var(--border-light)',borderRadius:'var(--radius-lg)',padding:24,marginBottom:20}}>
          <div style={{fontSize:14,fontWeight:600,marginBottom:16}}>Gelir / Gider Karşılaştırması</div>
          <div style={{height:220}}><Bar data={monthlyData} options={chartOpts}/></div>
        </div>

        {/* Transactions */}
        <div style={{background:'white',border:'1px solid var(--border-light)',borderRadius:'var(--radius-lg)',overflow:'hidden'}}>
          <div style={{padding:'16px 20px',borderBottom:'1px solid var(--border-light)',display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:10}}>
            <span style={{fontSize:14,fontWeight:600}}>İşlem Geçmişi</span>
            <div style={{display:'flex',gap:6}}>
              {[['tumu','Tümü'],['gelir','Gelir'],['gider','Gider']].map(([v,l])=>(
                <button key={v} onClick={()=>setFilter(v)} style={{padding:'6px 14px',borderRadius:99,fontSize:12,fontWeight:500,cursor:'pointer',border:'1px solid',borderColor:filter===v?'var(--sage-300)':'var(--border-light)',background:filter===v?'var(--sage-100)':'white',color:filter===v?'var(--sage-700)':'var(--muted)'}}>{l}</button>
              ))}
            </div>
          </div>
          <table style={{width:'100%',borderCollapse:'collapse'}}>
            <thead><tr>{['Tarih','Açıklama','Kategori','Tür','Tutar'].map(h=><th key={h} style={{fontSize:11,fontWeight:600,padding:'10px 16px',textAlign:'left',background:'var(--sage-50)',color:'var(--muted)'}}>{h}</th>)}</tr></thead>
            <tbody>
              {filtered.map((t,i)=>(
                <tr key={t.id} onMouseEnter={e=>e.currentTarget.style.background='var(--sage-50)'} onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                  <td style={{padding:'12px 16px',fontSize:12,color:'var(--muted)',fontFamily:'var(--font-mono)',borderBottom:'1px solid var(--border-light)'}}>{t.date}</td>
                  <td style={{padding:'12px 16px',fontSize:13,borderBottom:'1px solid var(--border-light)'}}>{t.desc}</td>
                  <td style={{padding:'12px 16px',borderBottom:'1px solid var(--border-light)'}}><span style={{padding:'2px 8px',borderRadius:99,fontSize:11,background:'var(--sage-50)',color:'var(--sage-700)'}}>{t.cat}</span></td>
                  <td style={{padding:'12px 16px',borderBottom:'1px solid var(--border-light)'}}><span style={{padding:'2px 8px',borderRadius:99,fontSize:11,background:t.type==='gelir'?'#ecfdf5':'#fef2f2',color:t.type==='gelir'?'#065f46':'#991b1b'}}>{t.type==='gelir'?'Gelir':'Gider'}</span></td>
                  <td style={{padding:'12px 16px',fontSize:14,fontWeight:700,color:t.type==='gelir'?'var(--success)':'var(--danger)',borderBottom:'1px solid var(--border-light)'}}>{t.type==='gelir'?'+':'-'}₺{t.amount.toLocaleString('tr-TR')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showAdd&&(
        <div onClick={e=>{if(e.target===e.currentTarget)setShowAdd(false);}} style={{position:'fixed',inset:0,background:'rgba(30,42,26,0.5)',backdropFilter:'blur(4px)',zIndex:200,display:'flex',alignItems:'center',justifyContent:'center'}}>
          <div style={{background:'white',borderRadius:'var(--radius-xl)',padding:32,width:420,maxWidth:'95vw',boxShadow:'var(--shadow-xl)',animation:'scaleIn 0.3s cubic-bezier(0.34,1.56,0.64,1)'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:24}}>
              <span style={{fontFamily:'var(--font-display)',fontSize:22,fontWeight:500}}>İşlem Ekle</span>
              <button onClick={()=>setShowAdd(false)} style={{width:32,height:32,borderRadius:'50%',background:'var(--sage-50)',border:'none',cursor:'pointer'}}>✕</button>
            </div>
            <div style={{marginBottom:14}}>
              <label style={{fontSize:11,fontWeight:600,textTransform:'uppercase',letterSpacing:'0.8px',color:'var(--muted)',display:'block',marginBottom:5}}>Tür</label>
              <div style={{display:'flex',gap:10}}>
                {['gelir','gider'].map(v=><button key={v} onClick={()=>setForm(p=>({...p,type:v}))} style={{flex:1,padding:'10px',borderRadius:'var(--radius-md)',border:`2px solid ${form.type===v?'var(--primary)':'var(--border)'}`,background:form.type===v?'var(--sage-50)':'white',fontWeight:600,fontSize:13,cursor:'pointer',color:form.type===v?'var(--primary)':'var(--muted)'}}>{v.charAt(0).toUpperCase()+v.slice(1)}</button>)}
              </div>
            </div>
            {[['Açıklama','desc','text'],['Tutar (₺)','amount','number'],['Tarih','date','date']].map(([l,k,t])=>(
              <div key={k} style={{marginBottom:14}}>
                <label style={{fontSize:11,fontWeight:600,textTransform:'uppercase',letterSpacing:'0.8px',color:'var(--muted)',display:'block',marginBottom:5}}>{l}</label>
                <input type={t} value={form[k]} onChange={e=>setForm(p=>({...p,[k]:e.target.value}))} style={{width:'100%',padding:'10px 14px',border:'1px solid var(--border)',borderRadius:'var(--radius-md)',fontSize:14,outline:'none'}}/>
              </div>
            ))}
            <div style={{display:'flex',justifyContent:'flex-end',gap:10,marginTop:16,paddingTop:16,borderTop:'1px solid var(--border-light)'}}>
              <button onClick={()=>setShowAdd(false)} style={{padding:'9px 20px',borderRadius:99,border:'1px solid var(--border)',background:'white',fontSize:13,fontWeight:500,cursor:'pointer'}}>İptal</button>
              <button onClick={()=>{toast('İşlem kaydedildi ✅','success');setShowAdd(false);}} style={{padding:'9px 20px',borderRadius:99,background:'var(--primary)',color:'white',border:'none',fontSize:13,fontWeight:500,cursor:'pointer'}}>Kaydet</button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}

// ─── RAPORLAR ──────────────────────────────────────────
export function Raporlar() {
  const toast = useToast();
  const lineData = { labels:['Oca','Şub','Mar','Nis','May','Haz','Tem','Ağu','Eyl','Eki','Kas','Ara'],
    datasets:[
      { label:'Aktif Danışan', data:[28,32,35,38,40,38,42,44,43,45,46,48], borderColor:'#548a48', backgroundColor:'rgba(84,138,72,0.1)', fill:true, tension:0.4 },
      { label:'Yeni Danışan', data:[4,5,4,4,3,2,5,3,1,3,2,6], borderColor:'#b8924a', backgroundColor:'rgba(184,146,74,0.1)', fill:true, tension:0.4 },
    ]};
  const lineOpts = { responsive:true, maintainAspectRatio:false, plugins:{ legend:{position:'top'}, tooltip:{backgroundColor:'#1e2a1a'} }, scales:{ x:{grid:{display:false},ticks:{color:'#6b7a65',font:{size:11}}}, y:{grid:{color:'rgba(0,0,0,0.04)'},ticks:{color:'#6b7a65',font:{size:11}}} } };

  const reports = [
    { title:'Mart 2026 Aylık Raporu', desc:'Danışan analizi, gelir ve randevu istatistikleri', date:'17 Mar 2026', type:'Aylık', icon:'📅' },
    { title:'Q1 2026 Çeyrek Raporu', desc:'Ocak-Mart dönemi kapsamlı performans raporu', date:'31 Mar 2026', type:'Çeyreklik', icon:'📊' },
    { title:'Danışan Başarı Raporu', desc:'Hedef başarı oranları ve kilo değişim analizi', date:'17 Mar 2026', type:'Analiz', icon:'🎯' },
    { title:'Gelir Analiz Raporu', desc:'Mart 2026 gelir-gider detaylı döküm', date:'17 Mar 2026', type:'Finansal', icon:'💰' },
  ];

  return (
    <AppLayout>
      <Topbar title="Raporlar" subtitle="Klinik performans analizleri"
        actions={<button onClick={()=>toast('Rapor oluşturuluyor...','info')} style={{padding:'8px 16px',borderRadius:99,background:'var(--primary)',color:'white',border:'none',fontSize:13,fontWeight:500,cursor:'pointer'}}>📄 Yeni Rapor</button>}
      />
      <div style={{padding:28,flex:1}}>
        {/* Summary cards */}
        <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:16,marginBottom:24}}>
          {[['👥','48','Aktif Danışan','Bu yılki en yüksek'],['🎯','%94','Başarı Oranı','↑ 4% geçen aya göre'],['📅','156','Toplam Randevu','Bu yıl yapılan'],['⭐','4.9','Müşteri Puanı','48 değerlendirme']].map(([ic,v,l,s])=>(
            <div key={l} style={{background:'white',border:'1px solid var(--border-light)',borderRadius:'var(--radius-lg)',padding:22}}>
              <div style={{fontSize:28,marginBottom:8}}>{ic}</div>
              <div style={{fontFamily:'var(--font-display)',fontSize:32,fontWeight:600,marginBottom:4,lineHeight:1}}>{v}</div>
              <div style={{fontSize:13,fontWeight:600,marginBottom:2}}>{l}</div>
              <div style={{fontSize:12,color:'var(--muted)'}}>{s}</div>
            </div>
          ))}
        </div>

        {/* Chart */}
        <div style={{background:'white',border:'1px solid var(--border-light)',borderRadius:'var(--radius-lg)',padding:24,marginBottom:24}}>
          <div style={{fontSize:14,fontWeight:600,marginBottom:16}}>Danışan Büyüme Trendi (2026)</div>
          <div style={{height:220}}><Line data={lineData} options={lineOpts}/></div>
        </div>

        {/* Report list */}
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))',gap:16}}>
          {reports.map((r,i)=>(
            <div key={i} style={{background:'white',border:'1px solid var(--border-light)',borderRadius:'var(--radius-lg)',padding:24,transition:'all 0.2s'}}
              onMouseEnter={e=>{e.currentTarget.style.boxShadow='var(--shadow-md)';e.currentTarget.style.transform='translateY(-2px)'}} onMouseLeave={e=>{e.currentTarget.style.boxShadow='none';e.currentTarget.style.transform='none'}}>
              <div style={{fontSize:36,marginBottom:14}}>{r.icon}</div>
              <div style={{fontSize:15,fontWeight:600,marginBottom:6}}>{r.title}</div>
              <div style={{fontSize:13,color:'var(--muted)',marginBottom:12,lineHeight:1.5}}>{r.desc}</div>
              <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:14}}>
                <span style={{padding:'2px 8px',borderRadius:99,fontSize:11,background:'var(--sage-100)',color:'var(--sage-700)'}}>{r.type}</span>
                <span style={{fontSize:11,color:'var(--muted)'}}>{r.date}</span>
              </div>
              <div style={{display:'flex',gap:8}}>
                <button onClick={()=>toast('Rapor indiriliyor...','info')} style={{flex:1,padding:'8px',borderRadius:99,background:'var(--primary)',color:'white',border:'none',fontSize:12,fontWeight:500,cursor:'pointer'}}>📥 İndir</button>
                <button onClick={()=>toast('Rapor görüntüleniyor...','info')} style={{flex:1,padding:'8px',borderRadius:99,background:'white',border:'1px solid var(--border)',fontSize:12,fontWeight:500,cursor:'pointer'}}>👁 Görüntüle</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}

// ─── WEB SİTEM ─────────────────────────────────────────
export function WebSitem() {
  const toast = useToast();
  const [activeSection, setActiveSection] = useState('genel');
  const [settings, setSettings] = useState({ siteName:'Dr. Derya Koç Diyetisyenlik', slug:'derya-koc', tagline:'Sağlıklı beslenme için profesyonel rehberlik', about:'10 yılı aşkın deneyimim ile kişiye özel beslenme programları hazırlıyor, sağlıklı yaşam yolculuğunuzda size rehberlik ediyorum.', phone:'0532 000 0001', email:'derya@nutriflow.com', instagram:'', bookingEnabled:true, onlineEnabled:true });

  const sections = [['genel','⚙️','Genel'],['icerik','✏️','İçerik'],['gorunum','🎨','Görünüm'],['rezervasyon','📅','Rezervasyon']];
  const themes = [['Yeşil & Bej','linear-gradient(135deg,#3e6b34,#b8924a)'],['Mavi & Beyaz','linear-gradient(135deg,#1e40af,#60a5fa)'],['Mor & Pembe','linear-gradient(135deg,#7c3aed,#ec4899)'],['Turuncu & Kahve','linear-gradient(135deg,#c2410c,#92400e)']];

  return (
    <AppLayout>
      <Topbar title="Web Sitem" subtitle="Klinik web sitenizi yönetin"
        actions={
          <div style={{display:'flex',gap:8}}>
            <button onClick={()=>toast('Önizleme açılıyor...','info')} style={{padding:'8px 16px',borderRadius:99,background:'white',border:'1px solid var(--border)',fontSize:13,fontWeight:500,cursor:'pointer'}}>👁 Önizle</button>
            <button onClick={()=>toast('Değişiklikler kaydedildi ✅','success')} style={{padding:'8px 16px',borderRadius:99,background:'var(--primary)',color:'white',border:'none',fontSize:13,fontWeight:500,cursor:'pointer'}}>💾 Yayınla</button>
          </div>
        }
      />
      <div style={{display:'flex',flex:1,overflow:'hidden'}}>
        {/* Left nav */}
        <div style={{width:220,flexShrink:0,background:'var(--surface)',borderRight:'1px solid var(--border-light)',padding:12}}>
          {sections.map(([k,ic,l])=>(
            <div key={k} onClick={()=>setActiveSection(k)}
              style={{display:'flex',alignItems:'center',gap:10,padding:'10px 12px',borderRadius:'var(--radius-md)',cursor:'pointer',marginBottom:4,background:activeSection===k?'var(--sage-50)':'transparent',color:activeSection===k?'var(--primary)':'var(--muted)',fontWeight:activeSection===k?600:400,fontSize:14,transition:'all 0.15s',border:`1px solid ${activeSection===k?'var(--sage-200)':'transparent'}`}}
              onMouseEnter={e=>{if(activeSection!==k)e.currentTarget.style.background='var(--sage-50)'}} onMouseLeave={e=>{if(activeSection!==k)e.currentTarget.style.background='transparent'}}>
              {ic} {l}
            </div>
          ))}
          <div style={{marginTop:24,padding:'12px',background:'var(--sage-50)',borderRadius:'var(--radius-md)'}}>
            <div style={{fontSize:11,fontWeight:600,color:'var(--muted)',marginBottom:6}}>Site Adresiniz</div>
            <div style={{fontSize:12,color:'var(--primary)',wordBreak:'break-all'}}>nutriflow.app/{settings.slug}</div>
            <div style={{marginTop:8,display:'flex',alignItems:'center',gap:4}}><div style={{width:6,height:6,borderRadius:'50%',background:'var(--success)'}}></div><span style={{fontSize:11,color:'var(--success)'}}>Yayında</span></div>
          </div>
        </div>

        {/* Right content */}
        <div style={{flex:1,overflowY:'auto',padding:28}}>
          {activeSection==='genel'&&(
            <>
              <h2 style={{fontFamily:'var(--font-display)',fontSize:24,fontWeight:500,marginBottom:20}}>Genel Ayarlar</h2>
              {[['Site Başlığı','siteName'],['URL Slug','slug'],['Kısa Açıklama','tagline'],['Telefon','phone'],['E-posta','email'],['Instagram','instagram']].map(([l,k])=>(
                <div key={k} style={{marginBottom:16}}>
                  <label style={{fontSize:12,fontWeight:600,color:'var(--muted)',display:'block',marginBottom:6}}>{l}</label>
                  <input value={settings[k]} onChange={e=>setSettings(p=>({...p,[k]:e.target.value}))} style={{width:'100%',maxWidth:480,padding:'10px 14px',border:'1px solid var(--border)',borderRadius:'var(--radius-md)',fontSize:14,outline:'none'}}/>
                </div>
              ))}
            </>
          )}
          {activeSection==='icerik'&&(
            <>
              <h2 style={{fontFamily:'var(--font-display)',fontSize:24,fontWeight:500,marginBottom:20}}>İçerik Yönetimi</h2>
              <div style={{marginBottom:16}}>
                <label style={{fontSize:12,fontWeight:600,color:'var(--muted)',display:'block',marginBottom:6}}>Hakkımda</label>
                <textarea value={settings.about} onChange={e=>setSettings(p=>({...p,about:e.target.value}))} rows={4} style={{width:'100%',maxWidth:560,padding:'10px 14px',border:'1px solid var(--border)',borderRadius:'var(--radius-md)',fontSize:14,outline:'none',resize:'vertical',fontFamily:'var(--font-body)'}}/>
              </div>
              <div style={{marginBottom:20}}>
                <label style={{fontSize:12,fontWeight:600,color:'var(--muted)',display:'block',marginBottom:10}}>Uzmanlık Alanları</label>
                <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
                  {['Kilo Yönetimi','Spor Beslenmesi','Çocuk Beslenmesi','Diyabet Diyeti','Kalp Sağlığı','Vegan Beslenme'].map(tag=>(
                    <span key={tag} onClick={()=>toast(`${tag} ${settings.about.includes(tag)?'kaldırıldı':'eklendi'}`,'info')} style={{padding:'6px 14px',borderRadius:99,fontSize:13,background:'var(--sage-100)',color:'var(--sage-700)',cursor:'pointer',transition:'all 0.15s'}}
                      onMouseEnter={e=>{e.currentTarget.style.background='var(--sage-200)'}} onMouseLeave={e=>{e.currentTarget.style.background='var(--sage-100)'}}>{tag} ✓</span>
                  ))}
                </div>
              </div>
            </>
          )}
          {activeSection==='gorunum'&&(
            <>
              <h2 style={{fontFamily:'var(--font-display)',fontSize:24,fontWeight:500,marginBottom:20}}>Tema & Görünüm</h2>
              <div style={{marginBottom:20}}>
                <label style={{fontSize:12,fontWeight:600,color:'var(--muted)',display:'block',marginBottom:12}}>Renk Teması</label>
                <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:12,maxWidth:480}}>
                  {themes.map(([name,grad],i)=>(
                    <div key={name} onClick={()=>toast(`"${name}" teması seçildi`,'success')} style={{cursor:'pointer',borderRadius:'var(--radius-md)',overflow:'hidden',border:`2px solid ${i===0?'var(--primary)':'var(--border-light)'}`,transition:'all 0.15s'}}>
                      <div style={{height:48,background:grad}}/>
                      <div style={{padding:'6px 8px',fontSize:11,fontWeight:500,textAlign:'center',background:'white'}}>{name}</div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
          {activeSection==='rezervasyon'&&(
            <>
              <h2 style={{fontFamily:'var(--font-display)',fontSize:24,fontWeight:500,marginBottom:20}}>Rezervasyon Ayarları</h2>
              {[['Online Randevu Aktif','bookingEnabled','Web sitenizden online randevu alınabilsin'],['Online Görüşme','onlineEnabled','Video görüşme seçeneği gösterilsin']].map(([l,k,desc])=>(
                <div key={k} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:16,background:'white',border:'1px solid var(--border-light)',borderRadius:'var(--radius-lg)',marginBottom:12}}>
                  <div><div style={{fontSize:14,fontWeight:600,marginBottom:2}}>{l}</div><div style={{fontSize:12,color:'var(--muted)'}}>{desc}</div></div>
                  <div onClick={()=>setSettings(p=>({...p,[k]:!p[k]}))} style={{width:44,height:24,borderRadius:99,background:settings[k]?'var(--primary)':'var(--border)',cursor:'pointer',position:'relative',transition:'background 0.3s'}}>
                    <div style={{position:'absolute',top:3,left:settings[k]?22:3,width:18,height:18,borderRadius:'50%',background:'white',boxShadow:'0 1px 3px rgba(0,0,0,0.2)',transition:'left 0.3s'}}/>
                  </div>
                </div>
              ))}
              <div style={{marginTop:16}}>
                <label style={{fontSize:12,fontWeight:600,color:'var(--muted)',display:'block',marginBottom:10}}>Randevu Saatleri</label>
                <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:8}}>
                  {['09:00','10:00','11:00','12:00','14:00','15:00','16:00','17:00'].map(t=>(
                    <button key={t} onClick={()=>toast(`${t} ${['09:00','10:00','14:00','16:00'].includes(t)?'kapatıldı':'açıldı'}`,'info')} style={{padding:'10px',borderRadius:'var(--radius-md)',fontSize:13,fontWeight:500,cursor:'pointer',border:`1px solid ${['09:00','10:00','14:00','16:00'].includes(t)?'var(--sage-200)':'var(--border)'}`,background:['09:00','10:00','14:00','16:00'].includes(t)?'var(--sage-50)':'white',color:['09:00','10:00','14:00','16:00'].includes(t)?'var(--sage-700)':'var(--muted)'}}>{t}</button>
                  ))}
                </div>
              </div>
            </>
          )}
          <div style={{marginTop:24}}>
            <button onClick={()=>toast('Değişiklikler kaydedildi ✅','success')} style={{padding:'10px 24px',borderRadius:99,background:'var(--primary)',color:'white',border:'none',fontSize:13,fontWeight:500,cursor:'pointer'}}>💾 Değişiklikleri Kaydet</button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

// ─── AYARLAR ───────────────────────────────────────────
export function Ayarlar() {
  const toast = useToast();
  const [tab, setTab] = useState('profil');
  const [profil, setProfil] = useState({ name:'Dr. Derya Koç', title:'Diyetisyen', email:'derya.koc@nutriflow.com', phone:'0532 000 0001', bio:'Beslenme ve diyetetik alanında 10 yıllık deneyim.', city:'İstanbul' });
  const [notif, setNotif] = useState({ emailRandevu:true, smsRandevu:true, emailOlcum:false, emailRapor:true, pushBildirim:true });

  const tabs = [['profil','👤','Profil'],['bildirim','🔔','Bildirimler'],['guvenlik','🔒','Güvenlik'],['plan','💳','Plan & Fatura']];

  return (
    <AppLayout>
      <Topbar title="Ayarlar" subtitle="Hesap ve sistem ayarları" />
      <div style={{padding:28,flex:1}}>
        <div style={{display:'flex',gap:24,flex:1}}>
          {/* Tab list */}
          <div style={{width:200,flexShrink:0}}>
            {tabs.map(([k,ic,l])=>(
              <div key={k} onClick={()=>setTab(k)}
                style={{display:'flex',alignItems:'center',gap:10,padding:'10px 14px',borderRadius:'var(--radius-md)',cursor:'pointer',marginBottom:4,background:tab===k?'var(--sage-50)':'transparent',color:tab===k?'var(--primary)':'var(--muted)',fontWeight:tab===k?600:400,fontSize:14,border:`1px solid ${tab===k?'var(--sage-200)':'transparent'}`,transition:'all 0.15s'}}
                onMouseEnter={e=>{if(tab!==k)e.currentTarget.style.background='var(--sage-50)'}} onMouseLeave={e=>{if(tab!==k)e.currentTarget.style.background='transparent'}}>
                {ic} {l}
              </div>
            ))}
          </div>

          {/* Content */}
          <div style={{flex:1,maxWidth:600}}>
            {tab==='profil'&&(
              <div style={{background:'white',border:'1px solid var(--border-light)',borderRadius:'var(--radius-xl)',padding:28}}>
                <div style={{display:'flex',alignItems:'center',gap:16,marginBottom:24,paddingBottom:24,borderBottom:'1px solid var(--border-light)'}}>
                  <div style={{width:72,height:72,borderRadius:'50%',background:'linear-gradient(135deg,var(--sage-400),var(--sage-600))',display:'flex',alignItems:'center',justifyContent:'center',fontSize:24,fontWeight:700,color:'white'}}>DK</div>
                  <div>
                    <div style={{fontSize:18,fontWeight:600,marginBottom:2}}>{profil.name}</div>
                    <div style={{fontSize:13,color:'var(--muted)',marginBottom:8}}>{profil.title} · {profil.city}</div>
                    <button onClick={()=>toast('Fotoğraf yükleme açılıyor...','info')} style={{padding:'6px 14px',borderRadius:99,border:'1px solid var(--border)',background:'white',fontSize:12,cursor:'pointer'}}>📷 Fotoğraf Değiştir</button>
                  </div>
                </div>
                {[['Ad Soyad','name'],['Unvan','title'],['E-posta','email'],['Telefon','phone'],['Şehir','city']].map(([l,k])=>(
                  <div key={k} style={{marginBottom:14}}>
                    <label style={{fontSize:11,fontWeight:600,textTransform:'uppercase',letterSpacing:'0.8px',color:'var(--muted)',display:'block',marginBottom:5}}>{l}</label>
                    <input value={profil[k]} onChange={e=>setProfil(p=>({...p,[k]:e.target.value}))} style={{width:'100%',padding:'10px 14px',border:'1px solid var(--border)',borderRadius:'var(--radius-md)',fontSize:14,outline:'none',transition:'border-color 0.15s'}} onFocus={e=>e.target.style.borderColor='var(--primary)'} onBlur={e=>e.target.style.borderColor='var(--border)'}/>
                  </div>
                ))}
                <div style={{marginBottom:14}}>
                  <label style={{fontSize:11,fontWeight:600,textTransform:'uppercase',letterSpacing:'0.8px',color:'var(--muted)',display:'block',marginBottom:5}}>Bio</label>
                  <textarea value={profil.bio} onChange={e=>setProfil(p=>({...p,bio:e.target.value}))} rows={3} style={{width:'100%',padding:'10px 14px',border:'1px solid var(--border)',borderRadius:'var(--radius-md)',fontSize:14,outline:'none',resize:'vertical',fontFamily:'var(--font-body)'}}/>
                </div>
                <button onClick={()=>toast('Profil güncellendi ✅','success')} style={{padding:'10px 24px',borderRadius:99,background:'var(--primary)',color:'white',border:'none',fontSize:13,fontWeight:500,cursor:'pointer'}}>💾 Değişiklikleri Kaydet</button>
              </div>
            )}
            {tab==='bildirim'&&(
              <div style={{background:'white',border:'1px solid var(--border-light)',borderRadius:'var(--radius-xl)',padding:28}}>
                <h3 style={{fontFamily:'var(--font-display)',fontSize:20,fontWeight:500,marginBottom:20}}>Bildirim Tercihleri</h3>
                {[['emailRandevu','E-posta','Randevu hatırlatmaları'],['smsRandevu','SMS','Randevu hatırlatmaları'],['emailOlcum','E-posta','Ölçüm girişi hatırlatmaları'],['emailRapor','E-posta','Haftalık özet raporu'],['pushBildirim','Uygulama','Anlık bildirimler']].map(([k,ch,desc])=>(
                  <div key={k} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'14px 0',borderBottom:'1px solid var(--border-light)'}}>
                    <div>
                      <div style={{fontSize:14,fontWeight:500,marginBottom:2}}>{desc}</div>
                      <div style={{fontSize:12,color:'var(--muted)'}}>{ch}</div>
                    </div>
                    <div onClick={()=>setNotif(p=>({...p,[k]:!p[k]}))} style={{width:44,height:24,borderRadius:99,background:notif[k]?'var(--primary)':'var(--border)',cursor:'pointer',position:'relative',transition:'background 0.3s',flexShrink:0}}>
                      <div style={{position:'absolute',top:3,left:notif[k]?22:3,width:18,height:18,borderRadius:'50%',background:'white',boxShadow:'0 1px 3px rgba(0,0,0,0.2)',transition:'left 0.3s'}}/>
                    </div>
                  </div>
                ))}
                <button onClick={()=>toast('Bildirim ayarları kaydedildi ✅','success')} style={{marginTop:20,padding:'10px 24px',borderRadius:99,background:'var(--primary)',color:'white',border:'none',fontSize:13,fontWeight:500,cursor:'pointer'}}>💾 Kaydet</button>
              </div>
            )}
            {tab==='guvenlik'&&(
              <div style={{background:'white',border:'1px solid var(--border-light)',borderRadius:'var(--radius-xl)',padding:28}}>
                <h3 style={{fontFamily:'var(--font-display)',fontSize:20,fontWeight:500,marginBottom:20}}>Güvenlik</h3>
                {[['Mevcut Şifre','password','password'],['Yeni Şifre','newpw','password'],['Şifreyi Onayla','confirmpw','password']].map(([l,k,t])=>(
                  <div key={k} style={{marginBottom:14}}>
                    <label style={{fontSize:11,fontWeight:600,textTransform:'uppercase',letterSpacing:'0.8px',color:'var(--muted)',display:'block',marginBottom:5}}>{l}</label>
                    <input type={t} placeholder="••••••••" style={{width:'100%',padding:'10px 14px',border:'1px solid var(--border)',borderRadius:'var(--radius-md)',fontSize:14,outline:'none'}} onFocus={e=>e.target.style.borderColor='var(--primary)'} onBlur={e=>e.target.style.borderColor='var(--border)'}/>
                  </div>
                ))}
                <button onClick={()=>toast('Şifre değiştirildi ✅','success')} style={{padding:'10px 24px',borderRadius:99,background:'var(--primary)',color:'white',border:'none',fontSize:13,fontWeight:500,cursor:'pointer'}}>🔒 Şifreyi Güncelle</button>
                <div style={{marginTop:24,padding:16,background:'#fef2f2',borderRadius:'var(--radius-md)',border:'1px solid #fecaca'}}>
                  <div style={{fontSize:14,fontWeight:600,color:'var(--danger)',marginBottom:4}}>Tehlikeli Bölge</div>
                  <div style={{fontSize:13,color:'var(--muted)',marginBottom:12}}>Hesabınızı kalıcı olarak silebilirsiniz. Bu işlem geri alınamaz.</div>
                  <button onClick={()=>toast('Bu işlem için destek ekibine başvurun','warning')} style={{padding:'8px 16px',borderRadius:99,background:'var(--danger)',color:'white',border:'none',fontSize:12,fontWeight:500,cursor:'pointer'}}>Hesabı Sil</button>
                </div>
              </div>
            )}
            {tab==='plan'&&(
              <div>
                <div style={{background:'var(--charcoal)',borderRadius:'var(--radius-xl)',padding:28,marginBottom:16,position:'relative',overflow:'hidden'}}>
                  <div style={{position:'absolute',inset:0,background:'radial-gradient(circle at 70% 50%,rgba(84,138,72,0.3) 0%,transparent 60%)'}}/>
                  <div style={{position:'relative',zIndex:1}}>
                    <div style={{fontSize:11,fontWeight:600,textTransform:'uppercase',letterSpacing:1.5,color:'rgba(255,255,255,0.5)',marginBottom:8}}>Aktif Plan</div>
                    <div style={{fontFamily:'var(--font-display)',fontSize:32,fontWeight:600,color:'white',marginBottom:4}}>Pro Plan</div>
                    <div style={{fontSize:28,color:'white',marginBottom:16}}><span style={{fontFamily:'var(--font-display)',fontSize:48}}>₺890</span><span style={{fontSize:14,opacity:0.6}}>/ay</span></div>
                    <div style={{fontSize:13,color:'rgba(255,255,255,0.6)',marginBottom:20}}>Bir sonraki fatura: 17 Nisan 2026</div>
                    <button onClick={()=>toast('Fatura yönetimine yönlendiriliyorsunuz...','info')} style={{padding:'10px 22px',borderRadius:99,background:'rgba(255,255,255,0.15)',color:'white',border:'1px solid rgba(255,255,255,0.3)',fontSize:13,fontWeight:500,cursor:'pointer'}}>Faturalarım →</button>
                  </div>
                </div>
                <div style={{background:'white',border:'1px solid var(--border-light)',borderRadius:'var(--radius-xl)',padding:24}}>
                  <div style={{fontSize:14,fontWeight:600,marginBottom:16}}>Plan Özellikleri</div>
                  {['Sınırsız danışan','Gelişmiş ölçüm analizleri','Kişisel klinik web sitesi','Gelir & gider takibi','Excel entegrasyonu','500+ tarif kütüphanesi','Öncelikli destek'].map(f=>(
                    <div key={f} style={{display:'flex',alignItems:'center',gap:10,padding:'10px 0',borderBottom:'1px solid var(--border-light)'}}>
                      <div style={{width:18,height:18,background:'var(--sage-100)',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:10,color:'var(--sage-700)',flexShrink:0}}>✓</div>
                      <span style={{fontSize:14}}>{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
