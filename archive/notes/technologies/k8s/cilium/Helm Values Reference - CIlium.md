---
tags:
  - k8s
  - cilium
  - cni
  - helm
  - AI-gen
version: v1.19.1
---
# Helm Values Reference - Cilium


> Source: [values.yaml](https://github.com/cilium/cilium/blob/main/install/kubernetes/cilium/values.yaml) (official Cilium chart) Sections ordered by operational importance.

---

## Cluster Identity

```yaml
cluster:
  name: default       # Required for ClusterMesh and SPIRE mTLS. Max 32 chars, lowercase alphanumeric + dashes.
  id: 0               # Unique int 1–255 across all connected clusters. 0 = no ClusterMesh.
```

---

## Routing Mode

Controls how pod-to-pod traffic crosses nodes.

```yaml
routingMode: ""           # "" | "tunnel" (default) | "native"
tunnelProtocol: ""        # "" | "vxlan" (default) | "geneve"
tunnelPort: 0             # 0 = default (8472 for VXLAN, 6081 for Geneve)
MTU: 0                    # 0 = auto-detect. Override when using tunnels (subtract 50–60 bytes from NIC MTU).

autoDirectNodeRoutes: false       # true = install pod CIDR routes between nodes (requires L2 adjacency)
directRoutingSkipUnreachable: false

## Required when routingMode=native and pod CIDRs overlap with node CIDRs:
ipv4NativeRoutingCIDR: ""         # e.g. "10.0.0.0/8"
ipv6NativeRoutingCIDR: ""
```

> **Homelab / k3s tip:** `routingMode: native` + `autoDirectNodeRoutes: true` avoids VXLAN overhead if all nodes are on the same L2 segment.

---

## kube-proxy Replacement (KPR)

```yaml
kubeProxyReplacement: "false"     # "true" = full KPR (recommended with Cilium CNI)
kubeProxyReplacementHealthzBindAddr: ""   # e.g. "0.0.0.0:10256" to expose healthz

## Required when kubeProxyReplacement=true:
k8sServiceHost: ""        # API server host. Use "auto" for auto-lookup.
k8sServicePort: ""        # API server port (usually 6443)
```

> When `kubeProxyReplacement: "true"`, kube-proxy must **not** be running. Cilium takes over NodePort, ClusterIP, ExternalIP, and LoadBalancer handling entirely via eBPF.

---

## NodePort & Load Balancing

```yaml
nodePort:
  # range: "30000,32767"          # Override the NodePort range
  bindProtection: true            # Prevent apps from binding to NodePort ports
  autoProtectPortRange: true      # Append NodePort range to ip_local_reserved_ports
  enableHealthCheck: true         # Healthcheck NodePort server for LB services

loadBalancer:
  # algorithm: random             # "random" | "maglev"
  # mode: snat                    # "snat" | "dsr" | "hybrid"
  acceleration: disabled          # "disabled" | "native" (XDP) | "best-effort"
  serviceTopology: false          # Enables K8s Topology Aware Hints
  l7:
    backend: disabled             # "disabled" | "envoy" (L7 LB via Envoy)
    algorithm: round_robin        # "round_robin" | "least_request" | "random"
    ports: []                     # Ports auto-redirected to L7 backend

serviceNoBackendResponse: reject  # "reject" | "drop"
```

---

## IPAM

```yaml
ipam:
  mode: "cluster-pool"            # "cluster-pool" | "kubernetes" | "multi-pool" | "eni" | "azure"
  ciliumNodeUpdateRate: "15s"
  operator:
    clusterPoolIPv4PodCIDRList: ["10.0.0.0/8"]   # Pod CIDR pool
    clusterPoolIPv4MaskSize: 24                   # /24 allocated per node (254 usable IPs)
    clusterPoolIPv6PodCIDRList: ["fd00::/104"]
    clusterPoolIPv6MaskSize: 120

defaultLBServiceIPAM: lbipam     # "lbipam" | "nodeipam" | "none"
```

> `clusterPoolIPv4MaskSize: 24` gives 254 pod IPs per node. Increase to `/26` if you have many small nodes and want to conserve the pool.

---

## IP Stack

```yaml
ipv4:
  enabled: true
ipv6:
  enabled: false

enableIPv4Masquerade: ~           # true by default (null = auto). Set false with native routing + proper node routes.
enableIPv6Masquerade: true
bpf:
  masquerade: ~                   # true = eBPF-native masquerade (replaces iptables MASQUERADE). Requires KPR.
```

---

## eBPF / BPF Datapath

```yaml
bpf:
  preallocateMaps: false          # true = lower latency, higher memory usage
  lbMapMax: 65536                 # Max service entries in LB maps
  policyMapMax: 16384             # Max entries in per-endpoint policy map
  ctTcpMax: ~                     # Default 524288 — TCP conntrack table size
  ctAnyMax: ~                     # Default 262144 — non-TCP conntrack table size
  natMax: ~                       # Default 524288 — NAT table size
  monitorAggregation: medium      # "none" | "low" | "medium" | "maximum" — Hubble/monitor verbosity
  monitorInterval: "5s"
  monitorFlags: "all"             # TCP flags that trigger first-packet monitor events
  lbExternalClusterIP: false      # Allow external traffic to reach ClusterIP services
  datapathMode: veth              # "veth" | "netkit" | "netkit-l2"
  enableTCX: true                 # Use tcx instead of tc hooks (kernel ≥ 6.6)
  tproxy: ~                       # eBPF TPROXY for L7 policy (incompatible with netkit)
  mapDynamicSizeRatio: ~          # Auto-size BPF maps relative to available RAM (default 0.0025)

bpfClockProbe: false              # eBPF clock source probing for tick retrieval

## DANGER: only use during full reinstall
cleanBpfState: false              # Wipe all eBPF datapath state on agent start
cleanState: false                 # Wipe all Cilium state (implies cleanBpfState)
```

---

## CNI

```yaml
cni:
  install: true
  uninstall: false                # Set true only when removing Cilium from cluster
  exclusive: true                 # Rename competing CNI configs to *.cilium_bak
  chainingMode: ~                 # "none" | "aws-cni" | "flannel" | "generic-veth" | "portmap"
  chainingTarget: ~               # CNI network name for chaining target
  logFile: /var/run/cilium/cilium-cni.log
  confPath: /etc/cni/net.d
  binPath: /opt/cni/bin
```

---

## Encryption

```yaml
encryption:
  enabled: false
  type: ipsec                     # "ipsec" | "wireguard" | "ztunnel"
  nodeEncryption: false           # Node-to-node encryption (WireGuard only)
  strictMode:
    egress:
      enabled: false              # Drop unencrypted egress pod traffic
      cidr: ""
      allowRemoteNodeIdentities: false
    ingress:
      enabled: false              # Drop unencrypted ingress overlay traffic (WireGuard + tunnel only)
  ipsec:
    secretName: cilium-ipsec-keys
    keyFile: keys
    keyRotationDuration: "5m"
    keyWatcher: true
    encryptedOverlay: false
  wireguard:
    persistentKeepalive: 0s       # 0 = disabled
```

> WireGuard is simpler to operate (no pre-shared key management, kernel-native). IPsec is required for FIPS environments or when PERFMON/BPF caps aren't available.

---

## Policy

```yaml
policyEnforcementMode: "default"  # "default" | "always" | "never"
## default = enforce only on endpoints that have at least one policy
## always  = enforce on all endpoints (deny-all if no policy)

k8sNetworkPolicy:
  enabled: true                   # Standard K8s NetworkPolicy support

k8sClusterNetworkPolicy:
  enabled: false                  # K8s Cluster Network Policy (alpha)

l7Proxy: true                     # L7 network policy via Envoy (required for HTTP/gRPC policies)
```

---

## Hubble (Observability)

```yaml
hubble:
  enabled: true
  listenAddress: ":4244"          # Must match relay.targetPort

  tls:
    enabled: true                 # Disable only for local dev, never in prod
    auto:
      enabled: true
      method: helm                # "helm" | "cronJob" | "certmanager"
      certValidityDuration: 365

  metrics:
    enabled: ~                    # e.g. [dns, drop, tcp, flow, icmp, http]
    port: 9965
    enableOpenMetrics: false
    serviceMonitor:
      enabled: false              # Set true if Prometheus Operator is installed
      interval: "10s"
    dashboards:
      enabled: false              # Auto-import Grafana dashboards via sidecar label

  relay:
    enabled: false                # Enable for hubble CLI / UI external access
    replicas: 1
    service:
      type: ClusterIP
    prometheus:
      enabled: false
      port: 9966

  ui:
    enabled: false
    service:
      type: ClusterIP
      nodePort: 31235
    ingress:
      enabled: false

  networkPolicyCorrelation:
    enabled: true                 # Annotates flows with matching network policy names

  redact:
    enabled: false                # Redact sensitive L7 data (URL params, auth headers)
```

---

## Prometheus Metrics

```yaml
## cilium-agent metrics
prometheus:
  enabled: false
  port: 9962
  serviceMonitor:
    enabled: false
    interval: "10s"
  metrics: ~                      # "+metric_foo -metric_bar" format to add/remove from defaults
  controllerGroupMetrics:
    - write-cni-file
    - sync-host-ips
    - sync-lb-maps-with-k8s-services

## cilium-operator metrics
operator:
  prometheus:
    enabled: true                 # On by default for the operator
    port: 9963
    serviceMonitor:
      enabled: false

## cilium-envoy metrics
envoy:
  prometheus:
    enabled: true
    port: "9964"
    serviceMonitor:
      enabled: false
```

> Ports at a glance: **agent** `9962`, **operator** `9963`, **envoy** `9964`, **hubble** `9965`, **hubble-relay** `9966`.

---

## Operator

```yaml
operator:
  enabled: true
  replicas: 2                     # 2 for HA (anti-affinity by hostname by default)
  hostNetwork: true
  endpointGCInterval: "5m0s"
  nodeGCInterval: "5m0s"
  identityGCInterval: "15m0s"
  identityHeartbeatTimeout: "30m0s"
  removeNodeTaints: true
  setNodeNetworkStatus: true
  unmanagedPodWatcher:
    restart: true                 # Restart pods not managed by Cilium (e.g. during CNI migration)
    intervalSeconds: 15
```

---

## BGP & L2

```yaml
bgpControlPlane:
  enabled: false                  # BGP via CiliumBGPPeeringPolicy CRDs

l2announcements:
  enabled: false                  # ARP-based LB IP announcements (similar to MetalLB L2)
  # leaseDuration: 15s
  # leaseRenewDeadline: 5s
  # leaseRetryPeriod: 2s

l2podAnnouncements:
  enabled: false                  # Gratuitous ARP for pod IPs (for L2 reachability)
  interface: "eth0"

enableLBIPAM: true                # Enable LB-IPAM (CiliumLoadBalancerIPPool CRDs)
enableInternalTrafficPolicy: true
```

---

## Egress Gateway

```yaml
egressGateway:
  enabled: false                  # SNAT + redirect for traffic leaving the cluster
  reconciliationTriggerInterval: 1s
```

---

## Envoy (Standalone DaemonSet)

```yaml
envoy:
  enabled: ~                      # true for new installs (default). Runs as a separate DaemonSet.
  connectTimeoutSeconds: 2
  maxGlobalDownstreamConnections: 50000
  idleTimeoutDurationSeconds: 60
  streamIdleTimeoutDurationSeconds: 300
  prometheus:
    enabled: true
    port: "9964"
```

---

## Bandwidth Manager

```yaml
bandwidthManager:
  enabled: false                  # EDT-based rate limiting via "kubernetes.io/egress-bandwidth" annotation
  bbr: false                      # BBR TCP congestion control for pods
```

---

## Ingress Controller / Gateway API

```yaml
ingressController:
  enabled: false                  # Cilium as Ingress controller (uses Envoy internally)
  default: false                  # Make it the default IngressClass
  loadbalancerMode: dedicated     # "dedicated" | "shared"
  enforceHttps: true

gatewayAPI:
  enabled: false                  # Gateway API support (requires gateway.networking.k8s.io CRDs)
  gatewayClass:
    create: auto
```

---

## Miscellaneous

```yaml
upgradeCompatibility: null        # e.g. "1.15" — prevents breaking configMap changes during upgrades

identityAllocationMode: "crd"     # "crd" (default) | "kvstore"

installNoConntrackIptablesRules: false  # Skip netfilter conntrack (requires KPR + native routing, non-managed cluster)

rollOutCiliumPods: false          # Auto-restart agent pods when ConfigMap changes

debug:
  enabled: false
  verbose: ~                      # "datapath envoy policy" etc.

waitForKubeProxy: false           # Wait for KUBE-PROXY-CANARY iptables rule before starting (legacy)

serviceNoBackendResponse: reject  # Behavior for traffic hitting a service with no backends
policyDenyResponse: none          # Response for pod egress denied by policy ("none" | "icmp")
```