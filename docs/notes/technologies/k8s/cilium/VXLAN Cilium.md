---
tags:
  - cilium
  - networking
  - vxlan
  - k8s
---
# VXLAN Cilium

> **Concept Reference:** [[VXLAN]]

So, first, I need to understand which problem Kubernetes wants to solve. This is known as an Overlay network.

## Real world vs Pods world
Imagine you're creating a cluster with some VMs running in an enviorment like Proxmox, you have two nodes:
* Node A (Physical IP: 192.168.1.10)
* Node B (Physical IP: 192.168.1.11)

Pod 1 (10.0.1.5) lives inside Node A, and Pod 2 (10.0.2.5) lives inside Node B.
If Pod 1 wants to talk with Pod 2, they send a packet. The problem is that the physical router doesn't know who the network 10.0.x.x is.. Those IPs only exist in the Kubernetes context. If that packet goes to the physical network "raw", it will be dropped by the switch/router because the won't know how to route it.
The solution for this is hiding the traffic of the pods as regular traffic of the nodes.

## It works like a Matryoshka
* **Original packet:** Pod 1 creates the packet for Pod 2 (From 10.0.1.5 -> To: 10.0.2.5)
* **New packet (VXLAN Encapsulation):** Cilium catches the packet before goes out of the Node A to the physical network. Since Cilium knows that Pod 2 lives in Node B, takes the original kubernetes packet and puts it into a regular UDP packet.
* **The physical send:** Now, from the outside, the packet has the addresses of the physical Nodes (From 192.168.1.10 -> To: 192.168.1.11)
* **The delivery:** Now the packet can happily travel through the physical switch, since it's normal traffic.
* **Decapsulation:** When the packet reaches the Node B, Cilium intercepts it, opens the "outer layer" (removes the VXLAN header), get's the original packet from Pod 1 and delivers it to Pod 2.

## VXLAN in Cilium
When you install Cilium (or other CNI like Flannel or Calico), by default, it usually uses VXLAN to create that overlay network. It's the easiest way to make all the pods communicate no matter in which nodes they're in, that's because *doesn't need any configuration on the physical routers or switches**. It just works in any network that allows UDP traffic (Cilium uses port 8472 by default for this).