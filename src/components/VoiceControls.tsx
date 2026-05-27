import { useState, useEffect } from 'react';
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { VoiceRecognition, VoiceSynthesis } from '@/utils/voice';
import { useToast } from '@/hooks/use-toast';

interface VoiceControlsProps {
  onTranscript: (text: string) => void;
  speakText?: string;
  autoListen?: boolean;
}

const VoiceControls = ({ onTranscript, speakText, autoListen = false }: VoiceControlsProps) => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(true);
  const [recognition] = useState(() => new VoiceRecognition());
  const [synthesis] = useState(() => new VoiceSynthesis());
  const [interimText, setInterimText] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    if (!recognition.isSupported()) {
      toast({
        title: 'Voice not supported',
        description: 'Your browser does not support voice recognition',
        variant: 'destructive',
      });
    }

    // Load voices when they're ready
    if (synthesis.isSupported()) {
      const loadVoices = () => {
        const voices = synthesis.getVoices();
        if (voices.length > 0) {
          const englishVoice = voices.find(v => v.lang.startsWith('en'));
          if (englishVoice) {
            synthesis.setVoice(englishVoice);
          }
        }
      };

      loadVoices();
      window.speechSynthesis?.addEventListener('voiceschanged', loadVoices);

      return () => {
        window.speechSynthesis?.removeEventListener('voiceschanged', loadVoices);
      };
    }
  }, [recognition, synthesis, toast]);

  useEffect(() => {
    if (speakText && ttsEnabled && synthesis.isSupported()) {
      setIsSpeaking(true);
      synthesis.speak(speakText, () => {
        setIsSpeaking(false);
        if (autoListen) {
          handleStartListening();
        }
      });
    }
    return () => {
      synthesis.stop();
      setIsSpeaking(false);
    };
  }, [speakText, ttsEnabled]);

  const handleStartListening = () => {
    if (!recognition.isSupported()) return;

    const started = recognition.start(
      (text, isFinal) => {
        setInterimText(text);
        if (isFinal) {
          onTranscript(text);
          setInterimText('');
          // Auto-stop after getting final result
          setTimeout(() => {
            recognition.stop();
            setIsListening(false);
          }, 1500);
        }
      },
      (error) => {
        toast({
          title: 'Voice error',
          description: error,
          variant: 'destructive',
        });
        setIsListening(false);
      }
    );

    if (started) {
      setIsListening(true);
    }
  };

  const handleStopListening = () => {
    recognition.stop();
    setIsListening(false);
    setInterimText('');
  };

  const toggleTTS = () => {
    if (isSpeaking) {
      synthesis.stop();
      setIsSpeaking(false);
    }
    setTtsEnabled(!ttsEnabled);
  };

  if (!recognition.isSupported() && !synthesis.isSupported()) {
    return null;
  }

  return (
    <div className="flex items-center gap-2">
      {/* Voice Recognition Button */}
      {recognition.isSupported() && (
        <div className="relative">
          <Button
            variant={isListening ? 'default' : 'outline'}
            size="icon"
            onClick={isListening ? handleStopListening : handleStartListening}
            className={isListening ? 'animate-pulse bg-accent hover:bg-accent/90' : ''}
          >
            {isListening ? (
              <Mic className="w-4 h-4" />
            ) : (
              <MicOff className="w-4 h-4" />
            )}
          </Button>
          
          {/* Interim transcript indicator */}
          {interimText && (
            <div className="absolute bottom-full left-0 mb-2 px-3 py-1 bg-muted rounded-lg text-xs text-muted-foreground whitespace-nowrap">
              {interimText}
            </div>
          )}
        </div>
      )}

      {/* Text-to-Speech Toggle */}
      {synthesis.isSupported() && (
        <Button
          variant={ttsEnabled ? 'default' : 'outline'}
          size="icon"
          onClick={toggleTTS}
          className={isSpeaking ? 'animate-pulse' : ''}
        >
          {ttsEnabled ? (
            <Volume2 className="w-4 h-4" />
          ) : (
            <VolumeX className="w-4 h-4" />
          )}
        </Button>
      )}
    </div>
  );
};

export default VoiceControls;
