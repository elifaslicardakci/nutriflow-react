import { useNavigate } from 'react-router-dom';

export default function Landing() {
  const navigate = useNavigate();
  return (
    <div style={{minHeight:'100vh',background:'linear-gradient(135deg,var(--sage-50) 0%,white 50%,var(--sage-50) 100%)',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:'40px 20px'}}>
      <div style={{textAlign:'center',maxWidth:600}}>
        <div style={{width:72,height:72,background:'var(--primary)',borderRadius:20,display:'flex',alignItems:'center',justifyContent:'center',fontSize:32,margin:'0 auto 24px',boxShadow:'var(--shadow-md)'}}>🌿</div>
        <h1 style={{fontFamily:'var(--font-display)',fontSize:'clamp(32px,5vw,52px)',fontWeight:700,color:'var(--charcoal)',marginBottom:16,lineHeight:1.15}}>
          Nutri<span style={{color:'var(--primary)'}}>Flow</span>
        </h1>
        <p style={{fontSize:18,color:'var(--muted)',marginBottom:40,lineHeight:1.7}}>
          Modern clinic management platform developed for dietitians.
          Manage your clients, appointments and nutrition programs all in one place.
        </p>
        <div style={{display:'flex',gap:16,justifyContent:'center',flexWrap:'wrap'}}>
          <button onClick={()=>navigate('/dashboard')} style={{padding:'14px 32px',background:'var(--primary)',color:'white',border:'none',borderRadius:'var(--radius-md)',fontSize:16,fontWeight:600,cursor:'pointer',boxShadow:'var(--shadow-md)'}}>
            Open App →
          </button>
          <button style={{padding:'14px 32px',background:'white',color:'var(--charcoal)',border:'1px solid var(--border)',borderRadius:'var(--radius-md)',fontSize:16,fontWeight:600,cursor:'pointer'}}>
            Learn More
          </button>
        </div>
        <p style={{marginTop:40,fontSize:13,color:'var(--muted)'}}>
          ✓ Start for free &nbsp; ✓ No credit card required &nbsp; ✓ Setup in 5 minutes
        </p>
      </div>
    </div>
  );
}