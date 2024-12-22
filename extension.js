/**
 * Gnome extension to show the IP address of current network
 *
 * @name    ip-indicator
 * @version 1.0.0
 * @author  PhoenixCreation
 * @license MIT
 *
 *
 */

import GObject from "gi://GObject";
import St from "gi://St";
import Clutter from "gi://Clutter";
import GLib from "gi://GLib";
import Gdk from "gi://Gdk";

import {
  Extension,
  gettext as _,
} from "resource:///org/gnome/shell/extensions/extension.js";
import * as PanelMenu from "resource:///org/gnome/shell/ui/panelMenu.js";

import * as Main from "resource:///org/gnome/shell/ui/main.js";

const Indicator = GObject.registerClass(
  class Indicator extends PanelMenu.Button {
    _init() {
      super._init(0.0, _("IP Indicator"), true);
      this.clipboard = St.Clipboard.get_default();

      this.label = new St.Label({
        name: "ip-indicator-label",
        y_align: Clutter.ActorAlign.CENTER,
        y_expand: true,
      });
      this.add_child(this.label);

      this.current_index = 0;
      this.ip_addresses = this.getIpAddress();
      if (this.ip_addresses.length > 0) {
        this.updateLabel();
      }

      this.connect("button-press-event", () => {
        this.clipboard.set_text(
          St.ClipboardType.CLIPBOARD,
          this.ip_addresses[this.current_index]["ip"]
        );
        this.label.set_text("Copied");
      });

      this.connect("scroll-event", (widget, event, pointer) => {
        if (event.get_scroll_direction() === Gdk.ScrollDirection.UP) {
          this.current_index -= 1;
          if (this.current_index < 0) {
            this.current_index = this.ip_addresses.length - 1;
          }
        } else if (event.get_scroll_direction() == Gdk.ScrollDirection.DOWN) {
          this.current_index += 1;
          if (this.current_index > this.ip_addresses.length - 1) {
            this.current_index = 0;
          }
        }
        this.updateLabel();
      });

      this.timeout_id = GLib.timeout_add(
        GLib.PRIORITY_DEFAULT,
        1000,
        this.updateIpAddresses.bind(this)
      );
    }

    updateIpAddresses() {
      this.ip_addresses = this.getIpAddress();
      this.updateLabel();
      return GLib.SOURCE_CONTINUE;
    }

    updateLabel() {
      this.label.set_text(
        `${this.ip_addresses[this.current_index]["ip"]} : ${
          this.ip_addresses[this.current_index]["interface"]
        }`
      );
    }

    getIpAddress() {
      try {
        let [ok, out] = GLib.spawn_command_line_sync(`ip -o -4 addr show`);
        if (ok) {
          const output = new TextDecoder().decode(out);
          const result = output
            .trim() // Remove any extra whitespace
            .split("\n") // Split input into lines
            .map((line) => {
              const parts = line.split(/\s+/); // Split line by whitespace
              const interfaceName = parts[1]; // Extract interface name
              const ipWithCidr = parts[3]; // Extract IP with CIDR
              const ip = ipWithCidr.split("/")[0]; // Extract IP without CIDR
              return { interface: interfaceName, ip }; // Return as an object
            })
            .sort((a, b) => {
              // Define priority of IP ranges
              const getPriority = (ip) => {
                if (ip.startsWith("10.")) return 1; // Highest priority
                if (ip.startsWith("192.")) return 2; // Medium priority
                if (ip.startsWith("172.")) return 3; // Lowest priority
                return 4; // Default priority (e.g., 127.x.x.x)
              };

              return getPriority(a.ip) - getPriority(b.ip); // Sort based on priority
            });

          return result;
        }
      } catch (e) {
        console.error(e);
      }
      return [];
    }

    destroy() {
      super.destroy();
      if (this.timeout_id) {
        GLib.Source.remove(this.timeout_id);
        this.timeout_id = null;
      }
    }
  }
);

export default class IndicatorExampleExtension extends Extension {
  enable() {
    this._indicator = new Indicator();
    Main.panel.addToStatusArea(this.uuid, this._indicator);
  }

  disable() {
    this._indicator.destroy();
    this._indicator = null;
  }
}
