const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

window.showToast = function(message) {
    let toast = document.getElementById('custom-toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'custom-toast';
        toast.className = 'toast';
        document.body.appendChild(toast);
    }
    toast.innerHTML = message;
    toast.classList.add('show');
    setTimeout(() => { toast.classList.remove('show'); }, 4100);
};

const fmt = (num) => {
    if (num < 10) return `00${num}`;
    if (num < 100) return `0${num}`;
    return num;
};

window.updateStats = function() {
    const total = myApps.length;
    const selected = document.querySelectorAll('.app-check:checked').length;
    const unselected = total - selected;
    document.getElementById('count-total').innerText = fmt(total);
    document.getElementById('count-sel').innerText = fmt(selected);
    document.getElementById('count-unsel').innerText = fmt(unselected);
};

window.renderUI = function() {
    const container = document.getElementById('app-list-container');
    const rail = document.getElementById('rail');
    container.innerHTML = ""; rail.innerHTML = "";
    myApps.sort((a, b) => a.name.localeCompare(b.name));
    letters.forEach(l => { rail.innerHTML += `<span data-letter="${l}">${l}</span>`; });
    let currentLetter = "";
    myApps.forEach((app, index) => {
        const firstLetter = app.name.charAt(0).toUpperCase();
        let idAttr = "";
        if(firstLetter !== currentLetter) { currentLetter = firstLetter; idAttr = `id="letter-${currentLetter}"`; }
        container.innerHTML += `
            <div class="app-card" ${idAttr} data-search="${app.name.toLowerCase()} ${app.pkg.toLowerCase()}">
                <div class="icon-box">${firstLetter}</div>
                <div class="info">
                    <span class="name">${app.name}</span>
                    <span class="pkg">${app.pkg}</span>
                </div>
                <input type="checkbox" class="app-check" id="app-${index}" value="${app.pkg}" checked onclick="window.updateStats()">
            </div>`;
    });
    window.setupFluidRail();
    window.updateStats();
};

window.setupFluidRail = function() {
    const rail = document.getElementById('rail');
    const pop = document.getElementById('pop-indicator');
    const popText = pop.querySelector('span');
    const handleTouch = (e) => {
        const touch = e.touches[0];
        const target = document.elementFromPoint(touch.clientX, touch.clientY);
        if (target && target.tagName === "SPAN" && target.parentElement === rail) {
            const letter = target.getAttribute('data-letter');
            pop.style.display = "flex";
            pop.style.top = (touch.clientY - 25) + "px";
            popText.innerText = letter;
            const el = document.getElementById(`letter-${letter}`);
            if (el) el.scrollIntoView({ block: 'start' });
        }
    };
    rail.addEventListener('touchstart', (e) => { handleTouch(e); e.preventDefault(); });
    rail.addEventListener('touchmove', (e) => { handleTouch(e); e.preventDefault(); });
    rail.addEventListener('touchend', () => { pop.style.display = "none"; });
};

window.filterApps = function() {
    const input = document.getElementById('appSearch').value.toLowerCase();
    document.querySelectorAll('.app-card').forEach(card => {
        const content = card.getAttribute('data-search');
        card.style.display = content.includes(input) ? "flex" : "none";
    });
};

window.toggleAll = function() {
    const master = document.getElementById('select-all-box');
    if (event.target.id !== 'select-all-box') master.checked = !master.checked;
    document.querySelectorAll('.app-check').forEach(cb => {
        if (cb.closest('.app-card').style.display !== 'none') cb.checked = master.checked;
    });
    window.updateStats();
};

window.inverseAll = function() {
    document.querySelectorAll('.app-check').forEach(cb => {
        if (cb.closest('.app-card').style.display !== 'none') cb.checked = !cb.checked;
    });
    window.updateStats();
};

window.saveAndSync = async function() {
    const log = document.getElementById('log');
    log.innerHTML = "Syncing Data...";
    let remove = []; let restore = [];
    myApps.forEach((app, index) => {
        const el = document.getElementById(`app-${index}`);
        if (el.checked) remove.push(app.pkg);
        else restore.push(app.pkg);
    });

    const modId = "Vishal_miui_debloat";
    
    // Non-root path (xyz)
    const pathXYZ = "/data/user_de/0/com.android.shell/axeron/plugins/" + modId + "/webroot";
    // Root path (abc)
    const pathABC = "/data/adb/modules/" + modId + "/webroot";

    const pkgsRemove = remove.join(" ");
    const pkgsRestore = restore.join(" ");

    // Create directories and write to BOTH paths simultaneously
    const cmd = `
        mkdir -p ${pathXYZ} ${pathABC};
        echo '${pkgsRemove}' > ${pathXYZ}/to_remove.list;
        echo '${pkgsRestore}' > ${pathXYZ}/to_restore.list;
        echo '${pkgsRemove}' > ${pathABC}/to_remove.list;
        echo '${pkgsRestore}' > ${pathABC}/to_restore.list;
    `;

    if (typeof ksu !== 'undefined' && ksu.exec) {
        try {
            await ksu.exec(cmd, "{}");
            log.innerHTML = `<span class="log-success">SUCCESS!</span><br>` + 
                           `Checked ✅ apps will be <span class="log-red">REMOVED</span>.<br>` +
                           `Unchecked ◻️ apps will be <span class="log-green">RESTORED</span>.<br>` +
                           `Tap RUN now.`;

            const toastHTML = `<span class="toast-header">Sync ⚡ Completed</span><div class="toast-body"><span style="color:#0f0;">SUCCESS!</span> Checked ✅ apps will be <span style="color:#f00;">REMOVED</span>. Unchecked ◻️ apps will be <span style="color:#0f0;">RESTORED</span>. Tap RUN now.</div>`;
            window.showToast(toastHTML);
        } catch(e) { 
            log.innerHTML = `<span class="log-red">Error:</span> ${e}`; 
            window.showToast("<span class='toast-header' style='color:#f00;'>Sync Failed</span>\n" + e);
        }
    } else {
        window.showToast("<span class='toast-header' style='color:#ff0;'>Warning</span>\nBRIDGE NOT FOUND");
    }
};

window.renderUI();
