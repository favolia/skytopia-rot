import { system } from '@minecraft/server';
import { ActionForm } from '../../Papers/FormPaper.js';
import Commands from '../../Papers/CommandPaper/CommandPaper.js';
const queue = {};
const cmd = Commands.create({
    name: 'UI',
    description: 'Membuka antarmuka pengguna (UI) dari semua perintah ROT sehingga kamu tidak perlu menggunakan chat.',
    aliases: ['form', 'frm'],
    category: 'ROT',
    developers: ['Mo9ses']
});
cmd.relayMethod({ form: false });
cmd.callback(plr => {
    Object.assign(queue, { [plr.name]: [plr, 0] });
    plr.send('Tutup chat untuk membuka UI.');
});
system.runInterval(() => Object.keys(queue).forEach(async (key) => {
    if (queue[key][1] === 0)
        return queue[key][1] = 1;
    const form = await openUI(queue[key][0]);
    console.warn(form);
    if (form || queue[key][1] > 12) {
        console.warn('Done');
        return delete queue[key];
    }
    queue[key][1] = queue[key][1] + 1;
}), 60);
async function openUI(player) {
    let open = true;
    const form = new ActionForm(), cmds = Commands.list.filter(c => c.rM.fM && (c.admin ? player.isAdmin : true));
    form.setTitle('§e§lThe Skytopia Command UI§r');
    form.setBody('Selamat datang di antarmuka pengguna (UI) Skytopia di mana kamu dapat melihat dan menggunakan semua perintah yang dapat kamu akses.');
    cmds.forEach(c => form.addButton(`§a${c.name[0].toUpperCase()}${c.name.slice(1)}\n§c${c.description.slice(0, 25).trim()}...§r`));
    await form.send(player, res => {
        console.warn(res.cancelationReason);
        if (res?.cancelationReason === 'UserBusy')
            return open = false;
        delete queue[player.name];
        Commands.form(cmds[res.selection], player);
    });
    return open;
}
