import Commands from "../../Papers/CommandPaper/CommandPaper.js";
import { system } from "@minecraft/server";
import quick from "../../quick.js";
const requests = [];
const cmd = Commands.create({
    name: 'tpa',
    category: 'Fantasy',
    description: 'Mengirim dan menerima permintaan tpa!',
});
cmd.startingArgs(['send', 'accept', 'decline']);
cmd.playerType('plr', undefined, true, undefined, { self: false });
cmd.staticType('send', 'send', (plr, val, target) => {
    if (hasRequest(plr, target[0]))
        return plr.error('Kamu sudah mengirimi permintaan TPA ke pemain ini.', 'TPA');
    plr.send(`kami mengirim permintaan TPA ke §a${target[0].name}`, 'TPA');
    target[0].send(`§a${plr.name}§e mengirimkan permintaan tpa kepadamu, ketik §c"!tpa accept ${plr.name}"§e untuk menerima atau §c"!tpa decline ${plr.name}"§e untuk menolak.`, 'TPA');
    requests.push({ sender: plr, target: target[0], expires: Date.now() + 30000 });
}, 'plr', false, true);
cmd.staticType('accept', 'accept', (plr, val, sender) => {
    if (!hasRequest(sender[0], plr))
        return plr.error(`§a${sender[0].name}§e tidak mengirimkan permintaan TPA kepadamu.`, 'TPA');
    sender[0].send(`Melakukan teleportasi ke lokasi §a${plr.name}§e...`, 'TPA');
    plr.send(`Kamu menerima permintaan TPA dari §a${sender[0].name}§e.`, 'TPA');
    plr.addTag(quick.epics['Automod'].protections.teleport.skip);
    sender[0].teleport(plr.location, { dimension: plr.dimension, rotation: { x: plr.getRotation().x, y: plr.getRotation().y } });
    requests.splice(requests.indexOf(getRequest(sender[0], plr)));
}, 'plr', false, true);
cmd.staticType('decline', 'decline', (plr, val, sender) => {
    if (!hasRequest(sender[0], plr))
        return plr.error(`§a${sender[0].name}§e tidak mengirimkan permintaan TPA kepadamu.`, 'TPA');
    sender[0].send(`§a${plr.name}§e menolak permintaan TPA kamu.`, 'TPA');
    plr.send(`Kamu menolak permintaan TPA dari §a${sender[0].name}§e.`, 'TPA');
    requests.splice(requests.indexOf(getRequest(sender[0], plr)));
}, 'plr', false, true);
system.runInterval(() => {
    requests.forEach((r, index) => {
        if (Date.now() < r.expires)
            return;
        requests.splice(index);
        r.sender?.send(`Permintaan TPA yang kamu kirim ke §a${r.target?.name}§e sudah kadaluarsa.`, 'TPA');
        r.target?.send(`Permintaan TPA dari §a${r.sender?.name}§e sudah kadaluarsa.`, 'TPA');
    });
});
function hasRequest(sender, target) {
    return requests.some(r => r.sender?.rID === sender?.rID && r.target?.rID === target?.rID);
}
function getRequest(sender, target) {
    return requests.find((r) => r.sender?.rID === sender?.rID && r.target?.rID === target?.rID);
}
