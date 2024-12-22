# IP Indicator Gnome Extension

## Overview

The **IP Indicator** Gnome extension provides a quick and easy way to display and interact with the IP addresses of your current network interfaces directly from the Gnome Shell. The extension shows your IP addresses in the top panel and allows copying them to the clipboard with a single click.

---

## Features

- **Display IP addresses:** View the IP addresses of your active network interfaces in the Gnome Shell top bar.
- **Copy IP address:** Click on the extension to copy the displayed IP address to the clipboard.
- **Scroll through IP addresses:** Use the mouse scroll to cycle through multiple IP addresses.
- **Automatic updates:** The displayed IP address updates every second to reflect changes in your network configuration.
- **Prioritized display:** The extension prioritizes private IP ranges (e.g., `10.x.x.x`, `192.x.x.x`, `172.x.x.x`) for display.

---

## Installation

1. **Clone the Repository**

   ```bash
   git clone https://github.com/phoenixcreation/ip_indicator_gnome
   cd ip_indicator_gnome
   ```

2. **Install the Extension**
   Copy the extension files to your Gnome extensions directory:

   ```bash
   mkdir -p ~/.local/share/gnome-shell/extensions/ip-indicator@phoenixcreation
   cp -r * ~/.local/share/gnome-shell/extensions/ip-indicator@phoenixcreation
   ```

3. **Enable the Extension**
   Use `gnome-extensions` to enable the extension:

   ```bash
   gnome-extensions enable ip-indicator@phoenixcreation
   ```

   Alternatively, enable it via the Gnome Tweaks tool.

4. **Restart Gnome Shell**
   Restart Gnome Shell to load the extension:

   - Press Alt + F2, type `r`, and press Enter (not supported on Wayland).
   - For Wayland, you can start a nested gnome-session with following command:
    ```
    dbus-run-session -- gnome-shell --nested --wayland
    ```
---

## Usage

- **View IP Address:** The current IP address and its associated network interface are displayed in the top panel.
- **Copy IP Address:** Click on the extension icon to copy the displayed IP address to your clipboard. The label will briefly display `Copied` to indicate success.
- **Switch Between IPs:** Scroll up or down on the extension icon to cycle through available IP addresses.

---

## Known Issues

- Limited to IPv4 addresses.
- May not display IP addresses correctly if the `ip` command output format changes. This is very unlikely to happen as entire networking depends on this command.

---

## Contributing

Contributions are welcome! To contribute:

1. Fork the repository.
2. Create a feature branch.
3. Submit a pull request.

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE.md) file for details.

---

## Credits

- **Author:** PhoenixCreation
- **Version:** 1.0.0

---

## Feedback

If you encounter any issues or have suggestions for improvement, please open an issue in the repository or contact the author directly.

Enjoy using the IP Indicator extension!

