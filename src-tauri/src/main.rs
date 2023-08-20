#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use std::ffi::OsStr;
use std::fs::File;
use std::io::Write;
use std::path::Path;
use std::{env, fs};
use std::process::Command;

use tauri::Manager;

mod encoding;
use encoding::BOM;

use crate::encoding::convert_to_u16;

#[tauri::command]
fn open_in_explorer(path: &str) {
    // FOR OTHER OS REFER - https://doc.rust-lang.org/std/env/consts/constant.OS.html
    // REF - https://github.com/tauri-apps/tauri/issues/4062
    // TARGET - WINDOWS
    if env::consts::OS == "windows" {
        Command::new("explorer")
            .args(["/select,", path])
            .spawn()
            .unwrap();
    }
}

#[tauri::command]
fn is_file(path: &str) -> bool {
    fs::metadata(path).unwrap().is_file()
}

#[tauri::command]
fn is_folder(path: &str) -> bool {
    fs::metadata(path).unwrap().is_dir()
}

#[tauri::command]
fn attempt_file_access(app_handle: tauri::AppHandle, p: &str) {
    app_handle.fs_scope().allow_directory(p, true).unwrap();
}

#[tauri::command]
fn delete_file(path: &str, perm: bool) {
    if perm {
        if is_file(path) {
            fs::remove_file(path).unwrap();
        }
        else {
            fs::remove_dir_all(path).unwrap();
        }
    }
    else {
        trash::delete(path).unwrap();
    }
}

#[derive(Hash, Eq, PartialEq, Debug)]
#[derive(serde::Serialize)]
struct FileData {
    text: String,
    encoding: String,
    extension: String,
    bom: bool
}

#[tauri::command]
fn read_file(path: &str) -> FileData {
    let bytes = fs::read(path).unwrap();
    let ext = Path::new(path).extension().and_then(OsStr::to_str).unwrap();
    let file_data: FileData;

    // encode based on bom if present otherwise just default to utf8
    if let Some(data) = encoding_rs::Encoding::for_bom(&bytes) {
        let (text, encoding, _) = data.0.decode(&bytes);
        file_data = FileData {text: text.to_string(), encoding: encoding.name().to_string(), extension: ext.to_string(), bom: true}
    }
    else {
        let (text, encoding, _) = encoding_rs::UTF_8.decode(&bytes);
        file_data = FileData {text: text.to_string(), encoding: encoding.name().to_string(), extension: ext.to_string(), bom: false}
    }
    file_data
}

#[tauri::command]
fn write_file(path: &str, content: &str, enc: &str, has_bom: bool) {
    let mut output = Vec::new();
    if let Some(data) = encoding_rs::Encoding::for_label(enc.as_bytes()) {
        let (bytes, _, _) = data.encode(content);
        let mut c_bytes = bytes.to_vec();
        let mut bom: Vec<u8> = Vec::new();
        if has_bom {
            if enc == "UTF-8" {
                bom = b"\xEF\xBB\xBF".to_vec();
            }
            else if enc == "UTF-16BE" {
                c_bytes = convert_to_u16(content, BOM::BigEndian);
            }
            else if enc == "UTF-16LE" {
                c_bytes = convert_to_u16(content, BOM::LittleEndian);
            }
        }
        output = [bom.as_slice(), c_bytes.as_slice()].concat();
    }
    let mut file = File::create(path).unwrap();
    file.write_all(&output).unwrap();
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![open_in_explorer, delete_file, attempt_file_access, is_file, is_folder, read_file, write_file])
        .plugin(tauri_plugin_fs_watch::init())
        .plugin(tauri_plugin_store::Builder::default().build())
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
