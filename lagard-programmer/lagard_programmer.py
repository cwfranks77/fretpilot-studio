#!/usr/bin/env python3
"""
La Gard 702/731 Series Programmer
Custom programming interface for La Gard electronic safe locks
Built for gun safe security management
"""

import serial
import serial.tools.list_ports
import time
import json
import os
import threading
from datetime import datetime, timedelta
from http.server import HTTPServer, SimpleHTTPRequestHandler
import webbrowser
import urllib.parse

# Configuration
DEFAULT_BAUD_RATES = [9600, 19200, 38400, 57600, 115200, 4800, 2400, 1200]
DEFAULT_BAUD = 9600
TIMEOUT = 2

class LaGardProgrammer:
    def __init__(self):
        self.serial_port = None
        self.connected = False
        self.port_name = None
        self.baud_rate = DEFAULT_BAUD
        self.users = {}
        self.settings = {
            'time_delay': 0,
            'wrong_try_penalty': 5,
            'wrong_try_count': 4,
            'dual_control': False,
            'timelock_enabled': False,
            'timelock_schedule': [],
            'dst_enabled': False,
            'dst_rules': []
        }
        self.log = []
        self.load_config()
    
    def load_config(self):
        """Load saved configuration"""
        config_file = os.path.join(os.path.dirname(__file__), 'lagard_config.json')
        if os.path.exists(config_file):
            try:
                with open(config_file, 'r') as f:
                    data = json.load(f)
                    self.users = data.get('users', {})
                    self.settings = {**self.settings, **data.get('settings', {})}
            except:
                pass
    
    def save_config(self):
        """Save configuration to file"""
        config_file = os.path.join(os.path.dirname(__file__), 'lagard_config.json')
        try:
            with open(config_file, 'w') as f:
                json.dump({
                    'users': self.users,
                    'settings': self.settings
                }, f, indent=2)
            return True
        except Exception as e:
            self.add_log(f"Error saving config: {e}")
            return False
    
    def add_log(self, message):
        """Add log entry"""
        timestamp = datetime.now().strftime("%H:%M:%S")
        entry = f"[{timestamp}] {message}"
        self.log.append(entry)
        print(entry)
        # Keep last 100 entries
        if len(self.log) > 100:
            self.log = self.log[-100:]
    
    def list_ports(self):
        """List available serial ports"""
        ports = []
        for port in serial.tools.list_ports.comports():
            ports.append({
                'device': port.device,
                'description': port.description,
                'hwid': port.hwid
            })
        return ports
    
    def connect(self, port, baud_rate=None):
        """Connect to La Gard device"""
        if baud_rate:
            self.baud_rate = baud_rate
        
        try:
            self.serial_port = serial.Serial(
                port=port,
                baudrate=self.baud_rate,
                bytesize=serial.EIGHTBITS,
                parity=serial.PARITY_NONE,
                stopbits=serial.STOPBITS_ONE,
                timeout=TIMEOUT
            )
            self.port_name = port
            self.connected = True
            self.add_log(f"Connected to {port} at {self.baud_rate} baud")
            return True
        except Exception as e:
            self.add_log(f"Connection error: {e}")
            return False
    
    def disconnect(self):
        """Disconnect from device"""
        if self.serial_port and self.serial_port.is_open:
            self.serial_port.close()
        self.connected = False
        self.add_log("Disconnected")
    
    def auto_detect_baud(self, port):
        """Try to auto-detect baud rate"""
        for baud in DEFAULT_BAUD_RATES:
            try:
                self.add_log(f"Trying {baud} baud...")
                test_serial = serial.Serial(port, baud, timeout=1)
                # Send a test command
                test_serial.write(b'\x00')
                time.sleep(0.1)
                if test_serial.in_waiting > 0:
                    test_serial.close()
                    self.add_log(f"Response at {baud} baud")
                    return baud
                test_serial.close()
            except:
                continue
        return DEFAULT_BAUD
    
    def send_command(self, command, wait_response=True):
        """Send command to La Gard device"""
        if not self.connected or not self.serial_port:
            self.add_log("Not connected")
            return None
        
        try:
            # Clear buffers
            self.serial_port.reset_input_buffer()
            self.serial_port.reset_output_buffer()
            
            # Send command
            if isinstance(command, str):
                command = command.encode('ascii')
            
            self.serial_port.write(command)
            self.add_log(f"TX: {command.hex() if isinstance(command, bytes) else command}")
            
            if wait_response:
                time.sleep(0.2)
                response = self.serial_port.read(self.serial_port.in_waiting or 64)
                if response:
                    self.add_log(f"RX: {response.hex()}")
                return response
            return True
        except Exception as e:
            self.add_log(f"Command error: {e}")
            return None
    
    def probe_device(self):
        """Probe device to detect communication protocol"""
        if not self.connected:
            return None
        
        self.add_log("Probing device...")
        
        # Try various probe commands
        probe_commands = [
            b'\x00',           # Null
            b'\x05',           # ENQ
            b'\x06',           # ACK
            b'\x15',           # NAK
            b'\x02',           # STX
            b'?',              # Query
            b'\r',             # CR
            b'\n',             # LF
            b'\r\n',           # CRLF
            b'AT\r\n',         # AT command
            b'\x02\x00\x00\x03',  # STX + data + ETX
        ]
        
        responses = []
        for cmd in probe_commands:
            response = self.send_command(cmd)
            if response:
                responses.append({
                    'command': cmd.hex(),
                    'response': response.hex() if response else None
                })
        
        return responses
    
    # ==================== USER MANAGEMENT ====================
    
    def add_user(self, user_id, code, name=""):
        """Add or update a user"""
        self.users[user_id] = {
            'code': code,
            'name': name,
            'created': datetime.now().isoformat(),
            'enabled': True
        }
        self.save_config()
        self.add_log(f"User {user_id} ({name}) added/updated")
        
        # Send to device if connected
        if self.connected:
            self._program_user(user_id, code)
        
        return True
    
    def delete_user(self, user_id):
        """Delete a user"""
        if user_id in self.users:
            del self.users[user_id]
            self.save_config()
            self.add_log(f"User {user_id} deleted")
            
            if self.connected:
                self._delete_user_from_device(user_id)
            return True
        return False
    
    def _program_user(self, user_id, code):
        """Send user programming command to device"""
        # La Gard protocol - this may need adjustment based on actual protocol
        # Common format: STX + CMD + USER_ID + CODE + CHECKSUM + ETX
        cmd = self._build_user_command(user_id, code)
        return self.send_command(cmd)
    
    def _delete_user_from_device(self, user_id):
        """Delete user from device"""
        cmd = self._build_delete_user_command(user_id)
        return self.send_command(cmd)
    
    def _build_user_command(self, user_id, code):
        """Build user programming command"""
        # This is a placeholder - actual protocol may vary
        # Common La Gard format uses ASCII or binary protocol
        user_bytes = user_id.encode() if isinstance(user_id, str) else bytes([int(user_id)])
        code_bytes = code.encode() if isinstance(code, str) else bytes([int(c) for c in str(code)])
        
        # Try ASCII protocol first
        cmd = f"\x02ADD{user_id:02d}{code}\x03"
        return cmd.encode()
    
    def _build_delete_user_command(self, user_id):
        """Build delete user command"""
        cmd = f"\x02DEL{user_id:02d}\x03"
        return cmd.encode()
    
    # ==================== SETTINGS ====================
    
    def set_time_delay(self, minutes):
        """Set time delay before opening"""
        self.settings['time_delay'] = minutes
        self.save_config()
        self.add_log(f"Time delay set to {minutes} minutes")
        
        if self.connected:
            cmd = f"\x02TDL{minutes:02d}\x03".encode()
            return self.send_command(cmd)
        return True
    
    def set_wrong_try_penalty(self, minutes, count=4):
        """Set wrong try penalty settings"""
        self.settings['wrong_try_penalty'] = minutes
        self.settings['wrong_try_count'] = count
        self.save_config()
        self.add_log(f"Wrong try penalty: {minutes}min after {count} attempts")
        
        if self.connected:
            cmd = f"\x02WTP{minutes:02d}{count:02d}\x03".encode()
            return self.send_command(cmd)
        return True
    
    def set_dual_control(self, enabled):
        """Enable/disable dual control (requires 2 users to open)"""
        self.settings['dual_control'] = enabled
        self.save_config()
        self.add_log(f"Dual control {'enabled' if enabled else 'disabled'}")
        
        if self.connected:
            cmd = f"\x02DCL{'1' if enabled else '0'}\x03".encode()
            return self.send_command(cmd)
        return True
    
    # ==================== TIMELOCK ====================
    
    def set_timelock(self, schedule):
        """
        Set timelock schedule
        schedule: list of {day: 0-6, open_time: "HH:MM", close_time: "HH:MM"}
        """
        self.settings['timelock_enabled'] = True
        self.settings['timelock_schedule'] = schedule
        self.save_config()
        self.add_log(f"Timelock schedule set with {len(schedule)} entries")
        
        if self.connected:
            for entry in schedule:
                cmd = self._build_timelock_command(entry)
                self.send_command(cmd)
        return True
    
    def disable_timelock(self):
        """Disable timelock"""
        self.settings['timelock_enabled'] = False
        self.save_config()
        self.add_log("Timelock disabled")
        
        if self.connected:
            cmd = b"\x02TLK0\x03"
            return self.send_command(cmd)
        return True
    
    def _build_timelock_command(self, entry):
        """Build timelock programming command"""
        day = entry.get('day', 0)
        open_time = entry.get('open_time', '00:00').replace(':', '')
        close_time = entry.get('close_time', '23:59').replace(':', '')
        cmd = f"\x02TLK{day}{open_time}{close_time}\x03"
        return cmd.encode()
    
    # ==================== DST ====================
    
    def set_dst(self, rules):
        """
        Set DST rules
        rules: list of {start_month, start_week, end_month, end_week, offset_minutes}
        """
        self.settings['dst_enabled'] = True
        self.settings['dst_rules'] = rules
        self.save_config()
        self.add_log(f"DST rules set")
        
        if self.connected:
            for rule in rules:
                cmd = self._build_dst_command(rule)
                self.send_command(cmd)
        return True
    
    def disable_dst(self):
        """Disable DST"""
        self.settings['dst_enabled'] = False
        self.save_config()
        self.add_log("DST disabled")
        
        if self.connected:
            cmd = b"\x02DST0\x03"
            return self.send_command(cmd)
        return True
    
    def _build_dst_command(self, rule):
        """Build DST programming command"""
        sm = rule.get('start_month', 3)
        sw = rule.get('start_week', 2)
        em = rule.get('end_month', 11)
        ew = rule.get('end_week', 1)
        offset = rule.get('offset_minutes', 60)
        cmd = f"\x02DST1{sm:02d}{sw}{em:02d}{ew}{offset:03d}\x03"
        return cmd.encode()
    
    # ==================== STATUS ====================
    
    def get_status(self):
        """Get device status"""
        return {
            'connected': self.connected,
            'port': self.port_name,
            'baud': self.baud_rate,
            'users': self.users,
            'settings': self.settings,
            'log': self.log[-20:]  # Last 20 log entries
        }
    
    def read_device_info(self):
        """Read device information"""
        if not self.connected:
            return None
        
        cmd = b"\x02INF\x03"
        response = self.send_command(cmd)
        return response
    
    def sync_time(self):
        """Sync device time with computer"""
        if not self.connected:
            return False
        
        now = datetime.now()
        time_str = now.strftime("%Y%m%d%H%M%S")
        cmd = f"\x02TIM{time_str}\x03".encode()
        response = self.send_command(cmd)
        self.add_log(f"Time synced to {now}")
        return response is not None


