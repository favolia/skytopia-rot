import { ItemStack, EnchantmentTypes, ItemTypes, Enchantment } from "@minecraft/server";
import quick from "../../quick.js";
export const getItemData = (item) => {
    if (!item)
        return;
    const itemData = {
        id: item.typeId,
        amount: item.amount,
        nameTag: item.nameTag,
        lore: item.getLore(),
        enchantments: [],
    };
    if (!item.hasComponent("enchantments"))
        return itemData;
    const enchants = item.getComponent('enchantments')?.enchantments;
    for (let k of quick.enchantmentList) {
        const type = EnchantmentTypes.get(k);
        if (!type || !enchants.hasEnchantment(k))
            continue;
        const enchant = enchants.getEnchantment(type);
        itemData.enchantments.push({
            id: enchant.type.id,
            level: enchant.level,
        });
    }
    return itemData;
};
/**
   * This function allows you to create a new itemStack instance with the data saved with the getItemData function.
   * @param {ItemData} itemData - The data saved to create a new item
   * @returns {itemStack}
*/
export const newItem = (itemData, optionalAmount) => {
    const item = new ItemStack(ItemTypes.get(itemData.id), optionalAmount ?? itemData.amount);
    item.nameTag = itemData.nameTag;
    item.setLore(itemData.lore);
    const enchComp = item.getComponent("enchantments"), enchants = enchComp?.enchantments;
    if (enchants) {
        for (let enchant of itemData.enchantments) {
            const key = enchant.id
                .replace("minecraft:", "")
                .replace(/_(.)/g, (match) => match[1].toUpperCase());
            enchants.addEnchantment(new Enchantment(key, enchant.level));
        }
        enchComp.enchantments = enchants;
    }
    return item;
};
