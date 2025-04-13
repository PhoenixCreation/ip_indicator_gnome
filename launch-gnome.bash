#! /bin/bash
rm -rf ~/.local/share/gnome-shell/extensions/ip-indicator@phoenixcreation
mkdir -p ~/.local/share/gnome-shell/extensions/ip-indicator@phoenixcreation
cp -r * ~/.local/share/gnome-shell/extensions/ip-indicator@phoenixcreation
glib-compile-schemas ~/.local/share/gnome-shell/extensions/ip-indicator@phoenixcreation/schemas/
gnome-extensions enable ip-indicator@phoenixcreation
dbus-run-session -- gnome-shell --nested --wayland