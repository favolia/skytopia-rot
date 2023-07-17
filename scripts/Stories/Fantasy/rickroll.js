import Commands from '../../Papers/CommandPaper/CommandPaper.js';
const cmd = Commands.create({
    name: 'rickroll',
    description: 'Gunakan perintah ini untuk membuat anggota lain kesal :)',
    category: 'Fantasy',
    developers: ['Aex66']
});
cmd.startingArgs('name');
cmd.playerType('name', (plr, plr2) => plr2.sendMessage(`§aNever gonna give you up\nNever gonna let you down\nNever gonna run around and desert you\nNever gonna make you cry\nNever gonna say goodbye\nNever gonna tell a lie and hurt you\nRickroll requested by §c${plr.name}§8!`));
