---
tags:
  - k8s
  - cilium
  - cni
  - helm
  - youtube
link: https://www.youtube.com/watch?v=ni0Uw4WLHYo
---
# Helm Values Reference (YouTube) - Cilium

### General & Debugging

* `ipv4.enabled` / `ipv6.enabled`: Very straightforward. Defaults are `true` for IPv4 and `false` for IPv6.
* `debug.enabled`: Passes the `--debug` flag to various Cilium containers (e.g., `cilium-envoy`, `clustermesh-apiserver`, `hubble-relay`). Default is `false`.
* `extraConfig`: Allows you to specify additional configuration parameters to be included in the `cilium-config` configmap. Values are injected **after** the other values. Since Kubernetes takes the last key if there are duplicates, this acts as a global override.

### Datapath & Routing

* `devices`: Specifies which network interfaces can run the eBPF datapath. When not specified, probing will automatically detect devices. You can use values like `eth+` to mean "all devices starting with eth". Default is `unset`.
* `bpf.lbExternalClusterIP`: Enables the use of per-endpoint routes instead of routing via the `cilium_host` interface. Default is `false`.
  * *Usecase:* Useful for `eni` mode. It allows traffic to bypass the host's network stack and hop directly to the container's interface, saving an extra hop. **Note:** This requires shifting where policy enforcement happens, as the packet skips the host network stack.
* `autoDirectNodeRoutes`: Enables installation of PodCIDR routes between worker nodes if they share a common L2 network segment. 
  * *How it works:* Modifies the host route table to populate the Pod IP ranges of other nodes with the IP of that specific node. The Linux kernel can then route packets directly without emitting them to the infrastructure between nodes.
  * *Important:* This is for **native** mode, not tunneling. The daemon will error if enabled alongside tunneling. It only works if all nodes are in the same L2 domain. You typically see this in bare-metal homelabs, clusters running as VMs on Proxmox, `kind` clusters, or server racks connected by an L2 switch.

### IPAM Configuration

> **Concept Reference:** [[IPAM]] & [[Cilium IPAM]]

* `ipam.mode`: Valid values include `kubernetes`, `eni`, `azure`, `cluster-pool`, etc. Default is `cluster-pool`.
* `ipam.operator.clusterPoolIPv4PodCIDRList`: IPv4 CIDR list range to delegate to individual nodes for IPAM. Default is `["10.0.0.0/8"]`. 
  * *Note:* Often needs to be changed (e.g., to `11.0.0.0/16`) to avoid clashing with existing internal home/firewall networks.
* `eni.enabled`: Enables Elastic Network Interface integration. Default is `false`.

### Masquerading

> **Concept Reference:** [[Masquerade (SNAT)]]

* `enableIPv4Masquerade` / `enableIPv6Masquerade`: Enables masquerading of IP traffic leaving the node from endpoints. Default is `true`.
* `egressMasqueradeInterfaces`: Limits egress masquerading to an interface selector. Default is `unset`.
  * *Note:* Cilium supports iptables mode (default) and pure eBPF mode for masquerading. You can inspect the iptables masquerade chain to see what it is doing.

### eBPF Internals

* `bpf.mapDynamicSizeRatio`: Tells the kernel how much of the overall memory budget the eBPF maps should take up. Tune this for high-throughput or memory-constrained environments. Default is `0.0025`.
* `bpf.preallocateMaps`: Trades longer startup time for better performance during traffic spikes. By default, maps start empty and grow. This flag tells the kernel to fully allocate them on startup based on expected size.

### Monitor Aggregation

* `bpf.monitorAggregation`: Configures the level of aggregation for monitor notifications (`none`, `low`, `medium`, `maximum`). Default is `medium`. 
* `bpf.monitorInterval`: Time between monitor notifications for active connections. Subsecond resolution is meaningless unless specified (e.g., `5s`). Default is `5s`.
* `bpf.monitorFlags`: Configures which TCP flags (FIN, SYN, RST, PSH, ACK, URG, ECE, CWR) trigger notifications when seen for the first time in a connection. Uses bitwise operations.

### Fallbacks

* `enableXTSocketFallback`: Enables compatibility for when the `xt_socket` kernel module is missing but needed for L7 datapath redirection. Default is `true`.