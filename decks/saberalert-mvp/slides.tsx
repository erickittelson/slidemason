import {
  Slide, Heading, Text, Badge, Card, GradientText,
  GhostNumber, Divider, IconCircle, StatBox, Step, Pipeline,
} from '@slidemason/primitives';
import {
  Radio, Brain, Bell, ShieldCheck, Wifi, Eye, Database, Smartphone,
  Cpu, Server, Cloud, Filter, ThumbsUp, BellRing, CheckCircle2, Circle,
  AlertCircle, Zap, Lock, Activity, Clock, Target, Rocket, Users, Home, Layers,
} from 'lucide-react';

const slides = [

  /* ── 1. HERO ── */
  <Slide key="s1" layout="center" bg="mesh">
    <Badge>Digital Saber · Pre-Seed · MVP Strategy</Badge>
    <GradientText size="hero" style={{ marginTop: 'clamp(1.5rem, 4vh, 2.5rem)' }}>SaberAlert</GradientText>
    <Text style={{ fontSize: 'clamp(1.1rem, 2.5vw, 1.75rem)', color: 'var(--sm-success)', marginTop: 'clamp(1rem, 3vh, 2rem)', maxWidth: '28ch', lineHeight: 1.4, fontWeight: 300 }}>
      Camera-free presence detection for the modern home
    </Text>
    <div className="flex gap-[clamp(1.5rem,3vw,2.5rem)]" style={{ marginTop: 'clamp(2rem, 5vh, 3.5rem)' }}>
      {[
        { icon: Radio, label: 'Passive' },
        { icon: Brain, label: 'Learns' },
        { icon: Bell, label: 'Alerts' },
      ].map(({ icon, label }) => (
        <div key={label} className="flex flex-col items-center gap-[clamp(0.3rem,0.6vh,0.5rem)]">
          <IconCircle icon={icon} size="md" />
          <span style={{ fontSize: 'clamp(0.6rem, 0.9vw, 0.75rem)', color: 'var(--sm-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{label}</span>
        </div>
      ))}
    </div>
  </Slide>,

  /* ── 2. NORTH STAR — Giant metric + manifesto ── */
  <Slide key="s2" layout="split">
    <div className="flex flex-col justify-center" style={{ flex: '0 0 45%' }}>
      <Text size="xs" style={{ color: 'var(--sm-primary)', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 500, marginBottom: 'clamp(0.5rem, 1vh, 0.75rem)' }}>
        North Star Outcome
      </Text>
      <GradientText size="stat" as="div" style={{ fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 0.85 }}>~5s</GradientText>
      <Text muted style={{ fontSize: 'clamp(0.9rem, 1.5vw, 1.2rem)', marginTop: 'clamp(0.5rem, 1.5vh, 1rem)' }}>
        from detection to notificrwerwation
      </Text>
    </div>
    <div className="flex flex-col justify-center flex-1" style={{ paddingLeft: 'clamp(2rem, 4vw, 4rem)' }}>
      <Card pad="lg" style={{ position: 'relative' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, width: 3, height: '100%', background: 'linear-gradient(180deg, var(--sm-primary), var(--sm-secondary))', borderRadius: 2 }} />
        <Text style={{ fontSize: 'clamp(1rem, 1.8vw, 1.4rem)', lineHeight: 1.6, fontWeight: 400 }}>
          A beta user receives a push notification within ~5 seconds when an untrusted presence appears at their property — after the system learns what "normal" looks like.
        </Text>
        <Text style={{ fontSize: 'clamp(0.8rem, 1.2vw, 1rem)', color: 'var(--sm-secondary)', marginTop: 'clamp(1rem, 2vh, 1.5rem)', fontStyle: 'italic', fontWeight: 500 }}>
          If we can't do this end-to-end, we don't have a product.
        </Text>
      </Card>
    </div>
  </Slide>,

  /* ── 3. WHAT IS SABERALERT — 2x2 card grid ── */
  <Slide key="s3" layout="grid">
    <Heading>What SaberAlert Is</Heading>
    <Text muted style={{ marginBottom: 'clamp(1.5rem, 3vh, 2.5rem)', maxWidth: '50ch' }}>
      No cameras. No subscriptions. Just invisible awareness.
    </Text>
    <div className="grid grid-cols-2 gap-[clamp(0.75rem,1.5vw,1.25rem)] flex-1">
      {([
        { icon: Radio, title: 'Passive Listening', desc: 'Hardware sniffs Wi-Fi + Bluetooth signals devices naturally emit — phones, cars, wearables, IoT', color: 'var(--sm-primary)' },
        { icon: Brain, title: 'Pattern of Life', desc: 'Cloud learns the normal rhythm of each property — who belongs and what\'s baseline', color: 'var(--sm-secondary)' },
        { icon: Bell, title: 'Instant Alerts', desc: 'Unfamiliar presence triggers a push notification to the homeowner\'s phone within seconds', color: 'var(--sm-accent)' },
        { icon: ShieldCheck, title: 'Trust / Ignore', desc: 'One-tap feedback trains the system — each action shapes future alert behavior', color: 'var(--sm-success)' },
      ] as const).map(({ icon: Icon, title, desc, color }) => (
        <Card key={title} pad="md" className="flex flex-col justify-between">
          <Icon size={40} style={{ color }} />
          <div>
            <Heading size="md" as="h3" style={{ marginTop: 'clamp(0.75rem, 1.5vh, 1rem)' }}>{title}</Heading>
            <Text size="xs" muted style={{ marginTop: '0.5rem' }}>{desc}</Text>
          </div>
        </Card>
      ))}
    </div>
  </Slide>,

  /* ── 4. MVP LIFECYCLE — Numbered steps with connector ── */
  <Slide key="s4" layout="split">
    <div className="flex flex-col justify-center" style={{ flex: '0 0 35%', paddingRight: 'clamp(1.5rem, 3vw, 3rem)' }}>
      <Heading>MVP =<br />Full Lifecycle</Heading>
      <Text muted style={{ marginTop: 'clamp(0.75rem, 1.5vh, 1rem)' }}>
        Eight steps from download to action. Every one must work end-to-end.
      </Text>
      <Divider style={{ marginTop: 'clamp(1.25rem, 2.5vh, 2rem)' }} />
    </div>
    <div className="flex flex-col justify-center flex-1 relative">
      <div className="absolute" style={{ left: 'clamp(14px,1.8vw,20px)', top: 'clamp(14px,1.8vw,20px)', bottom: 'clamp(14px,1.8vw,20px)', width: 2, background: 'var(--sm-border)' }} />
      {[
        'Download app & create account',
        'Provision hardware to Wi-Fi',
        'Link device to property',
        'Stream telemetry to cloud',
        'Learn baseline pattern of life',
        'Trigger "new presence" event',
        'Push notification to phone',
        'User acts: Trust or Ignore',
      ].map((text, i) => (
        <Step key={i} n={i + 1} active={i === 7} style={{ marginBottom: i < 7 ? 'clamp(0.35rem, 0.8vh, 0.5rem)' : 0 }}>
          {text}
        </Step>
      ))}
    </div>
  </Slide>,

  /* ── 5. DETECTION PIPELINE — Horizontal nodes ── */
  <Slide key="s5" layout="center">
    <Heading>How Detection Works</Heading>
    <Text muted style={{ marginBottom: 'clamp(3rem, 6vh, 4rem)' }}>
      Ship hardware → provision → learn → alert
    </Text>
    <Pipeline items={[
      { icon: Wifi, label: 'Sniffers', sub: 'Wi-Fi + BLE capture' },
      { icon: Layers, label: 'Gateway', sub: 'Aggregates & forwards' },
      { icon: Zap, label: 'EMQX', sub: 'MQTT routing' },
      { icon: Eye, label: 'Watcher', sub: 'Real-time analysis' },
      { icon: BellRing, label: 'Alert', sub: 'Push to phone' },
    ]} />
    <Card pad="sm" className="flex items-center gap-3" style={{ marginTop: 'clamp(2.5rem,5vh,3.5rem)' }}>
      <Clock size={18} style={{ color: 'var(--sm-accent)' }} />
      <Text size="sm" style={{ lineHeight: 1.3 }}>
        End-to-end target: <strong style={{ color: 'var(--sm-primary)' }}>~5 seconds</strong>
      </Text>
    </Card>
  </Slide>,

  /* ── 6. SECTION BREAK — Platform (ghost 01) ── */
  <Slide key="s6" layout="center">
    <GhostNumber n="01" style={{ color: 'var(--sm-primary)', left: '50%', right: 'auto', transform: 'translate(-50%, -50%)', fontSize: 'clamp(12rem,30vw,22rem)' }} />
    <Heading style={{ fontSize: 'clamp(3rem,7vw,5rem)' }}>Platform</Heading>
    <Text muted style={{ fontSize: 'clamp(1rem,1.8vw,1.35rem)', fontWeight: 300 }}>Six layers from edge to experience</Text>
    <Divider width="clamp(3rem,8vw,5rem)" />
  </Slide>,

  /* ── 7. ARCHITECTURE — 3x3 grid ── */
  <Slide key="s7" layout="grid" style={{ padding: 'clamp(1.5rem, 3vw, 3rem)' }}>
    <Heading style={{ fontSize: 'clamp(2rem,4vw,3rem)' }}>System Architecture</Heading>
    <Text muted size="sm" style={{ marginTop: '0.35rem', marginBottom: 'clamp(1.25rem,2.5vh,2rem)' }}>Every layer has a clear owner and boundary</Text>
    <div className="grid grid-cols-3 gap-[clamp(0.5rem,1vw,0.75rem)] flex-1" style={{ gridTemplateRows: 'repeat(3, 1fr)' }}>
      {([
        { icon: Wifi, label: 'ESP32 Sniffers + Gateway', desc: 'Capture Wi-Fi/BLE, forward via MQTT', color: '--sm-chart-1', span: 2 },
        { icon: Lock, label: 'AWS IoT Core', desc: 'Certs, shadows, OTA', color: '--sm-chart-2' },
        { icon: Zap, label: 'EMQX Broker', desc: 'High-vol MQTT routing', color: '--sm-chart-3' },
        { icon: Eye, label: 'Python Watcher', desc: 'Real-time brain', color: '--sm-chart-4' },
        { icon: Database, label: 'Redis', desc: 'Sub-second state store', color: '--sm-chart-5' },
        { icon: Server, label: 'Neon Postgres', desc: 'System of record', color: '--sm-chart-6' },
        { icon: Cloud, label: 'Backend API', desc: 'Auth, linking, alerts', color: '--sm-chart-1' },
        { icon: Smartphone, label: 'Mobile App', desc: 'Setup + alerts + actions', color: '--sm-chart-2' },
      ] as { icon: typeof Wifi; label: string; desc: string; color: string; span?: number }[]).map(({ icon: Icon, label, desc, color, span }) => (
        <Card key={label} pad="sm" className="flex items-center" style={{ gap: 'clamp(0.5rem,1vw,0.75rem)', gridColumn: span ? `span ${span}` : undefined }}>
          <Icon size={span ? 22 : 20} style={{ color: `var(${color})`, flexShrink: 0 }} />
          <div>
            <span className="font-semibold" style={{ fontSize: `clamp(${span ? '0.85rem' : '0.75rem'}, ${span ? '1.3vw' : '1.1vw'}, ${span ? '1.05rem' : '0.9rem'})`, color: 'var(--sm-text)' }}>{label}</span>
            <p style={{ fontSize: 'clamp(0.55rem,0.8vw,0.7rem)', color: 'var(--sm-muted)', marginTop: '0.1rem' }}>{desc}</p>
          </div>
        </Card>
      ))}
    </div>
  </Slide>,

  /* ── 8. DATA FLOW — Vertical cascade with color bars ── */
  <Slide key="s8" layout="free">
    <div className="flex items-end justify-between" style={{ marginBottom: 'clamp(2rem,4vh,3rem)' }}>
      <div>
        <Heading style={{ fontSize: 'clamp(2rem,4vw,3rem)' }}>Telemetry Path</Heading>
        <Text muted size="sm" style={{ marginTop: '0.35rem' }}>From radio capture to user action</Text>
      </div>
      <Card pad="sm" className="flex items-center gap-2">
        <Activity size={16} style={{ color: 'var(--sm-accent)' }} />
        <Text size="xs" style={{ color: 'var(--sm-danger)' }}>Real-time pipeline</Text>
      </Card>
    </div>
    <div className="flex flex-col gap-[clamp(0.4rem,0.8vh,0.6rem)] flex-1 justify-center">
      {([
        { icon: Wifi, label: 'Wi-Fi / BLE Sniffers', desc: 'Capture probe requests and BLE advertisements from nearby devices', color: '--sm-chart-1' },
        { icon: Layers, label: 'ESP32 Gateway', desc: 'Aggregates sniffer data, forwards upstream via MQTT with reconnect logic', color: '--sm-chart-2' },
        { icon: Zap, label: 'EMQX Broker', desc: 'High-volume MQTT routing to consumers — Watcher and rules engine', color: '--sm-chart-3' },
        { icon: Eye, label: 'Python Watcher + Redis', desc: 'Normalizes, clusters, fingerprints — decides in sub-seconds whether to alert', color: '--sm-chart-4' },
        { icon: BellRing, label: 'Alert → Push Notification', desc: 'New/untrusted presence creates event → queues push → phone buzzes', color: '--sm-primary' },
      ] as const).map(({ icon: Icon, label, desc, color }) => (
        <div key={label} className="flex items-stretch gap-[clamp(0.5rem,1vw,0.75rem)]">
          <div style={{ width: 4, borderRadius: 2, background: `var(${color})`, flexShrink: 0 }} />
          <Card pad="sm" className="flex items-center flex-1" style={{ gap: 'clamp(0.75rem,1.5vw,1rem)' }}>
            <Icon size={22} style={{ color: `var(${color})`, flexShrink: 0 }} />
            <div>
              <span className="font-semibold" style={{ fontSize: 'clamp(0.8rem,1.3vw,1rem)', color: 'var(--sm-text)' }}>{label}</span>
              <p style={{ fontSize: 'clamp(0.6rem,0.9vw,0.78rem)', color: 'var(--sm-muted)', marginTop: '0.15rem', lineHeight: 1.4 }}>{desc}</p>
            </div>
          </Card>
        </div>
      ))}
    </div>
  </Slide>,

  /* ── 9. SECTION BREAK — Roadmap (ghost 02) ── */
  <Slide key="s9" layout="center">
    <GhostNumber n="02" style={{ color: 'var(--sm-secondary)', left: '50%', right: 'auto', transform: 'translate(-50%, -50%)', fontSize: 'clamp(12rem,30vw,22rem)' }} />
    <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 60% 40% at 50% 80%, var(--sm-gradient-mesh-2), transparent)', opacity: 0.1 }} />
    <Heading style={{ fontSize: 'clamp(3rem,7vw,5rem)', color: 'var(--sm-success)' }}>Roadmap</Heading>
    <Text style={{ fontSize: 'clamp(1rem,1.8vw,1.35rem)', marginTop: 'clamp(0.5rem,1.5vh,1rem)', fontWeight: 300 }}>Four gates from lab bench to beta homes</Text>
    <Divider width="clamp(3rem,8vw,5rem)" style={{ background: 'linear-gradient(90deg, var(--sm-secondary), var(--sm-accent))' }} />
  </Slide>,

  /* ── 10. GATE SEQUENCE — 4-col cards ── */
  <Slide key="s10" layout="grid">
    <Heading style={{ fontSize: 'clamp(2rem,4vw,3rem)' }}>MVP Gate Sequence</Heading>
    <Text muted size="sm" style={{ marginTop: '0.35rem', marginBottom: 'clamp(1.5rem,3vh,2.5rem)' }}>Each gate unlocks the next level of product readiness</Text>
    <div className="grid grid-cols-4 gap-[clamp(0.5rem,1vw,0.75rem)] flex-1">
      {([
        { gate: '0', title: 'Lab Validation', desc: 'End-to-end pipeline proven in controlled environment', state: 'Engineering system', color: '--sm-primary' },
        { gate: '1', title: 'Mobile Provisioning', desc: 'Non-technical user sets up hardware in <10 minutes', state: 'Installable system', color: '--sm-chart-3' },
        { gate: '2', title: 'Baseline Learning', desc: 'System learns normal, filters drive-by noise', state: 'Learning product', color: '--sm-chart-4' },
        { gate: '3', title: 'Real-Time Alerts', desc: 'Phone buzzes for unfamiliar presence', state: 'True beta product', color: '--sm-chart-5' },
      ] as const).map(({ gate, title, desc, state, color }) => (
        <Card key={gate} pad="sm" className="flex flex-col" style={{ position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: `var(${color})` }} />
          <span className="font-mono" style={{ fontSize: 'clamp(2rem,4vw,3rem)', fontWeight: 800, color: `var(${color})`, opacity: 0.2, lineHeight: 1 }}>{gate}</span>
          <Heading size="md" as="h3" style={{ fontSize: 'clamp(0.9rem,1.4vw,1.15rem)', marginTop: 'clamp(0.25rem,0.5vh,0.5rem)' }}>{title}</Heading>
          <Text size="xs" muted style={{ marginTop: '0.35rem', flex: 1 }}>{desc}</Text>
          <Badge style={{ marginTop: 'clamp(0.5rem,1vh,0.75rem)', fontSize: 'clamp(0.5rem,0.75vw,0.65rem)', letterSpacing: '0.05em', padding: '0.3rem 0.6rem' }}>{state}</Badge>
        </Card>
      ))}
    </div>
  </Slide>,

  /* ── 11. GATES 0 & 1 — Split with checklist ── */
  <Slide key="s11" layout="split" className="gap-[clamp(1.5rem,3vw,3rem)]">
    <div className="flex flex-col justify-center" style={{ flex: '0 0 38%' }}>
      <div style={{ fontSize: 'clamp(4rem,8vw,6rem)', fontWeight: 900, color: 'var(--sm-primary)', opacity: 0.15, lineHeight: 0.9 }}>0–1</div>
      <Heading style={{ fontSize: 'clamp(2rem,3.5vw,2.75rem)', marginTop: 'clamp(0.25rem,0.5vh,0.5rem)' }}>Foundation</Heading>
      <Text muted size="sm" style={{ marginTop: '0.5rem' }}>Prove the pipeline works, then make it installable by real humans</Text>
      <div className="flex gap-[clamp(0.5rem,1vw,0.75rem)] mt-[clamp(1rem,2vh,1.5rem)]">
        {([Cpu, Server, Cloud, Smartphone] as const).map((icon, i) => (
          <IconCircle key={i} icon={icon} size="sm" style={{ width: 'clamp(36px,4.5vw,48px)', height: 'clamp(36px,4.5vw,48px)' }} />
        ))}
      </div>
    </div>
    <div className="flex flex-col justify-center gap-[clamp(0.5rem,1vh,0.75rem)] flex-1">
      {[
        { text: 'Telemetry flows Sniffer → Gateway → EMQX → Watcher → Postgres', done: true },
        { text: 'Simulated "new device" consistently produces alert events', done: true },
        { text: 'Watcher restarts safely; no Redis memory runaway', done: true },
        { text: 'Latency measured end-to-end — target ~5 seconds', done: false },
        { text: 'Non-technical beta tester completes setup in <10 minutes', done: false },
        { text: 'Device securely associated to correct user/property', done: false },
        { text: 'Online/offline status visible in app', done: false },
      ].map(({ text, done }, i) => (
        <Card key={i} pad="sm" className="flex items-start gap-[clamp(0.5rem,1vw,0.75rem)]">
          {done ? <CheckCircle2 size={16} style={{ color: 'var(--sm-success)', marginTop: '0.2em', flexShrink: 0 }} /> : <Circle size={16} style={{ color: 'var(--sm-border)', marginTop: '0.2em', flexShrink: 0 }} />}
          <span style={{ fontSize: 'clamp(0.7rem,1.1vw,0.9rem)', color: done ? 'var(--sm-text)' : 'var(--sm-muted)', lineHeight: 1.45 }}>{text}</span>
        </Card>
      ))}
    </div>
  </Slide>,

  /* ── 12. GATES 2 & 3 — Split reversed ── */
  <Slide key="s12" layout="split" className="gap-[clamp(1.5rem,3vw,3rem)]">
    <div className="flex flex-col justify-center gap-[clamp(0.5rem,1vh,0.75rem)] flex-1">
      {[
        'System enters "Learning Mode" for 3–7 days per property',
        'Builds trusted device list, filters drive-by noise',
        'Baseline completion logic is explicit ("Learning Mode complete")',
        'New/untrusted presence → alert event → push notification',
        'User can Trust/Ignore and it changes future behavior',
        'Alerts mostly accurate across 10–20 beta homes',
        'Push reliability is high — can\'t "sometimes" deliver alerts',
      ].map((text, i) => (
        <Card key={i} pad="sm" className="flex items-start gap-[clamp(0.5rem,1vw,0.75rem)]">
          <Target size={16} style={{ color: 'var(--sm-secondary)', marginTop: '0.2em', flexShrink: 0 }} />
          <span style={{ fontSize: 'clamp(0.7rem,1.1vw,0.9rem)', color: 'var(--sm-text)', lineHeight: 1.45 }}>{text}</span>
        </Card>
      ))}
    </div>
    <div className="flex flex-col justify-center items-end text-right" style={{ flex: '0 0 38%' }}>
      <div style={{ fontSize: 'clamp(4rem,8vw,6rem)', fontWeight: 900, color: 'var(--sm-secondary)', opacity: 0.15, lineHeight: 0.9 }}>2–3</div>
      <Heading style={{ fontSize: 'clamp(2rem,3.5vw,2.75rem)', marginTop: 'clamp(0.25rem,0.5vh,0.5rem)' }}>Intelligence</Heading>
      <Text muted size="sm" style={{ marginTop: '0.5rem' }}>Learn what's normal, then alert on what isn't</Text>
      <div className="flex gap-[clamp(0.5rem,1vw,0.75rem)] mt-[clamp(1rem,2vh,1.5rem)]">
        {([Brain, Filter, BellRing, ThumbsUp] as const).map((icon, i) => (
          <IconCircle key={i} icon={icon} size="sm" color="var(--sm-secondary)" style={{ width: 'clamp(36px,4.5vw,48px)', height: 'clamp(36px,4.5vw,48px)' }} />
        ))}
      </div>
    </div>
  </Slide>,

  /* ── 13. SUCCESS METRICS — Big numbers ── */
  <Slide key="s13" layout="center">
    <Badge style={{ marginBottom: 'clamp(0.5rem,1vh,0.75rem)' }}>Beta Reality Check</Badge>
    <Heading style={{ marginBottom: 'clamp(2.5rem,5vh,4rem)' }}>Success Criteria</Heading>
    <div className="grid grid-cols-4 gap-[clamp(0.75rem,1.5vw,1.25rem)] w-full">
      {([
        { value: '<5s', label: 'Alert Latency', color: 'var(--sm-chart-1)', icon: Clock },
        { value: '20', label: 'Beta Homes', color: 'var(--sm-chart-2)', icon: Home },
        { value: '99%', label: 'Push Delivery', color: 'var(--sm-chart-3)', icon: BellRing },
        { value: '<10m', label: 'Setup Time', color: 'var(--sm-chart-4)', icon: Rocket },
      ] as const).map(({ value, label, color, icon }) => (
        <StatBox key={label} value={value} label={label} icon={icon} color={color} />
      ))}
    </div>
  </Slide>,

  /* ── 14. WORKSTREAM STATUS — Traffic-light rows ── */
  <Slide key="s14" layout="free">
    <div className="flex items-end justify-between" style={{ marginBottom: 'clamp(1.5rem,3vh,2.5rem)' }}>
      <div>
        <Heading style={{ fontSize: 'clamp(2rem,4vw,3rem)' }}>Workstream Readiness</Heading>
        <Text muted size="sm" style={{ marginTop: '0.35rem' }}>Current status across all delivery tracks</Text>
      </div>
      <div className="flex gap-[clamp(0.75rem,1.5vw,1.25rem)]">
        {[{ color: '--sm-success', label: 'On Track' }, { color: '--sm-warning', label: 'In Progress' }, { color: '--sm-danger', label: 'Not Started' }].map(({ color, label }) => (
          <div key={label} className="flex items-center gap-1.5">
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: `var(${color})` }} />
            <span style={{ fontSize: 'clamp(0.55rem,0.85vw,0.7rem)', color: 'var(--sm-muted)' }}>{label}</span>
          </div>
        ))}
      </div>
    </div>
    <div className="flex flex-col gap-[clamp(0.35rem,0.7vh,0.5rem)] flex-1 justify-center">
      {([
        { label: 'Firmware & ddrdwgfdgdare', status: 'yellow' as const, note: 'Sniffer capture stable · OTA in progress', icon: Cpu },
        { label: 'Backend API', status: 'yellow' as const, note: 'Core endpoints built · provisioning flow next', icon: Server },
        { label: 'Watcher & Analytics', status: 'red' as const, note: 'Baseline learning logic not started · critical path', icon: Eye },
        { label: 'Mobile App', status: 'red' as const, note: 'Framework TBD · minimum screens designed', icon: Smartphone },
        { label: 'DevOps / Platform', status: 'green' as const, note: 'EMQX + Postgres + Redis hosted and healthy', icon: Cloud },
        { label: 'Beta Ops', status: 'yellow' as const, note: '20 homes targeted · recruiting underway', icon: Users },
      ]).map(({ label, status, note, icon }) => {
        const StatusIcon = status === 'green' ? CheckCircle2 : status === 'yellow' ? AlertCircle : Circle;
        const dotColor = status === 'green' ? 'var(--sm-success)' : status === 'yellow' ? 'var(--sm-warning)' : 'var(--sm-danger)';
        return (
          <Card key={label} pad="sm" className="flex items-center gap-[clamp(0.5rem,1vw,0.75rem)]">
            <IconCircle icon={icon} size="sm" color="var(--sm-muted)" style={{ border: '1px solid var(--sm-border)' }} />
            <span className="font-semibold" style={{ fontSize: 'clamp(0.8rem,1.3vw,1rem)', color: 'var(--sm-text)', flex: '0 0 auto', minWidth: 'clamp(8rem,14vw,12rem)' }}>{label}</span>
            <span style={{ fontSize: 'clamp(0.65rem,1vw,0.85rem)', color: 'var(--sm-muted)', flex: 1 }}>{note}</span>
            <StatusIcon size={18} style={{ color: dotColor, flexShrink: 0 }} />
          </Card>
        );
      })}
    </div>
  </Slide>,

  /* ── 15. CLOSING CTA ── */
  <Slide key="s15" layout="center" bg="mesh">
    <Badge>Next Steps</Badge>
    <GradientText size="lg" as="h2" style={{ fontSize: 'clamp(3.5rem,8vw,6rem)', marginTop: 'clamp(1.5rem,3vh,2rem)' }}>Let's Build It</GradientText>
    <Text muted style={{ fontSize: 'clamp(1rem,2vw,1.5rem)', marginTop: 'clamp(1rem,2vh,1.5rem)', maxWidth: '36ch', fontWeight: 300 }}>
      Align on gates. Unblock owners. Ship the MVP.
    </Text>
    <div className="flex gap-[clamp(0.75rem,1.5vw,1rem)]" style={{ marginTop: 'clamp(2rem,4vh,3rem)' }}>
      {[
        { icon: Target, label: 'Agree on Gate 0 exit criteria' },
        { icon: Users, label: 'Assign workstream owners' },
        { icon: Rocket, label: 'Set beta launch target date' },
      ].map(({ icon: Icon, label }) => (
        <Card key={label} pad="sm" className="flex items-center gap-[clamp(0.5rem,1vw,0.75rem)]">
          <Icon size={18} style={{ color: 'var(--sm-primary)' }} />
          <span style={{ fontSize: 'clamp(0.7rem,1.1vw,0.9rem)', color: 'var(--sm-text)', fontWeight: 500 }}>{label}</span>
        </Card>
      ))}
    </div>
  </Slide>,
];

export default slides;
