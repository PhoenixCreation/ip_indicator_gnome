import Gio from "gi://Gio";
import Adw from "gi://Adw";

import {
  ExtensionPreferences,
  gettext as _,
} from "resource:///org/gnome/Shell/Extensions/js/extensions/prefs.js";

export default class ExamplePreferences extends ExtensionPreferences {
  fillPreferencesWindow(window) {
    // Create a preferences page, with a single group
    const page = new Adw.PreferencesPage({
      title: _("General"),
      icon_name: "dialog-information-symbolic",
    });
    window.add(page);

    const group = new Adw.PreferencesGroup({
      title: _("Configure IP Indicator"),
      description: _("Select options for the public IP visibility"),
    });
    page.add(group);
    console.log(this.getSettings().get_boolean("show-public-ip"));

    // Create a new preferences row
    const visibility_row = new Adw.SwitchRow({
      title: _("Show Public IP"),
      subtitle: _(
        "Whether to show the public IP or not. Be careful not to accidentally disclose your public IP while taking screenshots or sharing your screen."
      ),
      active: this.getSettings().get_boolean("show-public-ip"),
    });
    group.add(visibility_row);

    const priority_row = new Adw.SwitchRow({
      title: _("Show Public IP on top"),
      subtitle: _(
        "This will show public IP first in the list. Enabling this will show the public IP as the first IP when you log in. Disable this to prevent accidental IP disclosures."
      ),
      active: this.getSettings().get_boolean("show-public-ip-on-top"),
    });
    group.add(priority_row);

    // bind settings to the UI rows
    window._settings = this.getSettings();
    window._settings.bind(
      "show-public-ip",
      visibility_row,
      "active",
      Gio.SettingsBindFlags.DEFAULT
    );
    window._settings.bind(
      "show-public-ip-on-top",
      priority_row,
      "active",
      Gio.SettingsBindFlags.DEFAULT
    );
  }
}
