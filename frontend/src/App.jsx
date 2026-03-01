import { useState, useEffect, useRef } from "react";

const API = "";

const EXAMPLES = [
  { id: "irs", label: "IRS Scam", tag: "fraud", text: "Hello, this is the IRS. We have detected suspicious activity on your tax account. You owe $5,000 in back taxes. If you do not pay immediately using gift cards, a warrant will be issued for your arrest. Do not hang up." },
  { id: "tech", label: "Tech Support", tag: "fraud", text: "This is Microsoft Tech Support. We detected a critical virus stealing your banking information. Give me your password and remote access immediately to fix it." },
  { id: "lottery", label: "Lottery", tag: "fraud", text: "Congratulations! You are the lucky winner of our $1,000,000 lottery. We need your bank account number and routing number to deposit the winnings immediately." },
  { id: "ssn", label: "SSN Scam", tag: "fraud", text: "This is Officer Johnson from the Social Security Administration. Your SSN has been suspended. I need your social security number and date of birth for verification immediately." },
  { id: "doctor", label: "Doctor", tag: "normal", text: "Hi, this is Dr. Smith's office calling to remind you about your dental appointment tomorrow at 3 PM. Please call us back if you need to reschedule. Have a great day!" },
  { id: "delivery", label: "Delivery", tag: "normal", text: "Hello, this is FedEx delivery services. We attempted to deliver a package today but no one was home. You can schedule a redelivery or pick it up at our facility." },
  { id: "school", label: "School", tag: "normal", text: "Hi, this is your daughter's school. The parent-teacher conference is scheduled for next Friday. Please let us know if you can attend." },
  { id: "job", label: "Job Call", tag: "normal", text: "Hello, calling from ABC Company about your Software Engineer application. We were impressed and would like to schedule a phone interview at your convenience." },
];

function Gauge({ score, animate }) {
  const pct = Math.round(score * 100);
  const fraud = score >= 0.5;
  const color = fraud ? "#ff3b3b" : "#00e09e";
  const r = 58, cx = 65, cy = 65, circ = 2 * Math.PI * r, arc = circ * 0.75;
  const offset = animate ? arc - score * arc : arc;
  return (
    <div style={{ width: 150, margin: "0 auto" }}>
      <svg viewBox="0 0 130 110" style={{ width: "100%", overflow: "visible" }}>
        <defs><filter id="gl"><feGaussianBlur stdDeviation="3" result="g" /><feMerge><feMergeNode in="g" /><feMergeNode in="SourceGraphic" /></feMerge></filter></defs>
        <path d={`M ${cx-r} ${cy} A ${r} ${r} 0 1 1 ${cx+r} ${cy}`} fill="none" stroke="#1a2332" strokeWidth="10" strokeLinecap="round" />
        <path d={`M ${cx-r} ${cy} A ${r} ${r} 0 1 1 ${cx+r} ${cy}`} fill="none" stroke={color} strokeWidth="10" strokeLinecap="round"
          strokeDasharray={arc} strokeDashoffset={offset} filter="url(#gl)"
          style={{ transition: "stroke-dashoffset 1.4s cubic-bezier(0.22,1,0.36,1), stroke 0.4s" }} />
        <text x={cx} y={cy-6} textAnchor="middle" fill={color} style={{ fontSize: 32, fontWeight: 800, fontFamily: "'Outfit',sans-serif" }}>{pct}</text>
        <text x={cx} y={cy+14} textAnchor="middle" fill="#546a7b" style={{ fontSize: 10, fontWeight: 600, letterSpacing: 2.5, fontFamily: "'Outfit',sans-serif" }}>RISK</text>
      </svg>
    </div>
  );
}

function Scan({ on }) {
  if (!on) return null;
  return (<div style={{ position:"absolute",inset:0,borderRadius:10,overflow:"hidden",pointerEvents:"none",zIndex:2 }}>
    <div style={{ position:"absolute",left:0,right:0,height:2,background:"linear-gradient(90deg,transparent,#00e09e,transparent)",animation:"scan 1.8s ease-in-out infinite",boxShadow:"0 0 20px #00e09e" }} /></div>);
}

