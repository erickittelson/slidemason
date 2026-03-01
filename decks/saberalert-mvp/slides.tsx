// ─── SaberAlert MVP — Team Alignment Deck ───────────────────────
// Narrative: Hook (north star) → Context → MVP definition → Architecture → Gates → Deliverables → Website → Ask
//
// Animation budget (4 of 15 slides):
//   s1  — CountUp on "~5s" stat (lands the north star with impact)
//   s4  — Stagger on 8 MVP lifecycle steps (sequential reveal)
//   s7  — Animate the pipeline flow (signal → alert path)
//   s12 — Scale entrance on Gate 3 payoff (climactic moment)
//
// Interaction budget (2 of 15 slides):
//   s8  — Tabs for architecture layers (presenter drills into each team's stack)
//   s13 — ClickReveal per team deliverable (presenter paces discussion)
//
// Branding: logo.avif top-right, footer "Confidential - DigitalSaber INC" on every slide
// ─────────────────────────────────────────────────────────────────

import {
  Slide, Heading, Text, Badge, Card, GradientText,
  GhostNumber, Divider, IconCircle, StatBox, Step, Pipeline,
  Grid, Split, Stack, Row, Spacer, ColorBar,
  Animate, CountUp, Stagger, ProgressReveal,
  Tooltip, ClickReveal, Tabs,
} from '@slidemason/primitives';
import {
  Radio, Wifi, Smartphone, Cloud, Brain, Bell,
  ShieldCheck, Shield, Eye, Clock, Cpu, Database,
  Server, Activity, Users, CheckCircle, Target,
  ArrowRight, Zap, Lock, Settings, BarChart3,
  Upload, Home, AlertTriangle, Fingerprint,
  Globe, Rocket,
} from 'lucide-react';
import { motion } from 'framer-motion';

/* ── Branding overlay — placed inside every <Slide> ──────────── */
function Brand() {
  return (
    <>
      {/* Logo — top right */}
      <img
        src="/__api/decks/saberalert-mvp/assets/logo.avif"
        alt="DigitalSaber"
        style={{
          position: 'absolute', top: 'clamp(12px, 2vw, 24px)', right: 'clamp(12px, 2vw, 24px)',
          height: 'clamp(20px, 3vw, 36px)', objectFit: 'contain', opacity: 0.7,
          zIndex: 10, pointerEvents: 'none',
        }}
      />
      {/* Footer */}
      <span style={{
        position: 'absolute', bottom: 'clamp(6px, 1vw, 14px)',
        left: '50%', transform: 'translateX(-50%)',
        fontSize: 'clamp(0.45rem, 0.8vw, 0.6rem)', color: 'var(--sm-muted)',
        opacity: 0.35, letterSpacing: '0.05em', whiteSpace: 'nowrap',
        zIndex: 10, pointerEvents: 'none',
      }}>
        Confidential — DigitalSaber INC
      </span>
    </>
  );
}

