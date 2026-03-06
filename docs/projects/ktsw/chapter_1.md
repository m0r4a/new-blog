So, I'm going to work with the clasic two, Terraform and Ansible.

## Terraform

I will use the [proxmox provider](https://registry.terraform.io/providers/Telmate/proxmox/latest/docs) for provisioning the three VMs. If you want to work on top of my project make sure you visit the provider's docs, it gives you a step by step guide on how to set up proxmox to work with Terraform. I highly recommend to configure the user and role through the CLI, it's very annoying to click on the specific permissions through the GUIj

But, in short, these are the configs

```bash
pveum role add TerraformProv -privs "Datastore.AllocateSpace Datastore.AllocateTemplate Datastore.Audit Pool.Allocate Pool.Audit Sys.Audit Sys.Console Sys.Modify VM.Allocate VM.Audit VM.Clone VM.Config.CDROM VM.Config.Cloudinit VM.Config.CPU VM.Config.Disk VM.Config.HWType VM.Config.Memory VM.Config.Network VM.Config.Options VM.Migrate VM.PowerMgmt SDN.Use VM.GuestAgent.Audit VM.GuestAgent.Unrestricted"
pveum user add terraform-prov@pve --password <password>
pveum aclmod / -user terraform-prov@pve -role TerraformProv
```

Note: I added `VM.GuestAgent.Audit` and `VM.GuestAgent.Unrestricted` permissions, apparently you need them, you will get the error: `Error: 403 Permission check failed (/vms/200, VM.GuestAgent.Audit|VM.GuestAgent.Unrestricted)` otherwise.

I will be using a token for the auth

```bash
pveum user token add terraform-prov@pve mytoken --privsep 0
```

### ¿Cloud init?

I need a way to put my ssh keys into my VMs, and I don't want to configure the installation EACH time so, Cloud init is a must. To make this work on proxmox you need to create a template and from that template create the VM. so, ¿how do I make that?.

There's two ways, I could sweat and try to figure out how to make it through terraform or simply follow [the provider's documentation](https://registry.terraform.io/providers/Telmate/proxmox/latest/docs/guides/cloud-init%2520getting%2520started) and make it work. It was a tough decision to make since I wanted to make it is pretty and well done as possible since I don't have a deadline or anything, **I have time**, but, my **motivation** is not infinite, this project is for kubernetes, so, as for now (probably for ever) I will give you the steps to create a template manually and just use it on the module.

```bash
wget https://dl.rockylinux.org/pub/rocky/10/images/x86_64/Rocky-10-GenericCloud-Base.latest.x86_64.qcow2
qm create 9000 --name rocky10-cloudinit
qm set 9000 --scsi0 local-lvm:0,import-from=/root/Rocky-10-GenericCloud-Base.latest.x86_64.qcow2
qm template 9000
```

You will also need a snippet to ensure that qemu guest agent is installed, the deploy will hang otherwise:

```bash
mkdir /var/lib/vz/snippets
tee /var/lib/vz/snippets/qemu-guest-agent.yml <<EOF
#cloud-config
runcmd:
  - dnf update
  - dnf install -y qemu-guest-agent
  - systemctl start qemu-guest-agent
EOF
```

### The module

I am not the most experienced Terraform user ever, but at least what I think works best for me is to plan **how I want to use the module** and then work my way into make it work like that, so, for that, this is how I planned that I want it to be used:

```hcl
module "k8s_custom" {
  source = "./modules/k8s-cluster"

  proxmox_host  = "192.168.1.100"
  proxmox_node  = "pve"
  template_name = "rocky10-cloudinit"
  cluster_name  = "dev"

  # SSH global (default)
  ssh_user = "kubernetes"
  ssh_keys = file("~/.ssh/id_rsa.pub")

  nodes = {
    control_plane = {
      vmid     = 201
      cores    = 2
      memory   = 4096
      ip       = "192.168.1.10"
      role     = "control_plane"
      ssh_user = "admin"  # Override the global var
      ssh_keys = file("~/.ssh/admin.pub")
    }

    worker1 = {
      vmid   = 202
      cores  = 2
      memory = 2048
      ip     = "192.168.1.11"
      role   = "worker"
      # Uses global ssh_user and ssh keys
    }
  }

  network_gateway = "192.168.1.1"
  network_cidr    = 24
}
```

## Ansible

By default, the `inventory.ini` is generated automatically using the ip and role declared in the nodes section, by default it assumes you cloned the ktsw repo and writes it on: `${path.root}/../ansible/inventory.ini`. To overwrite this path just use the variable `ansible_inventory_path` in the module.

The module automatically adds and updates (in case you re-use an ip) the host keys to your `known_hosts` so that shouldn't be a problem.

Note: I had to use the cluster cidr 11.0.0.0/16 and the service cidr as 11.1.0.0/16 because the default 10.0.0.0/8 clashes with my private network.
