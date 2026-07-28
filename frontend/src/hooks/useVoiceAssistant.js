import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Voice Assistant Hook - Siri/Google Assistant-like functionality
 * Features: Wake word detection, continuous listening, voice commands
 */
export const useVoiceAssistant = (enabled = true, onCommand) => {
    const [isListening, setIsListening] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [error, setError] = useState(null);
    const [isSupported, setIsSupported] = useState(false);

    const recognitionRef = useRef(null);
    const isWaitingForWakeWord = useRef(true);

    // Check browser support
    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        setIsSupported(!!SpeechRecognition);
    }, []);

    // Initialize Speech Recognition
    const initRecognition = useCallback(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            setError('Speech recognition not supported in this browser');
            return null;
        }

        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        // Use English-India as primary - it recognizes both English and Hinglish well
        // Hindi words will still be recognized but transcribed in Roman script
        recognition.lang = 'en-IN';

        recognition.onstart = () => {
            setIsListening(true);
            setError(null);
        };

        recognition.onend = () => {
            // Auto-restart if still enabled and not processing
            if (enabled && !isProcessing && isListening) {
                try {
                    recognition.start();
                } catch (e) {
                    console.log('Recognition restart prevented:', e);
                }
            } else {
                setIsListening(false);
            }
        };

        recognition.onerror = (event) => {
            if (event.error === 'no-speech') {
                // Ignore no-speech errors in continuous mode
                return;
            }
            if (event.error === 'aborted') {
                // Normal when stopping
                return;
            }
            console.error('Speech recognition error:', event.error);
            setError(`Error: ${event.error}`);

            // Don't restart on permission errors
            if (event.error === 'not-allowed') {
                setIsListening(false);
            }
        };

        recognition.onresult = (event) => {
            const current = event.resultIndex;
            const transcriptText = event.results[current][0].transcript;
            const isFinal = event.results[current].isFinal;

            // Update transcript
            setTranscript(transcriptText);

            if (isFinal) {
                handleFinalTranscript(transcriptText.trim());
            }
        };

        return recognition;
    }, [enabled, isProcessing, isListening]);

    // Handle final transcript
    const handleFinalTranscript = useCallback((text) => {
        const lowerText = text.toLowerCase();

        // Wake word variations - check on EVERY query
        const wakeWords = [
            'hey sahayak', 'hi sahayak', 'hello sahayak',
            'okay sahayak', 'ok sahayak', 'sahayak',
            'hey saahaayak', 'hi saahaayak', 'hello saahaayak',
            'hey sahaya', 'he sahayak', 'hey sahaayak', 'a sahayak'
        ];

        // Check if wake word is present
        const foundWakeWord = wakeWords.find(word => lowerText.includes(word));

        // If waiting for wake word and no wake word found, ignore
        if (isWaitingForWakeWord.current && !foundWakeWord) {
            console.log('Waiting for wake word, ignoring:', text);
            return;
        }

        // Extract command after wake word (if present)
        let command = text;
        if (foundWakeWord) {
            console.log('Wake word detected:', foundWakeWord);
            isWaitingForWakeWord.current = false;
            // Remove wake word from command
            wakeWords.forEach(word => {
                command = command.replace(new RegExp(word, 'gi'), '').trim();
            });
        }

        // If only wake word was said (no actual command), just activate
        if (!command || command.length < 2) {
            console.log('Just wake word, waiting for command...');
            setIsProcessing(false);
            setTranscript('I\'m listening...');
            return;
        }

        // Process the command
        setIsProcessing(true);
        processCommand(command);
    }, []);

    // Process voice commands
    const processCommand = useCallback((command) => {
        const lowerCommand = command.toLowerCase();
        console.log('Processing command:', command);

        // Built-in commands
        if (lowerCommand.includes('stop listening') || lowerCommand === 'stop' || lowerCommand === 'ruk jao') {
            stopListening();
            onCommand?.({ type: 'stop', text: command });
            return;
        }

        if (lowerCommand.includes('clear chat') || lowerCommand.includes('clear messages') || lowerCommand.includes('chat delete')) {
            onCommand?.({ type: 'clear', text: command });
            resetToWakeWord();
            return;
        }

        if (lowerCommand.startsWith('send message') || lowerCommand.startsWith('search for')) {
            const query = command.replace(/send message|search for|search/gi, '').trim();
            onCommand?.({ type: 'send', text: query || command });
            resetToWakeWord();
            return;
        }

        // Default: treat everything else as a query to the AI
        console.log('Sending as query:', command);
        onCommand?.({ type: 'query', text: command });
        // Don't reset to wake word - stay in active listening mode
        setIsProcessing(false);
        setTranscript('Listening...');
    }, [onCommand]);

    // Reset to ready state (continue listening without wake word)
    const resetToWakeWord = useCallback(() => {
        // Keep listening active for continuous conversation
        isWaitingForWakeWord.current = false;
        setIsProcessing(false);
        setTranscript('Listening...');
    }, []);

    // Start listening
    const startListening = useCallback(() => {
        if (!isSupported) {
            setError('Speech recognition not supported');
            return;
        }

        if (!recognitionRef.current) {
            recognitionRef.current = initRecognition();
        }

        if (recognitionRef.current && !isListening) {
            try {
                // When manually activated via button, skip wake word requirement
                // User can speak their query immediately
                isWaitingForWakeWord.current = false;
                setTranscript('Listening... speak now');
                console.log('Voice assistant started - ready for query');
                recognitionRef.current.start();
            } catch (error) {
                console.error('Error starting recognition:', error);
                setError('Could not start voice recognition');
            }
        }
    }, [isSupported, isListening, initRecognition]);

    // Stop listening
    const stopListening = useCallback(() => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
            recognitionRef.current = null;
        }
        setIsListening(false);
        setIsProcessing(false);
        setTranscript('');
        isWaitingForWakeWord.current = true;
    }, []);

    // Toggle listening
    const toggleListening = useCallback(() => {
        if (isListening) {
            stopListening();
        } else {
            startListening();
        }
    }, [isListening, startListening, stopListening]);

    // Auto-start if enabled
    useEffect(() => {
        if (enabled && isSupported) {
            // Don't auto-start, wait for user activation
            return;
        }

        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
        };
    }, [enabled, isSupported]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
                recognitionRef.current = null;
            }
        };
    }, []);

    return {
        isListening,
        isProcessing,
        transcript,
        error,
        isSupported,
        startListening,
        stopListening,
        toggleListening,
        isWaitingForWakeWord: isWaitingForWakeWord.current,
    };
};
