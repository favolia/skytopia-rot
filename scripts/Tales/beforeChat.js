import { world } from '@minecraft/server';
import { listeners } from './main.js';
import Commands from '../Papers/CommandPaper/CommandPaper.js';
import Player from '../Papers/PlayerPaper.js';
import Lang from '../Papers/LangPaper.js';
import quick from '../quick.js';
/**
 * The rank system and the command starter/runner
 */
world.beforeEvents.chatSend.subscribe(data => {
    try {
        data.cancel = true;
        data.message = data.message.replace(/\s+/g, ' ').trim();
        if (data.message === '')
            return;
        if (!data.message.startsWith(quick.prefix)) {
            const time = new Date();
            for (const event of listeners) {
                if (event[0] !== 'beforeChat')
                    continue;
                try {
                    event[1]({ message: data.message, player: data.sender });
                }
                catch {
                    return data.cancel = true;
                }
            }
            if (data.message.startsWith(quick.prefix))
                return Player.error(data.sender, Lang.cmd.wrongPrefix(quick.prefix));
            if (Player.isAdmin(data.sender) && data.sender.hasTag('mute'))
                return Player.error(data.sender, Lang.chat.mutted);
            if (!quick.chatRanks)
                return data.cancel = false;
            const message = Player.getChatColors(data.sender) + data.message.charAt(0).toUpperCase() + data.message.slice(1), rank = `§7[${Player.getPrefixes(data.sender).join('§r§7, ')}§r§7] ${Player.getNameColor(data.sender)}`;
            return Array.from(world.getPlayers()).forEach(plr => {
                const tz = Player.getScore(plr, 'ROTTimezone'), hour = time.getUTCHours() + tz > 24 ? Math.abs(tz - time.getUTCHours()) : time.getUTCHours() + tz;
                plr.sendMessage(`${rank}§r§7 ${hour === 0 ? 12 : hour > 12 ? hour - 12 : hour}:${time.getUTCMinutes() < 10 ? '0' + time.getUTCMinutes() : time.getUTCMinutes()} ${hour >= 12 ? 'pm' : 'am'}: ${message}`);
            });
        }
        const args = data.message.slice(quick.prefix.length).trim().split(/\s+/), command = args.shift().toLowerCase(), cmd = Commands.list.find(cmd => cmd.name === command || cmd.aliases && cmd.aliases.includes(command));
        Commands.run(cmd, Player.playerType(data.sender, { from: cmd?.name ?? 'ROT' }), args);
    }
    catch (e) {
        console.warn(e + e.stack);
        quick.logs.errors.push(`${e} : ${e.stack}`);
        data.cancel = false;
    }
});
