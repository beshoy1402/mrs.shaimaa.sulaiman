import { useState } from 'react';
import { ArrowRight, ArrowUpRight, BookOpen, BrainCircuit, Check, ChevronDown, CircleHelp, Clock3, GraduationCap, Menu, MessageCircle, Play, ShieldCheck, Sparkles, Target, TrendingUp, X, Zap } from 'lucide-react';

const features = [
  { icon: BrainCircuit, title: 'A tutor that gets you', text: 'Ask questions in your own words. Get clear, step-by-step explanations that meet you at your level.' },
  { icon: Target, title: 'Practice with a purpose', text: 'Focus on the exact skills you need to improve, from transitions to inference and grammar.' },
  { icon: TrendingUp, title: 'See your progress clearly', text: 'Understand what is improving, what needs attention, and what to work on next.' },
];

const skills = ['Information & Ideas', 'Craft & Structure', 'Expression of Ideas', 'Standard English Conventions'];
const faqs = [
  ['Is this platform suitable for beginners?', 'Absolutely. Lessons and explanations are designed to be clear and supportive, whether you are just starting or aiming for a higher score.'],
  ['Can I practice specific SAT English skills?', 'Yes. You can focus on individual Reading and Writing domains, choose practice lengths, and revisit questions you found difficult.'],
  ['How does the AI tutor help?', 'The AI tutor can explain questions, clarify grammar concepts, compare answer choices, and suggest targeted practice.'],
];

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [faqOpen, setFaqOpen] = useState<number | null>(0);
  const [showDemo, setShowDemo] = useState(false);
  const [language, setLanguage] = useState<'EN' | 'AR'>('EN');

  const closeMenu = () => setMenuOpen(false);
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    closeMenu();
  };

  return (
    <div className="site-shell">
      <div className="announcement"><Sparkles size={14} /> A more personal way to prepare for the SAT <span>Explore the academy <ArrowUpRight size={13} /></span></div>
      <header className="topbar">
        <a className="brand" href="#" aria-label="Mrs. Shaimaa Sulaiman home">
          <span className="brand-mark">S<span>.</span></span>
          <span className="brand-copy"><strong>MRS. SHAIMAA SULAIMAN</strong><small>SAT ENGLISH ACADEMY</small></span>
        </a>
        <nav className={menuOpen ? 'nav-links open' : 'nav-links'}>
          <a href="#approach" onClick={closeMenu}>Our approach</a>
          <a href="#features" onClick={closeMenu}>Why learn with us</a>
          <a href="#skills" onClick={closeMenu}>SAT skills</a>
          <a href="#faq" onClick={closeMenu}>FAQs</a>
          <button className="mobile-language" onClick={() => setLanguage(language === 'EN' ? 'AR' : 'EN')}>{language === 'EN' ? 'العربية' : 'English'}</button>
          <button className="mobile-login" onClick={() => setShowDemo(true)}>Student sign in <ArrowRight size={16}/></button>
        </nav>
        <div className="nav-actions">
          <button className="language-btn" onClick={() => setLanguage(language === 'EN' ? 'AR' : 'EN')}>{language === 'EN' ? 'العربية' : 'English'}</button>
          <button className="login-btn" onClick={() => setShowDemo(true)}>Student sign in <ArrowUpRight size={15}/></button>
          <button className="menu-btn" aria-label="Toggle menu" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X/> : <Menu/>}</button>
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="hero-copy">
            <div className="eyebrow"><span className="eyebrow-dot"/> YOUR NEXT CHAPTER STARTS HERE</div>
            <h1>Make every<br/>study session <em>count.</em></h1>
            <p className="hero-lead">A smarter, calmer way to master SAT Reading &amp; Writing. Learn at your pace, practice with purpose, and feel confident on test day.</p>
            <div className="hero-actions">
              <button className="primary-btn" onClick={() => setShowDemo(true)}>Start learning <ArrowRight size={18}/></button>
              <button className="text-btn" onClick={() => scrollTo('approach')}><span className="play-circle"><Play size={13} fill="currentColor"/></span> Discover our approach</button>
            </div>
            <div className="hero-proof"><div className="avatar-stack"><span>S</span><span>A</span><span>M</span><span>+</span></div><div><strong>A learning experience built around you</strong><small>Clear guidance. Meaningful progress.</small></div></div>
          </div>
          <div className="hero-visual">
            <div className="visual-glow"/>
            <div className="study-card">
              <div className="card-top"><span className="live-dot"/> YOUR LEARNING SPACE <span className="more-dots">•••</span></div>
              <div className="greeting">Good afternoon, Alex <span>✦</span></div>
              <p className="muted">Small steps lead to big progress.</p>
              <div className="goal-panel">
                <div className="goal-head"><span>Today's learning goal</span><strong>65%</strong></div>
                <div className="progress-track"><span/></div>
                <small>2 of 3 activities completed</small>
              </div>
              <div className="next-label">PICK UP WHERE YOU LEFT OFF</div>
              <div className="lesson-row"><div className="lesson-icon"><BookOpen size={20}/></div><div className="lesson-info"><strong>Transitions in context</strong><small>Expression of Ideas · 12 min</small></div><button aria-label="Continue lesson" onClick={() => setShowDemo(true)}><ArrowUpRight size={17}/></button></div>
              <div className="insight-card"><div className="insight-icon"><Sparkles size={17}/></div><div><strong>A little insight for you</strong><p>You're getting stronger at identifying the main idea. Keep it up!</p></div></div>
            </div>
            <div className="floating-note note-top"><span className="note-icon"><Zap size={15}/></span><div><strong>Personalized practice</strong><small>Made for your next step</small></div></div>
            <div className="floating-note note-bottom"><div className="mini-ring">↗</div><div><strong>Progress that feels good</strong><small>One question at a time</small></div></div>
            <div className="hero-orbit orbit-one"/><div className="hero-orbit orbit-two"/>
          </div>
          <div className="hero-bottom-line"><span>THOUGHTFUL LEARNING</span><span>SMARTER PRACTICE</span><span>CONFIDENT RESULTS</span></div>
        </section>

        <section className="trust-strip"><p>EVERYTHING YOU NEED TO FEEL READY</p><div><span><ShieldCheck/> Structured learning</span><span><BrainCircuit/> AI-powered support</span><span><Clock3/> Practice at your pace</span><span><GraduationCap/> SAT-focused skills</span></div></section>

        <section className="approach section-wrap" id="approach">
          <div className="section-kicker">A BETTER WAY TO PREPARE</div>
          <div className="section-heading"><h2>Less overwhelm.<br/><em>More understanding.</em></h2><p>Preparing for the SAT shouldn't feel like figuring everything out alone. Get a clear path, helpful explanations, and practice that makes sense.</p></div>
          <div className="approach-grid">
            <article className="approach-card approach-blue"><div className="number">01 / LEARN</div><div className="approach-art"><div className="book-art"><BookOpen size={38}/><span>Learn with clarity</span></div></div><h3>Understand the why.</h3><p>Build real understanding with focused lessons, helpful examples, and explanations that make difficult ideas feel simple.</p><button onClick={() => scrollTo('skills')}>Explore learning <ArrowUpRight size={16}/></button></article>
            <article className="approach-card approach-pale"><div className="number">02 / PRACTICE</div><div className="approach-art"><div className="practice-art"><Target size={43}/><span>Practice with purpose</span></div></div><h3>Practice with purpose.</h3><p>Work through SAT-style questions, learn from every attempt, and build confidence one skill at a time.</p><button onClick={() => setShowDemo(true)}>Try a practice session <ArrowUpRight size={16}/></button></article>
            <article className="approach-card approach-lavender"><div className="number">03 / IMPROVE</div><div className="approach-art"><div className="chart-art"><TrendingUp size={43}/><span>Progress you can see</span></div></div><h3>Know your next step.</h3><p>See your strengths, spot patterns in your mistakes, and get recommendations for what to focus on next.</p><button onClick={() => setShowDemo(true)}>See how it works <ArrowUpRight size={16}/></button></article>
          </div>
        </section>

        <section className="feature-section" id="features"><div className="feature-inner"><div className="feature-copy"><div className="section-kicker light-kicker">SUPPORT THAT MOVES WITH YOU</div><h2>You're never<br/>stuck on <em>your own.</em></h2><p>Meet your AI study companion. Get a thoughtful explanation, ask one more question, or look at a concept from a different angle — whenever you need it.</p><ul><li><Check/> Explanations in simple, clear language</li><li><Check/> Help understanding every answer choice</li><li><Check/> Practice recommendations based on your progress</li></ul><button className="white-btn" onClick={() => setShowDemo(true)}>Meet your AI tutor <ArrowRight size={17}/></button></div><div className="chat-preview"><div className="chat-head"><div className="ai-avatar"><Sparkles size={17}/></div><div><strong>Your study companion</strong><small><span/> Here to help you learn</small></div><span className="chat-menu">•••</span></div><div className="chat-body"><div className="chat-date">TODAY · STUDY SESSION</div><div className="bubble student-bubble">I don't understand when to use a transition like “however”.</div><div className="bubble ai-bubble"><div className="bubble-label"><Sparkles size={13}/> STUDY COMPANION</div>Think of <b>“however”</b> as a bridge that shows contrast. It tells the reader that the next idea is different from what came before.<div className="example-box"><small>QUICK EXAMPLE</small><p>It was raining. <b>However,</b> we went outside.</p></div>Want to try a quick question together?</div><div className="suggestions"><span>Give me an example</span><span>Practice this skill</span></div></div><div className="chat-input">Ask anything about SAT English... <span><ArrowUpRight size={16}/></span></div></div></div></section>

        <section className="skills-section section-wrap" id="skills"><div className="section-kicker">BUILT AROUND THE SAT</div><div className="section-heading"><h2>Four domains.<br/><em>One confident you.</em></h2><p>Build the skills tested in SAT Reading and Writing with organized, focused practice.</p></div><div className="skill-list">{skills.map((skill,i)=><button className="skill-item" key={skill} onClick={() => setShowDemo(true)}><span className="skill-index">0{i+1}</span><strong>{skill}</strong><span className="skill-desc">{['Understand information, ideas, and evidence','Explore words, purpose, and connections','Develop ideas and choose effective transitions','Master grammar, punctuation, and sentence structure'][i]}</span><span className="skill-arrow"><ArrowUpRight size={19}/></span></button>)}</div><div className="skills-footnote"><CircleHelp size={16}/> Not sure where to start? Your learning path can help you find the right next step.</div></section>

        <section className="quote-section"><div className="quote-mark">“</div><blockquote>Confidence doesn't come from knowing every answer. It comes from knowing <em>how to find it.</em></blockquote><div className="quote-rule"/><p>MRS. SHAIMAA SULAIMAN <span>·</span> SAT ENGLISH ACADEMY</p></section>

        <section className="faq-section section-wrap" id="faq"><div><div className="section-kicker">GOOD QUESTIONS</div><h2>Let's clear<br/><em>things up.</em></h2><p className="faq-intro">A few helpful answers to get you started on your SAT preparation journey.</p></div><div className="faq-list">{faqs.map(([q,a],i)=><div className={faqOpen===i?'faq-item active':'faq-item'} key={q}><button onClick={() => setFaqOpen(faqOpen===i?null:i)}><span>{q}</span><ChevronDown size={19}/></button>{faqOpen===i&&<p>{a}</p>}</div>)}</div></section>

        <section className="final-cta"><div className="cta-sparkle"><Sparkles size={21}/></div><div className="section-kicker light-kicker">YOUR JOURNEY STARTS WITH ONE STEP</div><h2>Ready to feel more<br/><em>confident?</em></h2><p>Build your skills, find your rhythm, and make your SAT preparation count.</p><button className="white-btn" onClick={() => setShowDemo(true)}>Start your journey <ArrowRight size={17}/></button><span className="cta-caption">A clearer path to your SAT goals.</span></section>
      </main>

      <footer className="footer"><a className="brand footer-brand" href="#"><span className="brand-mark">S<span>.</span></span><span className="brand-copy"><strong>MRS. SHAIMAA SULAIMAN</strong><small>SAT ENGLISH ACADEMY</small></span></a><p>Thoughtful preparation. Meaningful progress.</p><div className="footer-bottom"><span>© {new Date().getFullYear()} Mrs. Shaimaa Sulaiman. All rights reserved.</span><div><a href="#approach">Our approach</a><a href="#faq">FAQs</a><button onClick={() => setShowDemo(true)}>Student sign in</button></div></div></footer>

      {showDemo && <div className="modal-backdrop" role="presentation" onClick={() => setShowDemo(false)}><div className="demo-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title" onClick={e => e.stopPropagation()}><button className="modal-close" aria-label="Close" onClick={() => setShowDemo(false)}><X/></button><div className="modal-icon"><GraduationCap size={25}/></div><div className="section-kicker">STUDENT PORTAL</div><h2 id="modal-title">Your learning journey<br/><em>starts here.</em></h2><p>The student portal is being prepared. Sign-in and account access will be connected during the platform build.</p><button className="primary-btn modal-action" onClick={() => setShowDemo(false)}>Got it <Check size={17}/></button></div></div>}
    </div>
  );
}