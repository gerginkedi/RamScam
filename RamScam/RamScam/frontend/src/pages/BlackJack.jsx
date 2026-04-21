import { useState, useCallback } from 'react';
import Layout from '../components/layout';
import { useRam } from '../useRam';
import '../styles/Blackjack.css';
import '../styles/CoinFlip.css';

const SUITS = ['♠', '♥', '♦', '♣'];
const RANKS = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

function createDeck() {
    const deck = [];
    for (const suit of SUITS) {
        for (const rank of RANKS) {
            deck.push({ suit, rank });
        }
    }
    return deck.sort(() => Math.random() - 0.5);
}

function cardValue(rank) {
    if (['J', 'Q', 'K'].includes(rank)) return 10;
    if (rank === 'A') return 11;
    return parseInt(rank);
}

function handTotal(hand) {
    let total = hand.reduce((sum, c) => sum + cardValue(c.rank), 0);
    let aces = hand.filter(c => c.rank === 'A').length;
    while (total > 21 && aces > 0) {
        total -= 10;
        aces--;
    }
    return total;
}

function isRed(suit) {
    return suit === '♥' || suit === '♦';
}

function Card({ card, hidden }) {
    if (hidden) {
        return <div className='bj-card bj-card-hidden'>?</div>;
    }
    return (
        <div className={`bj-card ${isRed(card.suit) ? 'bj-card-red' : 'bj-card-black'}`}>
            <span className='bj-card-rank'>{card.rank}</span>
            <span className='bj-card-suit'>{card.suit}</span>
        </div>
    );
}

function Hand({ cards, hideSecond, label, total }) {
    return (
        <div className='bj-hand'>
            <div className='bj-hand-label'>
                {label} <span className='bj-total'>({total})</span>
            </div>
            <div className='bj-cards-row'>
                {cards.map((card, idx) => (
                    <Card key={idx} card={card} hidden={hideSecond && idx === 1} />
                ))}
            </div>
        </div>
    );
}

const PHASE = {
    BETTING: 'betting',
    PLAYING: 'playing',
    DONE: 'done',
};

