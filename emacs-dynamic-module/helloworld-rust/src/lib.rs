// comment out following line to enable rust-analyzer to analyze it
// mod expanded;
use emacs::{defun, Env, Result, Value};

emacs::plugin_is_GPL_compatible!();

#[emacs::module(name = "greeting")]
fn init(_: &Env) -> Result<()> {
    Ok(())
}

#[defun]
fn say_hello(env: &Env, name: String) -> Result<Value<'_>> {
    env.message(&format!("Hello, {}!", name))
}
