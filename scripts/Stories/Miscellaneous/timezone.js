import { world } from '@minecraft/server';
import Commands from '../../Papers/CommandPaper/CommandPaper.js';
try {
    world.getDimension('overworld').runCommandAsync(`scoreboard objectives add "ROTTimezone" dummy`);
}
catch { }
;
const cmd = Commands.create({
    name: 'timezone',
    description: 'Ini hanya mengatur zona waktu di obrolan sesuai dengan waktumu :)',
    aliases: ['tz'],
    category: 'Miscellaneous',
    developers: ['Aex66']
});
cmd.startingArgs('timezone', true);
cmd.numberType('timezone', (plr, val) => {
    if (val >= 24 || val <= -24)
        return plr.error('Itu bukan angka yang valid.');
    plr.runCommandAsync(`scoreboard players set @s ROTTimezone ${val}`);
    plr.send(`Zona waktu kamu telah diatur menjadi §6§l${val >= 0 ? '+' + val : val}§r§e jam!`);
}, [], { float: false });
