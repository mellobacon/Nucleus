#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

use std::process::Command;
use std::env;
#[tauri::command]
fn open_in_explorer(path: &str){
  // FOR OTHER OS REFER - https://doc.rust-lang.org/std/env/consts/constant.OS.html
  // REF - https://github.com/tauri-apps/tauri/issues/4062
  // TARGET - WINDOWS 
  if env:: consts:: OS == "windows" {
    Command::new("explorer")
            .args(["/select,",path]) 
            .spawn()
            .unwrap();
  }
}

fn main() {
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![
            open_in_explorer
        ])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
