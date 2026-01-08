use std::{fs, path::PathBuf};

pub fn execute(from: PathBuf, to: PathBuf, files_names: Vec<String>) -> std::io::Result<()> {
    for file in files_names {
        let mut final_name = file.split(" - ").take(2).collect::<Vec<_>>().join(" - ");
        final_name.push_str(".pdf");

        fs::copy(&from.join(&file), &to.join(&final_name))?;
    }

    Ok(())
}
