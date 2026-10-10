# ClassNest run-from-clone server. Windows PowerShell 5.1+, no installs, no admin.
# Serves <repo>\offline first (index.html + assets), then <repo>\public
# (avatars, shop, celebrations - including local-only untracked media).
# Unknown paths without a file extension (deep links like /class/...) get
# offline\index.html. Listens on 127.0.0.1:8765 (falls back to 8766-8768).
$ErrorActionPreference = "Stop"
$repo = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$offline = Join-Path $repo "offline"
$public = Join-Path $repo "public"
if (-not (Test-Path -LiteralPath (Join-Path $offline "index.html"))) {
  Write-Host "Missing offline\index.html in $repo"
  Write-Host "Run 'git pull' again; the built app lives in the offline folder."
  exit 1
}

if (-not ("ClassNestRepoHost" -as [type])) {
Add-Type -TypeDefinition @'
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Net;
using System.Net.Sockets;
using System.Text;
using System.Threading;

public static class ClassNestRepoHost {
  static readonly Dictionary<string, string> Mime = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase) {
    {".html","text/html; charset=utf-8"}, {".htm","text/html; charset=utf-8"},
    {".js","text/javascript; charset=utf-8"}, {".mjs","text/javascript; charset=utf-8"},
    {".css","text/css; charset=utf-8"}, {".json","application/json"},
    {".txt","text/plain; charset=utf-8"}, {".svg","image/svg+xml"},
    {".jpg","image/jpeg"}, {".jpeg","image/jpeg"}, {".png","image/png"},
    {".webp","image/webp"}, {".gif","image/gif"}, {".ico","image/x-icon"},
    {".mp4","video/mp4"}, {".webm","video/webm"}, {".mp3","audio/mpeg"},
    {".wav","audio/wav"}, {".ogg","audio/ogg"}, {".wasm","application/wasm"},
    {".woff2","font/woff2"}, {".woff","font/woff"}
  };

  static string[] roots;

  public static void Run(string[] rootDirs, int[] ports, bool openBrowser) {
    roots = new string[rootDirs.Length];
    for (int i = 0; i < rootDirs.Length; i++) {
      string r = Path.GetFullPath(rootDirs[i]);
      if (!r.EndsWith(Path.DirectorySeparatorChar.ToString())) r += Path.DirectorySeparatorChar;
      roots[i] = r;
    }
    TcpListener listener = null;
    int port = 0;
    foreach (int p in ports) {
      try {
        TcpListener l = new TcpListener(IPAddress.Loopback, p);
        l.Start();
        listener = l;
        port = p;
        break;
      } catch (SocketException) {
        Console.WriteLine("Port " + p + " is busy, trying the next one...");
      }
    }
    if (listener == null) throw new Exception("Ports 8765-8768 are all busy. Close the other ClassNest window and try again.");
    string url = "http://127.0.0.1:" + port + "/";
    Console.WriteLine("ClassNest is open at " + url);
    Console.WriteLine("Leave this window open. Close it when class is done.");
    if (openBrowser) {
      try { Process.Start(new ProcessStartInfo(url) { UseShellExecute = true }); } catch {}
    }
    while (true) {
      TcpClient client = listener.AcceptTcpClient();
      ThreadPool.QueueUserWorkItem(state => Serve((TcpClient)state), client);
    }
  }

  static string Resolve(string rel) {
    foreach (string root in roots) {
      string full = Path.GetFullPath(Path.Combine(root, rel));
      if (!full.StartsWith(root, StringComparison.OrdinalIgnoreCase)) return null;
      if (File.Exists(full)) return full;
    }
    return "";
  }

  static void Serve(TcpClient client) {
    NetworkStream net = null;
    try {
      client.ReceiveTimeout = 15000;
      client.SendTimeout = 60000;
      net = client.GetStream();
      string header = ReadHeaders(net);
      if (string.IsNullOrEmpty(header)) return;
      string[] lines = header.Split(new[] { "\r\n" }, StringSplitOptions.None);
      string[] req = lines[0].Split(' ');
      if (req.Length < 2) return;
      string rawPath = req[1];
      int q = rawPath.IndexOfAny(new[] { '?', '#' });
      if (q >= 0) rawPath = rawPath.Substring(0, q);
      string rel = Uri.UnescapeDataString(rawPath).TrimStart('/').Replace('/', Path.DirectorySeparatorChar);
      if (string.IsNullOrEmpty(rel)) rel = "index.html";
      string full = Resolve(rel);
      if (full == null) {
        WriteStatus(net, "403 Forbidden", "text/plain", Encoding.UTF8.GetBytes("Forbidden"));
        return;
      }
      if (full == "" && Path.GetFileName(rel).IndexOf('.') < 0) full = Path.Combine(roots[0], "index.html");
      if (full == "" || !File.Exists(full)) {
        WriteStatus(net, "404 Not Found", "text/plain", Encoding.UTF8.GetBytes("Not found"));
        return;
      }
      string ext = Path.GetExtension(full);
      string mime = Mime.ContainsKey(ext) ? Mime[ext] : "application/octet-stream";
      SendFile(net, full, mime, FindHeader(lines, "Range"), req[0] == "HEAD");
    } catch {
    } finally {
      try { if (net != null) net.Close(); } catch {}
      try { client.Close(); } catch {}
    }
  }

  static string ReadHeaders(NetworkStream net) {
    MemoryStream ms = new MemoryStream();
    byte[] buf = new byte[1024];
    while (ms.Length < 65536) {
      int n = net.Read(buf, 0, buf.Length);
      if (n <= 0) break;
      ms.Write(buf, 0, n);
      byte[] soFar = ms.ToArray();
      for (int i = 0; i <= soFar.Length - 4; i++) {
        if (soFar[i] == 13 && soFar[i+1] == 10 && soFar[i+2] == 13 && soFar[i+3] == 10)
          return Encoding.ASCII.GetString(soFar, 0, i);
      }
    }
    return Encoding.ASCII.GetString(ms.ToArray());
  }

  static string FindHeader(string[] lines, string name) {
    foreach (string line in lines) {
      int c = line.IndexOf(':');
      if (c <= 0) continue;
      if (string.Equals(line.Substring(0, c).Trim(), name, StringComparison.OrdinalIgnoreCase))
        return line.Substring(c + 1).Trim();
    }
    return null;
  }

  static void SendFile(NetworkStream net, string full, string mime, string range, bool headOnly) {
    long length = new FileInfo(full).Length;
    long start = 0, count = length;
    string status = "200 OK";
    string extra = "";
    if (!string.IsNullOrEmpty(range) && range.StartsWith("bytes=", StringComparison.OrdinalIgnoreCase)) {
      string spec = range.Substring(6).Trim();
      int dash = spec.IndexOf('-');
      if (dash >= 0) {
        long end = length - 1;
        if (dash > 0) long.TryParse(spec.Substring(0, dash), out start);
        if (dash < spec.Length - 1) long.TryParse(spec.Substring(dash + 1), out end);
        if (end >= length) end = length - 1;
        if (start < 0) start = 0;
        if (start <= end) {
          count = end - start + 1;
          status = "206 Partial Content";
          extra = "Content-Range: bytes " + start + "-" + end + "/" + length + "\r\n";
        }
      }
    }
    string head = "HTTP/1.1 " + status + "\r\n" +
      "Content-Type: " + mime + "\r\n" +
      "Content-Length: " + count + "\r\n" + extra +
      "Accept-Ranges: bytes\r\nCache-Control: no-cache\r\nConnection: close\r\n\r\n";
    byte[] hb = Encoding.ASCII.GetBytes(head);
    net.Write(hb, 0, hb.Length);
    if (headOnly) return;
    using (FileStream fs = new FileStream(full, FileMode.Open, FileAccess.Read, FileShare.ReadWrite)) {
      fs.Seek(start, SeekOrigin.Begin);
      byte[] buf = new byte[65536];
      long left = count;
      while (left > 0) {
        int n = fs.Read(buf, 0, (int)Math.Min(buf.Length, left));
        if (n <= 0) break;
        net.Write(buf, 0, n);
        left -= n;
      }
    }
  }

  static void WriteStatus(NetworkStream net, string status, string mime, byte[] body) {
    string head = "HTTP/1.1 " + status + "\r\nContent-Type: " + mime +
      "\r\nContent-Length: " + body.Length + "\r\nConnection: close\r\n\r\n";
    byte[] hb = Encoding.ASCII.GetBytes(head);
    net.Write(hb, 0, hb.Length);
    net.Write(body, 0, body.Length);
  }
}
'@
}

$openBrowser = -not $env:CLASSNEST_NO_BROWSER
try {
  [ClassNestRepoHost]::Run([string[]]@($offline, $public), [int[]]@(8765, 8766, 8767, 8768), $openBrowser)
} catch {
  Write-Host ""
  Write-Host ("Could not start ClassNest: " + $_.Exception.Message)
  exit 1
}
