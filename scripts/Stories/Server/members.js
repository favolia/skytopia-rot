import { MS, metricNumbers } from '../../Papers/Paragraphs/ConvertersParagraphs.js';
import { dateReg, nameReg } from '../../Tales/playerConnect.js';
import { addListener } from '../../Tales/main.js';
import Commands from '../../Papers/CommandPaper/CommandPaper.js';
import Player from '../../Papers/PlayerPaper.js';
const cmd = Commands.create({
    name: 'members',
    description: 'Daftar semua anggota yang pernah bergabung dengan server sebelumnya.',
    aliases: ['mem', 'players'],
    admin: true,
    category: 'Server',
    developers: ['Mo9ses']
});
cmd.startingArgs('page', false);
cmd.callback((plr, args) => !args.length && cmd.force(plr, 'page', 1));
cmd.numberType('page', (plr, page) => {
    const key = Object.entries(nameReg.getCollection()), len = key.length, memberList = new Array(Math.ceil(key.length / 35)).fill(0).map(_ => key.splice(0, 35)), members = [];
    if (!memberList[page - 1]?.[0])
        return plr.error('Unable to find this page');
    for (const member of memberList[page - 1])
        members.push(`§eNama anggota: §a${member[0].slice(1)}§e, tanggal bergabung: §a${MS(Date.now() - Number(dateReg.find(member[1]) ?? 0))} yang lalu§e, ID anggota: §a${member[1]}`);
    plr.send(`§aSelamat§e! Server ini memiliki §c${metricNumbers(len)}§e anggota! Berikut adalah daftar mereka:
${members.join('\n')}
§eHalaman §a${page}§e/§a${memberList.length}§e. §cHarap diingat bahwa tanggal-tanggal tersebut tidak 100% akurat.`);
});
//Use this for the ban command as well