export default function App() {
  const [text, setText] = useState("");
  const [mode, setMode] = useState("baseline");
  const [lang, setLang] = useState("en");
  const [result, setResult] = useState(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState(null);
  const [apiOk, setApiOk] = useState(null);
  const [hist, setHist] = useState([]);
  const [fb, setFb] = useState(null);
  const [anim, setAnim] = useState(false);
  const [tab, setTab] = useState("analyze");
  const ref = useRef(null);

  useEffect(() => { fetch(`${API}/health`).then(r=>r.json()).then(d=>setApiOk(d.status==="ok")).catch(()=>setApiOk(false)); }, []);

  const analyze = async () => {
    if (!text.trim() || text.trim().length < 10) { setErr("Enter at least 10 characters"); return; }
    setBusy(true); setErr(null); setResult(null); setFb(null); setAnim(false);
    try {
      const r = await fetch(`${API}/predict`, { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({transcript:text.trim(),language:lang,mode}) });
      if (!r.ok) { const e = await r.json().catch(()=>null); throw new Error(e?.detail||`Error ${r.status}`); }
      const d = await r.json(); setResult(d); setHist(p=>[d,...p].slice(0,30)); setTimeout(()=>setAnim(true),50);
    } catch(e) { setErr(e.message); } finally { setBusy(false); }
  };

  const sendFb = async (trueLabel) => {
    if (!result) return;
    try { await fetch(`${API}/feedback`, { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({transcript:text.trim(),predicted_label:result.label,true_label:trueLabel}) }); setFb(`Saved as ${trueLabel}`); } catch { setFb("Failed"); }
  };

  const load = (ex) => { setText(ex.text); setResult(null); setErr(null); setFb(null); ref.current?.focus(); };

  const c = { bg:"#0d1526", bdr:"#152035", card:{background:"#0d1526",border:"1px solid #152035",borderRadius:12,padding:24} };

  return (
    <div style={{ minHeight:"100vh", fontFamily:"'Outfit',sans-serif", background:"#080c14", backgroundImage:"radial-gradient(ellipse at 20% 0%,#0f1a2e 0%,transparent 50%),radial-gradient(ellipse at 80% 100%,#0a1628 0%,transparent 50%)", color:"#c8d6e5" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&family=DM+Sans:wght@400;500&display=swap');
        @keyframes scan{0%{top:-2px;opacity:0}10%{opacity:1}90%{opacity:1}100%{top:100%;opacity:0}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
        body{margin:0} select option{background:#0d1526;color:#c8d6e5} textarea::placeholder{color:#2a3f55}
        *::-webkit-scrollbar{width:6px} *::-webkit-scrollbar-track{background:#080c14} *::-webkit-scrollbar-thumb{background:#1a2332;border-radius:3px}
      `}</style>

      {/* HEADER */}
      <div style={{ padding:"20px 28px", display:"flex", alignItems:"center", justifyContent:"space-between", borderBottom:"1px solid #111c2e", background:"linear-gradient(180deg,#0b1120,transparent)" }}>
        <div style={{ display:"flex", alignItems:"center", gap:14 }}>
          <div style={{ width:40,height:40,borderRadius:10,background:"linear-gradient(135deg,#ff3b3b,#ff8c42)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,fontWeight:900,color:"#080c14",boxShadow:"0 4px 20px #ff3b3b30" }}>F</div>
          <div>
            <div style={{ fontSize:17,fontWeight:800,color:"#e8f0f8" }}>FraudShield</div>
            <div style={{ fontSize:11,color:"#3a5068",fontWeight:500,letterSpacing:1 }}>CALL TRANSCRIPT ANALYSIS</div>
          </div>
        </div>
        <div style={{ display:"flex",alignItems:"center",gap:8,fontSize:12,fontWeight:600,color:"#3a5068" }}>
          <div style={{ width:8,height:8,borderRadius:"50%",background:apiOk?"#00e09e":apiOk===false?"#ff3b3b":"#ff8c42",boxShadow:`0 0 8px ${apiOk?"#00e09e":apiOk===false?"#ff3b3b":"#ff8c42"}`,animation:apiOk===null?"pulse 1.5s infinite":"none" }} />
          {apiOk ? "API Connected" : apiOk===false ? "API Offline" : "Connecting..."}
        </div>
      </div>

      <div style={{ maxWidth:900,margin:"0 auto",padding:"24px 20px" }}>
        {/* TABS */}
        <div style={{ display:"flex",gap:6,marginBottom:20 }}>
          {[["analyze","Analyze"],["history",`History (${hist.length})`]].map(([k,l])=>(
            <button key={k} onClick={()=>setTab(k)} style={{ padding:"8px 20px",borderRadius:7,fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"'Outfit',sans-serif",transition:"all .2s",background:tab===k?"#152035":"transparent",border:`1px solid ${tab===k?"#1e3050":"transparent"}`,color:tab===k?"#c8d6e5":"#3a5068" }}>{l}</button>
          ))}
        </div>

        {tab==="analyze" && <>
          {/* INPUT */}
          <div style={{ ...c.card,marginBottom:20 }}>
            <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14,flexWrap:"wrap",gap:10 }}>
              <div style={{ fontSize:12,fontWeight:700,color:"#3a5068",letterSpacing:2 }}>TRANSCRIPT INPUT</div>
              <div style={{ display:"flex",gap:5,flexWrap:"wrap" }}>
                {EXAMPLES.map(ex=>(
                  <button key={ex.id} onClick={()=>load(ex)} style={{ padding:"6px 13px",background:"transparent",border:`1px solid ${ex.tag==="fraud"?"#ff3b3b25":"#00e09e25"}`,borderRadius:6,fontSize:12,fontWeight:500,cursor:"pointer",fontFamily:"'Outfit',sans-serif",color:ex.tag==="fraud"?"#ff6b6b":"#6ee7b7",transition:"all .2s" }}
                    onMouseEnter={e=>e.target.style.background=ex.tag==="fraud"?"#ff3b3b12":"#00e09e12"} onMouseLeave={e=>e.target.style.background="transparent"}>
                    {ex.label}
                  </button>))}
              </div>
            </div>
            <div style={{ position:"relative" }}>
              <Scan on={busy} />
              <textarea ref={ref} value={text} onChange={e=>setText(e.target.value)}
                onKeyDown={e=>{if((e.metaKey||e.ctrlKey)&&e.key==="Enter"){e.preventDefault();analyze();}}}
                placeholder="Paste a call transcript here... (Ctrl+Enter to analyze)"
                style={{ width:"100%",minHeight:140,padding:16,background:"#080c14",border:`1px solid ${busy?"#00e09e40":"#152035"}`,borderRadius:10,color:"#c8d6e5",fontSize:14,fontFamily:"'DM Sans',sans-serif",lineHeight:1.75,resize:"vertical",outline:"none",boxSizing:"border-box",transition:"border-color .3s" }}
                onFocus={e=>e.target.style.borderColor="#1e3050"} onBlur={e=>{if(!busy)e.target.style.borderColor="#152035";}} />
            </div>
            <div style={{ display:"flex",gap:14,marginTop:16,alignItems:"center",flexWrap:"wrap" }}>
              <div style={{ display:"flex",alignItems:"center",gap:8 }}>
                <span style={{ fontSize:11,fontWeight:700,color:"#3a5068",letterSpacing:1.5 }}>MODE</span>
                <select value={mode} onChange={e=>setMode(e.target.value)} style={{ padding:"7px 12px",background:"#080c14",border:"1px solid #152035",borderRadius:7,color:"#c8d6e5",fontSize:13,fontFamily:"'Outfit',sans-serif",outline:"none",cursor:"pointer" }}>
                  <option value="baseline">Baseline (Rules)</option><option value="llm">LLM (Stub)</option></select>
              </div>
              <div style={{ display:"flex",alignItems:"center",gap:8 }}>
                <span style={{ fontSize:11,fontWeight:700,color:"#3a5068",letterSpacing:1.5 }}>LANG</span>
                <select value={lang} onChange={e=>setLang(e.target.value)} style={{ padding:"7px 12px",background:"#080c14",border:"1px solid #152035",borderRadius:7,color:"#c8d6e5",fontSize:13,fontFamily:"'Outfit',sans-serif",outline:"none",cursor:"pointer" }}>
                  <option value="en">English</option><option value="de">German</option><option value="hi">Hindi</option><option value="other">Other</option></select>
              </div>
              <div style={{ flex:1 }} />
              <button onClick={analyze} disabled={busy||!text.trim()} style={{ padding:"10px 32px",border:"none",borderRadius:8,fontSize:14,fontWeight:700,letterSpacing:1.2,fontFamily:"'Outfit',sans-serif",color:"#080c14",cursor:!busy&&text.trim()?"pointer":"not-allowed",background:!busy&&text.trim()?"linear-gradient(135deg,#00e09e,#00b4d8)":"#1a2332",boxShadow:!busy&&text.trim()?"0 4px 24px #00e09e30":"none",opacity:!busy&&text.trim()?1:.4,transition:"all .3s" }}>
                {busy?"SCANNING...":"ANALYZE"}</button>
            </div>
          </div>

          {/* ERROR */}
          {err && <div style={{ ...c.card,marginBottom:20,borderColor:"#ff3b3b30",background:"#ff3b3b08",color:"#ff6b6b",fontSize:14,animation:"fadeUp .3s ease-out" }}>{err}</div>}

          {/* RESULT */}
          {result && (
            <div style={{ ...c.card,marginBottom:20,borderColor:result.label==="fraud"?"#ff3b3b30":"#00e09e30",boxShadow:`0 0 40px ${result.label==="fraud"?"#ff3b3b08":"#00e09e08"}`,animation:"fadeUp .4s ease-out" }}>
              <div style={{ display:"flex",gap:30,flexWrap:"wrap" }}>
                <div style={{ flex:"0 0 170px",textAlign:"center" }}>
                  <Gauge score={result.risk_score} animate={anim} />
                  <div style={{ marginTop:10,display:"inline-block",padding:"4px 16px",borderRadius:6,fontSize:13,fontWeight:800,letterSpacing:2,background:result.label==="fraud"?"#ff3b3b18":"#00e09e18",color:result.label==="fraud"?"#ff3b3b":"#00e09e",border:`1px solid ${result.label==="fraud"?"#ff3b3b30":"#00e09e30"}` }}>{result.label.toUpperCase()}</div>
                  <div style={{ marginTop:12,fontSize:11,color:"#2a3f55" }}>{result.model_version}</div>
                  <div style={{ fontSize:10,color:"#1e3050",fontFamily:"monospace",marginTop:4 }}>{result.request_id.slice(0,12)}...</div>
                </div>
                <div style={{ flex:1,minWidth:260 }}>
                  <div style={{ fontSize:11,fontWeight:700,color:"#3a5068",letterSpacing:2,marginBottom:10 }}>ANALYSIS</div>
                  {result.reasons.map((r,i)=>(
                    <div key={i} style={{ display:"flex",gap:10,marginBottom:10,fontSize:14,fontFamily:"'DM Sans',sans-serif",lineHeight:1.6,color:"#9bb0c4" }}>
                      <span style={{ color:result.label==="fraud"?"#ff3b3b":"#00e09e",fontSize:8,marginTop:8 }}>●</span>{r}</div>))}
                  {result.red_flags.length>0 && <div style={{ marginTop:18 }}>
                    <div style={{ fontSize:11,fontWeight:700,color:"#3a5068",letterSpacing:2,marginBottom:8 }}>RED FLAGS</div>
                    <div>{result.red_flags.map((f,i)=>(<span key={i} style={{ display:"inline-block",padding:"3px 10px",margin:"3px 5px 3px 0",borderRadius:5,fontSize:11,fontWeight:600,letterSpacing:.5,fontFamily:"'Outfit',sans-serif",background:"#ff3b3b14",border:"1px solid #ff3b3b30",color:"#ff6b6b" }}>{f}</span>))}</div></div>}
                  <div style={{ marginTop:20,paddingTop:18,borderTop:"1px solid #152035",display:"flex",alignItems:"center",gap:10,flexWrap:"wrap" }}>
                    <span style={{ fontSize:12,color:"#3a5068",fontWeight:600 }}>Correct?</span>
                    <button onClick={()=>sendFb(result.label)} style={{ padding:"5px 14px",background:"#00e09e14",border:"1px solid #00e09e30",borderRadius:6,color:"#6ee7b7",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"'Outfit',sans-serif" }}>Yes</button>
                    <button onClick={()=>sendFb(result.label==="fraud"?"normal":"fraud")} style={{ padding:"5px 14px",background:"#ff3b3b14",border:"1px solid #ff3b3b30",borderRadius:6,color:"#ff6b6b",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"'Outfit',sans-serif" }}>No, it's {result.label==="fraud"?"normal":"fraud"}</button>
                    {fb && <span style={{ fontSize:12,color:"#00e09e",fontWeight:600 }}>{fb}</span>}
                  </div>
                </div>
              </div>
            </div>
          )}
        </>}

        {/* HISTORY */}
        {tab==="history" && (
          <div style={c.card}>
            {hist.length===0 ? <div style={{ textAlign:"center",padding:40,color:"#2a3f55",fontSize:14 }}>No analyses yet.</div> :
              <div style={{ display:"flex",flexDirection:"column",gap:6 }}>
                {hist.map(h=>(<div key={h.request_id} style={{ display:"flex",alignItems:"center",gap:14,padding:"12px 16px",background:"#080c14",borderRadius:8,border:"1px solid #111c2e",animation:"fadeUp .3s ease-out" }}>
                  <span style={{ padding:"3px 10px",borderRadius:4,fontSize:11,fontWeight:800,letterSpacing:1.5,minWidth:60,textAlign:"center",background:h.label==="fraud"?"#ff3b3b18":"#00e09e18",color:h.label==="fraud"?"#ff3b3b":"#00e09e",border:`1px solid ${h.label==="fraud"?"#ff3b3b30":"#00e09e30"}` }}>{h.label.toUpperCase()}</span>
                  <span style={{ color:"#ff8c42",fontWeight:700,fontSize:14,minWidth:40 }}>{Math.round(h.risk_score*100)}%</span>
                  <span style={{ flex:1,color:"#2a3f55",fontSize:12,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",fontFamily:"monospace" }}>{h.request_id}</span>
                  <span style={{ color:"#1e3050",fontSize:11 }}>{h.model_version}</span>
                  <span style={{ color:"#1e3050",fontSize:11 }}>{new Date(h.created_at).toLocaleTimeString()}</span>
                </div>))}
              </div>}
          </div>
        )}
      </div>
    </div>
  );
}
