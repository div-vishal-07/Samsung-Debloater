#!/system/bin/sh
# OneUI Debloater by Vishal - Installer (v5050)
logcat -G 128K &>/dev/null

# Environment Detection
if [ "$AXERON" == "true" ]; then
    PRINT="printf"
else
    PRINT="ui_print"
fi

# Fixed Print Wrapper
print_msg() {
    case "$PRINT" in
        ui_print) ui_print "$1" ;;
        printf) printf "$1\n" ;;
    esac
}

# BRANDING HEADER
# Fixed ASCII art with double backslashes (\\)
print_msg "*****************************************"
print_msg "  Samsung OneUI Debloater Module/Plugin | V5.05            "
print_msg "  by Vishal Rathaur                      "
print_msg "*****************************************"
print_msg ""
print_msg "  __      _______  _____ _    _          _      "
print_msg "  \\ \\    / /_   _|/ ____| |  | |   /\\   | |     "
print_msg "   \\ \\  / /  | | | (___ | |__| |  /  \\  | |     "
print_msg "    \\ \\/ /   | |  \\___ \\|  __  | / /\\ \\ | |     "
print_msg "     \\  /   _| |_ ____) | |  | |/ ____ \\| |____ "
print_msg "      \\/   |_____|_____/|_|  |_/_/    \\_\\______|"
print_msg ""

# System Information
ANDROIDVERSION=$(getprop ro.build.version.release)
DEVICES=$(getprop ro.product.board)
MANUFACTURER=$(getprop ro.product.manufacturer)
NAME="Debloater | Vishu ❤️"
VERSION="5050 Stable"
DATE=$(date)

print_msg "Hello Sir/Ma'am 👋"
print_msg ""
sleep 0.4
print_msg " Let's Clean up the Trash that isn't necessary "
sleep 0.2
print_msg " Initializing cleanup for ${MANUFACTURER}..."
print_msg ""
print_msg "***************************************"
print_msg ""
print_msg "- Name            : ${NAME}"
print_msg "- Version         : ${VERSION}"
print_msg "- Android Version : ${ANDROIDVERSION:-Unknown}"
print_msg "- Current Date    : ${DATE}"
print_msg "***************************************"
print_msg ""
print_msg "- Device         : ${DEVICES:-Unknown}"
print_msg "- Manufacturer    : ${MANUFACTURER:-Unknown}"
print_msg "***************************************"
print_msg ""
print_msg "   - Samsung OneUI Debloater Module/Plugin -    "
print_msg ""
print_msg "*****************************************"

# --- INSTALLATION LOGIC ---
print_msg "- Extracting module files..."
# Unzip webroot specifically
unzip -o "$ZIPFILE" 'webroot/*' -d "$MODPATH" >&2

# PRO TIP: Ensure system folder for compliance
mkdir -p "$MODPATH/system"

print_msg "- Setting up permissions..."
set_permalink_recursive "$MODPATH/webroot" 0 0 0755 0644

print_msg "- Samsung OneUI Debloater Module  is ready."
print_msg "*****************************************"
