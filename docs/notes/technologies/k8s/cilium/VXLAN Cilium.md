---
tags:
  - cilium
  - networking
  - vxlan
  - k8s
---
# Cilium VXLAN

> **Concept Reference:** [[VXLAN]]

When you install Cilium (or other CNIs like Flannel or Calico), by default, it usually uses VXLAN to create an overlay network. 

It's the easiest way to make all pods communicate no matter which nodes they're in, because **it doesn't need any configuration on the physical routers or switches**. It just works in any network that allows UDP traffic.
* **Default Port:** Cilium uses UDP port `8472` by default for VXLAN traffic.

In Cilium, two main datapath options exist:
1. **Tunneling (Overlay):** Uses VXLAN or Geneve.
2. **Native Routing:** Avoids the VXLAN overhead, but requires the underlying network to understand Pod IPs (often configured via BGP).