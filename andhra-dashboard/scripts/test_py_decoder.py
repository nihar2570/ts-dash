import re
import urllib.parse

CHARS = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ+/"

def _0xe18c(d, e, f):
    h = CHARS[:e]
    i = CHARS[:f]
    # d reversed, reduce with sum of h.index(b) * (e ** c)
    j = 0
    for c, b in enumerate(reversed(d)):
        if b in h:
            j += h.index(b) * (e ** c)
    k = ""
    while j > 0:
        k = i[j % f] + k
        j = j // f
    return k or "0"

def decode_myneta(h, u, n, t, e, r=None):
    res = ""
    i = 0
    length = len(h)
    delimiter = n[e]
    while i < length:
        s = ""
        while i < length and h[i] != delimiter:
            s += h[i]
            i += 1
        i += 1 # skip delimiter
        if s:
            for j in range(len(n)):
                s = s.replace(n[j], str(j))
            code = int(_0xe18c(s, e, 10)) - t
            res += chr(code)
    # decodeURIComponent(escape(res)) is equivalent to decoding latin1 as utf-8 if needed, or simply res
    try:
        res = urllib.parse.unquote(res)
    except Exception:
        pass
    return res

# Test with the Kuppam encoded string:
encoded = 'QoCJbQiJQoEJbQjJbijJQojJbioJbQCJQioJbbiJbQAJbibJbQCJQojJQiQJQiiJoQJQbCJbQCJbQAJQboJoQJQbCJbQCJQoCJQboJoQJQbbJoQJQbCJQQiJbQCJQoCJQboJoQJQbCJbQCJQoCJQboJQbCJQobJoQJbiQJbQAJQojJQooJQbjJQoEJQobJbioJQoCJbibJQoCJQobJbQCJQojJQioJbQQJbiQJbQQJQAiJQoEJQobJbioJQoCJbibJQoCJQobJbQCJQojJQoiJbibJQoCJQbjJQQEJQQEJQQAJQboJQEEJQioJQCAJQioJQEAJQioJoQJQAAJbiQJQobJbQAJQobJbQCJbiQJQbCJQQiJQobJQboJQbCJQoAJQboJQbCJQQiJbQCJQoCJQboJoQJQbCJbQCJQoCJQboJQjbJQCEJQCAJQAEJQCQJQbCJQQiJbQCJQoCJQboJoQJQbCJbQCJQoCJoQJQobJbiCJbibJbiiJbioJQbjJQoEJQojJbioJbQCJQojJbQAJoQJbQEJbQCJbbbJbiCJQojJQbjJQjCJQiiJQjCJQiiJQboJQbCJbQEJbQQJQobJbioJoQJQoEJbiCJQobJbQEJbQEJQbjJQjCJQiiJbbiJQQEJQijJQoAJQobJQoCJbiiJQojJoQJbbiJQQEJQijJbQQJQobJQoCJQoCJbibJbioJbiiJoQJbbiJQQEJQijJbQAJQojJQoCJQjCJQiiJQboJQbCJQoAJQboJoQJQQbJoQJQbCJQQiJQoAJQboJQbCJQQiJbQEJbQQJQobJbioJQboJQbCJQQiJbQCJQoCJQboJoQJQbCJbQCJQoCJQboJQEiJbQAJQobJQoCJbQjJQobJbQCJQojJoQJQCQJbQAJbQiJQooJQojJbQEJbQEJbibJbQiJbioJQobJbiCJQbCJQQiJbQCJQoCJQboJQbCJbQCJQoCJQboJQQEJQQjJQbCJQQiJbQCJQoCJQboJoQJQbCJbQCJQoCJoQJQobJbiCJbibJbiiJbioJQbjJbQAJbibJbiiJbiQJbQCJQboJQbCJbibJbijJbiiJoQJbQEJbQAJQoEJQbjJbiQJbQCJbQCJbQQJbQEJQbAJQQiJQQiJbijJbbbJbioJQojJbQCJQobJQioJbibJbioJQooJbQiJQQiJbibJbijJQobJbiiJQojJQoiJbQoJQQAJQioJbQQJbiQJbQQJQAiJbijJbbbJbioJQojJbQCJQobJQoiJQooJbQiJbiCJQoCJQojJbQAJQbjJQAbJbioJQoCJbiQJbQAJQobJQCQJbQAJQobJQoCJQojJbQEJbiQJQQAJQQQJQQAJQQCJooJQoEJQobJbioJQoCJbibJQoCJQobJbQCJQojJQoiJbibJQoCJQbjJQQEJQQEJQQAJooJQoEJbQiJbiCJQbjJbQCJQobJQboJQbCJQQiJbQCJQoCJQboJoQJQbCJbQCJQoCJoQJQobJbiCJbibJbiiJbioJQbjJbQAJbibJbiiJbiQJbQCJQboJQbCJbibJbijJbiiJoQJbQEJbQAJQoEJQbjJbiQJbQCJbQCJbQQJbQEJQbAJQQiJQQiJbijJbbbJbioJQojJbQCJQobJQioJbibJbioJQooJbQiJQQiJbibJbijJQobJbiiJQojJQoiJbQoJQQAJQioJbQQJbiQJbQQJQAiJbijJbbbJbioJQojJbQCJQobJQoiJQooJbQiJbiCJQoCJQojJbQAJQbjJQAbJbioJQoCJbiQJbQAJQobJQCQJbQAJQobJQoCJQojJbQEJbiQJQQAJQQQJQQAJQQCJooJQoEJQobJbioJQoCJbibJQoCJQobJbQCJQojJQoiJbibJQoCJQbjJQQEJQQEJQQAJooJQoEJbQiJbiCJQbjJbiCJbibJQobJQboJQbCJQQiJbQCJQoCJQboJoQJQbCJQQiJbQCJbQAJQboJoQJQiiJQibJQbEJ'
out = decode_myneta(encoded, 8, 'iQbAECjoJ', 25, 8, 32)
print("Decoded in Python:")
print(out)

