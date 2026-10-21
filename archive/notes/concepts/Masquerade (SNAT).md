---
tags:
  - networking
  - layer-3
  - nat
---
# Masquerade (SNAT)

Masquerading is a form of Source Network Address Translation (SNAT). 

When emitting packets from an internal network (like a private IP address) to something external (like a publicly accessible IP), the packet carries the source IP. If that private IP is not externally routable, the receiving system won't be able to send a response back. 

Masquerade changes the source IP address of the packet as it leaves the internal network to match the IP address of the node/router making the request. When the node gets the response, it applies the reverse translation to send it to the correct internal device.

**Note:** Regular SNAT requires you to specify the exact source IP address you are translating to. Masquerade dynamically binds to an interface: anything going through that interface will be masqueraded to the IP address attached to it.