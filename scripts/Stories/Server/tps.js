import Commands from "../../Papers/CommandPaper/CommandPaper.js";
import { tps } from "../../Papers/Paragraphs/ExtrasParagraphs.js";
const cmd = Commands.create({
    name: 'tps',
    description: 'Mendapatkan TPS (Tick Per Second) server.',
    category: 'Server'
});
cmd.callback((plr) => {
    plr.send(`TPS (Tick Per Second) server saat ini: ${(Number(tps.toFixed(0)) >= 15) ? '§a' : '§c'}${tps.toFixed(3)}§e`);
});
