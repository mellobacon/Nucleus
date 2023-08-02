#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use std::{env, fs};
use std::process::Command;

use tauri::Manager;

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

#[tauri::command]
fn read_file(path: &str) -> std::string::String {
    let bytes = fs::read(path).unwrap();
    let content = encoding_rs::UTF_8.decode(&bytes);
    println!("{:?}", content);
    content.0.to_string()
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![open_in_explorer, delete_file, attempt_file_access, is_file, is_folder, read_file])
        .plugin(tauri_plugin_fs_watch::init())
        .plugin(tauri_plugin_store::Builder::default().build())
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
