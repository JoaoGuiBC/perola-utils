use fs_extra::{copy_items, dir};
use std::path::PathBuf;

pub fn execute(
    current_dir: PathBuf,
    contains_confort: bool,
    contains_lippy: bool,
) -> Result<(), Box<dyn std::error::Error>> {
    let options = dir::CopyOptions::new();

    let from = current_dir.join("reg");
    let to = current_dir.join("registro");

    let mut from_paths = Vec::new();

    if contains_confort {
        from_paths.push(from.join("MAXICONFORT"));
    }
    if contains_lippy {
        from_paths.push(from.join("LIPPY"));
    }

    copy_items(&from_paths, to, &options)?;

    Ok(())
}
