// Multiplayer Service - WebRTC Audio Streaming & Session Management
import { API_BASE } from './config'

class MultiplayerService {
  constructor() {
    this.ws = null
    this.peerConnections = new Map()
    this.localStream = null
    this.isConnected = false
    this.currentSession = null
    this.sessionCallbacks = new Map()
    this.audioContext = null
    this.audioNodes = new Map()
    
    // ICE servers for WebRTC (STUN/TURN)
    this.iceServers = [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
      { urls: 'stun:stun2.l.google.com:19302' }
    ]
  }

  // Connect to multiplayer server
  async connect() {
    return new Promise((resolve, reject) => {
      try {
        // In production, use wss://your-server.com/multiplayer
        const wsUrl = API_BASE.replace('http', 'ws') + '/multiplayer'
        
        // Demo mode - simulate connection
        setTimeout(() => {
          this.isConnected = true
          this.simulateConnection()
          resolve({ connected: true, demo: true })
        }, 1000)
        
        // Production WebSocket connection (commented out for demo)
        /*
        this.ws = new WebSocket(wsUrl)
        
        this.ws.onopen = () => {
          this.isConnected = true
          resolve({ connected: true })
        }
        
        this.ws.onmessage = (event) => {
          this.handleMessage(JSON.parse(event.data))
        }
        
        this.ws.onerror = (error) => {
          reject(error)
        }
        
        this.ws.onclose = () => {
          this.isConnected = false
          this.cleanup()
        }
        */
      } catch (error) {
        reject(error)
      }
    })
  }

