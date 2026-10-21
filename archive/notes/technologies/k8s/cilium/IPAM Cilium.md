---
tags:
  - cilium
  - networking
  - ipam
  - k8s
  - cni
---
# Cilium IPAM

> **Concept Reference:** [[IPAM]]

In Cilium, the IPAM mode setting tells the CNI **where to find IPs and who has the authority over them**. It dictates how Cilium interacts with the infrastructure to get valid IPs for the Pods.

### `cluster-pool`

Ideally for bare-metal. You give a huge block of IPs (like `10.0.0.0/8`) and Cilium fully manages it. It divides the `/8` into smaller CIDRs (`/24` by default) and assigns a slice to each Node. Cilium reads which block corresponds to which node and starts allocating IPs. When a pod is born in Node A, it gets an IP from Node A's block.

### `kubernetes`

In this mode, Cilium is more "passive" and gives the authority to Kubernetes itself (`kube-controller-manager`). Kubernetes is the one who assigns the block of IPs (`PodCIDR`) to each Node. Cilium just reads the block assigned to each Node and allocates the IPs.

### Cloud native modes (`eni`, `azure`, `gke`)

If you are in the cloud, things change. If you use `eni` in AWS, Cilium doesn't "create" internal IPs; it directly uses the AWS API to ask for real IPs from the AWS VPC. 
* **Benefit:** Your pod gets a real cloud IP. Any other machine on that VPC can communicate directly with the pod without the need for NAT.