import { useState, useCallback, useEffect } from 'react';
import Layout from '../components/layout';
import { useRam } from '../useRam';
import { useBuffs } from '../useBuffs';
import { useShards } from '../useShards';
import { addActivity } from '../utils/activity';
import { useNavigate } from 'react-router-dom';
import '../styles/RockPaperScissors.css';
import '../styles/CoinFlip.css'; // Intro modal still uses CoinFlip styles

const CHOICES = [
    { id: 'rock', label: 'Taş', icon: '✊' },
    { id: 'paper', label: 'Kağıt', icon: '✋' },
    { id: 'scissors', label: 'Makas', icon: '✌️' }
];

export default function RockPaperScissors() {
    const { ramBalance, addRam, removeRam } = useRam();
    const { hasBuff, consumeBuff } = useBuffs();
    const { addShardFromWin } = useShards();
    const [betAmount, setBetAmount] = useState('');
    const [userChoice, setUserChoice] = useState(null);
    const [cpuChoice, setCpuChoice] = useState(null);
    const [outcome, setOutcome] = useState(null); // 'win', 'lose', 'draw'
    const [isAnimating, setIsAnimating] = useState(false);
    const [error, setError] = useState('');
    const [showIntro, setShowIntro] = useState(() => !sessionStorage.getItem('rps_intro_seen'));

    const handlePlay = (choice) => {
        const bet = parseInt(betAmount);
        if (!betAmount || isNaN(bet) || bet <= 0) {
            setError('Lütfen geçerli bir miktar girin.');
            return;
        }
        if (bet > ramBalance) {
            setError('Yetersiz RAM bakiyesi.');
            return;
        }

        setError('');
        setUserChoice(choice);
        setIsAnimating(true);
        setOutcome(null);
        setCpuChoice(null);

        // Simulate thinking time
        setTimeout(() => {
            const cpu = CHOICES[Math.floor(Math.random() * CHOICES.length)];
            setCpuChoice(cpu);

            let result;
            if (choice.id === cpu.id) {
                result = 'draw';
            } else if (
                (choice.id === 'rock' && cpu.id === 'scissors') ||
                (choice.id === 'paper' && cpu.id === 'rock') ||
                (choice.id === 'scissors' && cpu.id === 'paper')
            ) {
                result = 'win';
            } else {
                result = 'lose';
            }

            setOutcome(result);
            setIsAnimating(false);

            // Handle Rewards/Losses
            if (result === 'win') {
                const chipGain = hasBuff('CHIP_BOOST') ? Math.floor(bet * 1.5) : bet;
                addRam(chipGain);
                if (hasBuff('CHIP_BOOST')) consumeBuff('CHIP_BOOST');

                const shardMult = hasBuff('SHARD_BOOST') ? 1.2 : 1;
                addShardFromWin(chipGain, shardMult);
                if (hasBuff('SHARD_BOOST')) consumeBuff('SHARD_BOOST');

                addActivity('Taş Kağıt Makas', 'win', chipGain);
            } else if (result === 'lose') {
                if (hasBuff('JOKER')) {
                    consumeBuff('JOKER');
                    addActivity('Taş Kağıt Makas', 'push', 0);
                    setOutcome('draw');
                } else {
                    const ramLoss = hasBuff('RAM_SHIELD') ? Math.floor(bet * 0.5) : bet;
                    removeRam(ramLoss);
                    if (hasBuff('RAM_SHIELD')) consumeBuff('RAM_SHIELD');
                    addActivity('Taş Kağıt Makas', 'lose', ramLoss);
                }
            } else {
                addActivity('Taş Kağıt Makas', 'push', 0);
            }
        }, 800);
    };

    const handleIntroClose = () => {
        sessionStorage.setItem('rps_intro_seen', 'true');
        setShowIntro(false);
    };

    return (
        <Layout>
            {showIntro && (
                <div className='intro-blur'>
                    <div className='intro-box'>
                        <h2>Taş Kağıt Makas</h2>
                        <p>Klasik Taş Kağıt Makas oyunu. Rakibini yen ve RAM'ini katla! Buff'lar bu oyunda da geçerlidir.</p>
                        <button onClick={handleIntroClose}>Anladım</button>
                    </div>
                </div>
            )}

            <div className='rps-container'>
                <h1 className='rps-title'>Taş Kağıt Makas</h1>

                <div className='rps-game-board'>
                    <div className='rps-result-display'>
                        <div className='rps-side'>
                            <span className='rps-side-label'>Senin Seçimin</span>
                            <span className='rps-side-choice'>{userChoice?.icon || '❓'}</span>
                        </div>
                        <div className='rps-side'>
                            <span className='rps-side-label'>Rakibinin Seçimi</span>
                            <span className='rps-side-choice'>{isAnimating ? '♻️' : (cpuChoice?.icon || '❓')}</span>
                        </div>
                    </div>

                    <div className={`rps-outcome ${outcome}`}>
                        {outcome === 'win' && 'KAZANDIN! 🎉'}
                        {outcome === 'lose' && 'KAYBETTİN... 💀'}
                        {outcome === 'draw' && 'BERABERE 👋'}
                    </div>

                    <div className='rps-choices'>
                        {CHOICES.map(choice => (
                            <button
                                key={choice.id}
                                className={`rps-choice-btn ${userChoice?.id === choice.id ? 'selected' : ''}`}
                                onClick={() => handlePlay(choice)}
                                disabled={isAnimating}
                            >
                                <span className='rps-icon'>{choice.icon}</span>
                                <span className='rps-label'>{choice.label}</span>
                            </button>
                        ))}
                    </div>

                    <div className='rps-bet-section'>
                        <input
                            type='text'
                            inputMode='numeric'
                            placeholder='Bahis tutarı'
                            className='rps-bet-input'
                            value={betAmount}
                            onChange={(e) => setBetAmount(e.target.value.replace(/\D/g, ''))}
                            disabled={isAnimating}
                        />
                        {error && <div className='rps-error'>{error}</div>}
                    </div>
                </div>
            </div>
        </Layout>
    );
}
