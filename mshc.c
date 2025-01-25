#define i32 int
#define loop for (;;)
#define let

__attribute__((import_module("wasi_snapshot_preview1"),
               import_name("fd_read"))) let i32
fd_read(i32 fd, i32 iovs, i32 iovs_len, i32 nread);

__attribute__((import_module("wasi_snapshot_preview1"),
               import_name("fd_write"))) let i32
fd_write(i32 fd, i32 iovs, i32 iovs_len, i32 nwritten);

let i32 iov[2];
let i32 nrw[1];
let i32 mem;
extern let i32 __heap_base;

let i32 fd_read_all(i32 fd, i32 contents[1], i32 contents_len[1])
{
    contents[0] = mem;
    contents_len[0] = 0;

    loop
    {
        iov[0] = mem;
        iov[1] = 512;
        let i32 err = fd_read(fd, iov, 1, nrw);
        if (err)
        {
            return err;
        }
        let i32 nread = nrw[0];
        if (nread <= 0)
        {
            break;
        }

        mem += nread;
        contents_len[0] += nread;
    }

    return 0;
}

let void _start()
{
    mem = __heap_base;

    let i32 contents[1];
    let i32 contents_len[1];
    fd_read_all(0, contents, contents_len);

    iov[0] = contents[0];
    iov[1] = contents_len[0];
    fd_write(1, iov, 1, nrw);
}
