export function getShortcut({ primaryKey, secondaryKey, modifier }) {
    if (modifier) {
        modifier = `${modifier} + `;
    }
    if (secondaryKey) {
        secondaryKey = `${secondaryKey} + `;
    }
    return `${modifier}${secondaryKey}${primaryKey}`;
}