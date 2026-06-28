import rawAddress from "../data/vietnamAddress.json";

const getName = (arr) => {
    if (!Array.isArray(arr)) return "";
    const names = arr[0];

    if (Array.isArray(names)) {
        return names[names.length - 1];
    }

    return "";
};

const isInvalid = (arr) => {
    return arr.includes("Deleted") || arr.includes("Moved");
};

export const getProvinces = () => {
    return Object.entries(rawAddress).map(([code, value]) => ({
        code,
        name: getName(value)
    }));
};

export const getDistricts = (provinceCode) => {
    if (!provinceCode) return [];

    const province = rawAddress[provinceCode];
    if (!province) return [];

    const districtsObj = province[1];

    return Object.entries(districtsObj)
        .filter(([_, value]) => !isInvalid(value))
        .map(([code, value]) => ({
            code,
            name: getName(value)
        }));
};

export const getWards = (provinceCode, districtCode) => {
    if (!provinceCode || !districtCode) return [];

    const district = rawAddress[provinceCode]?.[1]?.[districtCode];
    if (!district) return [];

    const wardsObj = district[1];

    return Object.entries(wardsObj)
        .filter(([_, value]) => !isInvalid(value))
        .map(([code, value]) => ({
            code,
            name: getName(value)
        }));
};