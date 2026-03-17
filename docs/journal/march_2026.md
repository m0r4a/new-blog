# March 2026

## March 5

This is my personal journal, Im not a native english speaker and I usually try to be careful with my syntax and stuff but I don't want to think much about that while typing the journal, If I try to make it "too good" I will end up dropping the project immediatly.

So, I've been working for some months now and there's always a lot of stuff going on, I usually assign tasks myself to myself lol trying to improve their monitoring, diagnose issues and so on. But you can't properly monitor what you don't now, for example, Postgres, we have had _some issues_ with it and to be honest I think databases are my absolute weakeast point when it comes to this techy stuff, and yea, I'm planning to work on it, I can't stand be that BAD. I actually have this list of resources:

1. https://databaseschool.com/series
2. https://www.crunchydata.com/developers/tutorials
3. MAAYBE this one: https://www.enterprisedb.com/training
4. And MAYBE this one as an occasional side quest: https://www.enterprisedb.com/training

Ah yea, I was talking about the job, I'm worried that now that I have less time I stop studying and working on my projects or just stop learning. One of my other worries is to not being able to actually rest, sometimes I get stuck in this loop in which I don't rest well because I don't feel like I "deserve" it, then I don't work well because I don't rest well, and, FOR ME, the ideal case would be to work hard and then fully rest, you know, have a nice balance.

So, I did this, this is meant to be thingy in which I registry for myself that I'm actually learning and moving constantly forward.

## March 6

