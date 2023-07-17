import { system } from '@minecraft/server';
import Commands from '../../Papers/CommandPaper/CommandPaper.js';
import Database from '../../Papers/DatabasePaper.js';
import { connected } from '../../Tales/playerConnect.js';
import { world } from "@minecraft/server";
import { MS } from '../../Papers/Paragraphs/ConvertersParagraphs.js';
export const ban = {
    regReason: null,
    regExpire: null
};
(async function () {
    ban.regReason = await Database.registry('banReason');
    ban.regExpire = await Database.registry('banExpire');
})();
const cmd = Commands.create({
    name: 'ban',
    description: 'banned pemain',
    aliases: ['tempban', 'bam'],
    category: 'Management',
    admin: true,
    developers: ['Mo9ses']
});
cmd.startingArgs('player');
cmd.playerType('player', (plr, val, args) => {
    if (val.player?.isAdmin)
        return plr.send('Kamu tidak bisa membanned administrator');
    if (args[1]?.includes('$-$'))
        return plr.error('Kamu tidak bisa menggunakan "$-$" di alasan.');
    if (val.name.includes('$-$'))
        return plr.error('Pemain itu sepertinya memiliki nama yang melanggar peraturan.');
    console.warn(val?.rID);
    plr.send(`Kamu baru saja mem-banned §a${val.name}§e.`);
    const data = ban.regExpire.find(Number(val.rID));
    if (data)
        ban.regExpire.delete(data);
    ban.regReason.write(`${val?.name}$-$${args[1] || 'Tidak ada alasan.'}$-$${val.rID}`, Number(val.rID));
    ban.regExpire.write(`${Date.now() + args[0]}$-$${val.rID}`, Number(val.rID));
}, false, 'time', { self: false }, true);
cmd.timeType('time', null, 'reason', null, false);
cmd.unknownType('reason', null, 1);
system.runInterval(() => {
    for (const player of world.getPlayers()) {
        if (!ban.regExpire || ban.regReason)
            return;
        const rID = connected[player.name]?.rID, date = ban.regExpire.find(Number(rID)), reason = ban.regReason.find(Number(rID));
        if (!date)
            continue;
        const expire = Number(date?.split('$-$')?.[0]) ?? 0;
        if (Date.now() < expire)
            return player.runCommand(`Menendang "${player.name}"
Alasan: ${reason?.split('$-$')?.[1]}
Larangan kamu akan berakhir dalam: ${MS(expire - Date.now())}`);
        ban.regExpire.delete(date);
        ban.regReason.delete(reason);
        console.warn(`Pemain §c${player.name}§r dengan ID §c${rID}§r telah dibebaskan dari unbanned!`);
    }
});
