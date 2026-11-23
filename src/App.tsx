import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { Activity, ArrowDownRight, ArrowRight, ArrowUpRight, Bell, BookOpen, Brain, CalendarDays, Check, ChevronDown, ChevronLeft, ChevronRight, CircleHelp, ClipboardCheck, Clock3, Code2, Download, Eye, EyeOff, FileQuestion, GraduationCap, LayoutDashboard, LifeBuoy, LockKeyhole, LogOut, Menu, MessageCircle, Plus, Search, Settings, ShieldCheck, Sparkles, Target, TrendingUp, Users, X, Zap } from 'lucide-react';
import { supabase } from './lib/supabase';

type Role = 'Student' | 'Parent' | 'Assistant' | 'Teacher' | 'Admin' | 'Developer';
type Student = { id:number; name:string; email:string; group:string; score:number; status:string };
const initialStudents: Student[] = [
  {id:1,name:'Mariam Ahmed',email:'mariam.ahmed@example.com',group:'G12-A',score:720,status:'Active'},
  {id:2,name:'Omar Khaled',email:'omar.khaled@example.com',group:'G12-A',score:680,status:'Active'},
  {id:3,name:'Nour Youssef',email:'nour.youssef@example.com',group:'G12-B',score:760,status:'Active'},
  {id:4,name:'Adam Hany',email:'adam.hany@example.com',group:'G12-B',score:640,status:'Needs support'},
];
const navByRole: Record<Role,string[]> = {
 Student:['Overview','My courses','Practice','Mock exams','My progress','Assignments'],
 Parent:['Overview','My children','Progress reports','Attendance','Messages'],
 Assistant:['Overview','Students','Attendance','Assignments','Question bank','Messages'],
 Teacher:['Overview','My classes','Students','Question bank','Assignments','Exams','Reports'],
 Admin:['Overview','Users & roles','Courses','Enrollments','Payments','Reports','Settings'],
 Developer:['Overview','System health','AI providers','Deployments','Security','Backups','Activity log'],
};
const questions = [
 {domain:'Information & Ideas',question:'Which choice best states the main purpose of the passage?',passage:'Urban gardens do more than provide fresh produce. In several cities, researchers have found that community gardens also create shared spaces where neighbors exchange knowledge and build stronger social connections.',answers:['To argue that urban gardens should replace public parks','To describe multiple benefits of community gardens','To explain why cities are reducing green spaces','To compare the cost of urban and rural farming'],correct:1,explain:'The passage explicitly identifies two benefits: fresh produce and stronger community connections.'},
 {domain:'Expression of Ideas',question:'Which transition best completes the sentence?',passage:'The first experiment produced promising results. _____, the research team decided to repeat the test with a larger sample.',answers:['Nevertheless','For example','Accordingly','Meanwhile'],correct:2,explain:'“Accordingly” signals that the second action follows logically from the promising first result.'},
 {domain:'Standard English Conventions',question:'Which choice completes the sentence according to standard English conventions?',passage:'The collection of rare manuscripts _____ stored in a climate-controlled room.',answers:['are','were','is','have been'],correct:2,explain:'The subject is the singular noun “collection,” so the singular verb “is” is required.'}
];
const roleIcon = (role:Role) => role==='Student'?GraduationCap:role==='Parent'?Users:role==='Assistant'?ClipboardCheck:role==='Teacher'?BookOpen:role==='Admin'?ShieldCheck:Code2;

