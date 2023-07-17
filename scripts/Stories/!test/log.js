import { system } from "@minecraft/server";
import { tps } from "../../Papers/Paragraphs/ExtrasParagraphs.js";
import quick from "../../quick.js";
system.runInterval(() => quick.logs.tps.push([`${new Date().getHours()}:${new Date().getMinutes()}`, tps.toFixed(3)]), 7200);
