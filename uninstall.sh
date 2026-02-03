#!/system/bin/sh
# OneUI Debloat by Vishal - Uninstall Script (v5050)

if [ -d "/data/adb/modules/Vishal_oneui_debloat" ]; then
    MODDIR="/data/adb/modules/Vishal_oneui_debloat"
else
    MODDIR=${0%/*}
fi

echo "-----------------------------------"
echo "  Uninstalling Samsung OneUI Debloater Module/Plugin...     "
echo "-----------------------------------"

[ -f "$MODDIR/webroot/to_remove.list" ] && rm -f "$MODDIR/webroot/to_remove.list"
[ -f "$MODDIR/webroot/to_restore.list" ] && rm -f "$MODDIR/webroot/to_restore.list"
echo "[*] Removing module files..."
echo "[+] Cleaning Up. Apps remain debloated."
echo "-----------------------------------"
echo "[+] Cleanup complete."
echo "-----------------------------------"
