use anyhow::Context;

fn read_config() -> Result<String, anyhow::Error> {
    let body = thiserror_lib::read_config().context("read conf")?;
    Ok(body)
}

fn main() {
    for id in [-1, 0, 1, 2] {
        if let Err(e) = thiserror_lib::login(id) {
            println!("Login failed, err:{:?}", e);
        }
    }

    if let Err(e) = read_config() {
        println!("Read config, err:{:?}", e);
    }

    if let Err(e) = thiserror_lib::read_config() {
        println!("Read config, err:{:?}", e);
    }
}
