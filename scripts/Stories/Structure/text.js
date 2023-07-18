import Commands from "../../Papers/CommandPaper/CommandPaper.js";
const cmd = Commands.create({
    name: 'text',
    description: 'Makes a cool little floating text so you don\'t have to place signs everywhere!',
    aliases: ['t', 'floating-text'],
    category: 'Structure',
    admin: true,
    developers: ['Mo9ses']
});
cmd.startingArgs(['spawn', 'kill']);
cmd.unknownType('any', null);
cmd.numberType('anynumber', null, null, { float: true, min: 1 });
cmd.dynamicType('spawn', 'spawn', (plr, _, args) => {
    plr.send(`Membuat teks melayang...\nTeks melayang berhasil dibuat "§c${args[0].join(' ')}§r§7"!`, 'TEXT');
    if (args[0].join(' ').includes('"'))
        plr.error('Teks tidak boleh mengandung karakter §4"§r.');
    plr.runCommandAsync(`summon rot:hologram "${args[0].join(' ')}" ~~~`);
}, 'any');
cmd.dynamicType('kill', 'kill', (plr, _, args) => {
    let radius = args[0] ?? 1;
    plr.send(`Menghentikan semua teks melayang dalam radius §c${radius}§e blok dari lokasi saat ini!`, 'TEXT');
    plr.runCommandAsync(`kill @e[type=rot:hologram,r=${radius},tag=!ROTLB]`);
}, 'anynumber', true, undefined, false);
