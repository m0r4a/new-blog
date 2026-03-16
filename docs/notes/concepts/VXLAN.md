---
tags:
  - networking
  - layer-2
  - layer-3
  - layer-4
---

# Virtual eXtensible Local Area Network (VXLAN)

VXLAN is an encapsulation protocol. Basically, tricks the physical network hiding the traffic as regular traffic of the nodes. It works like a Matryoshka.

## Why is it called Virtual eXtensible LAN?
Traditionally, to isolate L2 networks you used VLANs. But VLANs have a technical limit of 4,096 different networks, which, in modern data centers is not a lot. VXLAN uses a 24 bit identifier, which allows you to create 16 million virtual networks overlayed and isolated over the same physical infrastructure.

## The negative side of VXLAN
Wrap a packet inside another packet adds around 50 bytes on each send (overhead), and it requires a litte bit of more effort from the CPU to encapsulate and decapsulate packets constantly.
If you look for maximum performance in a bare-metar environment, and you want to avoid this "overhead", an alternative is using Native Routing, integrating protocols like BGP, in which you actually teach your physical routers how to reach the IPs.