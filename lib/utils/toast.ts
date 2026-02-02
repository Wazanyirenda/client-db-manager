import { toast as sonnerToast } from 'sonner';

// Sound generation functions using Web Audio API
let audioContext: AudioContext | null = null;

const getAudioContext = () => {
  if (!audioContext) {
    try {
      audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch (error) {
      console.debug('Audio context not available');
      return null;
    }
  }
  
  // Resume audio context if suspended (required by some browsers)
  if (audioContext.state === 'suspended') {
    audioContext.resume().catch(() => {
      // Silently fail if resume fails
    });
  }
  
  return audioContext;
};

const playSound = (frequency: number, duration: number, type: 'success' | 'error' | 'info' = 'success') => {
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    // Different waveforms for different toast types
    oscillator.type = type === 'success' ? 'sine' : type === 'error' ? 'sawtooth' : 'triangle';
    oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);

    // Envelope for smoother sound
    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + duration);
  } catch (error) {
    // Silently fail if sound cannot be played
    console.debug('Sound playback failed');
  }
};

const playSuccessSound = () => {
  // Pleasant ascending tone
  playSound(523.25, 0.15, 'success'); // C5
  setTimeout(() => playSound(659.25, 0.15, 'success'), 100); // E5
};

const playErrorSound = () => {
  // Lower, descending tone
  playSound(392, 0.2, 'error'); // G4
  setTimeout(() => playSound(311, 0.2, 'error'), 150); // D#4
};

const playInfoSound = () => {
  // Neutral tone
  playSound(440, 0.15, 'info'); // A4
};

// Custom toast wrapper with sounds
export const toast = {
  success: (message: string, options?: Parameters<typeof sonnerToast.success>[1]) => {
    playSuccessSound();
    return sonnerToast.success(message, {
      duration: 4000,
      style: {
        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        color: 'white',
        border: 'none',
        borderRadius: '12px',
        boxShadow: '0 10px 25px -5px rgba(16, 185, 129, 0.3), 0 8px 10px -6px rgba(16, 185, 129, 0.2)',
        padding: '16px 20px',
        fontSize: '14px',
        fontWeight: '500',
      },
      ...options,
    });
  },
  error: (message: string, options?: Parameters<typeof sonnerToast.error>[1]) => {
    playErrorSound();
    return sonnerToast.error(message, {
      duration: 5000,
      style: {
        background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
        color: 'white',
        border: 'none',
        borderRadius: '12px',
        boxShadow: '0 10px 25px -5px rgba(239, 68, 68, 0.3), 0 8px 10px -6px rgba(239, 68, 68, 0.2)',
        padding: '16px 20px',
        fontSize: '14px',
        fontWeight: '500',
      },
      ...options,
    });
  },
  info: (message: string, options?: Parameters<typeof sonnerToast.info>[1]) => {
    playInfoSound();
    return sonnerToast.info(message, {
      duration: 4000,
      style: {
        background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
        color: 'white',
        border: 'none',
        borderRadius: '12px',
        boxShadow: '0 10px 25px -5px rgba(59, 130, 246, 0.3), 0 8px 10px -6px rgba(59, 130, 246, 0.2)',
        padding: '16px 20px',
        fontSize: '14px',
        fontWeight: '500',
      },
      ...options,
    });
  },
  warning: (message: string, options?: Parameters<typeof sonnerToast.warning>[1]) => {
    playInfoSound(); // Use info sound for warnings
    return sonnerToast.warning(message, {
      duration: 4500,
      style: {
        background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
        color: 'white',
        border: 'none',
        borderRadius: '12px',
        boxShadow: '0 10px 25px -5px rgba(245, 158, 11, 0.3), 0 8px 10px -6px rgba(245, 158, 11, 0.2)',
        padding: '16px 20px',
        fontSize: '14px',
        fontWeight: '500',
      },
      ...options,
    });
  },
  // Expose other sonner methods
  promise: sonnerToast.promise,
  loading: sonnerToast.loading,
  dismiss: sonnerToast.dismiss,
  custom: sonnerToast.custom,
};

