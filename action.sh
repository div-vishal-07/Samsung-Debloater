#!/system/bin/sh
# OneUI Debloater by Vishal - Action Script (v5050)

# Combined Path Logic from A and C
if [ -d "/data/adb/modules/Vishal_oneui_debloat" ]; then
    MODDIR="/data/adb/modules/Vishal_oneui_debloat"
elif [ -d "/mnt/phh/vold/data/adb/modules/Vishal_oneui_debloat" ]; then
    MODDIR="/mnt/phh/vold/data/adb/modules/Vishal_oneui_debloat"
elif [ -d "/data/user_de/0/com.android.shell/axeron/plugins/Vishal_oneui_debloat" ]; then
    MODDIR="/data/user_de/0/com.android.shell/axeron/plugins/Vishal_oneui_debloat"
else
    MODDIR=${0%/*}
fi

REMOVE_FILE="$MODDIR/webroot/to_remove.list"
RESTORE_FILE="$MODDIR/webroot/to_restore.list"

echo "==============================="
echo "   Samsung OneUI Debloater| Vishu ❤️ (5050)  "
echo "==============================="

# Check Lists (from C)
if [ ! -f "$REMOVE_FILE" ] && [ ! -f "$RESTORE_FILE" ]; then
    echo "[!] Error: Sync lists not found at $MODDIR/webroot/"
    echo "[!] Did you tap 'SAVE SYNC' in the WebUI first?"
    exit 1
fi

# Restore Logic (Combined)
if [ -f "$RESTORE_FILE" ]; then
    RESTORE_LIST=$(cat "$RESTORE_FILE")
    for PKG in $RESTORE_LIST; do
        if [ ! -z "$PKG" ]; then
            echo "[+] Restoring: $PKG"
            pm install-existing --user 0 "$PKG" > /dev/null 2>&1
        fi
    done
fi

# Remove Logic (Combined)
if [ -f "$REMOVE_FILE" ]; then
    REMOVE_LIST=$(cat "$REMOVE_FILE")
    for PKG in $REMOVE_LIST; do
        if [ ! -z "$PKG" ]; then
            echo "[-] Debloating: $PKG"
            pm uninstall -k --user 0 "$PKG" > /dev/null 2>&1
        fi
    done
fi

echo "==============================="
echo "   Your Device is Debloated You can Restore your apps from Webui if necessary.     "
echo "==============================="
