---
tags:
  - networking
  - data-structure
  - bpf
---
# LPM Trie

- Introduced in Linux 4.11 as `BPF_MAP_TYPE_LPM_TRIE`.
- **LPM** stands for "Longest Prefix Match".
- A **Trie** is a kind of data structure, also known as a prefix tree.
- Intended to efficiently match IP addresses to a stored set of prefixes.
- Designed specifically for the CIDR membership use-case.
- **Example:** If you put in `10.0.0.0/8` and `10.40.22.0/24`, searching for `10.40.22.12` would return `10.40.22.0/24` because it's the "longest prefix" (the most specific one), even though it technically matches both.