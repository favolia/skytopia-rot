import Commands from '../../Papers/CommandPaper/CommandPaper.js';
import quick from '../../quick.js';
const cmd = Commands.create({
    name: 'tac',
    description: 'Menghapus semua tag dari seorang pemain (kecuali tag admin jika pemain tersebut memilikinya).',
    aliases: ['tc', 'tagc', 'tclear'],
    category: 'Management',
    admin: true,
    developers: ['Aex66']
});
cmd.startingArgs('name');
cmd.playerType('name', (plr, plr2) => plr.send(`Menghapus §6${plr2.getTags().filter(tag => tag !== quick.adminTag && plr2.removeTag(tag)).length}§e tag dari §a${plr2.name}§e.`));
