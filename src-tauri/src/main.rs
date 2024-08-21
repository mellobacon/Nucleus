#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

#[cfg(debug_assertions)]
const LOG_TARGETS: [LogTarget; 2] = [LogTarget::Stdout, LogTarget::Webview];

#[cfg(not(debug_assertions))]
const LOG_TARGETS: [LogTarget; 2] = [LogTarget::Stdout, LogTarget::LogDir];

use std::collections::{self, HashMap};
use std::fs::File;
use std::io::Write;
use std::path::{Path, PathBuf};
use std::process::Command;
use std::{env, fs};
use tauri::{App, Manager, Wry};
use encoding::BOM;
use log::{error, info, Level};
use tauri::plugin::TauriPlugin;
use tauri_plugin_log::{LogTarget, RotationStrategy};
use crate::encoding::convert_to_u16;

mod encoding;

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
fn open_in_default(path: &str)  {
    if env::consts::OS == "windows" {
        Command::new("powershell")
            .args(["&", path])
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
fn is_file(path: &str) -> bool {
    match fs::metadata(path) {
        Ok(r) => r.is_file(),
        Err(e) => {
            error!("{}", e);
            false
        }
    }
}

#[tauri::command]
fn is_folder(path: &str) -> bool {
    match fs::metadata(path) {
        Ok(r) => r.is_dir(),
        Err(e) => {
            error!("{}", e);
            false
        }
    }
}

#[tauri::command]
fn attempt_file_access(app_handle: tauri::AppHandle, p: &str) {
    app_handle.fs_scope().allow_directory(p, true).unwrap();
}

#[tauri::command]
fn delete_file(path: &str, perm: bool) {
    if perm {
        if is_file(path) {
            match fs::remove_file(path) {
                Ok(_) => {
                    info!("{:?} sucessfully deleted.", PathBuf::from(path).file_name());
                }
                Err(err) => error!("Cannot remove {}. Error: {}.", path, err),
            }
        } else {
            match fs::remove_dir_all(path) {
                Ok(_) => info!("Path {} deleted sucessfully.", path),
                Err(err) => error!("Cannot remove {}. Error: {}.", path, err),
            }
        }
    } else {
        match trash::delete(path) {
            Ok(_) => {
                info!(
                    "{:?} sucessfully moved to trash.",
                    PathBuf::from(path).file_name()
                );
            }
            Err(err) => error!("Cannot remove {}. Error: {}.", path, err),
        }
    }
}

#[derive(Hash, Eq, PartialEq, Debug, serde::Serialize)]
struct FileData {
    text: String,
    encoding: String,
    extension: String,
    bom: bool,
    spaces: usize
}

#[tauri::command]
fn read_file(path: &str) -> FileData {
    info!("Attempting to read file in {}.", path);

    let mut bytes: Vec<u8> = vec![];
    match fs::read(path) {
        Ok(b) => {
            bytes = b;
        }
        Err(err) => error!("Cannot read {}. Error: {}", path, err),
    }

    let ext = match Path::new(path).extension() {
        Some(v) => {
            v.to_str().unwrap()
        }
        None => {
            error!("No extension found for {}", path);
            ""
        }
    };

    let file_data: FileData;

    // encode based on bom if present otherwise just default to utf8
    if let Some(data) = encoding_rs::Encoding::for_bom(&bytes) {
        let (text, encoding, _) = data.0.decode(&bytes);
        let t = text.to_string();
        let x = t.as_str();
        let lines: Vec<&str> = x.lines().collect();
        let spaces = detect_indent(&lines);
        let space_count = match spaces {
            Some(capture) => capture,
            None => 0
        };

        file_data = FileData {
            text: text.to_string(),
            encoding: encoding.name().to_string(),
            extension: ext.to_string(),
            bom: true,
            spaces: space_count
        };
        info!("File BOM found. Encoding with {}...", encoding.name());
    } else {
        let (text, encoding, _) = encoding_rs::UTF_8.decode(&bytes);
        let t = text.to_string();
        let x = t.as_str();
        let lines: Vec<&str> = x.lines().collect();
        let spaces = detect_indent(&lines);
        let space_count = match spaces {
            Some(capture) => capture,
            None => 0
        };

        file_data = FileData {
            text: text.to_string(),
            encoding: encoding.name().to_string(),
            extension: ext.to_string(),
            bom: false,
            spaces: space_count
        };
        info!(
            "No file BOM found. Defaulting to {} encoding...",
            encoding.name()
        );
    }
    file_data
}

#[tauri::command]
fn write_file(path: &str, content: &str, enc: &str, has_bom: bool) {
    info!("Attempting to write file to {}.", path);

    let mut output = Vec::new();
    if let Some(data) = encoding_rs::Encoding::for_label(enc.as_bytes()) {
        let (bytes, _, _) = data.encode(content);
        let mut c_bytes = bytes.to_vec();
        let mut bom: Vec<u8> = Vec::new();
        if has_bom {
            info!("Encoding file to {} encoding...", enc);
            if enc == "UTF-8" {
                bom = b"\xEF\xBB\xBF".to_vec();
            } else if enc == "UTF-16BE" {
                c_bytes = convert_to_u16(content, BOM::BigEndian);
            } else if enc == "UTF-16LE" {
                c_bytes = convert_to_u16(content, BOM::LittleEndian);
            }
        }
        output = [bom.as_slice(), c_bytes.as_slice()].concat();
    }

    if !PathBuf::from(path).exists() {
        info!("{} not found. Creating new file...", path);
    }

    let file = File::create(path);
    match file {
        Ok(mut f) => {
            f.write_all(&output).unwrap();
        }
        Err(err) => error!("Cannot write to {}. Error: {}", path, err),
    }
}

#[tauri::command]
fn is_supported(path: &str) -> bool {
    match infer::get_from_path(path) {
        Ok(Some(info)) => {
            let mut supported = false;
            if info.mime_type().contains("text") {
                supported = true;
            }
            else {
                info!("File type detected: {}. Must be binary.", info.mime_type());
            }
            supported
        }
        Ok(None) => {
            true
        }
        Err(e) => {
            error!("{}", e);
            false
        }
    }
}

fn detect_indent(lines: &[&str]) -> Option<usize> {
    let mut indents: collections::HashMap<usize, usize> = collections::HashMap::new(); // # spaces indent -> # times seen
    let mut last = 0; // # leading spaces in the last line we saw

    for &text in lines.iter() {
        let width = text.find(|c: char| c != ' ').unwrap_or_else(|| text.len());

        let indent = (width as isize - last as isize).abs() as usize;
        if indent > 1 {
            *indents.entry(indent).or_insert(0) += 1;
        }
        last = width;
    }

    // find most frequent non-zero width difference
    let mut max = 0;
    let mut indent = None;
    for (&width, &tally) in &indents {
        if tally > max {
            max = tally;
            indent = Some(width);
        }
    }

    indent
}

fn configure_log() -> TauriPlugin<Wry> {
    tauri_plugin_log::Builder::default()
        .format(move |out, message, record| {
            let format = time::format_description::parse(
                "[[[year]-[month]-[day]][[[hour]:[minute]:[second]]",
            )
            .unwrap();
            let file_info = record.file().map(|location| format!("::{}", location.split("\\").last().unwrap().to_owned()))
                .unwrap_or("".to_string());
            let line_info =  record.line().map(|line| format!(":{}", line))
                .unwrap_or("".to_string());
            out.finish(format_args!(
                "{}[{}][{}{}{}] {}",
                time::OffsetDateTime::now_local()
                    .unwrap()
                    .format(&format)
                    .unwrap(),
                record.level(),
                record.target(),
                file_info,
                line_info,
                message
            ))
        })
        .targets(LOG_TARGETS)
        .filter(|l| {
            let mut filter = false;
            if cfg!(debug_assertions) {
                filter = !matches!(l.level(), Level::Trace);
            }
            else if cfg!(not(debug_assertions)) {
                filter = !matches!(l.level(), Level::Trace | Level::Debug);
            }
            filter
        })
        .rotation_strategy(RotationStrategy::KeepAll)
        .build()
}

fn configure_log_path(app: &mut App) {
    let app_log_dir = tauri::api::path::app_log_dir(&app.config()).unwrap();
    let old_log_path = app_log_dir.join("nucleus.log");
    if !Path::exists(&old_log_path) {
        return;
    }

    let format = time::format_description::parse("[year]-[month]-[day]-[hour][minute]").unwrap();
    let time = time::OffsetDateTime::now_local()
        .unwrap()
        .format(&format)
        .unwrap();
    let log_name = format!("nucleus_log-{}.log", time);
    
    // changing the default log name to something more meaningful
    let new_log_path = app_log_dir.join(log_name);
    fs::rename(old_log_path, new_log_path).unwrap();
}

fn load_settings(app: &mut App) {
    info!("Loading default settings:");

    let default_settings = serde_json::json!(
        {
            "nucleus.theme": "Dark",
            "editor.fontSize": 14,
            "editor.fontFamily": "monospace",
            "editor.lineHeight": 1.3,
            "editor.tabSize": 4,
            "editor.autosave": false,
            "nucleus.showKeybinds": false,
            "nucleus.useExternalTerminal": false,
            "terminal.external.profile": "powershell",
            "terminal.internal": {
                "profile": "powershell",
                "fontSize": "14",
                "fontFamily": "Cascadia Mono",
                "lineHeight": "1.2",
                "cursorStyle": "bar",
                "fontWeight": "normal",
            }
        }
    );
    let appdata_local = tauri::api::path::app_local_data_dir(&app.config()).unwrap();
    let settings_path = appdata_local.join("default_settings.json");

    #[cfg(debug_assertions)]
    fs::write(&settings_path, default_settings.to_string()).unwrap();

    if !settings_path.try_exists().unwrap() {
        fs::write(&settings_path, default_settings.to_string()).unwrap();
        info!(
            "Default settings file not found. Created a new default settings file. Path: {:?}",
            &settings_path
        );
    } else {
        info!("Settings path: {:?}:", settings_path);
    }

    let mut defaults = HashMap::new();
    for settings in default_settings.as_object().unwrap() {
        defaults
            .entry(settings.0.clone())
            .or_insert_with(|| settings.1.clone());
    }

    let mut settings_store = tauri_plugin_store::StoreBuilder::new(app.handle(), settings_path)
        .defaults(defaults)
        .build();

    settings_store.load().unwrap();
}

fn main() {
    let original = std::panic::take_hook();
    std::panic::set_hook(Box::new(move |info| {
        // log panics/crashes
        original(info);
        error!("[FATAL]: {:?}", info.to_string());
    }));

    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            open_in_explorer,
            delete_file,
            attempt_file_access,
            is_file,
            is_folder,
            read_file,
            write_file,
            open_in_default,
            is_supported,
            open_terminal
        ])
        .plugin(tauri_plugin_fs_watch::init())
        .plugin(tauri_plugin_store::Builder::default().build())
        .plugin(configure_log())
        .plugin(tauri_plugin_pty::init())
        .setup(|app| {
            configure_log_path(app);
            load_settings(app);
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
