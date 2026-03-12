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
