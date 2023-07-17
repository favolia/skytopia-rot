import { system, world } from '@minecraft/server';
import { sleep } from '../../Papers/Paragraphs/ExtrasParagraphs.js';
import Commands from '../../Papers/CommandPaper/CommandPaper.js';
import Server from '../../Papers/ServerPaper.js';
import Player from '../../Papers/PlayerPaper.js';
import quick from '../../quick.js';
const cmd = Commands.create({
    name: 'kt',
    description: 'Perintah ini akan menendang pemain dari permainan dengan tag tertentu.',
    aliases: ['ktag', 'ktags', 'kicktag', 'kicktags'],
    category: 'Management',
    admin: true,
    developers: ['Aex66', 'Mo9ses']
});
cmd.startingArgs(['set', 'toggle', 'msg']);
cmd.unknownType('any', null, 1, false);
cmd.staticType('set', 'set', (plr, tag) => {
    if (tag === quick.adminTag)
        return plr.error('You cannot put this tag');
    plr.send(`The kick tag is now "§c${tag}§r§e".`);
    Server.db.write('KT', tag);
});
cmd.staticType('toggle', 'toggle', (plr) => {
    Server.db.write('KTT', !Boolean(Server.db.read('KTT')));
    plr.send(`Kick tags is now §${Server.db.read('KTT') ? 'con' : 'aoff'}§e.`);
}, null, false);
cmd.dynamicType('msg', ['message', 'msg', 'text', 'mess', 'reason', 'reasons'], (plr, _, args) => {
    const reason = args[0];
    Server.db.write('KTM', reason);
    plr.send(`The new kick message is now "§c${reason}§r§e".`);
}, 'any');
system.runInterval(async () => {
    if (!Server.db.read('KTT') || system.currentTick < 50)
        return;
    const tag = Server.db.read('KT'), reason = Server.db.read('KTM');
    if (!tag)
        return;
    for (const player of world.getPlayers()) {
        if (!player.hasTag(tag) || !Player.isConnected(player) || Player.isAdmin(player))
            continue;
        player.dimension.runCommandAsync(`kick "${player.name}" ${reason ?? 'Tidak ada alasan!'}`);
        await sleep(10);
    }
}, 25);
