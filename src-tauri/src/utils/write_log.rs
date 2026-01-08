use crate::Item;

use std::fs;

pub fn execute(
    items_not_found: &Vec<Item>,
    items_without_register: &Vec<Item>,
) -> Result<(), Box<dyn std::error::Error>> {
    let mut message = String::from("Registros de busca manual:\n\n");

    for item in items_without_register {
        message = format!(
            "{} {} - {} - {}\n\n",
            message, item.item, item.produto, item.registro
        );
    }

    message = format!("{}\n\n\nRegistros não encontrados:\n\n", message);

    for item in items_not_found {
        message = format!(
            "{} {} - {} - {}\n\n",
            message, item.item, item.produto, item.registro
        );
    }

    fs::write("log.txt", message)?;
    Ok(())
}