  // Initialize audio context and processing
  async initAudio() {
    try {
      // Request microphone/audio input permission
      this.localStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 48000
        },
        video: false
      })

      // Create Web Audio API context for processing
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)()
      
      // Create audio processing nodes
      const source = this.audioContext.createMediaStreamSource(this.localStream)
      const compressor = this.audioContext.createDynamicsCompressor()
      const gain = this.audioContext.createGain()
      
      // Configure compressor for music
      compressor.threshold.value = -24
      compressor.knee.value = 30
      compressor.ratio.value = 12
      compressor.attack.value = 0.003
      compressor.release.value = 0.25
      
      // Connect audio graph
      source.connect(compressor)
      compressor.connect(gain)
      
      this.audioNodes.set('source', source)
      this.audioNodes.set('compressor', compressor)
      this.audioNodes.set('gain', gain)
      
      return { success: true, stream: this.localStream }
    } catch (error) {
      console.error('Audio init failed:', error)
      return { success: false, error: error.message }
    }
  }

  // Create or join a session
  async joinSession(sessionId, userInfo) {
    if (!this.isConnected) {
      throw new Error('Not connected to server')
    }

    // Initialize audio if not already done
    if (!this.localStream) {
      await this.initAudio()
    }

    // In production, send join request via WebSocket
    this.currentSession = {
      id: sessionId,
      userInfo,
      peers: new Map(),
      startTime: Date.now()
    }

    // Demo mode - simulate joining
    setTimeout(() => {
      this.triggerCallback('sessionJoined', {
        sessionId,
        peers: [],
        settings: { key: 'C', bpm: 120 }
      })
    }, 500)

    return { joined: true, sessionId }
  }

  // Create peer connection for a new user
  async createPeerConnection(userId, isInitiator = false) {
    const pc = new RTCPeerConnection({ iceServers: this.iceServers })
    
    // Add local audio tracks
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => {
        pc.addTrack(track, this.localStream)
      })
    }

    // Handle incoming tracks
    pc.ontrack = (event) => {
      const [remoteStream] = event.streams
      this.handleRemoteStream(userId, remoteStream)
    }

    // Handle ICE candidates
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        this.sendMessage({
          type: 'ice-candidate',
          candidate: event.candidate,
          to: userId
        })
      }
    }

    // Handle connection state changes
    pc.onconnectionstatechange = () => {
      console.log(`Connection state with ${userId}:`, pc.connectionState)
      if (pc.connectionState === 'disconnected' || pc.connectionState === 'failed') {
        this.removePeer(userId)
      }
    }

    this.peerConnections.set(userId, pc)

    // Initiate offer if we're the initiator
    if (isInitiator) {
      const offer = await pc.createOffer()
      await pc.setLocalDescription(offer)
      this.sendMessage({
        type: 'offer',
        offer: offer,
        to: userId
      })
    }

    return pc
  }

  // Handle remote audio stream
  handleRemoteStream(userId, stream) {
    // Create audio element for remote peer
    const audio = new Audio()
    audio.srcObject = stream
    audio.autoplay = true
    
    // Apply audio processing
    if (this.audioContext) {
      const source = this.audioContext.createMediaStreamSource(stream)
      const gainNode = this.audioContext.createGain()
      
      source.connect(gainNode)
      gainNode.connect(this.audioContext.destination)
      
      this.audioNodes.set(`peer-${userId}`, { source, gain: gainNode })
    }

    this.triggerCallback('peerAudioReceived', { userId, stream, audio })
  }

  // Send message to server or peer
  sendMessage(message) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message))
    }
  }

  // Handle incoming messages
  async handleMessage(message) {
    switch (message.type) {
      case 'offer':
        await this.handleOffer(message)
        break
      case 'answer':
        await this.handleAnswer(message)
        break
      case 'ice-candidate':
        await this.handleIceCandidate(message)
        break
      case 'peer-joined':
        await this.createPeerConnection(message.userId, true)
        break
      case 'peer-left':
        this.removePeer(message.userId)
        break
      case 'session-update':
        this.triggerCallback('sessionUpdate', message.data)
        break
      case 'chat':
        this.triggerCallback('chatMessage', message)
        break
    }
  }

  async handleOffer(message) {
    const pc = await this.createPeerConnection(message.from, false)
    await pc.setRemoteDescription(new RTCSessionDescription(message.offer))
    const answer = await pc.createAnswer()
    await pc.setLocalDescription(answer)
    
    this.sendMessage({
      type: 'answer',
      answer: answer,
      to: message.from
    })
  }

  async handleAnswer(message) {
    const pc = this.peerConnections.get(message.from)
    if (pc) {
      await pc.setRemoteDescription(new RTCSessionDescription(message.answer))
    }
  }

  async handleIceCandidate(message) {
    const pc = this.peerConnections.get(message.from)
    if (pc) {
      await pc.addIceCandidate(new RTCIceCandidate(message.candidate))
    }
  }

  removePeer(userId) {
    const pc = this.peerConnections.get(userId)
    if (pc) {
      pc.close()
      this.peerConnections.delete(userId)
    }
    
    const nodes = this.audioNodes.get(`peer-${userId}`)
    if (nodes) {
      nodes.source.disconnect()
      nodes.gain.disconnect()
      this.audioNodes.delete(`peer-${userId}`)
    }
    
    this.triggerCallback('peerLeft', { userId })
  }

  // Audio effects and processing
  setVolume(userId, volume) {
    const key = userId === 'local' ? 'gain' : `peer-${userId}`
    const nodes = this.audioNodes.get(key)
    if (nodes && nodes.gain) {
      nodes.gain.gain.value = volume
    }
  }

  toggleMute(userId) {
    const currentVolume = this.getVolume(userId)
    this.setVolume(userId, currentVolume > 0 ? 0 : 1)
    return currentVolume > 0 ? 0 : 1
  }

  getVolume(userId) {
    const key = userId === 'local' ? 'gain' : `peer-${userId}`
    const nodes = this.audioNodes.get(key)
    return nodes && nodes.gain ? nodes.gain.gain.value : 1
  }

  // Add audio effects
  addReverb(userId, intensity = 0.5) {
    if (!this.audioContext) return
    
    const key = userId === 'local' ? 'gain' : `peer-${userId}`
    const nodes = this.audioNodes.get(key)
    if (!nodes) return

    // Create convolver for reverb
    const convolver = this.audioContext.createConvolver()
    const reverbGain = this.audioContext.createGain()
    reverbGain.gain.value = intensity

    // Generate impulse response
    this.generateReverbImpulse(convolver)

    // Reconnect audio graph with reverb
    const source = nodes.source || nodes.gain
    source.disconnect()
    source.connect(convolver)
    convolver.connect(reverbGain)
    reverbGain.connect(this.audioContext.destination)
    source.connect(this.audioContext.destination) // Dry signal

    nodes.reverb = { convolver, gain: reverbGain }
  }

  generateReverbImpulse(convolver) {
    const rate = this.audioContext.sampleRate
    const length = rate * 2 // 2 seconds
    const impulse = this.audioContext.createBuffer(2, length, rate)
    
    for (let channel = 0; channel < 2; channel++) {
      const channelData = impulse.getChannelData(channel)
      for (let i = 0; i < length; i++) {
        channelData[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, 2)
      }
    }
    
    convolver.buffer = impulse
  }

  // Metronome with sync
  startMetronome(bpm, timeSignature = '4/4') {
    if (!this.audioContext) return

    const clickFrequency = 1000
    const interval = 60 / bpm

    this.metronomeInterval = setInterval(() => {
      const osc = this.audioContext.createOscillator()
      const gain = this.audioContext.createGain()
      
      osc.frequency.value = clickFrequency
      gain.gain.value = 0.3
      
      osc.connect(gain)
      gain.connect(this.audioContext.destination)
      
      osc.start()
      gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1)
      osc.stop(this.audioContext.currentTime + 0.1)
      
      // Broadcast click for sync
      this.broadcastMetronomeClick()
    }, interval * 1000)
  }

  stopMetronome() {
    if (this.metronomeInterval) {
      clearInterval(this.metronomeInterval)
      this.metronomeInterval = null
    }
  }

  broadcastMetronomeClick() {
    this.sendMessage({
      type: 'metronome-click',
      timestamp: Date.now()
    })
  }

  // Session recording
  async startRecording() {
    if (!this.audioContext) return

    const dest = this.audioContext.createMediaStreamDestination()
    
    // Connect all audio sources to recorder
    this.audioNodes.forEach((nodes, key) => {
      if (nodes.gain) {
        nodes.gain.connect(dest)
      }
    })

    this.mediaRecorder = new MediaRecorder(dest.stream, {
      mimeType: 'audio/webm;codecs=opus'
    })

    this.recordedChunks = []
    
    this.mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        this.recordedChunks.push(event.data)
      }
    }

    this.mediaRecorder.start(1000) // Collect data every second
    return { recording: true }
  }

  async stopRecording() {
    return new Promise((resolve) => {
      if (!this.mediaRecorder) {
        resolve(null)
        return
      }

      this.mediaRecorder.onstop = () => {
        const blob = new Blob(this.recordedChunks, { type: 'audio/webm' })
        const url = URL.createObjectURL(blob)
        resolve({ blob, url })
      }

      this.mediaRecorder.stop()
    })
  }

  // Chord progression sync
  broadcastChordProgression(progression) {
    this.sendMessage({
      type: 'chord-progression',
      progression,
      timestamp: Date.now()
    })
  }

  // Tablature sharing
  shareTablature(tab) {
    this.sendMessage({
      type: 'tablature',
      tab,
      timestamp: Date.now()
    })
  }

  // Practice loop sync
  startLoopSync(loopData) {
    this.sendMessage({
      type: 'loop-start',
      loopData,
      timestamp: Date.now()
    })
  }

  // Chat
  sendChat(message) {
    this.sendMessage({
      type: 'chat',
      message,
      timestamp: Date.now()
    })
  }

  // Session settings
  updateSessionSettings(settings) {
    this.sendMessage({
      type: 'session-settings',
      settings,
      timestamp: Date.now()
    })
  }

  // Event callbacks
  on(event, callback) {
    if (!this.sessionCallbacks.has(event)) {
      this.sessionCallbacks.set(event, [])
    }
    this.sessionCallbacks.get(event).push(callback)
  }

  off(event, callback) {
    if (this.sessionCallbacks.has(event)) {
      const callbacks = this.sessionCallbacks.get(event)
      const index = callbacks.indexOf(callback)
      if (index > -1) {
        callbacks.splice(index, 1)
      }
    }
  }

  triggerCallback(event, data) {
    if (this.sessionCallbacks.has(event)) {
      this.sessionCallbacks.get(event).forEach(callback => callback(data))
    }
  }

  // Demo mode simulation
  simulateConnection() {
    // Simulate periodic events in demo mode
    setInterval(() => {
      if (this.currentSession) {
        this.triggerCallback('audioLevel', {
          userId: 'demo-user',
          level: Math.random() * 100
        })
      }
    }, 100)
  }

  // Cleanup
  leaveSession() {
    // Close all peer connections
    this.peerConnections.forEach((pc, userId) => {
      pc.close()
    })
    this.peerConnections.clear()

    // Stop local stream
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => track.stop())
      this.localStream = null
    }

    // Stop metronome
    this.stopMetronome()

    // Clear audio nodes
    this.audioNodes.forEach(nodes => {
      if (nodes.source) nodes.source.disconnect()
      if (nodes.gain) nodes.gain.disconnect()
    })
    this.audioNodes.clear()

    this.currentSession = null
    
    this.sendMessage({ type: 'leave-session' })
  }

  disconnect() {
    this.leaveSession()
    
    if (this.ws) {
      this.ws.close()
      this.ws = null
    }

    if (this.audioContext) {
      this.audioContext.close()
      this.audioContext = null
    }

    this.isConnected = false
  }

  cleanup() {
    this.disconnect()
  }
}

// Singleton instance
const multiplayerService = new MultiplayerService()

export default multiplayerService
export { multiplayerService }
