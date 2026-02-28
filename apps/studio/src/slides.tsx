import {
  Headline,
  Subheadline,
  HeroText,
  BulletGroup,
  TwoColumn,
  MeshGradient,
  GradientBg,
  FeatureGrid,
  ProcessFlow,
  StatCallout,
  StepCards,
  MilestoneTracker,
  Checklist,
  IconList,
  NextStepsGrid,
  EndSlide,
  SectionHeader,
  TimelineVertical,
} from '@slidemason/components';

const slides = [
  // ─── Slide 1: Title ───────────────────────────────────────────────
  <MeshGradient
    key="s1"
    className="flex flex-1 flex-col items-center justify-center text-center gap-[2vh]"
  >
    <HeroText gradient>SaberAlert</HeroText>
    <p
      className="text-[var(--sm-muted)]"
      style={{ fontSize: 'clamp(1rem, 2.2vw, 1.8rem)', maxWidth: '80%' }}
    >
      Camera-Free Presence Detection for Home Security
    </p>
    <p
      className="text-[var(--sm-muted)]"
      style={{ fontSize: 'clamp(0.8rem, 1.5vw, 1.2rem)', opacity: 0.6 }}
    >
      MVP Strategy &amp; Technical Roadmap
    </p>
  </MeshGradient>,

  // ─── Slide 2: The Problem ─────────────────────────────────────────
  <div key="s2" className="flex flex-1 flex-col">
    <Headline>The Problem</Headline>
    <div className="flex flex-1 items-center py-[2vh]">
      <TwoColumn
        className="w-full items-start"
        left={
          <div>
            <Subheadline style={{ marginBottom: '1rem' }}>
              Traditional home security is broken
            </Subheadline>
            <BulletGroup
              items={[
                'Cameras raise privacy concerns for families and guests',
                'Motion sensors flood users with false alarms',
                'Existing systems require expensive professional installation',
                'Most alerts arrive too late to act on',
              ]}
            />
          </div>
        }
        right={
          <div className="flex flex-col items-center justify-center h-full gap-[2vh]">
            <StatCallout value="~5s" label="Target alert latency" />
            <p
              className="text-[var(--sm-muted)] text-center"
              style={{ fontSize: 'clamp(0.8rem, 1.4vw, 1.1rem)' }}
            >
              Push notification for untrusted presence — no cameras needed
            </p>
          </div>
        }
      />
    </div>
  </div>,

  // ─── Slide 3: What Is SaberAlert ─────────────────────────────────
  <div key="s3" className="flex flex-1 flex-col">
    <Headline>What Is SaberAlert?</Headline>
    <Subheadline style={{ margin: '0 0 2vh' }}>
      Passive Wi-Fi &amp; Bluetooth sniffing to detect who's home — and who shouldn't be
    </Subheadline>
    <div className="flex flex-1 items-center">
      <FeatureGrid
        columns={3}
        features={[
          {
            icon: 'Wifi',
            title: 'Passive Scanning',
            description: 'ESP32 sniffers detect Wi-Fi probe requests and BLE advertisements — no pairing required',
          },
          {
            icon: 'ShieldCheck',
            title: 'Privacy First',
            description: 'No cameras, no microphones. Only MAC addresses and signal strength are collected',
          },
          {
            icon: 'Bell',
            title: 'Instant Alerts',
            description: 'Push notifications within ~5 seconds when an unknown device is detected',
          },
          {
            icon: 'Brain',
            title: 'Learns Your Home',
            description: 'Baseline learning distinguishes trusted household devices from strangers',
          },
          {
            icon: 'Smartphone',
            title: 'Mobile Control',
            description: 'Arm, disarm, and manage trusted devices from a React Native app',
          },
          {
            icon: 'Zap',
            title: 'Low Power',
            description: 'ESP32 mesh network runs on minimal power with local-first processing',
          },
        ]}
        animate="stagger"
      />
    </div>
  </div>,

  // ─── Slide 4: How Detection Works ─────────────────────────────────
  <div key="s4" className="flex flex-1 flex-col">
    <Headline>How Detection Works</Headline>
    <div className="flex flex-1 flex-col items-center justify-center gap-[3vh]">
      <ProcessFlow
        steps={[
          { label: 'ESP32 Sniffs', icon: 'Radio' },
          { label: 'MQTT Publish', icon: 'Send' },
          { label: 'Watcher Evaluates', icon: 'Brain' },
          { label: 'Alert Fires', icon: 'Bell' },
          { label: 'User Notified', icon: 'Smartphone' },
        ]}
        animate="stagger"
      />
      <p
        className="text-[var(--sm-muted)] text-center"
        style={{ fontSize: 'clamp(0.85rem, 1.5vw, 1.2rem)', maxWidth: '80%' }}
      >
        ESP32 gateway aggregates sniffer events, publishes to EMQX via MQTT.
        Python Watcher compares against Redis baseline, triggers push notification through backend API.
      </p>
    </div>
  </div>,

  // ─── Slide 5: Section Divider — Platform ──────────────────────────
  <SectionHeader
    key="s5"
    number={1}
    title="Platform Architecture"
    subtitle="Eight components working together"
    animate
  />,

  // ─── Slide 6: Platform Components ─────────────────────────────────
  <div key="s6" className="flex flex-1 flex-col">
    <Headline>Platform Components</Headline>
    <div className="flex flex-1 items-center">
      <FeatureGrid
        columns={2}
        features={[
          {
            icon: 'Cpu',
            title: 'ESP32 Sniffers + Gateway',
            description: 'Mesh of passive RF listeners with a single gateway bridging to cloud via MQTT',
          },
          {
            icon: 'Cloud',
            title: 'AWS IoT Core + EMQX',
            description: 'Managed MQTT broker for device-to-cloud telemetry with TLS and per-device auth',
          },
          {
            icon: 'Eye',
            title: 'Python Watcher',
            description: 'Real-time stream processor: evaluates events against baseline, triggers alerts',
          },
          {
            icon: 'Database',
            title: 'Redis + Neon Postgres',
            description: 'Redis for hot baseline lookups; Neon Postgres for historical data, users, and config',
          },
          {
            icon: 'Server',
            title: 'Backend API',
            description: 'REST/GraphQL API handling auth, device management, alert routing, and push delivery',
          },
          {
            icon: 'Smartphone',
            title: 'Mobile App (React Native)',
            description: 'Arm/disarm, trusted device management, alert history, and push notification receiver',
          },
        ]}
        animate="stagger"
      />
    </div>
  </div>,

  // ─── Slide 7: Section Divider — MVP Roadmap ───────────────────────
  <SectionHeader
    key="s7"
    number={2}
    title="MVP Roadmap"
    subtitle="Five gates from lab to launch"
    animate
  />,

  // ─── Slide 8: MVP Gates Overview ──────────────────────────────────
  <div key="s8" className="flex flex-1 flex-col">
    <Headline>Five MVP Gates</Headline>
    <div className="flex flex-1 items-center py-[2vh]">
      <MilestoneTracker
        milestones={[
          { label: 'Gate 1\nLab Validation', status: 'current' },
          { label: 'Gate 2\nMobile Provisioning', status: 'upcoming' },
          { label: 'Gate 3\nBaseline Learning', status: 'upcoming' },
          { label: 'Gate 4\nReal-Time Alert', status: 'upcoming' },
          { label: 'Gate 5\nPost-MVP Intel', status: 'upcoming' },
        ]}
        className="w-full"
        animate="stagger"
      />
    </div>
  </div>,

  // ─── Slide 9: Gate 1 — Lab Validation ─────────────────────────────
  <div key="s9" className="flex flex-1 flex-col">
    <Headline>Gate 1: Lab Validation</Headline>
    <Subheadline style={{ margin: '0 0 2vh' }}>
      Prove the hardware can reliably detect and report device presence
    </Subheadline>
    <div className="flex flex-1 items-center">
      <TwoColumn
        className="w-full items-start"
        left={
          <Checklist
            items={[
              { text: 'ESP32 sniffer captures Wi-Fi probes + BLE beacons', checked: false },
              { text: 'Gateway aggregates and publishes to MQTT broker', checked: false },
              { text: 'Watcher ingests events from MQTT stream', checked: false },
              { text: 'End-to-end latency under 5 seconds in lab', checked: false },
            ]}
            animate="stagger"
          />
        }
        right={
          <div>
            <p style={{ color: 'var(--sm-muted)', fontSize: 'clamp(0.85rem, 1.4vw, 1.1rem)', marginBottom: '1rem' }}>
              <strong style={{ color: 'var(--sm-text)' }}>Exit criteria:</strong> A phone walks into range → event appears in Watcher logs within 5 seconds.
            </p>
            <IconList
              items={[
                { icon: 'Wrench', text: 'Firmware: sniffer + gateway sketches' },
                { icon: 'Cloud', text: 'Infra: EMQX broker deployed' },
                { icon: 'Terminal', text: 'Watcher: basic MQTT consumer' },
              ]}
              animate="stagger"
            />
          </div>
        }
      />
    </div>
  </div>,

  // ─── Slide 10: Gate 2 — Mobile Provisioning ───────────────────────
  <div key="s10" className="flex flex-1 flex-col">
    <Headline>Gate 2: Mobile Provisioning</Headline>
    <Subheadline style={{ margin: '0 0 2vh' }}>
      Users can set up hardware and create an account from the mobile app
    </Subheadline>
    <div className="flex flex-1 items-center">
      <TwoColumn
        className="w-full items-start"
        left={
          <Checklist
            items={[
              { text: 'BLE-based Wi-Fi provisioning for ESP32 gateway', checked: false },
              { text: 'User signup / login via mobile app', checked: false },
              { text: 'Gateway registered to user account in backend', checked: false },
              { text: 'Device appears in app dashboard', checked: false },
            ]}
            animate="stagger"
          />
        }
        right={
          <div>
            <p style={{ color: 'var(--sm-muted)', fontSize: 'clamp(0.85rem, 1.4vw, 1.1rem)', marginBottom: '1rem' }}>
              <strong style={{ color: 'var(--sm-text)' }}>Exit criteria:</strong> New user downloads app → provisions gateway → sees it online in dashboard.
            </p>
            <IconList
              items={[
                { icon: 'Smartphone', text: 'Mobile: onboarding + BLE provisioning flow' },
                { icon: 'Server', text: 'Backend: auth, device registration API' },
                { icon: 'Database', text: 'Database: users, properties, devices schema' },
              ]}
              animate="stagger"
            />
          </div>
        }
      />
    </div>
  </div>,

  // ─── Slide 11: Gate 3 — Baseline Learning ─────────────────────────
  <div key="s11" className="flex flex-1 flex-col">
    <Headline>Gate 3: Baseline Learning</Headline>
    <Subheadline style={{ margin: '0 0 2vh' }}>
      System learns which devices are trusted household members
    </Subheadline>
    <div className="flex flex-1 items-center">
      <TwoColumn
        className="w-full items-start"
        left={
          <Checklist
            items={[
              { text: 'Watcher builds baseline from initial observation window', checked: false },
              { text: 'Redis stores hot baseline for sub-second lookups', checked: false },
              { text: 'Users label devices as trusted/ignored in mobile app', checked: false },
              { text: 'Baseline persists across restarts in Postgres', checked: false },
            ]}
            animate="stagger"
          />
        }
        right={
          <div>
            <p style={{ color: 'var(--sm-muted)', fontSize: 'clamp(0.85rem, 1.4vw, 1.1rem)', marginBottom: '1rem' }}>
              <strong style={{ color: 'var(--sm-text)' }}>Exit criteria:</strong> System correctly classifies household phones as trusted and flags a new device as unknown.
            </p>
            <IconList
              items={[
                { icon: 'Brain', text: 'Watcher: baseline algorithm + Redis sync' },
                { icon: 'Smartphone', text: 'Mobile: device list + trust labeling UI' },
                { icon: 'Database', text: 'Backend: baseline CRUD endpoints' },
              ]}
              animate="stagger"
            />
          </div>
        }
      />
    </div>
  </div>,

  // ─── Slide 12: Gate 4 — Real-Time Alert MVP ───────────────────────
  <div key="s12" className="flex flex-1 flex-col">
    <Headline>Gate 4: Real-Time Alert MVP</Headline>
    <Subheadline style={{ margin: '0 0 2vh' }}>
      The core value — push notifications for unknown presence
    </Subheadline>
    <div className="flex flex-1 items-center">
      <TwoColumn
        className="w-full items-start"
        left={
          <Checklist
            items={[
              { text: 'Watcher fires alert when unknown device detected', checked: false },
              { text: 'Backend delivers push notification to mobile app', checked: false },
              { text: 'User can arm/disarm the system from the app', checked: false },
              { text: 'Alert history viewable in the app', checked: false },
            ]}
            animate="stagger"
          />
        }
        right={
          <div>
            <p style={{ color: 'var(--sm-muted)', fontSize: 'clamp(0.85rem, 1.4vw, 1.1rem)', marginBottom: '1rem' }}>
              <strong style={{ color: 'var(--sm-text)' }}>Exit criteria:</strong> System is armed → unknown phone walks in → user receives push within ~5 seconds.
            </p>
            <IconList
              items={[
                { icon: 'Bell', text: 'Push delivery via FCM/APNs' },
                { icon: 'Shield', text: 'Arm/disarm state machine' },
                { icon: 'History', text: 'Alert log + event replay' },
              ]}
              animate="stagger"
            />
          </div>
        }
      />
    </div>
  </div>,

  // ─── Slide 13: Gate 5 — Post-MVP Intelligence ─────────────────────
  <div key="s13" className="flex flex-1 flex-col">
    <Headline>Gate 5: Post-MVP Intelligence</Headline>
    <Subheadline style={{ margin: '0 0 2vh' }}>
      Smart features that improve accuracy and reduce noise over time
    </Subheadline>
    <div className="flex flex-1 items-center py-[2vh]">
      <FeatureGrid
        columns={3}
        features={[
          {
            icon: 'TrendingUp',
            title: 'Pattern Analysis',
            description: 'Learn arrival/departure patterns for household members to reduce false positives',
          },
          {
            icon: 'MapPin',
            title: 'Zone Mapping',
            description: 'RSSI triangulation to locate which room a device is in',
          },
          {
            icon: 'Users',
            title: 'Occupancy Insights',
            description: "Who's home, when did they arrive, historical occupancy trends",
          },
          {
            icon: 'ShieldAlert',
            title: 'Anomaly Detection',
            description: 'Flag unusual patterns like devices appearing at odd hours',
          },
          {
            icon: 'BarChart3',
            title: 'Analytics Dashboard',
            description: 'Visualize presence data, alert frequency, and system health',
          },
          {
            icon: 'Plug',
            title: 'Integrations',
            description: 'HomeAssistant, IFTTT, and smart home automations',
          },
        ]}
        animate="stagger"
      />
    </div>
  </div>,

  // ─── Slide 14: Section Divider — Deliverables ─────────────────────
  <SectionHeader
    key="s14"
    number={3}
    title="MVP Deliverables"
    subtitle="Six workstreams, one team"
    animate
  />,

  // ─── Slide 15: Deliverables by Workstream ─────────────────────────
  <div key="s15" className="flex flex-1 flex-col">
    <Headline>Workstream Deliverables</Headline>
    <div className="flex flex-1 items-center py-[2vh]">
      <StepCards
        steps={[
          {
            number: 1,
            title: 'Mobile App',
            description: 'Onboarding, BLE provisioning, arm/disarm, device management, push notifications, alert history',
          },
          {
            number: 2,
            title: 'Firmware',
            description: 'ESP32 sniffer sketch, gateway firmware, BLE provisioning, OTA update support',
          },
          {
            number: 3,
            title: 'Backend / API',
            description: 'Auth, device registry, baseline CRUD, alert routing, push delivery, arm/disarm state',
          },
          {
            number: 4,
            title: 'Watcher + Analytics',
            description: 'MQTT consumer, baseline learning, unknown device detection, alert trigger engine',
          },
          {
            number: 5,
            title: 'DevOps / Platform',
            description: 'EMQX broker, Redis, Neon Postgres, CI/CD pipelines, monitoring, OTA infrastructure',
          },
          {
            number: 6,
            title: 'Beta Operations',
            description: 'Hardware kits, tester onboarding, feedback collection, bug triage, iteration cycles',
          },
        ]}
        animate="stagger"
      />
    </div>
  </div>,

  // ─── Slide 16: Key Metrics ────────────────────────────────────────
  <div key="s16" className="flex flex-1 flex-col">
    <Headline>Key Metrics</Headline>
    <div
      className="flex flex-1 items-center justify-evenly"
      style={{ gap: 'clamp(1rem, 3vw, 3rem)' }}
    >
      <StatCallout value="<5s" label="Alert Latency" animate />
      <StatCallout value="<1%" label="False Positive Rate" animate />
      <StatCallout value="99.9%" label="Uptime Target" animate />
    </div>
  </div>,

  // ─── Slide 17: Next Steps ─────────────────────────────────────────
  <div key="s17" className="flex flex-1 flex-col">
    <Headline>Next Steps</Headline>
    <div className="flex flex-1 items-center py-[2vh]">
      <NextStepsGrid
        steps={[
          { action: 'Finalize ESP32 sniffer firmware', owner: 'Firmware', status: 'in-progress' },
          { action: 'Deploy EMQX broker on AWS', owner: 'DevOps', status: 'todo' },
          { action: 'Build Watcher MQTT consumer', owner: 'Backend', status: 'todo' },
          { action: 'Scaffold React Native app', owner: 'Mobile', status: 'todo' },
          { action: 'Run Gate 1 lab validation', owner: 'All', status: 'todo' },
          { action: 'Recruit 5 beta testers', owner: 'Beta Ops', status: 'todo' },
        ]}
        className="w-full"
        animate="stagger"
      />
    </div>
  </div>,

  // ─── Slide 18: Thank You ──────────────────────────────────────────
  <GradientBg
    key="s18"
    className="flex flex-1 flex-col items-center justify-center"
  >
    <EndSlide
      variant="qa"
      message="Let's align on priorities and kick off Gate 1"
      animate
    />
  </GradientBg>,
];

export default slides;
