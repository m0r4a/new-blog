---
tags:
  - networking
  - layer-2
  - layer-3
  - layer-4
---
# Virtual eXtensible Local Area Network (VXLAN)

VXLAN is an **encapsulation** protocol that solves the limitations of traditional L2 networks. Basically, it tricks the physical network by hiding the internal traffic as regular node-to-node traffic.

## Real world vs Overlay world
Imagine you're creating a cluster with some VMs running in an environment like Proxmox. You have two nodes:
- Node A (Physical IP: `192.168.1.10`)
- Node B (Physical IP: `192.168.1.11`)

If a virtualized entity (like a Pod) with IP `10.0.1.5` inside Node A wants to talk to `10.0.2.5` in Node B, the physical router will drop the packet. The physical switch doesn't know what the `10.0.x.x` network is. Those IPs only exist in the virtual context.

## It works like a Matryoshka
1. **Original packet**: The source creates the packet for the destination (From `10.0.1.5` -> To: `10.0.2.5`).
2. **New packet (VXLAN Encapsulation)**: The agent (e.g., a CNI) catches the packet before it goes out to the physical network. It takes the original packet and puts it into a regular UDP packet.
3. **The physical send**: From the outside, the packet now has the addresses of the physical Nodes (From `192.168.1.10` -> To: `192.168.1.11`).
4. **The delivery**: The packet can happily travel through the physical switch, since it's normal traffic.
5. **Decapsulation**: When the packet reaches the destination node, the agent intercepts it, removes the VXLAN header, and delivers the original packet to the target.

## Why is it called Virtual eXtensible LAN?
Traditionally, to isolate L2 networks you used VLANs. But VLANs have a technical limit of 4,096 different networks. VXLAN uses a 24-bit identifier, which allows you to create 16 million virtual networks overlayed and isolated over the same physical infrastructure.

## The negative side of VXLAN
Wrapping a packet inside another packet adds around 50 bytes on each send (overhead), and it requires a little bit more effort from the CPU to encapsulate and decapsulate packets constantly.
For maximum performance in a bare-metal environment to avoid this overhead, an alternative is using **Native Routing**, integrating protocols like **BGP**, to actually teach the physical routers how to reach the internal IPs.