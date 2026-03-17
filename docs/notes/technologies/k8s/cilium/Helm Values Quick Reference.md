---
tags:
  - k8s
  - cilium
  - cni
  - quick-reference
  - AI-gen
  - helm
version: v1.19.1
---
# Quick Reference: Common Homelab Config

```yaml
## Minimal opinionated homelab / k3s values
kubeProxyReplacement: "true"
k8sServiceHost: "<your-api-server-ip>"
k8sServicePort: "6443"

routingMode: "native"
autoDirectNodeRoutes: true
ipv4NativeRoutingCIDR: "10.0.0.0/8"

ipam:
  mode: "cluster-pool"
  operator:
    clusterPoolIPv4PodCIDRList: ["10.42.0.0/16"]
    clusterPoolIPv4MaskSize: 24

bpf:
  masquerade: true

hubble:
  enabled: true
  relay:
    enabled: true
  ui:
    enabled: true
  metrics:
    enabled: [dns, drop, tcp, flow, icmp, http]
    serviceMonitor:
      enabled: true   # If Prometheus Operator is installed

prometheus:
  enabled: true
  serviceMonitor:
    enabled: true

operator:
  prometheus:
    enabled: true
    serviceMonitor:
      enabled: true
```