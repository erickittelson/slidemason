import {
  TitleSlide,
  StatementSlide,
  FeatureSlide,
  ProcessSlide,
  SectionDividerSlide,
  NetworkSlide,
  TimelineSlide,
  ContentMediaSlide,
  MetricsSlide,
  TableSlide,
  ConclusionSlide,
} from '@slidemason/components';

const slides = [
  // ─── 1. Hook — Title ─────────────────────────────────────────────
  <TitleSlide
    key="s1"
    title="SaberAlert"
    subtitle="Camera-Free Presence Detection for Home Security"
    badge="Digital Saber · Pre-Seed · MVP Strategy"
    gradient="emerald-blue"
  />,

  // ─── 2. Context — North Star ─────────────────────────────────────
  <StatementSlide
    key="s2"
    title="North Star Outcome"
    type="pull-quote"
    quote="A beta user receives a push notification within ~5 seconds when an untrusted presence appears — after the system learns what normal looks like."
    attribution="If we can't do that end-to-end, we don't have a product."
    background="spotlight"
  />,

  // ─── 3. Problem — Why current security fails ─────────────────────
  <FeatureSlide
    key="s3"
    title="The Problem"
    subtitle="Traditional home security is broken"
    columns={2}
    features={[
      { label: 'Privacy Invasion', description: 'Cameras raise concerns for families, guests, and tenants', icon: 'EyeOff' },
      { label: 'Alert Fatigue', description: 'Motion sensors flood users with false alarms until they stop checking', icon: 'BellOff' },
      { label: 'High Barrier', description: 'Existing systems require expensive professional installation', icon: 'DollarSign' },
      { label: 'Too Slow', description: 'Most alerts arrive too late for the homeowner to act on', icon: 'Clock' },
    ]}
  />,

  // ─── 4. Vision — What SaberAlert is ──────────────────────────────
  <FeatureSlide
    key="s4"
    title="What Is SaberAlert?"
    subtitle="Passive Wi-Fi & Bluetooth sniffing to detect who's home — and who shouldn't be"
    columns={3}
    features={[
      { label: 'Passive Scanning', description: 'ESP32 sniffers detect Wi-Fi probe requests and BLE advertisements — no pairing required', icon: 'Wifi' },
      { label: 'Privacy First', description: 'No cameras, no microphones. Only MAC addresses and signal strength', icon: 'ShieldCheck' },
      { label: 'Instant Alerts', description: 'Push notifications within ~5 seconds when an unknown device is detected', icon: 'Bell' },
      { label: 'Learns Your Home', description: 'Baseline learning distinguishes trusted devices from strangers', icon: 'Brain' },
      { label: 'Mobile Control', description: 'Arm, disarm, and manage trusted devices from a React Native app', icon: 'Smartphone' },
      { label: 'Low Power', description: 'ESP32 mesh runs on minimal power with local-first processing', icon: 'Zap' },
    ]}
  />,

  // ─── 5. Solution — How detection works ───────────────────────────
  <ProcessSlide
    key="s5"
    title="How Detection Works"
    subtitle="Ship hardware → provision → learn → alert"
    steps={[
      { label: 'ESP32 Sniffs', icon: 'Radio' },
      { label: 'Gateway Forwards', icon: 'Send' },
      { label: 'Watcher Evaluates', icon: 'Brain' },
      { label: 'Alert Fires', icon: 'Bell' },
      { label: 'User Notified', icon: 'Smartphone' },
    ]}
  />,

  // ─── 6. Section — Platform ───────────────────────────────────────
  <SectionDividerSlide
    key="s6"
    number="01"
    title="Platform Architecture"
    subtitle="Six layers working together"
    gradient="blue-purple"
  />,

  // ─── 7. Architecture — Hub-spoke view ────────────────────────────
  <NetworkSlide
    key="s7"
    title="Platform Components"
    subtitle="Hardware to mobile, connected through MQTT"
    type="hub-spoke"
    center="EMQX Broker"
    spokes={[
      { label: 'ESP32 Sniffers' },
      { label: 'AWS IoT Core' },
      { label: 'Python Watcher' },
      { label: 'Redis + Postgres' },
      { label: 'Backend API' },
      { label: 'Mobile App' },
    ]}
  />,

  // ─── 8. Section — Roadmap ────────────────────────────────────────
  <SectionDividerSlide
    key="s8"
    number="02"
    title="MVP Roadmap"
    subtitle="Five gates from lab to launch"
    gradient="emerald-blue"
  />,

  // ─── 9. Roadmap — Five gates ─────────────────────────────────────
  <TimelineSlide
    key="s9"
    title="Five MVP Gates"
    variant="horizontal"
    items={[
      { phase: 'Gate 0', title: 'Lab Validation', description: 'Prove end-to-end pipeline in controlled environment', status: 'in-progress' },
      { phase: 'Gate 1', title: 'Mobile Provisioning', description: 'Non-technical user sets up hardware in <10 minutes', status: 'upcoming' },
      { phase: 'Gate 2', title: 'Baseline Learning', description: 'System identifies home devices vs noise in 3–7 days', status: 'upcoming' },
      { phase: 'Gate 3', title: 'Real-Time Alert', description: 'Phone buzzes for unfamiliar presence — true beta product', status: 'upcoming' },
      { phase: 'Gate 4', title: 'Post-MVP Intel', description: 'Recurring unknowns, personas, late-night patterns', status: 'upcoming' },
    ]}
  />,

  // ─── 10. Evidence — Gate details ─────────────────────────────────
  <ContentMediaSlide
    key="s10"
    title="Gate 0–1: Foundation"
    subtitle="Prove the hardware, then let users set it up"
    bullets={[
      'Telemetry flows Sniffer → Gateway → EMQX → Watcher → Redis → Postgres',
      'Simulated new device produces alert event consistently',
      'Latency measured end-to-end: target ~5 seconds',
      'BLE-based Wi-Fi provisioning for ESP32 gateway',
      'Device ends up securely associated to user/property',
    ]}
    mediaPosition="right"
    visual="checklist"
    visualItems={[
      { label: 'Firmware: sniffer + gateway', icon: 'Cpu' },
      { label: 'EMQX broker deployed', icon: 'Cloud' },
      { label: 'Watcher: MQTT consumer', icon: 'Terminal' },
      { label: 'Mobile: BLE provisioning', icon: 'Smartphone' },
      { label: 'Backend: auth + device API', icon: 'Server' },
    ]}
  />,

  // ─── 11. Evidence — Core MVP gates ───────────────────────────────
  <ContentMediaSlide
    key="s11"
    title="Gates 2–3: Core MVP"
    subtitle="Learn what's normal, then alert on what isn't"
    bullets={[
      'System enters Learning Mode for 3–7 days',
      'Builds list of normal/trusted candidates, filters drive-bys',
      'Users label devices as trusted/ignored in mobile app',
      'New/untrusted presence → alert event → push notification',
      'Alerts are mostly accurate in 10–20 beta homes',
    ]}
    mediaPosition="left"
    visual="checklist"
    visualItems={[
      { label: 'Baseline algorithm + Redis sync', icon: 'Brain' },
      { label: 'Device trust labeling UI', icon: 'Smartphone' },
      { label: 'Push delivery: FCM/APNs', icon: 'Bell' },
      { label: 'Arm/disarm state machine', icon: 'Shield' },
    ]}
  />,

  // ─── 12. Evidence — Target metrics ───────────────────────────────
  <MetricsSlide
    key="s12"
    title="MVP Success Criteria"
    subtitle="Gate 3 exit = these numbers in beta homes"
    metrics={[
      { value: '<5s', label: 'Alert Latency', trend: 'down', color: 'emerald' },
      { value: '<1%', label: 'False Positive Rate', trend: 'down', color: 'blue' },
      { value: '20', label: 'Beta Homes', trend: 'up', color: 'purple' },
      { value: '99.9%', label: 'Uptime Target', trend: 'up', color: 'amber' },
    ]}
  />,

  // ─── 13. Ask — Next steps ────────────────────────────────────────
  <TableSlide
    key="s13"
    title="Next Steps"
    subtitle="Immediate priorities to kick off Gate 0"
    steps={[
      { action: 'Finalize ESP32 sniffer firmware', owner: 'Firmware', status: 'in-progress' },
      { action: 'Deploy EMQX broker on AWS', owner: 'DevOps', status: 'todo' },
      { action: 'Build Watcher MQTT consumer', owner: 'Backend', status: 'todo' },
      { action: 'Scaffold React Native app', owner: 'Mobile', status: 'todo' },
      { action: 'Run Gate 0 lab validation', owner: 'All', status: 'todo' },
      { action: 'Recruit 20 beta homes', owner: 'Beta Ops', status: 'todo' },
    ]}
  />,

  // ─── 14. Close ───────────────────────────────────────────────────
  <ConclusionSlide
    key="s14"
    variant="qa"
    title="Questions?"
    subtitle="Let's align on priorities and kick off Gate 0"
    callToAction="Align on owners, approve headcount, start building"
  />,
];

export default slides;
