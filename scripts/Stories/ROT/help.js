import Commands from '../../Papers/CommandPaper/CommandPaper.js';
import Lang from '../../Papers/LangPaper.js';
import quick from '../../quick.js';
const cmd = Commands.create({
    name: 'help',
    description: 'Untuk daftar semua perintah, ketik "§6!help§e". Untuk informasi tentang perintah tertentu, tambahkan namanya.',
    aliases: ['?'],
    category: 'ROT',
    developers: ['Mo9ses']
});
cmd.startingArgs(['cmd', 'page'], false);
cmd.callback((plr, args) => !args.length && cmd.force(plr, 'page', 1));
cmd.dynamicType('cmd', [Commands.list.map(c => c.name), Commands.list.map(c => c.aliases)].flat(2), (plr, val) => {
    const cmd = Commands.list.find(c => c.name === val || c.aliases.includes(val));
    if (cmd && cmd.admin && !plr.isAdmin)
        plr.send(Lang.cmd.noPerms);
    let hI = `§bPerintah: §a${quick.prefix}§a${cmd.name}\n`;
    if (cmd.description.length)
        hI += `§bDeskripsi:§r§6 ${cmd.description}\n`;
    if (cmd.aliases.length)
        hI += `§bAlias:§r§6 ${cmd.aliases.join(`§e, §6`)}\n`;
    hI += `§bKategori:§r§6 ${cmd.category.toUpperCase()}\n`;
    if (cmd.toggle)
        hI += `§bTogglable:§r§6 ${cmd.toggle}\n`;
    if (cmd.tags)
        hI += `§bTag:§r§6 ${cmd.tags.join('§e, §6')}\n`;
    // if (cmd.developers)
    //     hI += `§bDeveloper(s):§r§6 ${cmd.developers.join('§e, §6')}\n`;
    if (cmd.notes)
        hI += `§bCatatan:§r§6 ${cmd.notes}\n§r`;
    if (cmd.sT[0].length)
        hI += `§eArgument awal:§r§6 ${quick.prefix}${cmd.name} < §a${cmd.sT[0].join('§6 | §a')}§6 >`;
    plr.tip(`Join the Skytopia Discord if you need any more help!§d ${quick.discord}`, 'ROT');
    plr.sendMessage(`§6${hI}§r`);
});
cmd.numberType('page', (plr, page) => {
    const fakeList = Commands.list, commandList = new Array(Math.ceil(Commands.list.length / 35)).fill(0).map(_ => fakeList.filter(c => plr.isAdmin ? true : !c.admin || (c.tags?.length ? plr.isAdmin : false)).splice(0, 35)), help = [], categoryHold = [];
    if (!commandList[page - 1]?.[0])
        return plr.error('Tidak dapat menemukan halaman ini.');
    for (const command of commandList[page - 1]) { //If admin, show disabled commands. Complete help page, Command UI, and quick today
        if (!categoryHold.includes(command.category))
            help.push(`\n   §6<=-=-=-§d${command.category.toUpperCase()}§6=-=-=->\n`) && categoryHold.push(command.category);
        help.push(`§a> §b${command.name[0].toUpperCase() + command.name.slice(1)}§6 - §c${command.description}`);
    }
    plr.tip(`Gabunglah ke Discord Skytopi jika kamu membutuhkan bantuan lebih lanjut! §d${quick.discord}`);
    plr.sendMessage(`${help.join('\n')}\n   §6<=-=-=-=-=-=-=-=-=->\n§bHalaman:§r §e${page}§a/§e${commandList.length}\n§bGunakan "§a${quick.prefix}help" §e<Nomer halaman>§b Untuk melihat halaman selanjutnya.`);
}, [], { min: 0 });
