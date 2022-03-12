// emacs 动态模块的头文件，一般在 Emacs 安装目录内可找到
#include <emacs-module.h>
#include <string.h>
// 声明该模块是 GPL 兼容的
int plugin_is_GPL_compatible;

void define_elisp_function(emacs_env *env);

// 模块的入口函数，相当于普通 C 程序的 main
int emacs_module_init (struct emacs_runtime *ert)
{
  emacs_env *env = ert->get_environment(ert);

  // Elisp 方法调用
  emacs_value message = env->intern(env, "message");
  char *msg = "hello world";
  emacs_value args[] = { env->make_string(env, msg, strlen(msg)) };
  env->funcall(env, message, 1, args);

  // 将 C 函数导出到 Elisp 中
  define_elisp_function(env);
  return 0;
}

emacs_value c_add(emacs_env *env, ptrdiff_t nargs, emacs_value *args, void *data) {
  intmax_t ret = 0;
  for(int i=0;i<nargs;i++) {
    ret += env->extract_integer(env, args[i]);
  }
  return env->make_integer(env, ret);
}

void define_elisp_function(emacs_env *env) {
  emacs_value func = env->make_function (env, 1, emacs_variadic_function, // 任意多个参数，类似 &rest
                                         c_add, "C-based adder", NULL);
  emacs_value symbol = env->intern (env, "c-add");
  emacs_value args[] = {symbol, func};
  env->funcall (env, env->intern (env, "defalias"), 2, args);
}