function Blackjack() {
    const { ramBalance, addRam, removeRam } = useRam();

    const [showIntro, setShowIntro] = useState(() =>
        !sessionStorage.getItem('blackjack_intro_seen')
    );

    const [deck, setDeck] = useState([]);
    const [playerHand, setPlayerHand] = useState([]);
    const [dealerHand, setDealerHand] = useState([]);
    const [phase, setPhase] = useState(PHASE.BETTING);
    const [betAmount, setBetAmount] = useState('');
    const [betError, setBetError] = useState('');
    const [result, setResult] = useState(null);

    const handleIntroClose = () => {
        sessionStorage.setItem('blackjack_intro_seen', 'true');
        setShowIntro(false);
    };

    const handleBetInput = (e) => {
        setBetError('');
        setResult(null);
        const val = e.target.value;
        if (val === '' || /^\d+$/.test(val)) setBetAmount(val);
    };

    const deal = useCallback(() => {
        const bet = parseInt(betAmount);
        if (!betAmount || isNaN(bet) || bet <= 0) {
            setBetError('Geçerli bir miktar girin.');
            return;
        }
        if (bet > ramBalance) {
            setBetError('Yetersiz RAM bakiyesi.');
            return;
        }

        setBetError('');
        const freshDeck = createDeck();
        const p = [freshDeck[0], freshDeck[2]];
        const d = [freshDeck[1], freshDeck[3]];
        const remaining = freshDeck.slice(4);

        setDeck(remaining);
        setPlayerHand(p);
        setDealerHand(d);
        setResult(null);

        if (handTotal(p) === 21) {
            if (handTotal(d) === 21) {
                setResult('push');
            } else {
                addRam(Math.floor(bet * 1.5));
                setResult('blackjack');
            }
            setPhase(PHASE.DONE);
        } else {
            setPhase(PHASE.PLAYING);
        }
    }, [betAmount, ramBalance, addRam]);

    const hit = useCallback(() => {
        const newCard = deck[0];
        const newDeck = deck.slice(1);
        const newHand = [...playerHand, newCard];
        setDeck(newDeck);
        setPlayerHand(newHand);

        if (handTotal(newHand) > 21) {
            removeRam(parseInt(betAmount));
            setResult('lose');
            setPhase(PHASE.DONE);
        }
    }, [deck, playerHand, betAmount, removeRam]);

    const stand = useCallback(() => {
        const bet = parseInt(betAmount);
        let currentDeck = [...deck];
        let dHand = [...dealerHand];

        while (handTotal(dHand) < 17) {
            dHand.push(currentDeck[0]);
            currentDeck = currentDeck.slice(1);
        }

        setDealerHand(dHand);
        setDeck(currentDeck);

        const playerTotal = handTotal(playerHand);
        const dealerTotal = handTotal(dHand);

        if (dealerTotal > 21 || playerTotal > dealerTotal) {
            addRam(bet);
            setResult('win');
        } else if (playerTotal === dealerTotal) {
            setResult('push');
        } else {
            removeRam(bet);
            setResult('lose');
        }

        setPhase(PHASE.DONE);
    }, [deck, dealerHand, playerHand, betAmount, addRam, removeRam]);

    const reset = () => {
        setPhase(PHASE.BETTING);
        setPlayerHand([]);
        setDealerHand([]);
        setBetAmount('');
        setResult(null);
        setBetError('');
    };

    const playerTotal = handTotal(playerHand);
    const dealerTotal = handTotal(dealerHand);
    const isPlaying = phase === PHASE.PLAYING;
    const isDone = phase === PHASE.DONE;

    return (
        <div>
            {showIntro && (
                <div className='intro-blur'>
                    <div className='intro-box'>
                        <h2>Blackjack'e Hoş Geldiniz!</h2>
                        <p>
                            Amaç: Elinizdeki kartların toplamını 21'e yaklaştırmak,
                            ancak 21'i geçmemek.<br /><br />
                            <strong>Hit</strong> — Yeni kart al.<br />
                            <strong>Stand</strong> — Dur, dealer oynasın.<br /><br />
                            Dealer 17 ve üzerinde durmak zorundadır.<br />
                            Blackjack (A + 10'luk kart) bahsin 1.5 katı öder.<br />
                            21'i geçersen otomatik kaybedersin.
                        </p>
                        <button onClick={handleIntroClose}>Anladım</button>
                    </div>
                </div>
            )}

            <Layout>
                <div className='bj-root'>
                    <h1 className='bj-title'>Blackjack</h1>

                    {dealerHand.length > 0 && (
                        <Hand
                            cards={dealerHand}
                            hideSecond={isPlaying}
                            label='Dealer'
                            total={isPlaying ? cardValue(dealerHand[0].rank) : dealerTotal}
                        />
                    )}

                    {playerHand.length > 0 && (
                        <Hand
                            cards={playerHand}
                            hideSecond={false}
                            label='Sen'
                            total={playerTotal}
                        />
                    )}

                    {result && (
                        <div className={`bj-result bj-result-${result}`}>
                            {result === 'win'       && `Kazandın! +${betAmount} Chip`}
                            {result === 'blackjack' && `Blackjack! +${Math.floor(parseInt(betAmount) * 1.5)} Chip`}
                            {result === 'lose'      && `Kaybettin! -${betAmount} Chip`}
                            {result === 'push'      && `Berabere! Bahis iade edildi.`}
                        </div>
                    )}

                    {phase === PHASE.BETTING && (
                        <div className='bj-bet-area'>
                            <input
                                type='text'
                                inputMode='numeric'
                                placeholder='Bahis miktarı (Chip)'
                                value={betAmount}
                                onChange={handleBetInput}
                                className='bj-bet-input'
                            />
                            {betError && <span className='bj-bet-error'>{betError}</span>}
                            <button className='bj-btn' onClick={deal}>Dağıt</button>
                        </div>
                    )}

                    {isPlaying && (
                        <div className='bj-action-row'>
                            <button className='bj-btn' onClick={hit}>Hit</button>
                            <button className='bj-btn bj-btn-stand' onClick={stand}>Stand</button>
                        </div>
                    )}

                    {isDone && (
                        <button className='bj-btn bj-btn-reset' onClick={reset}>
                            Yeni El
                        </button>
                    )}
                </div>
            </Layout>
        </div>
    );
}

export default Blackjack;