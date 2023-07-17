import { world } from '@minecraft/server';
import Commands from '../../Papers/CommandPaper/CommandPaper.js';
import Server from '../../Papers/ServerPaper.js';
import quick from '../../quick.js';
const cmd = Commands.create({
    name: 'spawn',
    description: 'Teleportasi ke titik awal (spawn)!',
    aliases: ['hub', 'lobby'],
    category: 'Server',
    developers: ['Aex66']
});
cmd.startingArgs('set', false);
cmd.callback((plr, args) => {
    if (args.length)
        return;
    const spawn = Server.db.read('spawn');
    if (!spawn)
        return plr.error('Terjadi kesalahan saat melakukan teleportasi ke titik awal (spawn)...');
    const [x, y, z, dim] = spawn;
    plr.send('Melakukan teleportasi ke titik awal (spawn)...');
    plr.addTag(quick.epics['Automod'].protections.teleport.skip);
    plr.teleport({ x, y, z }, { dimension: world.getDimension(dim), rotation: { x: plr.getRotation().x, y: plr.getRotation().y } });
});
cmd.staticType('set', 'set', (plr) => {
    let { x, y, z } = plr.location;
    const dim = plr.dimension.id;
    x = ~~(x);
    y = ~~(y);
    z = ~~(z);
    if (x > 5000000 || y > 5000000 || z > 5000000)
        return plr.error('Baiklah, tidak ada angka yang lebih besar dari 5 juta.');
    plr.send('Kamu telah mengatur lokasi titik awal (spawn)!');
    Server.db.write('spawn', [~~(x), ~~(y), ~~(z), dim]);
}, null, false);
cmd.config('set', { admin: true });
