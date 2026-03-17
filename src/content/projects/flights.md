---
title: "ADS-B Live Flight Map"
description: "A self-hosted real-time ADS-B flight tracking system that runs on a Raspberry Pi, decodes aircraft broadcast signals, and streams live telemetry data to a browser-based interactive map via WebSocket."
startDate: 2026-03-14
status: "in-progress"
technologies: ["Raspberry Pi", "Software Defined Radio (SDR)", "ADS-B / Mode S", "Node.js (Express)", "Cloudflare Tunnel", "WebSocket", "Leaflet" ]
categories: ["Aviation"]
featured: false
draft: false
liveUrl: "https://flights.danglorioso.com"
githubUrl: "https://github.com/danglorioso/adsb-map"
favicon: "flights.ico"
priority: 6
---

# Project Overview                                                                                     
                                                                                          
A self-hosted, real-time flight tracking web application that intercepts ADS-B radio signals from    
aircraft overhead, processes the decoded telemetry data, and streams it live to an interactive web   
map — all running on personal infrastructure with no third-party data APIs.                          
                                                                                                    
---             
What ADS-B Is (for context)

- ADS-B (Automatic Dependent Surveillance–Broadcast) is a surveillance technology where aircraft
broadcast their GPS position, altitude, speed, heading, callsign, and squawk code over 1090 MHz radio
every ~0.5 seconds
- It's mandatory on most commercial aircraft in US/EU airspace
- The data is unencrypted and freely receivable with an SDR (Software Defined Radio) antenna
- This is the same data that powers FlightRadar24, FlightAware, etc. — this project taps into that
raw feed at the source

---
Architecture

[Aircraft broadcasting ADS-B on 1090 MHz]
            ↓ radio signal
[SDR Antenna + Raspberry Pi]
└─ dump1090-mutability decodes raw radio → aircraft.json
            ↓ filesystem read every 3s
[Node.js WebSocket Server] (running on Pi)
            ↓ persistent connection
[Cloudflare Tunnel] (zero-trust, no open ports)
            ↓ wss://
[Browser — Leaflet.js map] (hosted on Vercel)

Designed for multi-source aggregation — additional Pis at different locations each run the same stack
under their own subdomain. The frontend connects to multiple WebSocket endpoints simultaneously and
merges all feeds into one unified map.

---
Technical Stack

┌────────────────┬───────────────────────────┬───────────────────────────────────────────────────┐
│     Layer      │        Technology         │                        Why                        │
├────────────────┼───────────────────────────┼───────────────────────────────────────────────────┤
│ Signal         │ dump1090-mutability       │ Industry-standard ADS-B decoder, writes JSON to   │
│ decoding       │                           │ filesystem                                        │
├────────────────┼───────────────────────────┼───────────────────────────────────────────────────┤
│ Data server    │ Node.js, Express, ws      │ Lightweight, non-blocking I/O ideal for real-time │
│                │                           │  streaming                                        │
├────────────────┼───────────────────────────┼───────────────────────────────────────────────────┤
│ Tunnel         │ Cloudflare Tunnel         │ Exposes Pi to internet without port forwarding or │
│                │ (cloudflared)             │  static IP                                        │
├────────────────┼───────────────────────────┼───────────────────────────────────────────────────┤
│ Frontend       │ Leaflet.js, vanilla JS    │ Lightweight mapping library, no framework         │
│                │                           │ overhead needed                                   │
├────────────────┼───────────────────────────┼───────────────────────────────────────────────────┤
│ Frontend       │ Vercel                    │ Static hosting, CDN-distributed, free tier        │
│ hosting        │                           │                                                   │
├────────────────┼───────────────────────────┼───────────────────────────────────────────────────┤
│ Process        │ systemd                   │ Ensures both Node.js server and Cloudflare tunnel │
│ management     │                           │  auto-restart on crash or reboot                  │
└────────────────┴───────────────────────────┴───────────────────────────────────────────────────┘

---
How It Works — Technical Detail

Signal decoding:
- dump1090-mutability runs as a background process, reads raw I/Q samples from the SDR dongle, and
decodes Mode S transponder messages
- Outputs a live snapshot to /run/dump1090-mutability/aircraft.json approximately every second
- Each aircraft entry contains: ICAO hex address, lat/lon, altitude (barometric), ground speed, track
heading, vertical rate, squawk code, signal strength (RSSI), and callsign if broadcast

Data server:
- Node.js server reads aircraft.json directly from the filesystem every 3 seconds using
fs.readFileSync
- Filters out aircraft without a known position (no lat/lon) before broadcasting
- Maintains a WebSocket server (ws library) — on each read cycle, serializes the aircraft array and
broadcasts to all connected clients via ws.send()
- Sends a WebSocket ping every 25 seconds to keep connections alive through Cloudflare's proxy layer
- New browser connections immediately receive the latest known state on connect

Tunnel:
- Cloudflare Tunnel (cloudflared) runs as a systemd service, creating an outbound-only encrypted
connection from the Pi to Cloudflare's edge network
- No inbound ports opened on the router, no static IP required, no port forwarding
- Traffic routes: Browser → Cloudflare edge → encrypted tunnel → Pi's localhost:3000

Frontend:
- Connects to one WebSocket endpoint per Pi using the browser's native WebSocket API
- Uses a time-based stale removal strategy — aircraft unseen across all feeds for >30 seconds are
removed from the map. This is necessary with multiple feeds so one Pi's update doesn't erase aircraft
only visible to another Pi
- Aircraft markers use L.divIcon with CSS rotation applied to the ✈ glyph based on the track heading
field, so each plane points in its actual direction of travel
- Callsign labels render inline next to the icon when broadcast; falls back to the ICAO hex code
otherwise
- Click any marker for a popup showing altitude, speed, heading, squawk, and RSSI

---
Key Engineering Decisions Worth Highlighting

Why read from the filesystem instead of HTTP?
dump1090-mutability's built-in HTTP server wasn't accessible on FlightRadar24 OS (port 8080 was
occupied by FR24's own dashboard). Reading the JSON file directly is actually more efficient — no
HTTP overhead, no network stack, just a file read.

Why Cloudflare Tunnel instead of port forwarding?
Residential ISPs frequently block inbound connections, assign dynamic IPs, and use CGNAT which makes
port forwarding impossible. Cloudflare Tunnel solves all three — outbound-only connection, works
behind any NAT, provides a stable public HTTPS/WSS URL, and adds DDoS protection for free.

Why time-based stale removal vs. per-update removal?
With a single data source, removing planes not in the latest update is fine. With multiple Pi feeds
on one map, each update only contains planes visible to that antenna — a per-update removal would
cause planes visible to Pi 2 to flicker off every time Pi 1 sends an update. Time-based removal (30s
TTL) means a plane stays on the map as long as any antenna can see it.

Why vanilla JS and Leaflet over a framework?
The frontend is a single-purpose real-time display with no routing, forms, or state complexity beyond
the aircraft store. A framework would add bundle size and build complexity for no benefit.

---
Interesting Numbers

- ADS-B range: typically 100–250 nautical miles line-of-sight depending on antenna height
- Update latency: ~3 seconds from aircraft broadcast to map update
- Data volume: a typical aircraft.json snapshot is 2–15 KB depending on how many planes are in range
- Each Pi costs ~$80–100 in hardware (Pi 5 + SDR dongle + antenna)
- Ongoing infrastructure cost: ~$0 (Cloudflare Tunnel free, Vercel free tier)