# ==================== WEB SERVER ====================

programmer = LaGardProgrammer()

class ProgrammerHandler(SimpleHTTPRequestHandler):
    """HTTP handler for the web interface"""
    
    def do_GET(self):
        if self.path == '/':
            self.send_response(200)
            self.send_header('Content-type', 'text/html')
            self.end_headers()
            self.wfile.write(self.get_index_html().encode())
        elif self.path == '/api/status':
            self.send_json(programmer.get_status())
        elif self.path == '/api/ports':
            self.send_json(programmer.list_ports())
        elif self.path == '/api/probe':
            self.send_json(programmer.probe_device())
        else:
            super().do_GET()
    
    def do_POST(self):
        content_length = int(self.headers.get('Content-Length', 0))
        post_data = self.rfile.read(content_length).decode('utf-8')
        
        try:
            data = json.loads(post_data) if post_data else {}
        except:
            data = dict(urllib.parse.parse_qsl(post_data))
        
        response = {'success': False, 'message': 'Unknown action'}
        
        if self.path == '/api/connect':
            port = data.get('port')
            baud = int(data.get('baud', DEFAULT_BAUD))
            if programmer.connect(port, baud):
                response = {'success': True, 'message': f'Connected to {port}'}
            else:
                response = {'success': False, 'message': 'Connection failed'}
        
        elif self.path == '/api/disconnect':
            programmer.disconnect()
            response = {'success': True, 'message': 'Disconnected'}
        
        elif self.path == '/api/add_user':
            user_id = data.get('user_id')
            code = data.get('code')
            name = data.get('name', '')
            if user_id and code:
                programmer.add_user(user_id, code, name)
                response = {'success': True, 'message': f'User {user_id} added'}
            else:
                response = {'success': False, 'message': 'Missing user_id or code'}
        
        elif self.path == '/api/delete_user':
            user_id = data.get('user_id')
            if programmer.delete_user(user_id):
                response = {'success': True, 'message': f'User {user_id} deleted'}
            else:
                response = {'success': False, 'message': 'User not found'}
        
        elif self.path == '/api/set_master':
            code = data.get('code')
            if code:
                programmer.add_user('01', code, 'Master')
                response = {'success': True, 'message': 'Master code set'}
            else:
                response = {'success': False, 'message': 'Missing code'}
        
        elif self.path == '/api/time_delay':
            minutes = int(data.get('minutes', 0))
            programmer.set_time_delay(minutes)
            response = {'success': True, 'message': f'Time delay set to {minutes} min'}
        
        elif self.path == '/api/wrong_try':
            minutes = int(data.get('minutes', 5))
            count = int(data.get('count', 4))
            programmer.set_wrong_try_penalty(minutes, count)
            response = {'success': True, 'message': f'Wrong try penalty set'}
        
        elif self.path == '/api/dual_control':
            enabled = data.get('enabled', False)
            programmer.set_dual_control(enabled in [True, 'true', '1', 1])
            response = {'success': True, 'message': f'Dual control updated'}
        
        elif self.path == '/api/timelock':
            schedule = data.get('schedule', [])
            if schedule:
                programmer.set_timelock(schedule)
                response = {'success': True, 'message': 'Timelock set'}
            else:
                programmer.disable_timelock()
                response = {'success': True, 'message': 'Timelock disabled'}
        
        elif self.path == '/api/dst':
            rules = data.get('rules', [])
            if rules:
                programmer.set_dst(rules)
                response = {'success': True, 'message': 'DST rules set'}
            else:
                programmer.disable_dst()
                response = {'success': True, 'message': 'DST disabled'}
        
        elif self.path == '/api/sync_time':
            if programmer.sync_time():
                response = {'success': True, 'message': 'Time synced'}
            else:
                response = {'success': False, 'message': 'Sync failed - not connected'}
        
        elif self.path == '/api/send_raw':
            cmd = data.get('command', '')
            if cmd:
                # Convert hex string to bytes if needed
                try:
                    if cmd.startswith('0x') or all(c in '0123456789abcdefABCDEF ' for c in cmd):
                        cmd_bytes = bytes.fromhex(cmd.replace('0x', '').replace(' ', ''))
                    else:
                        cmd_bytes = cmd.encode()
                    result = programmer.send_command(cmd_bytes)
                    response = {
                        'success': True, 
                        'message': 'Command sent',
                        'response': result.hex() if result else None
                    }
                except Exception as e:
                    response = {'success': False, 'message': str(e)}
            else:
                response = {'success': False, 'message': 'No command provided'}
        
        self.send_json(response)
    
    def send_json(self, data):
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(json.dumps(data).encode())
    
    def get_index_html(self):
        return '''<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>La Gard 702 Programmer</title>
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
            font-family: 'Segoe UI', system-ui, sans-serif;
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
            min-height: 100vh;
            color: #e4e4e7;
            padding: 20px;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
        }
        h1 {
            text-align: center;
            font-size: 2.5rem;
            margin-bottom: 8px;
            background: linear-gradient(135deg, #06c167, #00d4ff);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        .subtitle {
            text-align: center;
            color: #8892a6;
            margin-bottom: 30px;
        }
        .grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
            gap: 20px;
        }
        .card {
            background: rgba(15, 15, 30, 0.8);
            border: 2px solid #2a2a4a;
            border-radius: 16px;
            padding: 24px;
            backdrop-filter: blur(10px);
        }
        .card h2 {
            font-size: 1.3rem;
            margin-bottom: 20px;
            color: #06c167;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .form-group {
            margin-bottom: 16px;
        }
        label {
            display: block;
            font-size: 0.85rem;
            color: #8892a6;
            margin-bottom: 6px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        input, select {
            width: 100%;
            padding: 12px 16px;
            background: #1a1a2e;
            border: 2px solid #2a2a4a;
            border-radius: 10px;
            color: #e4e4e7;
            font-size: 1rem;
            transition: all 0.2s;
        }
        input:focus, select:focus {
            border-color: #06c167;
            outline: none;
        }
        input::placeholder {
            color: #4a4a6a;
        }
        button {
            padding: 12px 24px;
            border: none;
            border-radius: 10px;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
        }
        .btn-primary {
            background: linear-gradient(135deg, #06c167, #05a557);
            color: #fff;
        }
        .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(6, 193, 103, 0.3);
        }
        .btn-secondary {
            background: #2a2a4a;
            color: #e4e4e7;
        }
        .btn-secondary:hover {
            background: #3a3a5a;
        }
        .btn-danger {
            background: linear-gradient(135deg, #ef4444, #dc2626);
            color: #fff;
        }
        .btn-full {
            width: 100%;
        }
        .status-badge {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 0.9rem;
            font-weight: 600;
        }
        .status-connected {
            background: rgba(6, 193, 103, 0.2);
            color: #06c167;
            border: 2px solid #06c167;
        }
        .status-disconnected {
            background: rgba(239, 68, 68, 0.2);
            color: #ef4444;
            border: 2px solid #ef4444;
        }
        .user-list {
            margin-top: 16px;
        }
        .user-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 12px;
            background: #1a1a2e;
            border-radius: 10px;
            margin-bottom: 8px;
        }
        .user-info {
            display: flex;
            flex-direction: column;
        }
        .user-id {
            font-weight: 700;
            color: #06c167;
        }
        .user-name {
            font-size: 0.85rem;
            color: #8892a6;
        }
        .log-container {
            background: #0a0a14;
            border-radius: 10px;
            padding: 16px;
            max-height: 300px;
            overflow-y: auto;
            font-family: 'Courier New', monospace;
            font-size: 0.85rem;
        }
        .log-entry {
            padding: 4px 0;
            border-bottom: 1px solid #1a1a2e;
            color: #8892a6;
        }
        .log-entry:last-child {
            border-bottom: none;
        }
        .row {
            display: flex;
            gap: 12px;
        }
        .row > * {
            flex: 1;
        }
        .timelock-entry {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr auto;
            gap: 10px;
            align-items: end;
            margin-bottom: 10px;
        }
        .schedule-list {
            margin-top: 16px;
        }
        .toast {
            position: fixed;
            bottom: 30px;
            right: 30px;
            background: linear-gradient(135deg, #1a1a2e, #2a2a4a);
            color: #fff;
            padding: 16px 24px;
            border-radius: 12px;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4);
            z-index: 1000;
            animation: slideIn 0.3s ease;
        }
        .toast.success {
            border-left: 4px solid #06c167;
        }
        .toast.error {
            border-left: 4px solid #ef4444;
        }
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        .tabs {
            display: flex;
            gap: 8px;
            margin-bottom: 20px;
            flex-wrap: wrap;
        }
        .tab {
            padding: 10px 20px;
            background: #1a1a2e;
            border: 2px solid #2a2a4a;
            border-radius: 10px;
            color: #8892a6;
            cursor: pointer;
            transition: all 0.2s;
        }
        .tab:hover {
            border-color: #06c167;
        }
        .tab.active {
            background: #06c167;
            border-color: #06c167;
            color: #000;
        }
        .tab-content {
            display: none;
        }
        .tab-content.active {
            display: block;
        }
        .input-row {
            display: flex;
            gap: 10px;
        }
        .input-row input {
            flex: 1;
        }
        .checkbox-group {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 12px;
            background: #1a1a2e;
            border-radius: 10px;
        }
        .checkbox-group input[type="checkbox"] {
            width: 20px;
            height: 20px;
        }
        .alert {
            padding: 16px;
            border-radius: 10px;
            margin-bottom: 16px;
        }
        .alert-info {
            background: rgba(0, 212, 255, 0.1);
            border: 2px solid #00d4ff;
            color: #00d4ff;
        }
        .alert-warning {
            background: rgba(255, 165, 0, 0.1);
            border: 2px solid #ffa500;
            color: #ffa500;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🔐 La Gard 702 Programmer</h1>
        <p class="subtitle">Gun Safe Lock Programming Interface</p>
        
        <!-- Connection Card -->
        <div class="card" style="margin-bottom: 20px;">
            <h2>📡 Connection</h2>
            <div class="row">
                <div class="form-group">
                    <label>Serial Port</label>
                    <select id="portSelect">
                        <option value="">Select Port...</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Baud Rate</label>
                    <select id="baudSelect">
                        <option value="9600">9600</option>
                        <option value="19200">19200</option>
                        <option value="38400">38400</option>
                        <option value="57600">57600</option>
                        <option value="115200">115200</option>
                        <option value="4800">4800</option>
                        <option value="2400">2400</option>
                    </select>
                </div>
                <div class="form-group" style="display: flex; align-items: flex-end; gap: 10px;">
                    <button class="btn-primary" onclick="connect()">Connect</button>
                    <button class="btn-secondary" onclick="disconnect()">Disconnect</button>
                    <button class="btn-secondary" onclick="refreshPorts()">🔄</button>
                </div>
            </div>
            <div style="margin-top: 16px;">
                <span id="connectionStatus" class="status-badge status-disconnected">
                    ⚫ Disconnected
                </span>
            </div>
        </div>
        
        <!-- Tabs -->
        <div class="tabs">
            <button class="tab active" onclick="showTab('users')">👥 Users</button>
            <button class="tab" onclick="showTab('security')">🛡️ Security</button>
            <button class="tab" onclick="showTab('timelock')">⏰ Timelock</button>
            <button class="tab" onclick="showTab('dst')">🌍 DST</button>
            <button class="tab" onclick="showTab('terminal')">💻 Terminal</button>
            <button class="tab" onclick="showTab('log')">📋 Log</button>
        </div>
        
        <!-- Users Tab -->
        <div id="tab-users" class="tab-content active">
            <div class="grid">
                <div class="card">
                    <h2>🔑 Master Code</h2>
                    <div class="alert alert-warning">
                        The master code controls all lock settings. Keep it secure!
                    </div>
                    <div class="form-group">
                        <label>New Master Code (6-8 digits)</label>
                        <input type="password" id="masterCode" placeholder="Enter new master code">
                    </div>
                    <div class="form-group">
                        <label>Confirm Master Code</label>
                        <input type="password" id="masterCodeConfirm" placeholder="Confirm master code">
                    </div>
                    <button class="btn-primary btn-full" onclick="setMasterCode()">Set Master Code</button>
                </div>
                
                <div class="card">
                    <h2>👤 Add User</h2>
                    <div class="form-group">
                        <label>User ID (01-09)</label>
                        <input type="text" id="newUserId" placeholder="02" maxlength="2">
                    </div>
                    <div class="form-group">
                        <label>User Name</label>
                        <input type="text" id="newUserName" placeholder="John Doe">
                    </div>
                    <div class="form-group">
                        <label>User Code (6-8 digits)</label>
                        <input type="password" id="newUserCode" placeholder="Enter code">
                    </div>
                    <button class="btn-primary btn-full" onclick="addUser()">Add User</button>
                </div>
            </div>
            
            <div class="card" style="margin-top: 20px;">
                <h2>👥 Current Users</h2>
                <div id="userList" class="user-list">
                    <p style="color: #8892a6;">No users configured</p>
                </div>
            </div>
        </div>
        
        <!-- Security Tab -->
        <div id="tab-security" class="tab-content">
            <div class="grid">
                <div class="card">
                    <h2>⏱️ Time Delay</h2>
                    <p style="color: #8892a6; margin-bottom: 16px;">
                        Add a delay before the lock opens after correct code entry.
                    </p>
                    <div class="form-group">
                        <label>Delay (minutes, 0 = disabled)</label>
                        <input type="number" id="timeDelay" min="0" max="99" value="0">
                    </div>
                    <button class="btn-primary btn-full" onclick="setTimeDelay()">Set Time Delay</button>
                </div>
                
                <div class="card">
                    <h2>🚫 Wrong Try Penalty</h2>
                    <p style="color: #8892a6; margin-bottom: 16px;">
                        Lock out after multiple failed attempts.
                    </p>
                    <div class="row">
                        <div class="form-group">
                            <label>Attempts</label>
                            <input type="number" id="wrongTryCount" min="1" max="9" value="4">
                        </div>
                        <div class="form-group">
                            <label>Lockout (min)</label>
                            <input type="number" id="wrongTryPenalty" min="1" max="99" value="5">
                        </div>
                    </div>
                    <button class="btn-primary btn-full" onclick="setWrongTry()">Set Penalty</button>
                </div>
                
                <div class="card">
                    <h2>👥 Dual Control</h2>
                    <p style="color: #8892a6; margin-bottom: 16px;">
                        Require two different users to open the lock.
                    </p>
                    <div class="checkbox-group">
                        <input type="checkbox" id="dualControl">
                        <label style="margin: 0;">Enable Dual Control</label>
                    </div>
                    <button class="btn-primary btn-full" style="margin-top: 16px;" onclick="setDualControl()">Update</button>
                </div>
                
                <div class="card">
                    <h2>🕐 Sync Time</h2>
                    <p style="color: #8892a6; margin-bottom: 16px;">
                        Sync the lock's internal clock with your computer.
                    </p>
                    <button class="btn-primary btn-full" onclick="syncTime()">Sync Now</button>
                </div>
            </div>
        </div>
        
        <!-- Timelock Tab -->
        <div id="tab-timelock" class="tab-content">
            <div class="card">
                <h2>⏰ Timelock Schedule</h2>
                <div class="alert alert-info">
                    Set time windows when the lock can be opened. Outside these times, valid codes will not work.
                </div>
                
                <div id="timelockEntries">
                    <div class="timelock-entry">
                        <div class="form-group">
                            <label>Day</label>
                            <select class="tl-day">
                                <option value="0">Sunday</option>
                                <option value="1">Monday</option>
                                <option value="2">Tuesday</option>
                                <option value="3">Wednesday</option>
                                <option value="4">Thursday</option>
                                <option value="5">Friday</option>
                                <option value="6">Saturday</option>
                                <option value="7">All Days</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Open Time</label>
                            <input type="time" class="tl-open" value="08:00">
                        </div>
                        <div class="form-group">
                            <label>Close Time</label>
                            <input type="time" class="tl-close" value="18:00">
                        </div>
                        <button class="btn-danger" onclick="this.parentElement.remove()">✕</button>
                    </div>
                </div>
                
                <div style="display: flex; gap: 10px; margin-top: 16px;">
                    <button class="btn-secondary" onclick="addTimelockEntry()">+ Add Entry</button>
                    <button class="btn-primary" onclick="saveTimelock()">Save Schedule</button>
                    <button class="btn-danger" onclick="disableTimelock()">Disable Timelock</button>
                </div>
            </div>
        </div>
        
        <!-- DST Tab -->
        <div id="tab-dst" class="tab-content">
            <div class="card">
                <h2>🌍 Daylight Saving Time</h2>
                <div class="alert alert-info">
                    Configure automatic DST adjustments for accurate timelock operation.
                </div>
                
                <div class="row" style="margin-bottom: 16px;">
                    <div class="form-group">
                        <label>DST Start Month</label>
                        <select id="dstStartMonth">
                            <option value="3">March</option>
                            <option value="4">April</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Start Week</label>
                        <select id="dstStartWeek">
                            <option value="1">1st</option>
                            <option value="2" selected>2nd</option>
                            <option value="3">3rd</option>
                            <option value="4">4th</option>
                        </select>
                    </div>
                </div>
                
                <div class="row" style="margin-bottom: 16px;">
                    <div class="form-group">
                        <label>DST End Month</label>
                        <select id="dstEndMonth">
                            <option value="10">October</option>
                            <option value="11" selected>November</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>End Week</label>
                        <select id="dstEndWeek">
                            <option value="1" selected>1st</option>
                            <option value="2">2nd</option>
                            <option value="3">3rd</option>
                            <option value="4">4th</option>
                        </select>
                    </div>
                </div>
                
                <div class="form-group">
                    <label>Offset (minutes)</label>
                    <input type="number" id="dstOffset" value="60" min="0" max="120">
                </div>
                
                <div style="display: flex; gap: 10px; margin-top: 16px;">
                    <button class="btn-primary" onclick="saveDST()">Save DST Rules</button>
                    <button class="btn-danger" onclick="disableDST()">Disable DST</button>
                </div>
            </div>
        </div>
        
        <!-- Terminal Tab -->
        <div id="tab-terminal" class="tab-content">
            <div class="card">
                <h2>💻 Raw Terminal</h2>
                <div class="alert alert-warning">
                    Send raw commands to the lock. Use hex format (e.g., "02 41 44 44 03") or ASCII.
                </div>
                <div class="input-row" style="margin-bottom: 16px;">
                    <input type="text" id="rawCommand" placeholder="Enter command (hex or ASCII)">
                    <button class="btn-primary" onclick="sendRaw()">Send</button>
                </div>
                <button class="btn-secondary" onclick="probeDevice()">🔍 Probe Device</button>
            </div>
        </div>
        
        <!-- Log Tab -->
        <div id="tab-log" class="tab-content">
            <div class="card">
                <h2>📋 Communication Log</h2>
                <div id="logContainer" class="log-container">
                    <div class="log-entry">Waiting for activity...</div>
                </div>
                <button class="btn-secondary" style="margin-top: 16px;" onclick="refreshStatus()">Refresh</button>
            </div>
        </div>
    </div>
    
    <div id="toast" class="toast" style="display: none;"></div>
    
    <script>
        // State
        let isConnected = false;
        
        // Initialize
        document.addEventListener('DOMContentLoaded', () => {
            refreshPorts();
            refreshStatus();
            setInterval(refreshStatus, 5000);
        });
        
        // Tab switching
        function showTab(tabId) {
            document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
            document.querySelector(`[onclick="showTab('${tabId}')"]`).classList.add('active');
            document.getElementById(`tab-${tabId}`).classList.add('active');
        }
        
        // API calls
        async function api(endpoint, data = null) {
            const options = {
                method: data ? 'POST' : 'GET',
                headers: { 'Content-Type': 'application/json' }
            };
            if (data) options.body = JSON.stringify(data);
            
            const response = await fetch(`/api/${endpoint}`, options);
            return response.json();
        }
        
        // Toast notification
        function showToast(message, type = 'success') {
            const toast = document.getElementById('toast');
            toast.textContent = message;
            toast.className = `toast ${type}`;
            toast.style.display = 'block';
            setTimeout(() => toast.style.display = 'none', 3000);
        }
        
        // Connection
        async function refreshPorts() {
            const ports = await api('ports');
            const select = document.getElementById('portSelect');
            select.innerHTML = '<option value="">Select Port...</option>';
            ports.forEach(p => {
                select.innerHTML += `<option value="${p.device}">${p.device} - ${p.description}</option>`;
            });
        }
        
        async function connect() {
            const port = document.getElementById('portSelect').value;
            const baud = document.getElementById('baudSelect').value;
            if (!port) {
                showToast('Please select a port', 'error');
                return;
            }
            const result = await api('connect', { port, baud });
            showToast(result.message, result.success ? 'success' : 'error');
            refreshStatus();
        }
        
        async function disconnect() {
            const result = await api('disconnect');
            showToast(result.message);
            refreshStatus();
        }
        
        // Status
        async function refreshStatus() {
            const status = await api('status');
            isConnected = status.connected;
            
            const badge = document.getElementById('connectionStatus');
            if (status.connected) {
                badge.className = 'status-badge status-connected';
                badge.innerHTML = `🟢 Connected to ${status.port}`;
            } else {
                badge.className = 'status-badge status-disconnected';
                badge.innerHTML = '⚫ Disconnected';
            }
            
            // Update user list
            const userList = document.getElementById('userList');
            const users = Object.entries(status.users || {});
            if (users.length > 0) {
                userList.innerHTML = users.map(([id, user]) => `
                    <div class="user-item">
                        <div class="user-info">
                            <span class="user-id">User ${id}</span>
                            <span class="user-name">${user.name || 'Unnamed'}</span>
                        </div>
                        <button class="btn-danger" onclick="deleteUser('${id}')">Delete</button>
                    </div>
                `).join('');
            } else {
                userList.innerHTML = '<p style="color: #8892a6;">No users configured</p>';
            }
            
            // Update log
            const logContainer = document.getElementById('logContainer');
            if (status.log && status.log.length > 0) {
                logContainer.innerHTML = status.log.map(l => `<div class="log-entry">${l}</div>`).join('');
                logContainer.scrollTop = logContainer.scrollHeight;
            }
            
            // Update settings
            if (status.settings) {
                document.getElementById('timeDelay').value = status.settings.time_delay || 0;
                document.getElementById('wrongTryCount').value = status.settings.wrong_try_count || 4;
                document.getElementById('wrongTryPenalty').value = status.settings.wrong_try_penalty || 5;
                document.getElementById('dualControl').checked = status.settings.dual_control || false;
            }
        }
        
        // User management
        async function setMasterCode() {
            const code = document.getElementById('masterCode').value;
            const confirm = document.getElementById('masterCodeConfirm').value;
            
            if (code !== confirm) {
                showToast('Codes do not match', 'error');
                return;
            }
            if (code.length < 6 || code.length > 8) {
                showToast('Code must be 6-8 digits', 'error');
                return;
            }
            
            const result = await api('set_master', { code });
            showToast(result.message, result.success ? 'success' : 'error');
            document.getElementById('masterCode').value = '';
            document.getElementById('masterCodeConfirm').value = '';
            refreshStatus();
        }
        
        async function addUser() {
            const user_id = document.getElementById('newUserId').value.padStart(2, '0');
            const name = document.getElementById('newUserName').value;
            const code = document.getElementById('newUserCode').value;
            
            if (!user_id || !code) {
                showToast('User ID and code are required', 'error');
                return;
            }
            
            const result = await api('add_user', { user_id, name, code });
            showToast(result.message, result.success ? 'success' : 'error');
            document.getElementById('newUserId').value = '';
            document.getElementById('newUserName').value = '';
            document.getElementById('newUserCode').value = '';
            refreshStatus();
        }
        
        async function deleteUser(user_id) {
            if (confirm(`Delete user ${user_id}?`)) {
                const result = await api('delete_user', { user_id });
                showToast(result.message, result.success ? 'success' : 'error');
                refreshStatus();
            }
        }
        
        // Security settings
        async function setTimeDelay() {
            const minutes = parseInt(document.getElementById('timeDelay').value) || 0;
            const result = await api('time_delay', { minutes });
            showToast(result.message, result.success ? 'success' : 'error');
        }
        
        async function setWrongTry() {
            const minutes = parseInt(document.getElementById('wrongTryPenalty').value) || 5;
            const count = parseInt(document.getElementById('wrongTryCount').value) || 4;
            const result = await api('wrong_try', { minutes, count });
            showToast(result.message, result.success ? 'success' : 'error');
        }
        
        async function setDualControl() {
            const enabled = document.getElementById('dualControl').checked;
            const result = await api('dual_control', { enabled });
            showToast(result.message, result.success ? 'success' : 'error');
        }
        
        async function syncTime() {
            const result = await api('sync_time');
            showToast(result.message, result.success ? 'success' : 'error');
        }
        
        // Timelock
        function addTimelockEntry() {
            const container = document.getElementById('timelockEntries');
            const entry = document.createElement('div');
            entry.className = 'timelock-entry';
            entry.innerHTML = `
                <div class="form-group">
                    <label>Day</label>
                    <select class="tl-day">
                        <option value="0">Sunday</option>
                        <option value="1">Monday</option>
                        <option value="2">Tuesday</option>
                        <option value="3">Wednesday</option>
                        <option value="4">Thursday</option>
                        <option value="5">Friday</option>
                        <option value="6">Saturday</option>
                        <option value="7">All Days</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Open Time</label>
                    <input type="time" class="tl-open" value="08:00">
                </div>
                <div class="form-group">
                    <label>Close Time</label>
                    <input type="time" class="tl-close" value="18:00">
                </div>
                <button class="btn-danger" onclick="this.parentElement.remove()">✕</button>
            `;
            container.appendChild(entry);
        }
        
        async function saveTimelock() {
            const entries = document.querySelectorAll('.timelock-entry');
            const schedule = Array.from(entries).map(e => ({
                day: parseInt(e.querySelector('.tl-day').value),
                open_time: e.querySelector('.tl-open').value,
                close_time: e.querySelector('.tl-close').value
            }));
            const result = await api('timelock', { schedule });
            showToast(result.message, result.success ? 'success' : 'error');
        }
        
        async function disableTimelock() {
            const result = await api('timelock', { schedule: [] });
            showToast(result.message, result.success ? 'success' : 'error');
        }
        
        // DST
        async function saveDST() {
            const rules = [{
                start_month: parseInt(document.getElementById('dstStartMonth').value),
                start_week: parseInt(document.getElementById('dstStartWeek').value),
                end_month: parseInt(document.getElementById('dstEndMonth').value),
                end_week: parseInt(document.getElementById('dstEndWeek').value),
                offset_minutes: parseInt(document.getElementById('dstOffset').value)
            }];
            const result = await api('dst', { rules });
            showToast(result.message, result.success ? 'success' : 'error');
        }
        
        async function disableDST() {
            const result = await api('dst', { rules: [] });
            showToast(result.message, result.success ? 'success' : 'error');
        }
        
        // Terminal
        async function sendRaw() {
            const command = document.getElementById('rawCommand').value;
            if (!command) {
                showToast('Enter a command', 'error');
                return;
            }
            const result = await api('send_raw', { command });
            showToast(result.message + (result.response ? ` | Response: ${result.response}` : ''), result.success ? 'success' : 'error');
            refreshStatus();
        }
        
        async function probeDevice() {
            const result = await api('probe');
            console.log('Probe results:', result);
            showToast('Probe complete - check log', 'success');
            refreshStatus();
        }
    </script>
</body>
</html>'''


def main():
    """Start the programmer"""
    port = 8702  # La Gard 702!
    
    # Change to the script directory
    os.chdir(os.path.dirname(os.path.abspath(__file__)) or '.')
    
    print("=" * 50)
    print("  La Gard 702/731 Programmer")
    print("  Gun Safe Lock Programming Interface")
    print("=" * 50)
    print(f"\nStarting server on http://localhost:{port}")
    print("Opening browser...")
    
    # Open browser
    webbrowser.open(f'http://localhost:{port}')
    
    # Start server
    server = HTTPServer(('localhost', port), ProgrammerHandler)
    print(f"\nServer running. Press Ctrl+C to stop.\n")
    
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nShutting down...")
        programmer.disconnect()
        server.shutdown()


if __name__ == '__main__':
    main()

