import Gio from "gi://Gio";

/**
 * Execute a command asynchronously and return the output from `stdout` on
 * success or throw an error with output from `stderr` on failure.
 *
 * If given, @input will be passed to `stdin` and @cancellable can be used to
 * stop the process before it finishes.
 *
 * @param {string[]} argv - a list of string arguments
 * @param {string} [input] - Input to write to `stdin` or %null to ignore
 * @param {Gio.Cancellable} [cancellable] - optional cancellable object
 * @returns {Promise<string>} - The process output
 */
export async function execCommunicate(argv, input = null, cancellable = null) {
  let cancelId = 0;
  let flags = Gio.SubprocessFlags.STDOUT_PIPE | Gio.SubprocessFlags.STDERR_PIPE;

  if (input !== null) flags |= Gio.SubprocessFlags.STDIN_PIPE;

  const proc = Gio.Subprocess.new(argv, flags);
  proc.init(cancellable);

  if (cancellable instanceof Gio.Cancellable)
    cancelId = cancellable.connect(() => proc.force_exit());

  try {
    const result = await new Promise((resolve, reject) => {
      proc.communicate_utf8_async(null, null, (proc, res) => {
        try {
          const [ok, stdout, stderr] = proc.communicate_utf8_finish(res);
          const status = proc.get_exit_status();

          if (status !== 0) {
            reject(
              new Gio.IOErrorEnum({
                code: Gio.IOErrorEnum.FAILED,
                message: stderr
                  ? stderr.trim()
                  : `Command '${argv.join(
                      " "
                    )}' failed with exit code ${status}`,
              })
            );
          } else {
            resolve(stdout.trim());
          }
        } catch (error) {
          reject(error);
        }
      });
    });

    return result;
  } finally {
    if (cancelId > 0) cancellable.disconnect(cancelId);
  }
}