const slides = [
  // ── s1: HERO — North Star ──────────────────────────────────────
  <Slide key="s1" layout="center" bg="mesh">
    <Brand />
    <Badge>Digital Saber · Pre-Seed · 2026</Badge>
    <Spacer size="sm" />
    <GradientText size="hero">SaberAlert</GradientText>
    <Text muted style={{ maxWidth: '38ch', textAlign: 'center' }}>
      Camera-free presence detection. Push notification in
    </Text>
    <motion.div
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', damping: 12, delay: 0.4 }}
      style={{
        fontSize: 'clamp(4rem, 10vw, 7rem)',
        fontWeight: 800,
        color: 'var(--sm-primary)',
        lineHeight: 1,
      }}
    >
      ~<CountUp to={5} duration={1.5} />s
    </motion.div>
    <Text muted size="sm" style={{ maxWidth: '42ch', textAlign: 'center' }}>
      when an untrusted presence appears at your property — after
      the system learns what "normal" looks like.
    </Text>
    <Spacer size="sm" />
    <Text size="xs" style={{ color: 'var(--sm-muted)', opacity: 0.5 }}>
      Presented by Eric Kittelson
    </Text>
  </Slide>,

  // ── s2: CONTEXT — What SaberAlert Is ───────────────────────────
  <Slide key="s2" layout="free">
    <Brand />
    <GhostNumber n="?" style={{ opacity: 0.03 }} />
    <Stack gap="lg" style={{ maxWidth: '88%', margin: '0 auto', justifyContent: 'center', flex: 1 }}>
      <Badge>The Product</Badge>
      <Heading size="lg">What Is SaberAlert?</Heading>
      <Divider />
      <Split ratio="60/40">
        <Stack gap="md">
          {[
            { icon: Radio, color: 'var(--sm-primary)', title: 'Passive Listening', desc: 'Hardware captures Wi-Fi + Bluetooth signals devices naturally emit — phones, cars, wearables, IoT.' },
            { icon: Brain, color: 'var(--sm-secondary)', title: 'Pattern of Life', desc: 'Cloud system learns your property\'s "normal" — who belongs, who\'s a drive-by, what\'s routine.' },
            { icon: Bell, color: 'var(--sm-accent)', title: 'Instant Alert', desc: 'When something new shows up, your phone buzzes. No cameras. No footage. Just awareness.' },
          ].map(({ icon, color, title, desc }) => (
            <Row key={title} gap="sm" align="start">
              <IconCircle icon={icon} color={color} />
              <Stack gap="xs">
                <Text style={{ fontWeight: 600 }}>{title}</Text>
                <Text muted size="sm">{desc}</Text>
              </Stack>
            </Row>
          ))}
        </Stack>
        <Card pad="lg" style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', textAlign: 'center',
        }}>
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Eye size={64} style={{ color: 'var(--sm-primary)', opacity: 0.7, marginBottom: '0.75rem' }} />
          </motion.div>
          <Heading size="md">No Cameras</Heading>
          <Text muted size="sm" style={{ maxWidth: '24ch' }}>
            Privacy-first presence detection using RF signals only
          </Text>
        </Card>
      </Split>
    </Stack>
  </Slide>,

  // ── s3: STATEMENT — The Line in the Sand ───────────────────────
  <Slide key="s3" layout="statement" bg="mesh">
    <Brand />
    <Stack gap="lg" align="center">
      <IconCircle icon={Target} size="lg" active color="var(--sm-primary)" />
      <Heading size="lg" style={{ maxWidth: '22ch', textAlign: 'center' }}>
        If we can't do that end-to-end, we don't have a product.
      </Heading>
      <Divider width="clamp(4rem, 8vw, 6rem)" />
      <Text muted style={{ maxWidth: '44ch', textAlign: 'center' }}>
        Ship hardware. Provision. Learn. Alert.
        That's the full lifecycle — and every piece has to work.
      </Text>
    </Stack>
  </Slide>,

  // ── s4: MVP LIFECYCLE — The 8 Steps (staggered) ───────────────
  <Slide key="s4" layout="free">
    <Brand />
    <GhostNumber n={8} />
    <Stack gap="md" style={{ maxWidth: '78%', margin: '0 auto', justifyContent: 'center', flex: 1 }}>
      <Badge>MVP Definition</Badge>
      <Heading size="lg">Full Lifecycle Works</Heading>
      <Spacer size="sm" />
      <Stagger interval={0.12} effect="fade-up">
        <Step n={1} active>User downloads mobile app and creates account</Step>
        <Step n={2}>User provisions hardware to Wi-Fi and links to account</Step>
        <Step n={3}>Device streams telemetry reliably to cloud</Step>
        <Step n={4}>System learns baseline — "pattern of life"</Step>
        <Step n={5}>System triggers "new presence detected" event</Step>
        <Step n={6} active>User receives push notification reliably</Step>
        <Step n={7}>User can Trust / Ignore — action affects future alerts</Step>
        <Step n={8}>Gateway OTA updates for post-ship iteration</Step>
      </Stagger>
    </Stack>
  </Slide>,

  // ── s5: NOT MVP — Scope Discipline ─────────────────────────────
  <Slide key="s5" layout="free">
    <Brand />
    <Stack gap="lg" style={{ maxWidth: '88%', margin: '0 auto', justifyContent: 'center', flex: 1 }}>
      <Badge>Scope Discipline</Badge>
      <Heading size="lg">What We're Not Building</Heading>
      <Divider />
      <Grid cols={3} gap="md">
        {[
          { icon: Fingerprint, label: 'Persona Modeling', desc: 'No identity profiling' },
          { icon: AlertTriangle, label: 'Stalker Scoring', desc: 'No threat levels' },
          { icon: BarChart3, label: 'Advanced Dashboards', desc: 'No analytics views' },
          { icon: Settings, label: 'Perfect UI Polish', desc: 'Functional over beautiful' },
          { icon: Home, label: 'Multi-Property', desc: 'One property per user' },
          { icon: Activity, label: 'Raw MACs / RSSI', desc: 'No raw signal data exposed' },
        ].map(({ icon: Icon, label, desc }) => (
          <Card key={label} pad="sm" style={{ position: 'relative', overflow: 'hidden' }}>
            <ColorBar color="var(--sm-danger)" position="left" thickness={3} />
            <Stack gap="xs" style={{ paddingLeft: '0.75rem' }}>
              <Row gap="sm">
                <Icon size={18} style={{ color: 'var(--sm-danger)', flexShrink: 0 }} />
                <Text style={{ fontWeight: 600 }}>{label}</Text>
              </Row>
              <Text muted size="sm">{desc}</Text>
            </Stack>
          </Card>
        ))}
      </Grid>
      <Text muted size="sm" style={{ textAlign: 'center', fontStyle: 'italic' }}>
        Post-MVP intelligence layer — not required to validate the core.
      </Text>
    </Stack>
  </Slide>,

  // ── s6: SECTION BREAK — Architecture ───────────────────────────
  <Slide key="s6" layout="center" bg="mesh">
    <Brand />
    <GhostNumber n={6} style={{ opacity: 0.03, left: 'clamp(1rem, 3vw, 2rem)', right: 'auto' }} />
    <Badge>Platform</Badge>
    <Spacer size="sm" />
    <Heading size="hero" style={{ fontSize: 'clamp(3.5rem, 8vw, 6rem)' }}>
      Tech Stack
    </Heading>
    <Spacer size="sm" />
    <Text muted style={{ maxWidth: '42ch', textAlign: 'center' }}>
      Hardware, cloud, real-time brain, storage, and mobile — how each piece connects.
    </Text>
  </Slide>,

  // ── s7: DATA PIPELINE — Animated Flow ──────────────────────────
  <Slide key="s7" layout="free">
    <Brand />
    <Stack gap="lg" align="center" style={{ justifyContent: 'center', flex: 1 }}>
      <Badge>Telemetry Pipeline</Badge>
      <Heading size="lg">From Signal to Alert</Heading>
      <Spacer size="sm" />
      <Animate effect="fade-up" duration={0.8}>
        <Pipeline items={[
          { icon: Radio, label: 'Sniffer', sub: 'Wi-Fi + BLE' },
          { icon: Cpu, label: 'Gateway', sub: 'ESP32' },
          { icon: Server, label: 'EMQX', sub: 'MQTT Broker' },
          { icon: Brain, label: 'Watcher', sub: 'Python' },
          { icon: Bell, label: 'Alert', sub: '~5 seconds' },
        ]} />
      </Animate>
      <Spacer size="sm" />
      <Row gap="lg" style={{ justifyContent: 'center' }}>
        <Tooltip content="Fast buffer for clustering + fingerprinting. Enables sub-second decisions.">
          <Card pad="sm">
            <Row gap="sm">
              <Zap size={16} style={{ color: 'var(--sm-accent)' }} />
              <Text size="sm">Redis — sub-second state</Text>
            </Row>
          </Card>
        </Tooltip>
        <Tooltip content="System of record: events, aggregates, users, properties, devices, alerts.">
          <Card pad="sm">
            <Row gap="sm">
              <Database size={16} style={{ color: 'var(--sm-chart-3)' }} />
              <Text size="sm">Postgres — durable store</Text>
            </Row>
          </Card>
        </Tooltip>
      </Row>
    </Stack>
  </Slide>,

  // ── s8: ARCHITECTURE — Tabbed Layers ───────────────────────────
  <Slide key="s8" layout="free">
    <Brand />
    <Stack gap="md" style={{ maxWidth: '92%', margin: '0 auto', justifyContent: 'center', flex: 1 }}>
      <Badge>Platform Components</Badge>
      <Heading size="lg">Architecture by Layer</Heading>
      <Tabs items={[
        {
          label: 'Hardware',
          content: (
            <Grid cols={2} gap="md">
              <Card pad="md">
                <Row gap="sm" align="start">
                  <IconCircle icon={Radio} color="var(--sm-chart-1)" />
                  <Stack gap="xs">
                    <Text style={{ fontWeight: 600 }}>ESP32 Sniffers (2x)</Text>
                    <Text muted size="sm">Capture nearby Wi-Fi + BLE broadcasts. The telemetry source for the entire system.</Text>
                  </Stack>
                </Row>
              </Card>
              <Card pad="md">
                <Row gap="sm" align="start">
                  <IconCircle icon={Cpu} color="var(--sm-chart-2)" />
                  <Stack gap="xs">
                    <Text style={{ fontWeight: 600 }}>ESP32 Gateway (1x)</Text>
                    <Text muted size="sm">Forwards telemetry upstream. Supports OTA updates so we can iterate after shipping boards.</Text>
                  </Stack>
                </Row>
              </Card>
            </Grid>
          ),
        },
        {
          label: 'Cloud',
          content: (
            <Grid cols={2} gap="md">
              <Card pad="md">
                <Row gap="sm" align="start">
                  <IconCircle icon={Cloud} color="var(--sm-chart-3)" />
                  <Stack gap="xs">
                    <Text style={{ fontWeight: 600 }}>AWS IoT Core</Text>
                    <Text muted size="sm">Secure device identity, provisioning metadata, online/offline shadows, OTA workflow.</Text>
                  </Stack>
                </Row>
              </Card>
              <Card pad="md">
                <Row gap="sm" align="start">
                  <IconCircle icon={Server} color="var(--sm-chart-4)" />
                  <Stack gap="xs">
                    <Text style={{ fontWeight: 600 }}>EMQX (MQTT Broker)</Text>
                    <Text muted size="sm">Receives device telemetry at high volume. Routes to Watcher and rule consumers.</Text>
                  </Stack>
                </Row>
              </Card>
            </Grid>
          ),
        },
        {
          label: 'Brain',
          content: (
            <Grid cols={2} gap="md">
              <Card pad="md">
                <Row gap="sm" align="start">
                  <IconCircle icon={Brain} color="var(--sm-chart-5)" />
                  <Stack gap="xs">
                    <Text style={{ fontWeight: 600 }}>MQTT Watcher (Python)</Text>
                    <Text muted size="sm">Subscribes, normalizes, analyzes in near real-time. Writes events and aggregates to Postgres.</Text>
                  </Stack>
                </Row>
              </Card>
              <Card pad="md">
                <Row gap="sm" align="start">
                  <IconCircle icon={Zap} color="var(--sm-chart-6)" />
                  <Stack gap="xs">
                    <Text style={{ fontWeight: 600 }}>Redis (In-Memory)</Text>
                    <Text muted size="sm">Fast buffer + state store for clustering and fingerprinting. Enables sub-second decisions.</Text>
                  </Stack>
                </Row>
              </Card>
            </Grid>
          ),
        },
        {
          label: 'Storage + API',
          content: (
            <Grid cols={2} gap="md">
              <Card pad="md">
                <Row gap="sm" align="start">
                  <IconCircle icon={Database} color="var(--sm-primary)" />
                  <Stack gap="xs">
                    <Text style={{ fontWeight: 600 }}>Neon Postgres</Text>
                    <Text muted size="sm">System of record: users, properties, devices, alerts. Aggregates, not raw packet firehose.</Text>
                  </Stack>
                </Row>
              </Card>
              <Card pad="md">
                <Row gap="sm" align="start">
                  <IconCircle icon={Lock} color="var(--sm-secondary)" />
                  <Stack gap="xs">
                    <Text style={{ fontWeight: 600 }}>Backend API (Python)</Text>
                    <Text muted size="sm">Auth, device registration, alert history, Trust/Ignore writeback, push notification triggers.</Text>
                  </Stack>
                </Row>
              </Card>
            </Grid>
          ),
        },
      ]} />
    </Stack>
  </Slide>,

  // ── s9: SECTION BREAK — Gates ──────────────────────────────────
  <Slide key="s9" layout="center" bg="mesh">
    <Brand />
    <GhostNumber n={4} style={{ opacity: 0.04 }} />
    <Badge>Execution</Badge>
    <Spacer size="sm" />
    <Heading size="hero" style={{ fontSize: 'clamp(3.5rem, 8vw, 6rem)' }}>
      MVP Gates
    </Heading>
    <Spacer size="sm" />
    <Text muted style={{ maxWidth: '42ch', textAlign: 'center' }}>
      Four phases from lab validation to real beta product. Each gate has owners, exit criteria, and a clear product state.
    </Text>
  </Slide>,

  // ── s10: GATE 0 + GATE 1 — Side by Side ────────────────────────
  <Slide key="s10" layout="free">
    <Brand />
    <Stack gap="md" style={{ maxWidth: '92%', margin: '0 auto', justifyContent: 'center', flex: 1 }}>
      <Heading size="lg">Gates 0 & 1</Heading>
      <Split ratio="50/50">
        {/* Gate 0 */}
        <Card pad="md" style={{ position: 'relative', overflow: 'hidden' }}>
          <ColorBar color="var(--sm-chart-1)" />
          <Stack gap="sm">
            <Row gap="sm">
              <Badge style={{ background: 'var(--sm-chart-1)', color: 'var(--sm-bg)', border: 'none' }}>Gate 0</Badge>
              <Badge>Engineering System</Badge>
            </Row>
            <Heading size="md">Lab Validation</Heading>
            <Text muted size="sm">Prove end-to-end pipeline + alert event in a controlled environment.</Text>
            <Divider />
            <Text size="sm" style={{ fontWeight: 600 }}>Exit Criteria</Text>
            <Text muted size="xs">Telemetry flows Sniffer → Gateway → EMQX → Watcher → Postgres</Text>
            <Text muted size="xs">Controlled "new device" produces alert event consistently</Text>
            <Text muted size="xs">Watcher restarts safely; no Redis memory runaway</Text>
            <Text muted size="xs">End-to-end latency measured (target ~5s)</Text>
            <Spacer size="xs" />
            <Row gap="sm" wrap>
              {['Firmware', 'Backend', 'DevOps', 'Analytics'].map(t => (
                <Badge key={t} style={{ fontSize: '0.6rem' }}>{t}</Badge>
              ))}
            </Row>
          </Stack>
        </Card>
        {/* Gate 1 */}
        <Card pad="md" style={{ position: 'relative', overflow: 'hidden' }}>
          <ColorBar color="var(--sm-chart-2)" />
          <Stack gap="sm">
            <Row gap="sm">
              <Badge style={{ background: 'var(--sm-chart-2)', color: 'var(--sm-bg)', border: 'none' }}>Gate 1</Badge>
              <Badge>Installable System</Badge>
            </Row>
            <Heading size="md">Mobile Provisioning</Heading>
            <Text muted size="sm">Real user can get hardware online and linked to their account.</Text>
            <Divider />
            <Text size="sm" style={{ fontWeight: 600 }}>Required User Flow</Text>
            <Pipeline items={[
              { icon: Users, label: 'Account', sub: 'Sign Up' },
              { icon: Home, label: 'Property', sub: 'Add' },
              { icon: Cpu, label: 'Device', sub: 'Add' },
              { icon: Wifi, label: 'Wi-Fi', sub: 'Provision' },
              { icon: CheckCircle, label: 'Online', sub: 'Verified' },
            ]} />
            <Spacer size="xs" />
            <Row gap="sm" wrap>
              {['Mobile', 'Firmware', 'Backend', 'DevOps'].map(t => (
                <Badge key={t} style={{ fontSize: '0.6rem' }}>{t}</Badge>
              ))}
            </Row>
          </Stack>
        </Card>
      </Split>
    </Stack>
  </Slide>,

  // ── s11: GATE 2 — Baseline Learning ────────────────────────────
  <Slide key="s11" layout="free">
    <Brand />
    <GhostNumber n={2} />
    <Stack gap="md" style={{ maxWidth: '88%', margin: '0 auto', justifyContent: 'center', flex: 1 }}>
      <Row gap="sm">
        <Badge style={{ background: 'var(--sm-chart-3)', color: 'var(--sm-bg)', border: 'none' }}>Gate 2</Badge>
        <Badge>Learning Product</Badge>
      </Row>
      <Heading size="lg">Pattern of Life</Heading>
      <Text muted>System enters "Learning Mode" for 3–7 days. Builds what "normal" looks like.</Text>
      <Divider />
      <Split ratio="50/50">
        <Card pad="md" style={{ textAlign: 'center' }}>
          <Text style={{ fontWeight: 600, marginBottom: '0.75rem' }}>Signal Identification</Text>
          <ProgressReveal value={85} label="Home Devices Recognized" color="var(--sm-success)" />
          <Spacer size="sm" />
          <ProgressReveal value={92} label="Drive-By Traffic Filtered" color="var(--sm-chart-3)" />
        </Card>
        <Card pad="md" style={{ position: 'relative', overflow: 'hidden' }}>
          <ColorBar color="var(--sm-chart-3)" />
          <Stack gap="xs">
            <Text style={{ fontWeight: 600 }}>Exit Criteria</Text>
            <Text muted size="sm">Identify high-frequency home devices vs noise</Text>
            <Text muted size="sm">Drive-by traffic suppressed to tolerable level</Text>
            <Text muted size="sm">Baseline completion logic explicit and visible</Text>
            <Spacer size="sm" />
            <Badge style={{ background: 'var(--sm-success)', color: 'var(--sm-bg)', border: 'none' }}>
              "Learning Mode Complete"
            </Badge>
          </Stack>
        </Card>
      </Split>
    </Stack>
  </Slide>,

  // ── s12: GATE 3 — Real-Time Alert (climactic) ──────────────────
  <Slide key="s12" layout="free" bg="mesh">
    <Brand />
    <GhostNumber n={3} />
    <Stack gap="lg" align="center" style={{ justifyContent: 'center', flex: 1 }}>
      <Row gap="sm">
        <Badge style={{ background: 'var(--sm-primary)', color: 'var(--sm-bg)', border: 'none' }}>Gate 3</Badge>
        <Badge>True Beta Product</Badge>
      </Row>
      <Animate effect="scale" duration={0.6}>
        <Heading size="lg" style={{ textAlign: 'center' }}>
          Phone Buzzes for Unfamiliar Presence
        </Heading>
      </Animate>
      <Divider width="clamp(4rem, 8vw, 6rem)" />
      <Grid cols={3} gap="lg" style={{ maxWidth: '90%' }}>
        <StatBox icon={Bell} value="~5s" label="Alert Latency" color="var(--sm-primary)" />
        <StatBox icon={Home} value="10–20" label="Beta Homes" color="var(--sm-chart-2)" />
        <StatBox icon={ShieldCheck} value="Trust / Ignore" label="User Action" color="var(--sm-success)" />
      </Grid>
      <Text muted size="sm" style={{ maxWidth: '52ch', textAlign: 'center' }}>
        Alerts are mostly accurate and understandable. Push reliability is high —
        you can't "sometimes" deliver alerts. User actions change future alerting behavior.
      </Text>
    </Stack>
  </Slide>,

  // ── s13: DELIVERABLES — ClickReveal Per Team ───────────────────
  <Slide key="s13" layout="free">
    <Brand />
    <Stack gap="md" style={{ maxWidth: '92%', margin: '0 auto', justifyContent: 'center', flex: 1 }}>
      <Badge>Deliverables</Badge>
      <Heading size="lg">What Each Team Ships</Heading>
      <Spacer size="sm" />
      <Grid cols={3} gap="md">
        <ClickReveal prompt="Mobile App">
          <Card pad="md" style={{ position: 'relative', overflow: 'hidden' }}>
            <ColorBar color="var(--sm-chart-1)" />
            <Stack gap="xs">
              <Row gap="sm">
                <Smartphone size={20} style={{ color: 'var(--sm-chart-1)' }} />
                <Text style={{ fontWeight: 600 }}>Mobile App</Text>
              </Row>
              <Text muted size="sm">Auth, add property, provision device, push notifications, alert screen + Trust/Ignore</Text>
            </Stack>
          </Card>
        </ClickReveal>
        <ClickReveal prompt="Firmware">
          <Card pad="md" style={{ position: 'relative', overflow: 'hidden' }}>
            <ColorBar color="var(--sm-chart-2)" />
            <Stack gap="xs">
              <Row gap="sm">
                <Cpu size={20} style={{ color: 'var(--sm-chart-2)' }} />
                <Text style={{ fontWeight: 600 }}>Firmware</Text>
              </Row>
              <Text muted size="sm">Provisioning handshake, stable capture, gateway forwarding + reconnect, OTA, remote logging</Text>
            </Stack>
          </Card>
        </ClickReveal>
        <ClickReveal prompt="Backend / API">
          <Card pad="md" style={{ position: 'relative', overflow: 'hidden' }}>
            <ColorBar color="var(--sm-chart-3)" />
            <Stack gap="xs">
              <Row gap="sm">
                <Server size={20} style={{ color: 'var(--sm-chart-3)' }} />
                <Text style={{ fontWeight: 600 }}>Backend / API</Text>
              </Row>
              <Text muted size="sm">User/property management, device linking, alert creation, Trust/Ignore writeback, baseline status</Text>
            </Stack>
          </Card>
        </ClickReveal>
        <ClickReveal prompt="Watcher + Analytics">
          <Card pad="md" style={{ position: 'relative', overflow: 'hidden' }}>
            <ColorBar color="var(--sm-chart-5)" />
            <Stack gap="xs">
              <Row gap="sm">
                <Brain size={20} style={{ color: 'var(--sm-chart-5)' }} />
                <Text style={{ fontWeight: 600 }}>Watcher + Analytics</Text>
              </Row>
              <Text muted size="sm">Real-time filtering, fingerprint logic, baseline learning, "new presence" detection, alert rules</Text>
            </Stack>
          </Card>
        </ClickReveal>
        <ClickReveal prompt="DevOps / Platform">
          <Card pad="md" style={{ position: 'relative', overflow: 'hidden' }}>
            <ColorBar color="var(--sm-chart-4)" />
            <Stack gap="xs">
              <Row gap="sm">
                <Settings size={20} style={{ color: 'var(--sm-chart-4)' }} />
                <Text style={{ fontWeight: 600 }}>DevOps / Platform</Text>
              </Row>
              <Text muted size="sm">EMQX hosting, Watcher + API deploy, Redis + Postgres, secrets, monitoring + logs, OTA pipeline</Text>
            </Stack>
          </Card>
        </ClickReveal>
        <ClickReveal prompt="Beta Ops">
          <Card pad="md" style={{ position: 'relative', overflow: 'hidden' }}>
            <ColorBar color="var(--sm-accent)" />
            <Stack gap="xs">
              <Row gap="sm">
                <Users size={20} style={{ color: 'var(--sm-accent)' }} />
                <Text style={{ fontWeight: 600 }}>Beta Ops</Text>
              </Row>
              <Text muted size="sm">20 beta homes recruited, install guide, troubleshooting page, feedback loop, demo videos</Text>
            </Stack>
          </Card>
        </ClickReveal>
      </Grid>
    </Stack>
  </Slide>,

  // ── s14: MARKETING WEBSITE — Beta Signup ────────────────────────
  <Slide key="s14" layout="free">
    <Brand />
    <Stack gap="lg" style={{ maxWidth: '90%', margin: '0 auto', justifyContent: 'center', flex: 1 }}>
      <Row gap="sm" align="center">
        <IconCircle icon={Globe} color="var(--sm-chart-2)" />
        <Stack gap="xs">
          <Badge>Beta Launch</Badge>
          <Heading size="md">Marketing Website</Heading>
        </Stack>
      </Row>
      <Text muted style={{ maxWidth: '60ch' }}>
        Once MVP is complete, we drive beta signups through the marketing site.
        Goal: 20 beta homes recruited and active.
      </Text>
      <Card pad="sm" style={{
        overflow: 'hidden', display: 'flex', justifyContent: 'center',
        maxHeight: 'clamp(200px, 35vh, 380px)',
      }}>
        <img
          src="/__api/decks/saberalert-mvp/assets/Screenshot_2026-03-01_at_11.58.16___AM.png"
          alt="SaberAlert Marketing Website"
          style={{
            width: '100%', objectFit: 'contain', borderRadius: '4px',
          }}
        />
      </Card>
      <Row gap="md" style={{ justifyContent: 'center' }}>
        <Card pad="sm">
          <Row gap="sm">
            <Users size={16} style={{ color: 'var(--sm-chart-2)' }} />
            <Text size="sm">20 beta homes target</Text>
          </Row>
        </Card>
        <Card pad="sm">
          <Row gap="sm">
            <Rocket size={16} style={{ color: 'var(--sm-primary)' }} />
            <Text size="sm">Install guide + troubleshooting</Text>
          </Row>
        </Card>
      </Row>
    </Stack>
  </Slide>,

  // ── s15: ASK — Call to Action ──────────────────────────────────
  <Slide key="s15" layout="center" bg="mesh">
    <Brand />
    <GradientText size="lg" style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)' }}>
      Ship. Provision. Learn. Alert.
    </GradientText>
    <Spacer size="md" />
    <Text muted style={{ maxWidth: '48ch', textAlign: 'center' }}>
      Every team owns a gate. Every gate has clear exit criteria.
      Let's align on owners and timelines — and get to Gate 0.
    </Text>
    <Spacer size="md" />
    <Row gap="md" style={{ justifyContent: 'center' }}>
      <Card pad="sm" style={{ borderColor: 'var(--sm-primary)' }}>
        <Row gap="sm">
          <ArrowRight size={16} style={{ color: 'var(--sm-primary)' }} />
          <Text size="sm" style={{ fontWeight: 600 }}>Assign Gate Owners</Text>
        </Row>
      </Card>
      <Card pad="sm" style={{ borderColor: 'var(--sm-secondary)' }}>
        <Row gap="sm">
          <ArrowRight size={16} style={{ color: 'var(--sm-secondary)' }} />
          <Text size="sm" style={{ fontWeight: 600 }}>Set Gate 0 Deadline</Text>
        </Row>
      </Card>
      <Card pad="sm" style={{ borderColor: 'var(--sm-accent)' }}>
        <Row gap="sm">
          <Upload size={16} style={{ color: 'var(--sm-accent)' }} />
          <Text size="sm" style={{ fontWeight: 600 }}>Recruit 20 Beta Homes</Text>
        </Row>
      </Card>
    </Row>
    <Spacer size="lg" />
    <Text size="xs" style={{ color: 'var(--sm-muted)', opacity: 0.5 }}>
      Eric Kittelson · Digital Saber · Pre-Seed 2026
    </Text>
  </Slide>,
];

export default slides;
