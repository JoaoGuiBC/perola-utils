pub mod utils;

use serde::{Deserialize, Serialize};
use std::{env, fs};

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Item {
    item: i32,
    produto: String,
    registro: String,
    fornecedor: String,
}

#[derive(Debug, Serialize, Deserialize)]
enum RegisterFilesResponse {
    WithMessage { message: String },
    WithItems { not_found: Vec<Item> },
}

#[tauri::command]
fn get_register_files(
    items: Vec<Item>,
    items_without_register: Vec<Item>,
) -> RegisterFilesResponse {
    let current_dir = match env::current_dir() {
        Ok(dir) => dir,
        Err(_) => {
            return RegisterFilesResponse::WithMessage {
                message: "Falha ao ler local do executavel".into(),
            }
        }
    };

    let origin_reg_folder = current_dir.join("reg");
    let path_exists = origin_reg_folder.exists();

    if !path_exists {
        return RegisterFilesResponse::WithMessage {
            message: "Falha ao buscar pasta com os registros".into(),
        };
    }

    let file_names = if let Ok(entries) = fs::read_dir(&origin_reg_folder) {
        let file_names: Vec<String> = entries
            .filter_map(Result::ok)
            .map(|entry| entry.file_name().into_string())
            .filter_map(Result::ok)
            .collect();

        file_names
    } else {
        Vec::new()
    };

    let queried_files_folder = current_dir.join("registro");

    if queried_files_folder.exists() {
        if let Err(e) = fs::remove_dir_all(&queried_files_folder) {
            return RegisterFilesResponse::WithMessage {
                message: format!("Falha ao remover pasta registro: {}", e),
            };
        }
    }

    if let Err(e) = fs::create_dir(&queried_files_folder) {
        return RegisterFilesResponse::WithMessage {
            message: format!("Falha ao criar pasta registro: {}", e),
        };
    }

    let contains_confort = items.iter().any(|i| i.fornecedor.trim() == "CONFORT");
    let contains_lippy = items.iter().any(|i| i.fornecedor.trim() == "LIPY");

    let items: Vec<Item> = items
        .into_iter()
        .filter(|item| item.fornecedor != "CONFORT" && item.fornecedor != "LIPY")
        .collect();

    let names_of_requested_files: Vec<String> = items
        .iter()
        .filter_map(|item| {
            file_names
                .iter()
                .find(|file| file.contains(&item.registro))
                .cloned()
        })
        .collect();
    let not_found_files: Vec<Item> = items
        .into_iter()
        .filter(|item| !file_names.iter().any(|file| file.contains(&item.registro)))
        .collect();

    if let Err(_) =
        utils::copy_diaper_folder::execute(current_dir, contains_confort, contains_lippy)
    {
        return RegisterFilesResponse::WithMessage {
            message: format!("Falha ao copiar pasta de fraldas"),
        };
    };

    if let Err(err) = utils::copy_and_paste_file::execute(
        origin_reg_folder,
        queried_files_folder,
        names_of_requested_files,
    ) {
        return RegisterFilesResponse::WithMessage {
            message: format!("Falha ao copiar registros: {}", err),
        };
    };

    let _ = utils::write_log::execute(&not_found_files, &items_without_register);

    return RegisterFilesResponse::WithItems {
        not_found: not_found_files,
    };
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![greet, get_register_files])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
