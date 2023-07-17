import { system, world } from '@minecraft/server';
import Commands from '../../Papers/CommandPaper/CommandPaper.js';
import Database from '../../Papers/DatabasePaper.js';
import { metricNumbers } from '../../Papers/Paragraphs/ConvertersParagraphs.js';
import Player from '../../Papers/PlayerPaper.js';
import Server from '../../Papers/ServerPaper.js';
const cmd = Commands.create({
    name: 'scoreboard',
    description: 'Membuat sidebar pribadi khusus untuk pemain!',
    aliases: ['score', 'board', 'scoreboard', 'sidebar', 'personal-sidebar', 'sb'],
    category: 'Server',
    admin: true,
    developers: ['Aex66']
});
let sc = null;
(async function () {
    sc = await Database.register('SC');
})();
cmd.unknownType('any', null, 1);
cmd.numberType('anynumber', null);
cmd.unknownType('anynull', null);
cmd.startingArgs(['create', 'remove', 'preview', 'setline', 'removeline', 'settag', 'list'], false);
cmd.callback((plr, args) => {
    if (args.length)
        return;
    cmd.force(plr, 'list', null);
});
cmd.staticType('create', 'create', (plr, val) => {
    if (sc.has(val))
        return plr.error(`Server ini sudah memiliki sidebar "§6${val}§r§e"!`, 'Sidebar');
    if (val.replace(/[a-zA-Z0-9]/g, '') !== '')
        return plr.error('Kamu tidak dapat menggunakan karakter khusus dalam hal ini!', 'Sidebar');
    sc.write(val, [val]);
    return plr.send(`Sidebar §6${val}§e telah dibuat! Kamu dapat membuatnya muncul di layar pemain dengan mengetik "§6/tag "nama_pemain" add ${val}§r§e".`, 'Sidebar');
});
cmd.staticType('remove', 'remove', (plr, val) => {
    if (!sc.has(val))
        return plr.error(`Sidebar "§6${val}§r§e" tidak ada!`, 'Sidebar');
    sc.delete(val);
    return plr.send(`Sidebar §6${val}§e telah §6§lDIHAPUS§r§e!`, 'Sidebar');
});
cmd.dynamicType('preview', ['show', 'preview', 'pushingp'], (plr, _, args) => {
    if (!sc.has(args[0]))
        return plr.error(`Sidebar "§6${args[0]}§r§e" tidak ada!`, 'Sidebar');
    let board = sc.read(args[0]).join('§r\n').replace(/\(rank\)/g, plr.getPrefixes().join('§r§7, ') + '§r').replace(/\(name\)/g, plr.getNameColor() + '§r');
    if (/(?<=\(score:).+?(?=\))/.test(board))
        board.match(/(?<=\(score:).+?(?=\))/g).map((obj) => {
            board = board.replace(`(score:${obj})`, plr.getScore(obj) ? metricNumbers(plr.getScore(obj)) : 0);
        });
    if (/(?<=\(tag:).+?(?=\))/.test(board))
        board.match(/(?<=\(tag:).+?(?=\))/g).map((tag) => {
            board = board.replace(`(tag:${tag})`, Array.from(world.getPlayers()).filter(p => p.hasTag(tag)).map(p => p?.name)?.length ?
                Array.from(world.getPlayers()).filter(p => p.hasTag(tag)).map(p => p?.name).join('§r§7, ') :
                '');
        });
    Server.runCommand(`titleraw "${plr.name}" actionbar {"rawtext":[{"text":${JSON.stringify(board)}}]}`);
    return plr.send(`You are currently previewing the sidebar §6${args[0]}§r§e!`, 'Sidebar');
}, 'any');
cmd.dynamicType('setline', ['setline', 'addline', 'newline', 'sl'], (plr, _, args) => {
    if (!sc.has(args[0]))
        return plr.error(`Sidebar "§6${args[0]}§r§e" tidak ada!`, 'Sidebar');
    if (!args[1])
        return plr.error('Silakan ketik angka.', 'Sidebar');
    let line = args[1], lineChars = args[2].join(' ');
    if (line > 16)
        return plr.error('Maaf, kamu tidak dapat memiliki lebih dari 16 baris.', 'Sidebar');
    if (line < 1)
        return plr.error('Tidak ada baris kurang dari 1, teman.', 'Sidebar');
    if (lineChars.includes('\\n'))
        return plr.error(`Kamu tidak dapat pindah ke baris berikutnya saat berada di baris §6${line}§e!`, 'Sidebar');
    if (line > sc.read(args[0]).length + 1)
        return plr.error(`Kamu belum membuat baris §6${line - 1}§e!`, 'Sidebar');
    let board = sc.read(args[0]);
    board.splice(line - 1, 1, lineChars);
    sc.write(args[0], board);
    return plr.send(`Baris §6${line}§e pada sidebar "§6${args[0]}§r§e" telah diatur menjadi "§6${lineChars}§r§e"!`, 'Sidebar');
}, 'sl:sidebar');
cmd.numberType('sl:line', null, 'anynull');
cmd.unknownType('sl:sidebar', null, 1, false, 'sl:line');
cmd.dynamicType('removeline', ['delline', 'd', 'removeline'], (plr, _, args) => {
    if (!sc.has(args[0]))
        return plr.error(`Sidebar "§6${args[0]}§r§e" tidak ada!`, 'Sidebar');
    if (!args[1])
        return plr.error('Silakan ketikkan sebuah angka.', 'Sidebar');
    let line = args[1];
    if (line > 16)
        return plr.error('Aku bertaruh kamu tidak memiliki lebih dari 16 baris.', 'Sidebar');
    if (line < 1)
        return plr.error('Tidak ada baris yang kurang dari 1, kawan.', 'Sidebar');
    if (line > sc.read(args[0]).length + 1)
        return plr.error(`Kamu bahkan belum membuat baris §6${line - 1}§e!`, 'Sidebar');
    let board = sc.read(args[0]);
    board.splice(line - 1, 1);
    sc.write(args[0], board);
    return plr.send(`Baris §6${line}§e pada sidebar "§6${args[0]}§r§e" telah §6§ldihapus§r§e!`, 'Sidebar');
}, 'rl:sidebar');
cmd.numberType('rl:line', null);
cmd.unknownType('rl:sidebar', null, 1, false, 'rl:line');
cmd.dynamicType('settag', ['st', 'settag', 'maketag'], (plr, _, args) => {
    if (!sc.has(args[0]))
        return plr.error(`Sidebar "§6${args[0]}§r§e" tidak ada!`, 'Sidebar');
    if (args[1].replace(/[a-zA-Z0-9]/g, '') !== '')
        return plr.error('Kamu tidak dapat menggunakan karakter!', 'Sidebar');
    sc.write(args[1], sc.read(args[0]));
    sc.delete(args[0]);
    return plr.send(`Sidebar §6${args[0]}§e telah diubah namanya menjadi §6${args[1]}§e.`, 'Sidebar');
}, 'st:any');
cmd.unknownType('st:any', null, 1, false, 'st:tag');
cmd.unknownType('st:tag', null, 1);
cmd.staticType('list', 'list', (plr) => {
    let allBoards = [];
    for (let key in sc.getCollection())
        allBoards.push(`§lTag: §6${key}§r§6`);
    if (allBoards.length > 0)
        return plr.send(`Server ini memiliki total §6${allBoards.length}§e sidebar! Berikut adalah daftar sidebar yang tersedia:
${allBoards.join('\n')}`, 'SIDEBAR');
    return plr.error('Sepertinya server ini tidak memiliki sidebar saat ini.', 'SIDEBAR');
}, null, false);
system.runInterval(() => {
    if (!sc)
        return;
    world.getAllPlayers().forEach((p) => {
        const tags = p?.getTags();
        if (!tags?.length)
            return;
        tags.forEach((tag) => {
            if (sc.has(tag)) {
                let board = sc.read(tag).join('§r\n').replace(/\(rank\)/g, Player.getPrefixes(p).join('§r§7, ') + '§r').replace(/\(name\)/g, Player.getNameColor(p) + '§r');
                if (/(?<=\(score:).+?(?=\))/.test(board))
                    board.match(/(?<=\(score:).+?(?=\))/g).map((obj) => board = board.replace(`(score:${obj})`, Player.getScore(p, obj) ? metricNumbers(Player.getScore(p, obj)) : 0));
                if (/(?<=\(tag:).+?(?=\))/.test(board))
                    board.match(/(?<=\(tag:).+?(?=\))/g).map((tag) => board = board.replace(`(tag:${tag})`, Array.from(world.getPlayers()).filter(p => p.hasTag(tag)).map(p => p?.name)?.length ? Array.from(world.getPlayers()).filter(p => p.hasTag(tag)).map(p => p?.name).join('§r§7, ') : ''));
                Server.runCommand(`titleraw "${p.name}" title {"rawtext":[{"text":${JSON.stringify(board)}}]}`);
            }
        });
    });
}, 1);
