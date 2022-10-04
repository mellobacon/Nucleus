use notify::{Watcher, RecursiveMode, watcher};
use std::sync::mpsc::channel;
use std::time::Duration;

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