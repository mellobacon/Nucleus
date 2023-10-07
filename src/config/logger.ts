import { error, warn, info } from "tauri-plugin-log-api";
function getScriptName() {
    let error = new Error()
    let lastStackFrameRegex = new RegExp(/.+\/(.*?):\d+(:\d+)*$/)
    let currentStackFrameRegex = new RegExp(/getScriptName \(.+\/(.*):\d+:\d+\)/);

    let lastStack = lastStackFrameRegex.exec(error.stack.trim());
    let currentStack = currentStackFrameRegex.exec(error.stack.trim());
    
    const result = {"location": "???", stack: error.stack};
    if (lastStack && lastStack[1] != "") {
        result.location = lastStack[1];
    }
    else if (currentStack) {
        result.location = currentStack[1];
    }
    return result;
}

export function logInfo(message: string, lineNumber: number) {
    const e = getScriptName();
    info(message, {file: e.location, line: lineNumber})
}
export function logWarn(message: string, lineNumber: number) {
    const e = getScriptName();
    warn(message, {file: e.location, line: lineNumber})
}
export function logError(message: string, lineNumber: number, withTrace = false) {
    const e = getScriptName();
    error(message, {file: e.location, line: lineNumber});
    if (withTrace) {
        error(e.stack);   
    }
}
