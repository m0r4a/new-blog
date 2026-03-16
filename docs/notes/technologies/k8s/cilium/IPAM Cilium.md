---
tags:
  - cilium
  - networking
  - ipam
  - k8s
---
# IPAM Cilium

> **Concept Reference:** [[IPAM]]

Cilium is complicated, I mean, sure, you can just install it and never use hubble, ebpf, any type of policies and use it totally vanilla, but at that ponit just use the base kube-proxy if you don't plan on using any of the features. But anyways, the point is that concepts like VXLAN are foregin, I know VLANs bbut idk what's VXLAN so, yea, I will write down all the concept I find in this with my own words and my usecases.

In this case, to the PODs.

## IPAM mode
This settings tells Cilium where to find those IPs and who has the authority over them, so, it tells Cilium how to interact with them and the infra around it to get valid IPs for the PODs.

### cluster-pool
This is ideally for bare metal, you give a huge block of IPs, like 10.0.0.0/8 and Cilium fully manages it. He divides the /8 into smaller CIDR (/24 by default) and assigns a slice to each Node. Cilium reads which block corresponds to which node and starts giving away the IPs from there. When a pod borns in Node A, gives an IP from the block assigned to that node.
This makes a lot of sense now, when I install cilium I do it like this: `cilium install --version 1.19.0 --set ipam.operator.clusterPoolIPv4PodCIDRList=11.0.0.0/16`, I change the default 10.0.0.0 with 11, I remember that I struggle at first when installing cilium, didn't realize that the CIDR range clashed with my internal network behind my firewall clashed, so I used that flag, but didn't read about it thoroughly.

### kubernetes
In this mode, Cilium is more "passive" and gives the authority to Kubernetes itself (kube-controller-manager). Kubernetes is the one who assign the block of IPs (PodCIDR) to each Node. Cilium just reads the block of IPs assigned to each Node and gives the IPs away.

### Cloud native modes, (eni, azure, gke)
If you are in the cloud, the things change. If you use eni in AWS, Cilium don't "create" the internal IPs, it uses directry the AWS API and ask for the real IPs on the AWS VPC.
Your pod gets a real cloud IP. Any other machine on that AWS VPC can communicate directly with the pod without the need NAT.