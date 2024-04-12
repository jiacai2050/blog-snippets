use anyhow::Context;

fn read_config() -> Result<String, anyhow::Error> {
    let body = thiserror_lib::read_config().context("read conf")?;
    Ok(body)
}

fn main() {
    if let Err(e) = thiserror_lib::login(0) {
        println!("Login failed, err:{:?}", e);
    }

    if let Err(e) = read_config() {
        println!("Read config, err:{:?}", e);
    }

    if let Err(e) = thiserror_lib::read_config() {
        println!("Read config, err:{:?}", e);
    }
}
