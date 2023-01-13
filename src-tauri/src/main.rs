#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use std::env;
use std::process::Command;
use font_loader::system_fonts;
use std::fs;
use std::path::Path;
extern crate trash;

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
    } else if env::consts::OS == "linux" {
        Command::new("explorer")
            .args(["/select,", path])
            .spawn()
            .unwrap();
    }
}

#[tauri::command]
fn open_terminal(path: &str) {
    if env::consts::OS == "windows" {
        // programs for windows: [cmd, powershell, wt]
        // programs for ubuntu: [gnome-terminal]
        // .args(["/C", "start", "wt"])
        Command::new("cmd")
        .args(["/C", "wt", "-d", path])
        .spawn()
        .unwrap();
    }
    else {
        Command::new("gnome-terminal")
        .arg(format!("--working-directory={}", path).as_str())
        .spawn()
        .unwrap();
    }
}

#[tauri::command]
fn get_installed_fonts() -> Vec<String> {
    system_fonts::query_all()
}

#[tauri::command]
fn delete_file(path: &str, force: bool) {
    if path != "" {
        let path = Path::new(path);
        if path.exists() {
            if force {
                if path.is_file() {
                    fs::remove_file(path).unwrap();
                } else if path.is_dir() {
                    fs::remove_dir_all(path).unwrap();
                }
            } else {
                trash::delete(path).unwrap();
            }
        } else {
            println!("File or folder not found!");
        }
    }
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![open_in_explorer, open_terminal, get_installed_fonts, delete_file])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
