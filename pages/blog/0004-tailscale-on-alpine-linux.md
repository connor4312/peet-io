---
title: 'Setting up Tailscale on Alpine Linux'
date: '2021-04-02'
---

[Tailscale](https://tailscale.com/) is a magical VPN solution, but doesn't come prepackaged for Alpine Linux [yet](https://github.com/tailscale/tailscale/issues/230). Here's how to get it set up.

1. Download the latest static binaries from [https://pkgs.tailscale.com/stable/#static](https://pkgs.tailscale.com/stable/#static)
1. Unzip and copy the tailscale binaries to a bin folder: `tar xvf tailscale_*.tgz && cp tailscale/tailscale* /usr/bin`
1. Create an openrc script in `/etc/init.d/tailscale`:

    ```bash
    #!/sbin/openrc-run

    # supervise the running process
    supervisor=supervise-daemon

    # require network before starting
    depend() {
        need net
    }

    # run tailscale
    command=/usr/bin/tailscaled
    name=tailscale
    command_args="--state=tailscaled.state"
    ```

1. Make it executable: `chmod +x /etc/init.d/tailscale`
1. Make it start on boot: `rc-update add tailscale default`
1. Go ahead and `rc-service tailscale start` the service to make sure it works.
1. `tailscale up` to log in and get connected.
1. `reboot` to make sure things come up cleanly on boot (check `rc-status --servicelist`)
