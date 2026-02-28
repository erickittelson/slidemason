import {
  TitleSlide,
  SectionDividerSlide,
  ContentMediaSlide,
  FeatureSlide,
  ProcessSlide,
  TimelineSlide,
  MetricsSlide,
  TableSlide,
  ConclusionSlide,
} from '@slidemason/components';

const slides = [
  // ─── Slide 1: Title ───────────────────────────────────────────────
  <TitleSlide
    key="s1"
    title="SaberAlert"
    subtitle="Camera-Free Presence Detection for Home Security"
    badge="MVP Strategy & Technical Roadmap"
    gradient="emerald-blue"
  />,

  // ─── Slide 2: The Problem ─────────────────────────────────────────
  <ContentMediaSlide
    key="s2"
    title="The Problem"
    subtitle="Traditional home security is broken"
    bullets={[
      'Cameras raise privacy concerns for families and guests',
      'Motion sensors flood users with false alarms',
      'Existing systems require expensive professional installation',
      'Most alerts arrive too late to act on',
    ]}
    mediaPosition="right"
    visual="icon-grid"
    visualItems={[
      { label: '~5s alert latency', icon: 'Zap' },
      { label: 'No cameras needed', icon: 'ShieldCheck' },
      { label: 'Push notifications', icon: 'Bell' },
      { label: 'Passive detection', icon: 'Wifi' },
    ]}
  />,

  // ─── Slide 3: What Is SaberAlert ─────────────────────────────────
  <FeatureSlide
    key="s3"
    title="What Is SaberAlert?"
    subtitle="Passive Wi-Fi & Bluetooth sniffing to detect who's home — and who shouldn't be"
    columns={3}
    features={[
      { label: 'Passive Scanning', description: 'ESP32 sniffers detect Wi-Fi probe requests and BLE advertisements — no pairing required', icon: 'Wifi' },
      { label: 'Privacy First', description: 'No cameras, no microphones. Only MAC addresses and signal strength are collected', icon: 'ShieldCheck' },
      { label: 'Instant Alerts', description: 'Push notifications within ~5 seconds when an unknown device is detected', icon: 'Bell' },
      { label: 'Learns Your Home', description: 'Baseline learning distinguishes trusted household devices from strangers', icon: 'Brain' },
      { label: 'Mobile Control', description: 'Arm, disarm, and manage trusted devices from a React Native app', icon: 'Smartphone' },
      { label: 'Low Power', description: 'ESP32 mesh network runs on minimal power with local-first processing', icon: 'Zap' },
    ]}
  />,

  // ─── Slide 4: How Detection Works ─────────────────────────────────
  <ProcessSlide
    key="s4"
    title="How Detection Works"
    subtitle="ESP32 gateway aggregates sniffer events, publishes to EMQX via MQTT. Python Watcher compares against Redis baseline, triggers push notification through backend API."
    steps={[
      { label: 'ESP32 Sniffs', icon: 'Radio' },
      { label: 'MQTT Publish', icon: 'Send' },
      { label: 'Watcher Evaluates', icon: 'Brain' },
      { label: 'Alert Fires', icon: 'Bell' },
      { label: 'User Notified', icon: 'Smartphone' },
    ]}
  />,

  // ─── Slide 5: Section — Platform Architecture ─────────────────────
  <SectionDividerSlide
    key="s5"
    number="01"
    title="Platform Architecture"
    subtitle="Eight components working together"
    gradient="blue-purple"
  />,

  // ─── Slide 6: Platform Components ─────────────────────────────────
  <FeatureSlide
    key="s6"
    title="Platform Components"
    columns={2}
    features={[
      { label: 'ESP32 Sniffers + Gateway', description: 'Mesh of passive RF listeners with a single gateway bridging to cloud via MQTT', icon: 'Cpu' },
      { label: 'AWS IoT Core + EMQX', description: 'Managed MQTT broker for device-to-cloud telemetry with TLS and per-device auth', icon: 'Cloud' },
      { label: 'Python Watcher', description: 'Real-time stream processor: evaluates events against baseline, triggers alerts', icon: 'Eye' },
      { label: 'Redis + Neon Postgres', description: 'Redis for hot baseline lookups; Neon Postgres for historical data, users, and config', icon: 'Database' },
      { label: 'Backend API', description: 'REST/GraphQL API handling auth, device management, alert routing, and push delivery', icon: 'Server' },
      { label: 'Mobile App (React Native)', description: 'Arm/disarm, trusted device management, alert history, and push notification receiver', icon: 'Smartphone' },
    ]}
  />,

  // ─── Slide 7: Section — MVP Roadmap ───────────────────────────────
  <SectionDividerSlide
    key="s7"
    number="02"
    title="MVP Roadmap"
    subtitle="Five gates from lab to launch"
    gradient="emerald-blue"
  />,

  // ─── Slide 8: Five MVP Gates ──────────────────────────────────────
  <TimelineSlide
    key="s8"
    title="Five MVP Gates"
    variant="horizontal"
    items={[
      { phase: 'Gate 1', title: 'Lab Validation', description: 'Prove hardware can reliably detect and report device presence', status: 'in-progress' },
      { phase: 'Gate 2', title: 'Mobile Provisioning', description: 'Users set up hardware and create an account from the mobile app', status: 'upcoming' },
      { phase: 'Gate 3', title: 'Baseline Learning', description: 'System learns which devices are trusted household members', status: 'upcoming' },
      { phase: 'Gate 4', title: 'Real-Time Alert', description: 'Push notifications for unknown presence — the core MVP value', status: 'upcoming' },
      { phase: 'Gate 5', title: 'Post-MVP Intel', description: 'Smart features that improve accuracy and reduce noise over time', status: 'upcoming' },
    ]}
  />,

  // ─── Slide 9: Gates 1 & 2 Detail ─────────────────────────────────
  <ContentMediaSlide
    key="s9"
    title="Gates 1–2: Foundation"
    subtitle="Lab validation and mobile provisioning"
    bullets={[
      'ESP32 sniffer captures Wi-Fi probes + BLE beacons',
      'Gateway aggregates and publishes to MQTT broker',
      'End-to-end latency under 5 seconds in lab',
      'BLE-based Wi-Fi provisioning for ESP32 gateway',
      'User signup/login via mobile app',
      'Gateway registered to user account in backend',
    ]}
    mediaPosition="left"
    visual="checklist"
    visualItems={[
      { label: 'Firmware: sniffer + gateway sketches', icon: 'Wrench' },
      { label: 'Infra: EMQX broker deployed', icon: 'Cloud' },
      { label: 'Watcher: basic MQTT consumer', icon: 'Terminal' },
      { label: 'Mobile: onboarding + BLE provisioning', icon: 'Smartphone' },
      { label: 'Backend: auth, device registration API', icon: 'Server' },
      { label: 'Database: users, properties, devices schema', icon: 'Database' },
    ]}
  />,

  // ─── Slide 10: Gates 3 & 4 Detail ────────────────────────────────
  <ContentMediaSlide
    key="s10"
    title="Gates 3–4: Core MVP"
    subtitle="Baseline learning and real-time alerts"
    bullets={[
      'Watcher builds baseline from initial observation window',
      'Redis stores hot baseline for sub-second lookups',
      'Users label devices as trusted/ignored in mobile app',
      'Watcher fires alert when unknown device detected',
      'Backend delivers push notification to mobile app',
      'User can arm/disarm the system from the app',
    ]}
    mediaPosition="right"
    visual="checklist"
    visualItems={[
      { label: 'Watcher: baseline algorithm + Redis sync', icon: 'Brain' },
      { label: 'Mobile: device list + trust labeling UI', icon: 'Smartphone' },
      { label: 'Backend: baseline CRUD endpoints', icon: 'Database' },
      { label: 'Push delivery via FCM/APNs', icon: 'Bell' },
      { label: 'Arm/disarm state machine', icon: 'Shield' },
      { label: 'Alert log + event replay', icon: 'History' },
    ]}
  />,

  // ─── Slide 11: Gate 5 — Post-MVP Intelligence ─────────────────────
  <FeatureSlide
    key="s11"
    title="Gate 5: Post-MVP Intelligence"
    subtitle="Smart features that improve accuracy and reduce noise over time"
    columns={3}
    features={[
      { label: 'Pattern Analysis', description: 'Learn arrival/departure patterns for household members to reduce false positives', icon: 'TrendingUp' },
      { label: 'Zone Mapping', description: 'RSSI triangulation to locate which room a device is in', icon: 'MapPin' },
      { label: 'Occupancy Insights', description: "Who's home, when did they arrive, historical occupancy trends", icon: 'Users' },
      { label: 'Anomaly Detection', description: 'Flag unusual patterns like devices appearing at odd hours', icon: 'ShieldAlert' },
      { label: 'Analytics Dashboard', description: 'Visualize presence data, alert frequency, and system health', icon: 'BarChart3' },
      { label: 'Integrations', description: 'HomeAssistant, IFTTT, and smart home automations', icon: 'Plug' },
    ]}
  />,

  // ─── Slide 12: Section — Deliverables ─────────────────────────────
  <SectionDividerSlide
    key="s12"
    number="03"
    title="MVP Deliverables"
    subtitle="Six workstreams, one team"
    gradient="amber-rose"
  />,

  // ─── Slide 13: Workstream Deliverables ────────────────────────────
  <FeatureSlide
    key="s13"
    title="Workstream Deliverables"
    columns={2}
    features={[
      { label: 'Mobile App', description: 'Onboarding, BLE provisioning, arm/disarm, device management, push notifications, alert history', icon: 'Smartphone' },
      { label: 'Firmware', description: 'ESP32 sniffer sketch, gateway firmware, BLE provisioning, OTA update support', icon: 'Cpu' },
      { label: 'Backend / API', description: 'Auth, device registry, baseline CRUD, alert routing, push delivery, arm/disarm state', icon: 'Server' },
      { label: 'Watcher + Analytics', description: 'MQTT consumer, baseline learning, unknown device detection, alert trigger engine', icon: 'Eye' },
      { label: 'DevOps / Platform', description: 'EMQX broker, Redis, Neon Postgres, CI/CD pipelines, monitoring, OTA infrastructure', icon: 'Cloud' },
      { label: 'Beta Operations', description: 'Hardware kits, tester onboarding, feedback collection, bug triage, iteration cycles', icon: 'Users' },
    ]}
  />,

  // ─── Slide 14: Key Metrics ────────────────────────────────────────
  <MetricsSlide
    key="s14"
    title="Key Metrics"
    metrics={[
      { value: '<5s', label: 'Alert Latency', trend: 'down', color: 'emerald' },
      { value: '<1%', label: 'False Positive Rate', trend: 'down', color: 'blue' },
      { value: '99.9%', label: 'Uptime Target', trend: 'up', color: 'purple' },
    ]}
  />,

  // ─── Slide 15: Next Steps ─────────────────────────────────────────
  <TableSlide
    key="s15"
    title="Next Steps"
    subtitle="Owners and priorities"
    steps={[
      { action: 'Finalize ESP32 sniffer firmware', owner: 'Firmware', status: 'in-progress' },
      { action: 'Deploy EMQX broker on AWS', owner: 'DevOps', status: 'todo' },
      { action: 'Build Watcher MQTT consumer', owner: 'Backend', status: 'todo' },
      { action: 'Scaffold React Native app', owner: 'Mobile', status: 'todo' },
      { action: 'Run Gate 1 lab validation', owner: 'All', status: 'todo' },
      { action: 'Recruit 5 beta testers', owner: 'Beta Ops', status: 'todo' },
    ]}
  />,

  // ─── Slide 16: Conclusion ─────────────────────────────────────────
  <ConclusionSlide
    key="s16"
    variant="qa"
    title="Questions & Discussion"
    subtitle="Let's align on priorities and kick off Gate 1"
    callToAction="Let's align on priorities and kick off Gate 1"
  />,
];

export default slides;
