extern crate winreg;
use winreg::RegKey;
use winreg::enums::*;

use notify::{Watcher, RecursiveMode, watcher};
use std::sync::mpsc::channel;
use std::time::Duration;

pub fn get_file_extensions(input: &str) -> &str {
    println!("File extensions, registered in system:");
    for i in RegKey::predef(HKEY_CLASSES_ROOT)
        .enum_keys().map(|x| x.unwrap())
        .filter(|x| x.starts_with("."))
    {
        println!("{}", i);
    }
    return input;
}

pub fn watch_directory(directory: &str) -> String {
    // Create a channel to receive the events.
    let (sender, receiver) = channel();

    // Create a watcher object, delivering debounced events.
    // The notification back-end is selected based on the platform.
    let mut watcher = watcher(sender, Duration::from_secs(10)).unwrap();
    
    // Add a path to be watched. All files and directories at that path and
    // below will be monitored for changes.
    watcher.watch(directory, RecursiveMode::Recursive).unwrap();
    loop {
        match receiver.recv() {
           Ok(event) => {
            println!("{:?}", event);
            let x = format!("{:?}", event);
            return x;
           },
           Err(e) => println!("watch error: {:?}", e),
        }
    }
}