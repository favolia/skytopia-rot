import Commands from '../../Papers/CommandPaper/CommandPaper.js';
import Server from '../../Papers/ServerPaper.js';
const cmd = Commands.create({
    name: 'clearchat',
    description: 'Perintah ini akan membersihkan obrolan.',
    aliases: ['chatc', 'bomb', 'clearc'],
    admin: true,
    category: 'Server',
    developers: ['Aex66']
});
cmd.callback(plr => {
    Server.broadcast('\n\n\n\n\n'.repeat(100), undefined, false);
    Server.broadcast(`Chat telah dibersihkan oleh §6${plr.name}§r§e!`, 'ROT');
});
