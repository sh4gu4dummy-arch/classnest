# ClassNest local server — PowerShell only. No Python. No admin.
$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location -LiteralPath $root
Get-ChildItem -LiteralPath $root -Recurse -File -ErrorAction SilentlyContinue |
  Unblock-File -ErrorAction SilentlyContinue

if (-not ("ClassNestHost" -as [type])) {
Add-Type -TypeDefinition @"
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Net;
using System.Net.Sockets;
using System.Text;
using System.Threading;

public static class ClassNestHost {
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

  public static void Run(string root, int port) {
    TcpListener listener = new TcpListener(IPAddress.Loopback, port);
    listener.Start();
    string url = "http://127.0.0.1:" + port + "/";
    Console.WriteLine("ClassNest is open at " + url);
    Console.WriteLine("Leave this window open. Close it when class is done.");
    Console.WriteLine("Nothing else to install.");
    try {
      Process.Start(new ProcessStartInfo(url) { UseShellExecute = true });
    } catch {}
    while (true) {
      TcpClient client = listener.AcceptTcpClient();
      ThreadPool.QueueUserWorkItem(state => Serve((TcpClient)state, root), client);
    }
  }

  static void Serve(TcpClient client, string root) {
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
      int q = rawPath.IndexOf('?');
      if (q >= 0) rawPath = rawPath.Substring(0, q);
      string rel = Uri.UnescapeDataString(rawPath.TrimStart('/').Replace('/', Path.DirectorySeparatorChar));
      if (string.IsNullOrEmpty(rel)) rel = "index.html";
      string full = Path.GetFullPath(Path.Combine(root, rel));
      string rootFull = Path.GetFullPath(root);
      if (!rootFull.EndsWith(Path.DirectorySeparatorChar.ToString()))
        rootFull += Path.DirectorySeparatorChar;
      if (!full.StartsWith(rootFull, StringComparison.OrdinalIgnoreCase)) {
        WriteStatus(net, "403 Forbidden", "text/plain", Encoding.UTF8.GetBytes("Forbidden"));
        return;
      }
      if (!File.Exists(full)) {
        string name = Path.GetFileName(rel);
        if (name.IndexOf('.') < 0) full = Path.Combine(root, "index.html");
      }
      if (!File.Exists(full)) {
        WriteStatus(net, "404 Not Found", "text/plain", Encoding.UTF8.GetBytes("Not found"));
        return;
      }
      string ext = Path.GetExtension(full);
      string mime = Mime.ContainsKey(ext) ? Mime[ext] : "application/octet-stream";
      string range = FindHeader(lines, "Range");
      SendFile(net, full, mime, range);
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
      if (soFar.Length >= 4) {
        for (int i = 0; i <= soFar.Length - 4; i++) {
          if (soFar[i] == 13 && soFar[i+1] == 10 && soFar[i+2] == 13 && soFar[i+3] == 10)
            return Encoding.ASCII.GetString(soFar, 0, i);
        }
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

  static void SendFile(NetworkStream net, string full, string mime, string range) {
    FileInfo info = new FileInfo(full);
    long length = info.Length;
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
      "Content-Length: " + count + "\r\n" +
      extra +
      "Accept-Ranges: bytes\r\n" +
      "Cache-Control: no-cache\r\n" +
      "Connection: close\r\n\r\n";
    byte[] hb = Encoding.ASCII.GetBytes(head);
    net.Write(hb, 0, hb.Length);
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
"@
}

function Test-FreePort([int]$port) {
  try {
    $t = New-Object System.Net.Sockets.TcpListener([Net.IPAddress]::Loopback, $port)
    $t.Start()
    $t.Stop()
    return $true
  } catch {
    return $false
  }
}

$port = 8765
$ok = $false
foreach ($try in 8765, 8766, 8767, 8768) {
  if (Test-FreePort $try) {
    $port = $try
    $ok = $true
    break
  }
}
if (-not $ok) {
  Write-Host "Could not open a local port."
  exit 1
}

[ClassNestHost]::Run($root, $port)