Im working on Flux now, I need it as part of the KTSW project thingy so yea, flux cd. Apparently it uses kustomize no matter what becauese kustomize by it's own handles dependencies on the yamls so, yea, it doesn't do a dumb apply -f but uses a `kubectl kustomize` instead. I also _learned_ about kustomize for the "first" time. I was working on the company on a way to have traces without instrumentation, we tried [pixie](https://docs.px.dev/about-pixie/pixie-ebpf/) (and many other things such as [Odigos](https://odigos.io/)) but nothing quite clicked (probably [OBI](https://github.com/open-telemetry/opentelemetry-ebpf-instrumentation) will be the move but I'm waiting for the 1.x version) but the thing is that, when working on Pixie, we decided to dropped it because the installation was SUPER flimsy, a single restart and it was GONE, I tried to debug it reading the manifests and stumbled upon some "kustomization.yaml"s but I didn't quite have the time to deeply look into it.

Turn out Kustomize is like an "easy" way to patch your deployments for different enviorments with the {{something.something}} hell of the template vars on Go, which is present on projects like, helm.

The structure is kinda like this:

```
observability/
├── grafana/
│   ├── base/
│   │   ├── deployment.yaml
│   │   ├── service.yaml
│   │   ├── configmap-datasources.yaml
│   │   ├── configmap-dashboards.yaml
│   │   ├── rbac.yaml
│   │   └── kustomization.yaml
│   │
│   └── overlays/
│       ├── dev/
│       │   ├── kustomization.yaml
│       │   └── patch-replicas.yaml
│       │
│       └── prod/
│           ├── kustomization.yaml
│           ├── patch-resources.yaml
│           └── ingress.yaml
│
├── loki/
│   ├── base/
│   │   ├── statefulset.yaml
│   │   ├── service.yaml
│   │   ├── configmap.yaml
│   │   └── kustomization.yaml
│   │
│   └── overlays/
│       ├── dev/
│       │   ├── kustomization.yaml
│       │   └── patch-storage.yaml
│       │
│       └── prod/
│           ├── kustomization.yaml
│           ├── patch-resources.yaml
│           └── pvc.yaml
│
└── environments/
    ├── dev/
    │   └── kustomization.yaml
    │
    └── prod/
        └── kustomization.yaml
```

And, inside `grafana/base/kustomization.yaml`:

```yaml
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization

resources:
  - deployment.yaml
  - service.yaml
  - rbac.yaml
  - configmap-datasources.yaml
  - configmap-dashboards.yaml

labels:
  - pairs:
      app: grafana
```

!!! note
    The `pairs` thing is a way to declare a lablel to all the resources declared on the `kustomization.yaml` at the same time, in this case, `deployment.yaml`, `service.yaml`,...,`configmap-dashboards.yaml` will have the `app: grafana` label.

Inside `loki/base/kustomization.yaml`:

```yaml
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization

resources:
  - statefulset.yaml
  - service.yaml
  - configmap.yaml
```

But enough of kustomize. another important thing at least for me is the tokens, you IDEALLY SHOULD use a separte GitHub account with fine grained permissions which I will def. do (I wont) the bare minimum permissions for a classic token for flux is: `full repo scope` and MAYBE (if you're going to use it) `workflow`.

Thats pretty much it for today, I did the [getting started from flux](https://fluxcd.io/flux/get-started/) and now I need to do homework so that's it for today.

## March 7

I honestly didn't do anything, it's saturday and I spent the majority of my day with my girlfriend, helping my mom and doing school homework, it was a very fun day and I actually got very distracted which as a great thing from time to time, I take it as a win.

## March 8

I honestly spent like a billion hours sleeping and doing the _stoopid_ school homework. But still, I wanted to take a deeper look into Kustomize, for future reference, the official docs are [these ones](https://kubernetes.io/docs/tasks/manage-kubernetes-objects/kustomization/) and the video tutorial I watched was [this one](https://www.youtube.com/watch?v=5gsHYdiD6v8), once again, shout out to [That DevOps Guy](https://www.youtube.com/@MarcelDempers) his content is awesome.

this is kinda cheating because is technically March 9 at 1 am but I will count it as March 8. I wrote [this README](https://github.com/m0r4a/k8s-misc/tree/main/concepts/kustomize/1.Whats%20that) in which I followed the tutorial instructions working around the deprecated stuff and also using Grafana instead of That DevOps Guy's exmple app.

It went pretty smoothly to be honest, I already knew the key concepts and folder structure so it was pretty simple.

So yea, first Kustomize file written.

## March 10

I forgot to wite the journal xd. But I worked a lot this day, it was actually my first implementation of Flux CD in my k3s cluster, it was fun and a little tiny bit stressing. I kinda totally fully stole my `.yaml` from `March 8` so I didn't use time to learn how kustomize works. I updated many things, moved around the folder structure, apparently I'm using sort of a "standard" one which is great news for me, [THIS](https://github.com/m0r4a/flux_cd_testing) is the repo on which Im working on this, and yea, that's that, I had a ton of fun.

## March 11

This is technically from March 10 because I did it at like 2 am or smth but anyways, I struggled a lot on trynig to make it "public", everytime I work on a project I try to do it as if someone will use it or try to replicate it, idk why but Im programmed that way, when publishing it I was thinking how to make it easy to replicate. I had some iterations on this but it was too _dirty_, but I got quite happy with the final solution. The issue is this, the folder structure, in general is this one:

├── apps
│   ├── stuff
├── clusters
│   └── homelab
│       ├── flux-system
│       │   ├── gotk-components.yaml
│       │   ├── gotk-sync.yaml
│       │   └── kustomization.yaml
│       ├── stuff

And the contents of `gotk-sync.yaml` are this:

```yaml
apiVersion: source.toolkit.fluxcd.io/v1
kind: GitRepository
metadata:
  name: flux-system
  namespace: flux-system
spec:
  interval: 1m0s
  ref:
    branch: main
  secretRef:
    name: flux-system
  url: ssh://git@github.com/m0r4a/flux_cd_testing
---
apiVersion: kustomize.toolkit.fluxcd.io/v1
kind: Kustomization
metadata:
  name: flux-system
  namespace: flux-system
spec:
  interval: 10m0s
  path: ./clusters/homelab
  prune: true
  sourceRef:
    kind: GitRepository
    name: flux-system
```

The issue is the `secretRef` part, even though I don't **expose** my secrets, when a user adds to it's flux a kustomization aiming at `clusters/homelab` flux will try to sync THAT part, trying to do an authenticated thingy with it, so it will constantly fail for them. As said, there's several iterations on how I thought about handling this which are not even worth mentioning lol, I ended up writing a pipeline that clones the whole repo, deletes the `flux-system` folder and pushes it into a `public` branch, and voilà, you now can aim at `./clusters/homelab` and clone everything in peace (just don't forget to use the public branch)

## March 16

Been a while, exams came and I also lead a rightsizing too which, isn't super complicated because it was never tought of in the company they were many low hanging candidates for it but I had to do a HUGE speadsheet with all k8s resources and that was hella time consuming even when I automated information gathering with Grafana dashboads, it's been a tough week.

Anyways, today I'm continuing with Cilium's helm values, I'm using [THIS](https://www.youtube.com/watch?v=ni0Uw4WLHYo&t=1232s) video as reference for it. They explain like main concepts or configurations you might be interested in. All my notes on this are in my notes:

### Cilium key HELM values

- ipv4.enabled
- ipv6.enabled

Vey straight forward, the defualts are `true` for ipv4 and `false` for ipv6.

---

- debug.enabled

Passes the --debug flag to variuos Cilium containers.
  - cilium-envoy (if L7 enabled)
  - clustermesh-apiserver (if clustermesh enabled)
  - kvstoremesh (if clustermesh enabled)
  - cilium-certgen (if clustermesh enabled)
  - hubble-relay (if enabled)

And, ofc, the default is `false`.

---

- devices

Specify which network interfaces can run the eBPF datapath. This means that a packet sent from a pod to a distination outside the cluster will be masqueraded (to an output device IPv4 address), if the output device runs the program. When not specified, probing will automatically detect devices.

You can put values lake "eth+", here to mean "all devices starting with `eth`"

The default is `unset`.

---

- ipam.mode

It's valid values are: `kubernetes`, `crd`, `eni`, `azure`, `cluster-pool`, `cluster-pool-v2beta`, `multi-pool`, `alibabacloud`, `delegated-plugin`. I found this information in [THIS][https://youtu.be/ni0Uw4WLHYo?list=TLPQMTYwMzIwMjYB07UMoyo3Zg&t=1309) video, but I could't find a modern reference in which all the possible values are listed.

It's default is `cluster-pool`. More detais on [IPAM](#ipam)

---

- ipam.operator.clusterPoolIPv4PodCIDRList

IPv4 CIDR list range to delegate to individual nodes for IPAM.

It's default value is `["10.0.0.0/8"]`

---

- eni.enabled

Enable `Elastic Network Interface (ENI)` integration. The default value is `false`. 

---

- bpf.lbExternalClusterIP

Official description in the chart: Enable the use of per endpoint routes instead of routing vie the cilium_host interface

By default in Cilium a clusterIP would be externally routable, like, if you sent a packet to a k8s node running cilium that had a ClusterIP service on it, by default, cilium would route it correctly, it would route it to the correct pod, so, in order to preserve the expected behavior to clusterIP there's a special flag in the service to indicate that the service is not externally routable and that flag gets passed down all the way out into the ebpf into the `nodeport_lb4` function.

The default value is `false`.

This can set up specific routes on the host for end points for specific interfaces, which is very useful for `eni` mode because this means you can avoid a hop going through the main network interface you can hop the network interface that you need internally on another node which is pretty good. For example, this means that if you have two pods in two nodes that need to talk to eachother if you are using `eni` what would **normally** happen is when this two nodes communicate to the node-to-node kind of internal with cilium and then it would have an extra hop to get to the container but if you have a direct interface available for the container which we do on `eni` mode you can have it hop directry there and bypass the whole iteration through the host networks stack.

One side effect of this is that we then need to change where we do policy enforcement because if a packet can completely skip the hosts network stack and go straight into the container we need to do enforcement there.

---

- autoDirectNodeRoutes

Description in the chart: Enable installation of PodCIDR routes between worker nodes if worker nodes share a commmon L2 network segment

This will modify the route table of the host in order to for the IP Adress ranges for every node, because every node get assigned an IP Adress range for pods on that node (depends on the IPAM mode) but essentialy it does, and this will set up a route table in this nodes to populate it the pod IP Range for other nodes with the IP of that node, this means that when the linux kernel is routing a packet in the networking stack from a pod to a pod in another nodeit can send it directy to that node rather than kind of emit it to the networking infrastructure that exists between the nodes. Re-iterating, Cilium has two data-paths options, you have the **native** and the **tunneling**, when tunneling you have an overlay between all the nodes and native you don't, this is using native mode, not tunneling. The deamon errors if you enable this using tunneling mode.

This ONLY works if all your nodes from your cluster are in the same L2 domain, if they are not, if there's a router or something between them then you're going to have to rely on that outline networking. You tipically see this in homelabs, or like "kind" clusters, or on-prem/bare-metal clusters or like a rack of servers. If you have a rack of servers that have an L2 switch between them this helps a lot because then you don't need somethig like an L3 switch or hop out to a router in order to get packages between different nodes.

#### ebpf internals

- bpf.mapDynamicSizeRatio

You tell how much memory of the overall kind of memory of the memory budget of the application you want the ebpf maps to take up. This settings are the kind of settings that you would tune if you have like a really high throughput or you're winning in a really constrained environment and something like this and you want to be able like fine those ebpf maps. This is really good for helping with the startup time or like kind of "warming up" time.

The default is `0.0025`.

- bpf.preallocateMaps

You can effectively trade longer startup time for better performance when dealing in traffic spikes. The way it does this is that there are, because, you know, cilium uses a whole bunch of ebpf maps. An ebpf map is effectively just the data structure in ebpf which shares data either between ebpf programs or between ebpf programs and user space programs like the agenr, so it's effectively storing data because ebpf programs don't run forever, they have a very limited shelf lik , like cilium ones will only run once per packet to do some processing effectively. This is how they store information between runs. Some of this maps kind of start empty and grow bigger as you add stuff, this onewill tell the kernel by passing the flag to just fully allocate them to begin with based on the expected size.

#### Masquerade

- enableIPv4Masquerade
- enableIPv6Masquerade

Official definition in the chart: Enables masquerading of IPvx traffic leaving the node from endpoints

The idea here is that by default the pods will have IP addresses and the node will have an IP Address in the network and when you're emmiting packets out from your pod to something external, like a public accesible IP, another thing on the same private network, that isn't inside kubernetes, when you send a packet it has the source IP where it came from and the problem is that if your IP Addresses for your pods are not routable outside of the cluster (which is the usual case unless you're doing something like eni mode or something like that) then your not going to be able to get a response because the system you're talking to will try to respond to your pods private IP address which probably will not be able to route to and so it will just fail to get anywhere so, masquerade will change the source IP addres of the packet as is leaving the cluster to be the cluster's node IP address which is expected to be publicy routable in this case, and THEN when the node gets the response it can apply the reverse translation in order to send it to the correct place.

It's default value is `true` for both.

---

egressMasqueradeInterfaces

Official chart doc: Limit egress masquerading to interface seletctor.

The default value is `unset`.

An interesting thing is that there's two modes of this, one is iptables mode and one for pure ebpf mode, cilium by default uses iptables mode but you can customize the behavior. You can use an iptables command to see the iptables masquerade chain to see what is going to do. 

Note: snat requires you to actually specify the source ip address that you're going to change it to whereas masquerade is by the interface so you basically anything that is going through that interface will be masqueraded to the IP address attached to the interface where the Source Natting is I can say anything going here except the source IP address. It's it's going to destination B then the source should be this and things like that.

#### Monitor Aggregation

- bpf.monitorAggregation

Chart docs: Configure the level of aggregation for monitor notifications. `none`, `low`, `medium`, `maximum`. Default is `medium`.

- bpf.monitorFlags

Chart docs: Configure which TCP flags trigger notifications when see for the first time in a connection.

This is how you set which flags you're interested in if you're doing the aggregation. There's effectively 8 tcp flags that you can set which specify certain things about the TCP connection stat, so there's normal wones like FIN, SYN, RST, PSH, ACK, or less common ones like URG, ECE, CWR. they all fit perfectly in one byte so you can do some fun bitwise or operations where you can do bit operations to figure out which flags are set.

- bpf.monitorInterval

Chart docs: Configure the typical time between monitor notifications for active connections

This means that intervals with subsecond resolution are meaningless. Interestingly, `cast.ToDuration` presumes that you mean nanoseconds. So if you don't put the s at the end it will end up as zero seconds. You can give it a 0 or negative value and it's the same as turning off aggregation in both cases.

`5s` it's the default value.


### Notes on Cilium/Networking concepts

#### LPMTire

- `BPF_MAP_TYPE_LPM_TRIE` introduced in Linux 4.11
- LPM stands for "Longest Prefix Match"
- A Tire is a kind of data structure, also known as prefix tree.
- Intended to "[..]" match IP addresses to a stored set of prefixes
- Designed for the CIDR membership use-case
- Efficently finds the "longest prefix" match for items in the three
  - If you put in 10.0.0.0/8 and 10.40.22.0/24, then searching for 10.40.22.12 would return 10.40.22.0/24 even though it matches both  

#### IPAM

Cilium is complicated, I mean, sure, you can just install it and never use hubble, ebpf, any type of policies and use it totally vanilla, but at that ponit just use the base kube-proxy if you don't plan on using any of the features. But anyways, the point is that concepts like VXLAN are foregin, I know VLANs bbut idk what's VXLAN so, yea, I will write down all the concept I find in this with my own words and my usecases.

- IPAM (IP Address Management): in general, this is the thing that manages the IP Address assignment to the devices, in this case, to the PODs.

- IPAM mode: this settings tells Cilium **where to find those IPs and who has the authority over them**, so, it tells Cilium how to interact with them and the infra around it to get valid IPs for the PODs.

=== "cluster-pool"
    ```md
    This is ideally for bare metal, you give a huge block of IPs, `like 10.0.0.0/8` and Cilium fully manages it. He divides the `/8` into smaller CIDR (`/24` by default) and assigns a slice to each Node. Cilium reads which block corresponds to which node and starts giving away the IPs from there. When a pod borns in Node A, gives an IP from the block assigned to that node.

    This makes a lot of sense now, when I install cilium I do it like this: `cilium install --version 1.19.0 --set ipam.operator.clusterPoolIPv4PodCIDRList=11.0.0.0/16`, I change the default 10.0.0.0 with 11, I remember that I struggle at first when installing cilium, didn't realize that the CIDR range clashed with my internal network behind my firewall clashed, so I used that flag, but didn't read about it thoroughly
    ```

=== "kubernetes"
    ```md
    In this mode, Cilium is more "passive" and gives the authority to Kubernetes itself (`kube-controller-manager`). Kubernetes is the one who assign the block of IPs (`PodCIDR`) to each Node. Cilium just reads the block of IPs assigned to each Node and gives the IPs away.
    ```

=== "Cloud native modes, (eni, azure, gke)"
    ```md
    If you are in the cloud, the things change. If you use `eni` in AWS, Cilium don't "create" the internal IPs, it uses directry the AWS API and ask for the real IPs on the AWS VPC.

    Your pod gets a real cloud IP. Any other machine on that AWS VPC can communicate directly with the pod without the need NAT.
    ```

#### VXLAN (Virtual eXtensible Local Area Network),

So, first, I need to understand which problem Kubernetes wants to solve. This is known as an **Overlay** network.

**Real world vs Pods world**

Imagine you're creating a cluster with some VMs running in an enviorment like Proxmox, you have two nodes:

- Node A (Physical IP: `192.168.1.10`)
- Node B (Physical IP: `192.168.1.11`)

**Pod 1** (`10.0.1.5`) lives inside **Node A**, and **Pod 2** (`10.0.2.5`) lives inside **Node B**.

If Pod 1 wants to talk with Pod 2, they send a packet. The problem is that **the physical router doesn't know who the network `10.0.x.x` is.**. Those IPs only exist in the Kubernetes context. If that packet goes to the physical network "raw", it will be dropped by the switch/router because the won't know how to route it.

The solution for this is **VXLAN**. VXLAN is an **encapsulation** protocol. Basically, tricks the physical network hiding the traffic of the pods as regular traffic of the nodes.

It works like a [Matryoshka](https://en.wikipedia.org/wiki/Matryoshka_doll).

1. **Original packet**: Pod 1 creates the packet for Pod 2 (From `10.0.1.5` -> To: `10.0.2.5`)

2. **New packet (VXLAN Encapsulation)**: Cilium catches the packet before goes out of the Node A to the physical network. Since Cilium knows that Pod 2 lives in Node B, takes the original kubernetes packet and puts it into a regular UDP packet.

3. **The physical send**: Now, from the outside, the packet has the addresses of the physical Nodes (From `192.168.1.10` -> To: `192.168.1.11`)

4. **The delivery**: Now the packet can happily travel through the physical switch, since it's normal traffic.

5. **Decapsulation**: When the packet reaches the Node B, Cilium intercepts it, opens the "outer layer" (removes the VXLAN header), get's the original packet from Pod 1 and delivers it to Pod 2.

###### Why is it called Virtual eXtensible LAN?

Traditionally, to isolate L2 networks you used VLANs. But VLANs have a technical limit of 4,096 different networks, which, in modern data centers is not a lot. VXLAN uses a 24 bit identifier, which allows you to create 16 million virtual networks overlayed and isolated over the same physical infrastructure.

##### VXLAN in Cilium

When you install Cilium (or other CNI like Flannel or Calico), by default, it usually uses VXLAN to create that overlay network. It's the easiest way to make all the pods communicate no matter in which nodes they're in, that's because *doesn't need any configuration on the physical routers or switches**. It just works in any network that allows UDP traffic (Cilium uses port `8472` by default for this).

##### The negative side of VXLAN

Wrap a packet inside another packet adds around 50 bytes on each send (overhead), and it requires a litte bit of more effort from the CPU to encapsulate and decapsulate packets constantly.

If you look for maximum performance in a bare-metar environment, and you want to avoid this "overhead", an alternative is using **Native Routing**, integrating protocols like **BGP**, in which you actually teach your physical routers how to reach the IPs of the pods.