export default function App() {
 const [role,setRole]=useState<Role>('Student');
 const [showLogin,setShowLogin]=useState(false);
 const [signedIn,setSignedIn]=useState(false);
 const [profile,setProfile]=useState<{id:string;display_name:string;role:string;is_active:boolean;preferred_language:string}|null>(null);
 const [authLoading,setAuthLoading]=useState(true);
 const [loginLoading,setLoginLoading]=useState(false);
 const [loginEmail,setLoginEmail]=useState('');
 const [loginPassword,setLoginPassword]=useState('');
 const [showPassword,setShowPassword]=useState(false);
 const [authError,setAuthError]=useState('');
 const [resetMessage,setResetMessage]=useState('');
 const [recoveryMode,setRecoveryMode]=useState(false);
 const [newPassword,setNewPassword]=useState('');
 const [confirmPassword,setConfirmPassword]=useState('');
 const [active,setActive]=useState('Overview');
 const [sidebar,setSidebar]=useState(true);
 const [search,setSearch]=useState('');
 const [students,setStudents]=useState(initialStudents);
 const [modal,setModal]=useState(false);
 const [newName,setNewName]=useState('');
 const [newEmail,setNewEmail]=useState('');
 const [newGroup,setNewGroup]=useState('G12-A');
 const [qIndex,setQIndex]=useState(0);
 const [answer,setAnswer]=useState<number|null>(null);
 const [showExplanation,setShowExplanation]=useState(false);
 const [notice,setNotice]=useState('');
 const filtered=useMemo(()=>students.filter(s=>(s.name+' '+s.email+' '+s.group).toLowerCase().includes(search.toLowerCase())),[students,search]);
 const flash=(message:string)=>{setNotice(message);window.setTimeout(()=>setNotice(''),3200)};
 const roleMap:Record<string,Role>={student:'Student',parent:'Parent',assistant:'Assistant',teacher:'Teacher',admin:'Admin',developer:'Developer'};
 const loadAccount=async(userId:string)=>{
  const {data,error}=await supabase.from('profiles').select('id,display_name,role,is_active,preferred_language').eq('id',userId).maybeSingle();
  if(error) throw error;
  if(!data) throw new Error('Your account has not been assigned an academy role. Please contact the academy administrator.');
  if(!data.is_active) throw new Error('This academy account is currently inactive. Please contact the academy administrator.');
  const assignedRole=roleMap[String(data.role)];
  if(!assignedRole) throw new Error('This account role is not enabled for this portal. Please contact the academy administrator.');
  setProfile(data);
  setRole(assignedRole);
  setSignedIn(true);
  setActive('Overview');
 };
 useEffect(()=>{
  let alive=true;
  const restore=async()=>{
   try{
    const {data,error}=await supabase.auth.getSession();
    if(error) throw error;
    if(window.location.hash.includes('type=recovery')) setRecoveryMode(true);
    else if(data.session?.user) await loadAccount(data.session.user.id);
   }catch(error){
    if(alive){setProfile(null);setSignedIn(false);setAuthError(error instanceof Error?error.message:'Unable to restore your session. Please sign in again.');}
    await supabase.auth.signOut();
   }finally{if(alive)setAuthLoading(false);}
  };
  void restore();
  const {data:{subscription}}=supabase.auth.onAuthStateChange((event)=>{
   if(event==='PASSWORD_RECOVERY'&&alive){setRecoveryMode(true);setSignedIn(false);setAuthLoading(false);}
   if(event==='SIGNED_OUT'&&alive){setProfile(null);setSignedIn(false);setRole('Student');}
  });
  return ()=>{alive=false;subscription.unsubscribe();};
 },[]);
 const handleLogin=async(e:FormEvent)=>{
  e.preventDefault();setAuthError('');setResetMessage('');setLoginLoading(true);
  try{
   const {data,error}=await supabase.auth.signInWithPassword({email:loginEmail.trim(),password:loginPassword});
   if(error) throw error;
   if(!data.user) throw new Error('Authentication did not return a user account.');
   await loadAccount(data.user.id);
  }catch(error){
   await supabase.auth.signOut();
   setAuthError(error instanceof Error?error.message:'Sign-in failed. Please try again.');
  }finally{setLoginLoading(false);}
 };
 const handleForgotPassword=async()=>{
  setAuthError('');setResetMessage('');
  if(!loginEmail.trim()){setAuthError('Enter your email address first, then select Forgot password.');return;}
  setLoginLoading(true);
  const {error}=await supabase.auth.resetPasswordForEmail(loginEmail.trim(),{redirectTo:window.location.origin});
  setLoginLoading(false);
  if(error)setAuthError(error.message);else setResetMessage('If an account exists for this email, a password reset link has been sent.');
 };
 const handlePasswordUpdate=async(e:FormEvent)=>{
  e.preventDefault();setAuthError('');setResetMessage('');
  if(newPassword.length<8){setAuthError('Choose a password with at least 8 characters.');return;}
  if(newPassword!==confirmPassword){setAuthError('The two passwords do not match.');return;}
  setLoginLoading(true);
  const {error}=await supabase.auth.updateUser({password:newPassword});
  setLoginLoading(false);
  if(error){setAuthError(error.message);return;}
  await supabase.auth.signOut();
  setRecoveryMode(false);setNewPassword('');setConfirmPassword('');setLoginPassword('');
  setResetMessage('Your password has been updated. Sign in with your new password.');
 };
 const addStudent=(e:FormEvent)=>{e.preventDefault();setStudents(old=>[...old,{id:Date.now(),name:newName,email:newEmail,group:newGroup,score:0,status:'New'}]);setModal(false);setNewName('');setNewEmail('');flash('Student added to this local preview. Student creation is not yet connected to the database.')};
 const RoleIcon=roleIcon(role);
 const logout=async()=>{await supabase.auth.signOut();setSignedIn(false);setProfile(null);setActive('Overview')};

 if(authLoading) return <div className="auth-loading"><div className="auth-spinner"/><span>Connecting to the academy…</span></div>;
 if(!signedIn && !showLogin && !recoveryMode) return <div className="public-site">
  <div className="announcement">SAT ENGLISH PREPARATION <span><Sparkles size={12}/> A clearer path to your target score</span></div>
  <header className="public-nav">
   <a className="brand" href="#home"><span className="brand-mark">S<span>.</span></span><span><b>MRS. SHAIMAA SULAIMAN</b><small>SAT ENGLISH ACADEMY</small></span></a>
   <nav><a href="#approach">Our approach</a><a href="#platform">Learning platform</a><a href="#faq">FAQs</a></nav>
   <div className="nav-tools"><button className="language-btn" onClick={()=>flash('Arabic language support can be added to the public website.')}>EN</button><button className="button button-dark" onClick={()=>setShowLogin(true)}>Student portal <ArrowRight size={15}/></button></div>
  </header>
  <main id="home">
   <section className="hero-public">
    <div className="hero-copy"><div className="eyebrow"><i/> SAT ENGLISH · LEARN WITH PURPOSE</div><h1>Prepare smarter.<br/><em>Achieve higher.</em></h1><p>Build the skills, confidence, and exam strategies you need for SAT English. Learn each concept clearly, practise with purpose, and understand your progress at every step.</p>
     <div className="hero-buttons"><button className="button button-primary" onClick={()=>setShowLogin(true)}>Enter the academy <ArrowRight size={16}/></button><a href="#approach">Discover our approach <ArrowRight size={15}/></a></div>
     <div className="hero-proof"><span className="proof-icon"><GraduationCap size={19}/></span><span><b>A focused SAT English learning experience</b><small>Lessons · Question bank · Timed practice · Progress</small></span></div>
    </div>
    <div className="hero-art"><div className="art-halo"/><div className="art-window"><div className="art-window-top"><span/><span/><span/><small>YOUR LEARNING DASHBOARD</small></div><div className="art-welcome">Welcome to your <span>next step.</span></div><p>A little progress, every day.</p><div className="goal-box"><div><span>Weekly learning goal</span><strong>4 / 5 sessions</strong></div><div className="progress"><i/></div><small>Keep your momentum going</small></div><div className="art-label">CONTINUE LEARNING</div><div className="lesson-card"><span><BookOpen size={19}/></span><div><b>Information & Ideas</b><small>Reading skills · Lesson 04</small></div><ArrowRight size={16}/></div><div className="lesson-card" style={{marginTop:14}}><span><Target size={19}/></span><div><b>Grammar in context</b><small>Standard English Conventions</small></div><ArrowRight size={16}/></div><div className="insight"><TrendingUp size={17}/><div><b>Your progress, made clear</b><small>Review your strengths and discover what to practise next.</small></div></div></div><div className="float-card float-one"><Clock3/><div><b>Timed practice</b><small>Build exam-day confidence</small></div></div><div className="float-card float-two"><Check/><div><b>Learn step by step</b><small>Understand before you advance</small></div></div></div>
    <div className="hero-foot"><span>LEARN WITH CLARITY</span><span>PRACTISE WITH PURPOSE</span><span>PROGRESS WITH CONFIDENCE</span></div>
   </section>
   <section className="trust"><span>YOUR SAT ENGLISH JOURNEY</span><div><b><BookOpen/> Structured lessons</b><b><FileQuestion/> Skill-based questions</b><b><Clock3/> Timed practice</b><b><TrendingUp/> Progress insights</b></div></section>
   <section className="public-section" id="approach"><div className="eyebrow"><i/> A STEP-BY-STEP METHOD</div><div className="section-title"><h2>Understand it.<br/><em>Practise it. Master it.</em></h2><p>A structured learning path helps you move from understanding the basics to applying your skills under real exam conditions.</p></div><div className="approach-cards">
    <article><span>01 / BUILD YOUR FOUNDATION</span><div className="approach-icon blue"><BookOpen/></div><h3>Learn the basics</h3><p>Study each SAT English skill and question type with focused lessons, clear explanations, and useful notes.</p></article>
    <article><span>02 / DEVELOP YOUR SKILLS</span><div className="approach-icon cream"><Brain/></div><h3>Practise by skill</h3><p>Use a question bank and quizzes across Easy, Medium, and Hard levels to strengthen your understanding.</p></article>
    <article><span>03 / GET EXAM READY</span><div className="approach-icon violet"><Target/></div><h3>Train with purpose</h3><p>Build confidence through timed practice tests, answer review, and focused preparation for test day.</p></article>
   </div></section>
   <section className="feature-band" id="platform"><div><div className="eyebrow light"><i/> YOUR LEARNING, ALL IN ONE PLACE</div><h2>More than lessons.<br/><em>A complete learning journey.</em></h2><p>Stay organised, practise consistently, and see where your effort is taking you with a connected academy learning experience.</p><ul><li><Check/> Focused lessons and downloadable notes</li><li><Check/> Skill-based question bank and quizzes</li><li><Check/> Timed practice tests and answer review</li><li><Check/> Progress analytics and weekly reports</li><li><Check/> Parent access to learning progress</li></ul><button className="button button-light" onClick={()=>setShowLogin(true)}>Access the learning portal <ArrowRight size={15}/></button></div><div className="feature-visual"><div className="feature-chip"><Sparkles/> YOUR PROGRESS, AT A GLANCE</div><h3>Every practice session<br/>helps you move forward.</h3><div className="mini-chat"><span>PERSONALISED LEARNING INSIGHT</span><p>Review your recent practice, identify the skills that need attention, and plan your next study session.</p><div className="progress"><i style={{width:'72%'}}/></div><small style={{fontSize:9,color:'#8297b1'}}>A steady routine makes a difference.</small></div></div></section>
   <section className="public-section faq-public" id="faq"><div><div className="eyebrow"><i/> GOOD TO KNOW</div><h2>Questions?<br/><em>We're here to help.</em></h2><p>Explore the academy learning experience and find the right next step for your SAT English preparation.</p><button className="button button-primary" onClick={()=>setShowLogin(true)}>Go to student portal <ArrowRight size={15}/></button></div><div className="faq-stack"><details open><summary>What can I study on the academy platform?</summary><p>You can work through SAT English lessons, review notes, practise individual skills, and use quizzes to strengthen your understanding.</p></details><details><summary>Can I practise with a time limit?</summary><p>The learning platform is designed to include timed practice and mock-test experiences so you can build familiarity with exam conditions.</p></details><details><summary>How can I follow my progress?</summary><p>Progress tools are planned to show practice activity, results, and areas that may need more attention.</p></details><details><summary>Can parents follow a student's learning?</summary><p>Parent accounts are part of the academy's role-based portal, with access limited to the children linked to that parent account.</p></details><details><summary>How do I access my account?</summary><p>Select Student portal and sign in using the account credentials provided by the academy.</p></details></div></section>
   <section className="cta-public"><div className="eyebrow light"><i/> YOUR NEXT STEP STARTS HERE</div><h2>Make every practice session<br/><em>count.</em></h2><p>Sign in to continue your SAT English learning journey with Mrs. Shaimaa Sulaiman.</p><button className="button button-light" onClick={()=>setShowLogin(true)}>Enter the academy portal <ArrowRight size={16}/></button></section>
  </main>
  <footer className="public-footer"><a className="brand" href="#home"><span className="brand-mark">S<span>.</span></span><span><b>MRS. SHAIMAA SULAIMAN</b><small>SAT ENGLISH ACADEMY</small></span></a><p>A focused learning experience for students preparing for SAT English.</p><small>© {new Date().getFullYear()} Mrs. Shaimaa Sulaiman SAT English Academy. All rights reserved.</small></footer>
 </div>;

 if(!signedIn) return <div className="login-page">
  <section className="login-story">
   <div className="login-brand"><span className="brand-mark">S<span>.</span></span><span><b>MRS. SHAIMAA SULAIMAN</b><small>SAT ENGLISH ACADEMY</small></span></div>
   <div className="login-story-copy"><div className="login-eyebrow"><i/> YOUR LEARNING SPACE</div><h1>Prepare smarter.<br/><em>Grow with confidence.</em></h1><p>One academy. One account. Everything you need to build your SAT English skills and follow your progress.</p>
    <div className="login-path"><div><BookOpen/><span><b>Learn the basics</b><small>Focused lessons and clear notes</small></span></div><div><Target/><span><b>Practice by skill</b><small>Question bank and three difficulty levels</small></span></div><div><Clock3/><span><b>Train for test day</b><small>Timed practice and mock exams</small></span></div><div><TrendingUp/><span><b>Track your progress</b><small>Reports and performance insights</small></span></div></div>
   </div>
   <div className="login-story-foot"><ShieldCheck size={16}/> A dedicated learning environment for the academy community.</div>
   <div className="login-orbit orbit-a"/><div className="login-orbit orbit-b"/>
  </section>
  <section className="login-main"><div className="login-card">
   <div className="login-card-mark"><LockKeyhole size={20}/></div><div className="login-eyebrow">ACADEMY PORTAL</div><h2>{recoveryMode?'Reset your password':'Welcome back'}</h2><p className="login-subtitle">{recoveryMode?'Choose a new password to secure your academy account.':'Sign in with the account provided by your academy.'}</p>
   {recoveryMode?<form onSubmit={handlePasswordUpdate}>
    <label htmlFor="new-academy-password">New password</label><div className="login-input"><span><LockKeyhole size={17}/></span><input id="new-academy-password" type="password" autoComplete="new-password" placeholder="At least 8 characters" value={newPassword} onChange={e=>setNewPassword(e.target.value)} minLength={8} required/></div>
    <label htmlFor="confirm-academy-password">Confirm new password</label><div className="login-input"><span><LockKeyhole size={17}/></span><input id="confirm-academy-password" type="password" autoComplete="new-password" placeholder="Enter it again" value={confirmPassword} onChange={e=>setConfirmPassword(e.target.value)} minLength={8} required/></div>
    {authError&&<div className="auth-message auth-error" role="alert">{authError}</div>}
    <button className="button button-primary login-submit" type="submit" disabled={loginLoading}>{loginLoading?'Saving…':'Update password'} <ArrowRight size={17}/></button>
   </form>:<form onSubmit={handleLogin}>
    <label htmlFor="academy-email">Email address</label><div className="login-input"><span><Users size={17}/></span><input id="academy-email" type="email" autoComplete="username" placeholder="you@example.com" value={loginEmail} onChange={e=>setLoginEmail(e.target.value)} required/></div>
    <div className="login-password-label"><label htmlFor="academy-password">Password</label><button type="button" onClick={handleForgotPassword} disabled={loginLoading}>Forgot password?</button></div>
    <div className="login-input"><span><LockKeyhole size={17}/></span><input id="academy-password" type={showPassword?'text':'password'} autoComplete="current-password" placeholder="Enter your password" value={loginPassword} onChange={e=>setLoginPassword(e.target.value)} required/><button type="button" className="password-toggle" onClick={()=>setShowPassword(!showPassword)} aria-label={showPassword?'Hide password':'Show password'}>{showPassword?<EyeOff size={17}/>:<Eye size={17}/>}</button></div>
    {authError&&<div className="auth-message auth-error" role="alert">{authError}</div>}
    {resetMessage&&<div className="auth-message auth-success" role="status">{resetMessage}</div>}
    <button className="button button-primary login-submit" type="submit" disabled={loginLoading}>{loginLoading?'Please wait…':'Sign in to your account'} <ArrowRight size={17}/></button>
   </form>}
   <div className="login-divider"><span>SECURE ACADEMY ACCESS</span></div><div className="login-security"><ShieldCheck size={16}/><span>Your dashboard is selected automatically using the role assigned to your account.</span></div>
   <div className="login-role-note">Student · Parent · Assistant · Teacher · Admin · Developer</div>
  </div><div className="login-copyright">© {new Date().getFullYear()} Mrs. Shaimaa Sulaiman SAT English Academy</div></section>
 </div>;

 return <div className="app-shell">
  <aside className={sidebar?'sidebar':'sidebar collapsed'}><div className="side-brand"><span className="brand-mark">S<span>.</span></span>{sidebar&&<div><b>SHAIMAA</b><small>ACADEMY PORTAL</small></div>}<button className="collapse" onClick={()=>setSidebar(!sidebar)}><Menu size={18}/></button></div>
   <div className="workspace-label">{sidebar?'WORKSPACE':''}</div><div className="side-nav">{navByRole[role].map((item,i)=>{const Icon=[LayoutDashboard,BookOpen,FileQuestion,ClipboardCheck,TrendingUp,CalendarDays,Users,Activity,Settings][i%9];return <button key={item} className={active===item?'side-link active':'side-link'} onClick={()=>setActive(item)} title={item}><Icon size={18}/>{sidebar&&<span>{item}</span>}</button>})}</div>
   <div className="side-bottom"><button className="side-link" onClick={()=>flash('Help centre is not connected yet.')}><LifeBuoy size={18}/>{sidebar&&<span>Help centre</span>}</button><button className="side-link" onClick={logout}><LogOut size={18}/>{sidebar&&<span>Sign out</span>}</button><div className="profile-mini"><div className="avatar">SS</div>{sidebar&&<div><b>{profile?.display_name || 'Academy account'}</b><small>{role} workspace</small></div>}</div></div>
  </aside>
  <main className="dashboard-main"><header className="dashboard-top"><button className="mobile-menu" onClick={()=>setSidebar(!sidebar)} aria-label="Toggle navigation"><Menu size={19}/></button><div className="crumb"><span>Academy</span><ChevronRight size={14}/><b>{active}</b></div><div className="top-actions"><span className="demo-pill secure-pill"><i/> SECURE SESSION</span><button className="icon-btn" onClick={()=>flash('You are all caught up.')}><Bell size={18}/></button><div className="top-avatar">SS</div></div></header>
   <div className="dashboard-content"><div className="demo-warning connected-warning"><ShieldCheck size={17}/><span><b>Account connected:</b> {profile?.display_name || 'Academy user'} · Your dashboard and navigation are selected from your backend-assigned role: {role}.</span></div>
    <div className="page-heading"><div><div className="eyebrow">MONDAY, 23 NOVEMBER 2026</div><h1>{active==='Overview'?`Good afternoon, ${profile?.display_name || 'there'}.`:active}</h1><p>{role==='Student'?'Your next step starts here. Keep building your skills, one session at a time.':role==='Parent'?'A clear view of your child’s learning journey.':role==='Developer'?'Monitor the platform and its technical operations.':'Manage learning, students, and academy activity from one place.'}</p></div><div className="heading-actions"><button className="button button-primary" onClick={()=>role==='Teacher'||role==='Assistant'||role==='Admin'?setModal(true):flash('This action will be enabled when the backend is connected.')}><Plus size={16}/> {role==='Student'?'Start practice':'Quick action'}</button></div></div>
    {active==='Overview'&&<><div className="stat-grid"><div className="stat-card"><div><span>ACTIVE STUDENTS</span><Users/></div><strong>{students.length}</strong><small className="positive"><ArrowUpRight size={13}/> Sample records · not live</small></div><div className="stat-card"><div><span>AVERAGE PRACTICE SCORE</span><Target/></div><strong>78%</strong><small className="positive"><TrendingUp size={13}/> Sample metric</small></div><div className="stat-card"><div><span>COMPLETED ACTIVITIES</span><ClipboardCheck/></div><strong>124</strong><small>Sample dashboard data</small></div><div className="stat-card"><div><span>UPCOMING EXAMS</span><CalendarDays/></div><strong>03</strong><small>Sample schedule</small></div></div>
     <div className="dashboard-grid"><section className="panel performance"><div className="panel-head"><div><h3>Learning overview</h3><p>Sample weekly activity</p></div><button onClick={()=>setActive('My progress')}>View report <ArrowUpRight size={15}/></button></div><div className="chart-legend"><span><i/> Practice sessions</span><span><i/> Completed lessons</span></div><div className="bar-chart">{[42,67,53,83,61,92,73].map((v,i)=><div className="bar-column" key={i}><div className="bar-pair"><i style={{height:v+'%'}}/><i style={{height:(v*.64)+'%'}}/></div><small>{['Mon','Tue','Wed','Thu','Fri','Sat','Sun'][i]}</small></div>)}</div></section>
      <section className="panel next-panel"><div className="panel-head"><div><h3>What's next</h3><p>Suggested next steps</p></div><Sparkles/></div><div className="next-item"><span className="next-icon"><BookOpen/></span><div><b>Transitions in context</b><small>Expression of Ideas · 12 min</small></div><ArrowRight/></div><div className="next-item"><span className="next-icon lavender"><FileQuestion/></span><div><b>Practice: punctuation</b><small>Standard English · 10 questions</small></div><ArrowRight/></div><div className="next-item"><span className="next-icon green"><Target/></span><div><b>Review your weak skills</b><small>Personal study recommendation</small></div><ArrowRight/></div></section></div>
     <div className="bottom-grid"><section className="panel"><div className="panel-head"><div><h3>Recent activity</h3><p>Latest updates in this demo</p></div><button onClick={()=>setActive('Activity log')}>View all</button></div><div className="activity-row"><span className="activity-dot blue-dot"/><div><b>Practice session completed</b><small>Information & Ideas · 8 minutes ago</small></div><strong>+12 XP</strong></div><div className="activity-row"><span className="activity-dot green-dot"/><div><b>Lesson marked complete</b><small>Transitions in context · Yesterday</small></div><strong>Done</strong></div><div className="activity-row"><span className="activity-dot violet-dot"/><div><b>New assignment available</b><small>Grammar review · 2 days ago</small></div><strong>New</strong></div></section><section className="panel goal-panel-dash"><div className="panel-head"><div><h3>Weekly goal</h3><p>Keep your learning streak going</p></div><Zap/></div><div className="goal-number">4 <small>/ 5 sessions</small></div><div className="progress large"><i style={{width:'80%'}}/></div><p>You are one session away from your weekly goal.</p></section></div>
    </>}
    {(active==='Students'||active==='My classes'||active==='My children'||active==='Users & roles')&&<section className="panel table-panel"><div className="panel-head"><div><h3>{active}</h3><p>Sample student directory · local preview only</p></div><button className="button button-primary" onClick={()=>setModal(true)}><Plus size={15}/> Add student</button></div><div className="table-tools"><div className="searchbox"><Search size={16}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search students..."/></div><button className="filter-btn">All groups <ChevronDown size={14}/></button><button className="filter-btn" onClick={()=>flash('CSV export will be available with connected records.')}><Download size={15}/> Export</button></div><div className="table-scroll"><table><thead><tr><th>STUDENT</th><th>GROUP</th><th>PRACTICE SCORE</th><th>STATUS</th><th/></tr></thead><tbody>{filtered.map(s=><tr key={s.id}><td><div className="student-cell"><span className="student-avatar">{s.name.split(' ').map(n=>n[0]).join('').slice(0,2)}</span><div><b>{s.name}</b><small>{s.email}</small></div></div></td><td>{s.group}</td><td><b>{s.score||'—'}</b></td><td><span className={s.status==='Active'?'status active-status':'status'}>{s.status}</span></td><td><button className="row-action" onClick={()=>flash('Student details are sample data in preview mode.')}><ArrowUpRight size={16}/></button></td></tr>)}</tbody></table>{filtered.length===0&&<div className="empty-state">No students match your search.</div>}</div></section>}
    {active==='Practice'&&<section className="panel practice-panel"><div className="practice-meta"><span>QUESTION {qIndex+1} OF {questions.length}</span><span>{questions[qIndex].domain}</span></div><div className="practice-progress"><i style={{width:((qIndex+1)/questions.length*100)+'%'}}/></div><h2>{questions[qIndex].question}</h2><div className="passage">{questions[qIndex].passage}</div><div className="answer-list">{questions[qIndex].answers.map((a,i)=><button key={a} className={answer===i?'answer-choice chosen':''} onClick={()=>{setAnswer(i);setShowExplanation(false)}}><span>{String.fromCharCode(65+i)}</span>{a}{answer===i&&<Check size={17}/>}</button>)}</div>{showExplanation&&<div className={answer===questions[qIndex].correct?'answer-feedback correct':'answer-feedback incorrect'}><b>{answer===questions[qIndex].correct?'Correct answer!':'Not quite. The correct answer is '+String.fromCharCode(65+questions[qIndex].correct)+'.'}</b><p>{questions[qIndex].explain}</p></div>}<div className="practice-actions"><button className="filter-btn" onClick={()=>{setQIndex((qIndex+questions.length-1)%questions.length);setAnswer(null);setShowExplanation(false)}}><ChevronLeft size={16}/> Previous</button><button className="button button-primary" disabled={answer===null} onClick={()=>showExplanation?(setQIndex((qIndex+1)%questions.length),setAnswer(null),setShowExplanation(false)):setShowExplanation(true)}>{showExplanation?'Next question':'Check answer'} <ArrowRight size={16}/></button></div></section>}
    {active!=='Overview'&&!['Students','My classes','My children','Users & roles','Practice'].includes(active)&&<section className="module-grid"><div className="panel module-card"><div className="module-icon"><BookOpen/></div><h3>{active} workspace</h3><p>This area is designed for the {role.toLowerCase()} role. Connect the academy database and authentication to load real records and enable secure actions.</p><button className="button button-primary" onClick={()=>flash('This module is part of the platform preview. Live data connection is still required.')}>Explore module <ArrowRight size={16}/></button></div><div className="panel module-card"><div className="module-icon lavender"><Brain/></div><h3>Learning intelligence</h3><p>Organize learning activity, identify skill gaps, and turn progress into practical next steps.</p><button className="filter-btn" onClick={()=>setActive('Overview')}>Back to overview</button></div></section>}
   </div>
  </main>
  {modal&&<div className="modal-layer" onClick={()=>setModal(false)}><form className="modal-card" onClick={e=>e.stopPropagation()} onSubmit={addStudent}><button type="button" className="modal-x" onClick={()=>setModal(false)}><X/></button><div className="module-icon"><Users/></div><h2>Add a student</h2><p>Add a sample student to this local preview.</p><label>Full name<input required value={newName} onChange={e=>setNewName(e.target.value)} placeholder="Student name"/></label><label>Email address<input required type="email" value={newEmail} onChange={e=>setNewEmail(e.target.value)} placeholder="student@example.com"/></label><label>Class<select value={newGroup} onChange={e=>setNewGroup(e.target.value)}><option>G12-A</option><option>G12-B</option><option>G12-C</option></select></label><button className="button button-primary" type="submit">Add to preview <Plus size={16}/></button></form></div>}
  {notice&&<div className="toast"><Check size={16}/>{notice}</div>}
 </div>;
}
