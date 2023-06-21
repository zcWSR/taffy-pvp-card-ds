const fs = require("node:fs");

if (!fs.existsSync('./data')) {
  fs.mkdirSync('./data');
}

const writeFile = (name, jsonData) => {
  fs.writeFileSync(`./data/${name}.json`, JSON.stringify(jsonData, null, 2), {flag: 'w+'});
}

// weapons
const weaponsJsonData = require("../GenshinData/ExcelBinOutput/WeaponExcelConfigData.json");
const weaponsData = weaponsJsonData.reduce((result, weapon) => {
  const { id, weaponType, nameTextMapHash } = weapon;
  result[id] = {
    type: weaponType,
    nameTextMapHash: nameTextMapHash,
  };
  return result;
}, {});

writeFile('weapons', weaponsData);

// character
const characterJsonData = require("../enka/store/characters.json");

const characterData = Object.keys(characterJsonData).reduce((result, characterId) => {
    const character = characterJsonData[characterId];
    if (isNaN(Number(characterId))) return result
    const { NameTextMapHash, Element, SideIconName } = character;
    let image
    if (NameTextMapHash === 3816664530) {
      image = 'lumine';
    } else if (NameTextMapHash === 1533656818) {
      image = 'aether';
    } else {
      image = SideIconName
        .match(/_([a-zA-Z]+)$/)[1]
        .replace(/^\w/, (c) => c.toLowerCase());
    }
    result[characterId] = {
      nameTextMapHash: NameTextMapHash,
      element: Element.toLowerCase(),
      image,
    };
    return result
  }, {});

writeFile('characters', characterData);

// reliquaries
const reliquaryJsonData = require("../GenshinData/ExcelBinOutput/ReliquaryExcelConfigData.json");
const reliquarySetJsonData = require("../GenshinData/ExcelBinOutput/ReliquarySetExcelConfigData.json");
const equipAffixJsonData = require("../GenshinData/ExcelBinOutput/EquipAffixExcelConfigData.json");
const enTextMapHash = require("../GenshinData/TextMap/TextMapEN.json");
const ruTextMapHash = require("../GenshinData/TextMap/TextMapRU.json");
const viTextMapHash = require("../GenshinData/TextMap/TextMapVI.json");
const thTextMapHash = require("../GenshinData/TextMap/TextMapTH.json");
const ptTextMapHash = require("../GenshinData/TextMap/TextMapPT.json");
const krTextMapHash = require("../GenshinData/TextMap/TextMapKR.json");
const jpTextMapHash = require("../GenshinData/TextMap/TextMapJP.json");
const idTextMapHash = require("../GenshinData/TextMap/TextMapID.json");
const frTextMapHash = require("../GenshinData/TextMap/TextMapFR.json");
const esTextMapHash = require("../GenshinData/TextMap/TextMapES.json");
const deTextMapHash = require("../GenshinData/TextMap/TextMapDE.json");
const chsTextMapHash = require("../GenshinData/TextMap/TextMapCHS.json");
const chtTextMapHash = require("../GenshinData/TextMap/TextMapCHT.json");
const itTextMapHash = require("../GenshinData/TextMap/TextMapIT.json");
const trTextMapHash = require("../GenshinData/TextMap/TextMapTR.json");

const reliquariesData = {};

const reliquarySetData = {}

const reliquarySetMap = {};
const equipAffixMap = {};

reliquarySetJsonData.forEach((set) => {
  reliquarySetMap[set.setId] = {
    affixId: set.EquipAffixId,
  };
});

equipAffixJsonData.forEach((affix) => {
  equipAffixMap[affix.id] = {
    nameTextMapHash: affix.nameTextMapHash,
  };
});

const langs = ["en", "ru", "vi", "th", "pt", "kr", "jp", "id", "fr", "es", "de", "zh-TW", "zh-CN", "it", "tr"]

const reliquariesLocData = langs.reduce((result, lang) => {
  result[lang] = {};
  return result;
}, {});


function addReliquariesLoc(textMapHash) {
  reliquariesLocData["en"][textMapHash] = enTextMapHash[textMapHash];
  reliquariesLocData["ru"][textMapHash] = ruTextMapHash[textMapHash];
  reliquariesLocData["vi"][textMapHash] = viTextMapHash[textMapHash];
  reliquariesLocData["th"][textMapHash] = thTextMapHash[textMapHash];
  reliquariesLocData["pt"][textMapHash] = ptTextMapHash[textMapHash];
  reliquariesLocData["kr"][textMapHash] = krTextMapHash[textMapHash];
  reliquariesLocData["jp"][textMapHash] = jpTextMapHash[textMapHash];
  reliquariesLocData["id"][textMapHash] = idTextMapHash[textMapHash];
  reliquariesLocData["fr"][textMapHash] = frTextMapHash[textMapHash];
  reliquariesLocData["es"][textMapHash] = esTextMapHash[textMapHash];
  reliquariesLocData["de"][textMapHash] = deTextMapHash[textMapHash];
  reliquariesLocData["zh-TW"][textMapHash] = chtTextMapHash[textMapHash];
  reliquariesLocData["zh-CN"][textMapHash] = chsTextMapHash[textMapHash];
  reliquariesLocData["it"][textMapHash] = itTextMapHash[textMapHash];
  reliquariesLocData["tr"][textMapHash] = trTextMapHash[textMapHash];
}

reliquaryJsonData.forEach((reliquaryData) => {
  reliquariesData[reliquaryData.id] = { nameTextMapHash: reliquaryData.nameTextMapHash };
  addReliquariesLoc(reliquaryData.nameTextMapHash);
  if (reliquaryData.setId) {
    const affixId = reliquarySetMap[reliquaryData.setId]?.affixId;
    if (affixId) {
      const setNameTextMapHash = equipAffixMap[affixId]?.nameTextMapHash;
      if (setNameTextMapHash) {
        reliquariesData[reliquaryData.id].setId = reliquaryData.setId;
        reliquariesData[reliquaryData.id].setNameTextMapHash = setNameTextMapHash;
        addReliquariesLoc(setNameTextMapHash);
      } else {
        console.warn(
          `equip affix data missing, reliquaryId:${reliquaryData.id} reliquarySetId:${reliquaryData.setId} affixId:${affixId}`
        );
      }
    } else {
      console.warn(
        `reliquary set data missing, reliquaryId:${reliquaryData.id} reliquarySetId:${reliquaryData.setId}`
      );
    }
  }
});

reliquarySetJsonData.forEach((setData) => {
  const affixId = reliquarySetMap[setData.setId]?.affixId;
  if (affixId) {
    const nameTextMapHash = equipAffixMap[affixId]?.nameTextMapHash;
    if (nameTextMapHash) {
      reliquarySetData[setData.setId] = { nameTextMapHash };
    } else {
      console.warn(
        `equip affix data missing, reliquarySetId:${setData.setId} affixId:${affixId}`
      );
    }
  } else {
    console.warn(`reliquary set data missing, reliquarySetId:${setData.setId}`);
  }
});

writeFile("reliquaries", reliquariesData);
writeFile("reliquaries-loc", reliquariesLocData);
writeFile("reliquary-set", reliquarySetData);