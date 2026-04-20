// Service Worker for offline access to learning notes
// Strategy: pre-cache all content on install, serve cache-first
// All URLs are relative to the SW scope (works on GitHub Pages subpaths)

const CACHE_NAME = 'learning-notes-v4';

// Paths relative to the service worker location
const PRECACHE_PATHS = [
  './',
  'index.html',
  'styles/notes.css',
  'nav.js',
  'pages.json',
  // Frontend
  '01-html-css/notes.html',
  '01-html-css/flexbox.html',
  '01-html-css/figma-basics.html',
  '01-html-css/figma-to-code-flow.html',
  '01-html-css/ai-design-tools.html',
  '01-html-css/webassembly.html',
  '02-typescript/notes.html',
  '02-typescript/api-requests.html',
  '03-typescript-advanced/destructuring.html',
  '03-typescript-advanced/spread-rest.html',
  '03-typescript-advanced/async-await.html',
  '03-typescript-advanced/modules.html',
  '03-typescript-advanced/utility-types.html',
  '04-react-foundations/what-is-react.html',
  '04-react-foundations/project-setup.html',
  '04-react-foundations/jsx.html',
  '04-react-foundations/components-props.html',
  '05-react-hooks-core/use-state.html',
  '05-react-hooks-core/use-effect.html',
  '05-react-hooks-core/use-ref.html',
  '05-react-hooks-core/hooks-rules.html',
  '06-tailwind-css/setup.html',
  '06-tailwind-css/core-utilities.html',
  '06-tailwind-css/component-patterns.html',
  '07-component-patterns/composition.html',
  '07-component-patterns/conditional-rendering.html',
  '07-component-patterns/lists-keys.html',
  '07-component-patterns/typing-patterns.html',
  '08-react-hooks-advanced/use-context.html',
  '08-react-hooks-advanced/use-reducer.html',
  '08-react-hooks-advanced/custom-hooks.html',
  '08-react-hooks-advanced/use-memo-callback.html',
  '09-routing/setup.html',
  '09-routing/routes-navigation.html',
  '09-routing/data-loading.html',
  '09-routing/auth-routes.html',
  '10-forms/basics.html',
  '10-forms/validation.html',
  '10-forms/complex-forms.html',
  '11-state-management/mental-model.html',
  '11-state-management/zustand.html',
  '11-state-management/patterns.html',
  '12-error-handling/error-boundaries.html',
  '12-error-handling/async-errors.html',
  '13-testing/setup.html',
  '13-testing/component-testing.html',
  '13-testing/hook-testing.html',
  '14-architecture/project-structure.html',
  '14-architecture/auth-pattern.html',
  '14-architecture/performance.html',
  '15-deployment/build-deploy.html',
  '16-ecosystem/redux.html',
  '16-ecosystem/nextjs-ssr-rsc.html',
  '16-ecosystem/css-alternatives.html',
  '16-ecosystem/storybook.html',
  '16-ecosystem/e2e-testing.html',
  '16-ecosystem/graphql.html',
  // Networking
  'net-01-fundamentals/osi-model.html',
  'net-01-fundamentals/tcp-ip-model.html',
  'net-01-fundamentals/encapsulation.html',
  'net-02-ethernet-switching/ethernet.html',
  'net-02-ethernet-switching/switching.html',
  'net-02-ethernet-switching/vlans.html',
  'net-03-ip-routing/ipv4.html',
  'net-03-ip-routing/ipv6.html',
  'net-03-ip-routing/routing.html',
  'net-03-ip-routing/dynamic-routing.html',
  'net-04-tcp-udp/tcp-deep-dive.html',
  'net-04-tcp-udp/tcp-states.html',
  'net-04-tcp-udp/udp.html',
  'net-04-tcp-udp/ports-sockets.html',
  'net-05-dns/how-dns-works.html',
  'net-05-dns/record-types.html',
  'net-05-dns/dns-advanced.html',
  'net-06-http-tls/http.html',
  'net-06-http-tls/tls.html',
  'net-06-http-tls/mtls-certs.html',
  'net-06-http-tls/web-servers.html',
  'net-07-firewalls-nat-vpn/firewalls.html',
  'net-07-firewalls-nat-vpn/nat.html',
  'net-07-firewalls-nat-vpn/vpn.html',
  'net-08-nat-traversal-tailscale/nat-types.html',
  'net-08-nat-traversal-tailscale/stun-turn-ice.html',
  'net-08-nat-traversal-tailscale/tailscale.html',
  'net-08-nat-traversal-tailscale/tailscale-features.html',
  'net-08-nat-traversal-tailscale/nat-traversal-deep-dive.html',
  'net-09-linux-internals/namespaces-veth.html',
  'net-09-linux-internals/netfilter.html',
  'net-09-linux-internals/iproute2.html',
  'net-10-ebpf-xdp/ebpf-fundamentals.html',
  'net-10-ebpf-xdp/xdp-tc.html',
  'net-10-ebpf-xdp/cilium.html',
  'net-11-cloud-init/cloud-init-basics.html',
  'net-11-cloud-init/user-data.html',
  'net-11-cloud-init/network-config.html',
  'net-12-container-networking/docker-networking.html',
  'net-12-container-networking/cni.html',
  'net-13-kubernetes-networking/pod-networking.html',
  'net-13-kubernetes-networking/services.html',
  'net-13-kubernetes-networking/ingress-gateway.html',
  'net-13-kubernetes-networking/network-policies.html',
  // Virtualization
  'virt-01-cpu-virtualization/cpu-rings-traps.html',
  'virt-01-cpu-virtualization/hypervisors.html',
  'virt-02-namespaces/namespace-theory.html',
  'virt-02-namespaces/namespace-advanced.html',
  'virt-03-cgroups/cgroup-fundamentals.html',
  'virt-03-cgroups/cgroup-controllers.html',
  'virt-03-cgroups/cgroup-in-practice.html',
  'virt-04-security/capabilities-seccomp.html',
  'virt-04-security/lsm-apparmor.html',
  'virt-05-container-images/oci-image-spec.html',
  'virt-05-container-images/union-filesystems.html',
  'virt-05-container-images/building-images.html',
  'virt-06-container-runtimes/oci-runtime-spec.html',
  'virt-06-container-runtimes/containerd-cri.html',
  'virt-06-container-runtimes/sandboxed-runtimes.html',
  'virt-07-docker-internals/docker-architecture.html',
  'virt-07-docker-internals/volumes-storage.html',
  'virt-07-docker-internals/docker-resource-limits.html',
  'virt-08-kubernetes-architecture/control-plane.html',
  'virt-08-kubernetes-architecture/kubelet-runtime.html',
  'virt-08-kubernetes-architecture/workloads-scheduling.html',
  'virt-09-kubernetes-storage/pv-pvc-storageclass.html',
  'virt-09-kubernetes-storage/csi.html',
  'virt-10-proxmox-kvm/proxmox-architecture.html',
  'virt-10-proxmox-kvm/vm-lifecycle-networking.html',
  'virt-10-proxmox-kvm/storage-ha.html',
  // Storage
  'storage-01-block-devices/disks-ssds-nvme.html',
  'storage-01-block-devices/partitions.html',
  'storage-02-filesystems/filesystem-fundamentals.html',
  'storage-02-filesystems/ext4-xfs.html',
  'storage-03-raid/raid-levels.html',
  'storage-03-raid/mdadm.html',
  'storage-04-device-mapper/device-mapper.html',
  'storage-05-lvm/lvm-fundamentals.html',
  'storage-05-lvm/thin-provisioning-snapshots.html',
  'storage-06-encryption/dm-crypt-luks.html',
  'storage-06-encryption/luks-auto-unlock.html',
  'storage-07-tpm-secure-boot/tpm-basics.html',
  'storage-07-tpm-secure-boot/secure-boot-auto-unlock.html',
  'storage-08-advanced-filesystems/zfs.html',
  'storage-08-advanced-filesystems/btrfs.html',
];

// Resolve relative paths to absolute URLs based on SW scope
const scope = self.registration.scope;

// Install: pre-cache all pages
self.addEventListener('install', (event) => {
  const urls = PRECACHE_PATHS.map(p => new URL(p, scope).href);
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urls))
      .then(() => self.skipWaiting())
  );
});

// Activate: clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

// Fetch: cache-first, fall back to network, cache new responses
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;

      return fetch(event.request).then((response) => {
        // Cache successful HTML/CSS/JS responses for future offline use
        if (response.ok && /\.(html|css|js|json)(\?|$)/.test(event.request.url)) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        }
        return response;
      });
    }).catch(() => {
      // Offline fallback — return index if available
      if (event.request.mode === 'navigate') {
        return caches.match(new URL('index.html', scope).href);
      }
    })
  );
});
