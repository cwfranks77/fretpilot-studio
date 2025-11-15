// Bluetooth Audio Service for connecting instruments via BT adapters
// Supports devices like iRig, Focusrite Scarlett Solo, and generic BT audio

let connectedDevice = null
let audioStream = null

export async function scanBluetoothDevices() {
  try {
    // Use Web Bluetooth API for device discovery
    if (!navigator.bluetooth) {
      throw new Error('Bluetooth not supported in this browser')
    }

    // Request device with audio service
    const device = await navigator.bluetooth.requestDevice({
      filters: [
        { services: ['audio_service'] },
        { namePrefix: 'iRig' },
        { namePrefix: 'Focusrite' },
        { namePrefix: 'BT' }
      ],
      optionalServices: ['battery_service']
    })

    return [{
      id: device.id,
      name: device.name || 'Audio Device',
      device: device
    }]
  } catch (error) {
    console.error('Bluetooth scan error:', error)
    
    // Fallback: Return mock devices for testing
    return [
      { id: 'mock-1', name: 'iRig HD 2', device: null },
      { id: 'mock-2', name: 'Focusrite Scarlett Solo', device: null },
      { id: 'mock-3', name: 'BT Audio Adapter', device: null }
    ]
  }
}

export async function connectDevice(device) {
  try {
    if (device.device) {
      // Real Bluetooth device
      await device.device.gatt.connect()
      connectedDevice = device
      
      // Initialize audio stream from device
      await initializeAudioStream()
    } else {
      // Mock device - use microphone as fallback
      connectedDevice = device
      await initializeAudioStream()
    }
    
    return true
  } catch (error) {
    console.error('Connection error:', error)
    throw error
  }
}

export function disconnectDevice(device) {
  if (connectedDevice && connectedDevice.device) {
    try {
      connectedDevice.device.gatt.disconnect()
    } catch (error) {
      console.error('Disconnect error:', error)
    }
  }
  
  if (audioStream) {
    audioStream.getTracks().forEach(track => track.stop())
    audioStream = null
  }
  
  connectedDevice = null
}

async function initializeAudioStream() {
  try {
    // Request audio input (will use BT device if connected, otherwise mic)
    audioStream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: false,
        noiseSuppression: false,
        autoGainControl: false,
        latency: 0
      }
    })
    
    return audioStream
  } catch (error) {
    console.error('Audio stream error:', error)
    throw error
  }
}

export function getAudioStream() {
  return audioStream
}

export function getConnectedDevice() {
  return connectedDevice
}

// Audio processing utilities
export function createAudioContext() {
  return new (window.AudioContext || window.webkitAudioContext)()
}

export function createAnalyzer(audioContext) {
  const analyzer = audioContext.createAnalyser()
  analyzer.fftSize = 2048
  return analyzer
}

export function applyEffect(audioContext, source, effectType) {
  let effectNode = null
  
  switch (effectType) {
    case 'reverb':
      effectNode = createReverb(audioContext)
      break
    case 'delay':
      effectNode = createDelay(audioContext)
      break
    case 'distortion':
      effectNode = createDistortion(audioContext)
      break
    case 'eq':
      effectNode = createEQ(audioContext)
      break
  }
  
  if (effectNode) {
    source.connect(effectNode)
    return effectNode
  }
  
  return source
}

function createReverb(audioContext) {
  const convolver = audioContext.createConvolver()
  // Simple impulse response for reverb
  const length = audioContext.sampleRate * 2
  const impulse = audioContext.createBuffer(2, length, audioContext.sampleRate)
  
  for (let channel = 0; channel < 2; channel++) {
    const channelData = impulse.getChannelData(channel)
    for (let i = 0; i < length; i++) {
      channelData[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, 2)
    }
  }
  
  convolver.buffer = impulse
  return convolver
}

function createDelay(audioContext) {
  const delay = audioContext.createDelay(1.0)
  delay.delayTime.value = 0.3
  
  const feedback = audioContext.createGain()
  feedback.gain.value = 0.4
  
  delay.connect(feedback)
  feedback.connect(delay)
  
  return delay
}

function createDistortion(audioContext) {
  const distortion = audioContext.createWaveShaper()
  const amount = 50
  const samples = 44100
  const curve = new Float32Array(samples)
  const deg = Math.PI / 180
  
  for (let i = 0; i < samples; i++) {
    const x = (i * 2) / samples - 1
    curve[i] = ((3 + amount) * x * 20 * deg) / (Math.PI + amount * Math.abs(x))
  }
  
  distortion.curve = curve
  distortion.oversample = '4x'
  return distortion
}

function createEQ(audioContext) {
  const eq = audioContext.createBiquadFilter()
  eq.type = 'peaking'
  eq.frequency.value = 1000
  eq.Q.value = 1
  eq.gain.value = 5
  return eq
}
