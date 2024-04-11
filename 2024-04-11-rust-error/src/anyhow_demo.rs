use std::fmt;

use anyhow::Context;
use anyhow::Result;
use std::error::Error;

pub fn read_file() -> Result<String> {
    let body = std::fs::read_to_string("input.txt").context("read input.txt failed")?;

    Ok(body)
}

#[derive(Debug)]
struct MyError {
    message: String,
}

impl fmt::Display for MyError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "MyError({})", self.message)
    }
}

impl Error for MyError {
    fn source(&self) -> Option<&(dyn Error + 'static)> {
        None
    }
}

pub fn foo(i: i8) -> Result<()> {
    if i > 10 {
        // return Err(anyhow::anyhow!("Too large"));
        // 等价于
        anyhow::bail!("Too large");
    }

    Ok(())
}

pub fn bar(i: i8) -> Result<()> {
    foo(i).context("call foo")
}

pub fn foobar(i: i8) -> Result<()> {
    bar(i).context("call bar")
}

fn main() {
    if let Err(e) = foobar(100) {
        println!("{}", e);
        // anyhow::Error 没有实现 std Error，所以这里用了它的 source
        my_lib::print_error(e.source().unwrap());
    }

    if let Err(e) = read_file() {
        println!("{:?}", e);
    }
}
