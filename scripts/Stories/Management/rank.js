import { system, world } from '@minecraft/server';
import Commands from '../../Papers/CommandPaper/CommandPaper.js';
import Database from '../../Papers/DatabasePaper.js';
import Player from '../../Papers/PlayerPaper.js';
import quick from '../../quick.js';
let db = null;
(async function () {
    db = await Database.register('ranks');
})();
const cmd = Commands.create({
    name: 'rank',
    description: 'Menambahkan dan membuat role untuk server.',
    aliases: ['ranks', 'display', 'role'],
    category: 'Management',
    admin: true,
    developers: ['Mo9ses']
});
cmd.startingArgs(['create', 'delete', 'list', 'plr', 'set']);
cmd.staticType('create', 'create', (plr, val, args) => {
    if (db.has(val))
        return plr.error(`Sebuah rank dengan nama "§6${val}§e" telah dibuat sebelumnya!`);
    db.write(val, { tag: val, prefix: args[0]?.length ? args[0].join(' ') : '§eRank baru' });
    plr.send(`Berhasil membuat rank §6${val}§e dengan awalan "§r${args[0]?.length ? args[0].join(' ') : '§aRank baru'}§r§e"!`);
}, 'any', true, false);
cmd.staticType('delete', 'delyeet', (plr, val) => {
    if (!db.has(val))
        return plr.error(`Tidak ada rank dengan nama "§6${val}§e". Apakah kamu yakin itu bukan sebuah tag?`);
    plr.send(`Berhasil menghapus peringkat §6${val}§e dengan awalan "§r${db.read(val).prefix}§r§e"!`);
    db.delete(val);
}, null, true);
cmd.staticType('list', 'list', plr => {
    const allKeys = db.allKeys();
    if (!allKeys.length)
        return plr.send('Saat ini tidak ada peringkat di server.');
    plr.send(`Berikut adalah daftar semua peringkat:
${db.allKeys().map(r => `§6Nama: §e${r[0].toUpperCase() + r.slice(1)}§6, tag: §e${db.read(r).tag}§6, awalan: §e${db.read(r).prefix}§r`).join('\n')}`);
}, null, false);
cmd.playerType('plr', (plr, plr2, args) => {
    if (args[0] === 'add')
        plr2.addTag(args[1].join(' '));
    else
        plr.removeTag(args[1].join(' '));
    plr.send(`Rank "§6${args[1].join(' ')}§e" telah ${args[0] === 'add' ? '§adiberikan§e kepada' : '§cdicabut§e dari'} §6${plr2.name}§e!`);
}, true, ['add', 'remove']);
cmd.staticType('add', 'add', null, 'any', false);
cmd.staticType('remove', 'remove', null, 'any', false);
cmd.staticType('set', 'set', (plr, val, args) => {
}, ['prefix', 'name', 'color'], true);
cmd.dynamicType('prefix', ['prefix', 'pre', 'before'], null, 'any');
cmd.staticType('name', 'rename', null, 'any', false);
cmd.dynamicType('color', ['color', 'namecolor'], null, 'any');
cmd.unknownType('any', null, 255, true);
system.runInterval(() => world.getAllPlayers().forEach(player => {
    if (!Player.isConnected(player))
        return;
    const health = player.getComponent('health').currentValue;
    player.nameTag = `§7[${Player.getPrefixes(player).join('§r§7, ')}§r§7] ${Player.getNameColor(player)}${quick.displayHealth ? `\n§r§4❤ §c${~~(health)}` : ''}`;
}), 20);
