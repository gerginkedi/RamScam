import '../styles/layout.css';
import '../styles/Home.css';
import Layout from '../components/layout';
import useEmblaCarousel from 'embla-carousel-react';
import AutoScroll from 'embla-carousel-auto-scroll';
import { getActivities } from '../utils/activity';
import { useEffect, useState } from 'react';

function Home() {
    const [emblaRef] = useEmblaCarousel({ loop: true }, [
        AutoScroll({ speed: 1, stopOnInteraction: false, stopOnMouseEnter: true })
    ]);

    const [activities, setActivities] = useState(getActivities());

    useEffect(() => {
        const interval = setInterval(() => {
            setActivities(getActivities());
        }, 60000);
        return () => clearInterval(interval);
    }, []);

    const formatActivity = (a) => {
        const time = new Date(a.timestamp).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
        if (a.result === 'win') return `${a.game}'de +${a.amount} Chip kazandın • ${time}`;
        if (a.result === 'blackjack') return `${a.game}'de Blackjack! +${a.amount} Chip • ${time}`;
        if (a.result === 'lose') return `${a.game}'de -${a.amount} Chip kaybettin • ${time}`;
        if (a.result === 'push') return `${a.game}'de berabere • ${time}`;
        return '';
    };

    const FOR_YOU_GAMES = [
    { name: 'Coin Flip', href: '/games/coinflip', logo: '/images/coinflip-logo.png' },
    { name: 'Blackjack', href: '/games/blackjack', logo: '/images/blackjack-logo.png' },
];

    // Seed ile karıştırır — her kullanıcıya farklı ama tutarlı sıra (Sunum icin gecici cozum)
    const seededShuffle = (arr) => {
        const token = localStorage.getItem('token') || 'guest';
        let seed = token.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
        const result = [...arr];
        for (let i = result.length - 1; i > 0; i--) {
            seed = (seed * 1664525 + 1013904223) & 0x7fffffff;
            const j = seed % (i + 1);
            [result[i], result[j]] = [result[j], result[i]];
        }
        return result;
    };

    const shuffled = seededShuffle(FOR_YOU_GAMES);

    return (
        <Layout>
            <div className="top-games-swiper">
                <h2>Popüler Oyunlar</h2>
                <div className="embla" ref={emblaRef}>
                    <div className="embla__container">
                        <div className="embla__slide">
                            <div className="game-card">
                                <img src="/images/coinflip-logo.png" alt="Coinflip" className='coinflip-logo'/>
                                <div className='game-info'><h3>Coinflip</h3></div>
                                <a href='/games/coinflip'>Oyna</a>
                            </div>
                        </div>
                        <div className="embla__slide">
                            <div className="game-card">
                                <img src="/images/blackjack-logo.png" alt="Blackjack" className='blackjack-logo'/>
                                <div className='game-info'><h3>Blackjack</h3></div>
                                <a href='/games/blackjack'>Oyna</a>
                            </div>
                        </div>
                        <div className="embla__slide">
                            <div className="game-card">
                                <img src="/images/roulette-logo.png" alt="Rulet" className='roulette-logo' />
                                <div className='game-info'><h3>Rulet</h3></div>
                                <a href='/games/roulette'>Oyna</a>
                            </div>
                        </div>
                        <div className="embla__slide">
                            <div className="game-card">
                                <img src="/images/minesweeper-logo.png" alt="Mayın Tarlası" className='minesweeper-logo'/>
                                <div className='game-info'><h3>Mayın Tarlası</h3></div>
                                <a href='/games/minesweeper'>Oyna</a>
                            </div>
                        </div>
                        <div className="embla__slide">
                            <div className="game-card">
                                <img src="/images/rock-paper-scissors-logo.png" alt="Taş Kağıt Makas" className='rock-paper-scissors-logo'/>
                                <div className='game-info'><h3>Taş Kağıt Makas</h3></div>
                                <a href='/games/rock-paper-scissors'>Oyna</a>
                            </div>
                        </div>                        
                    </div>
                </div>
            </div>
            <div className='for-you'>
                <h2>Senin İçin</h2>
                <div className='game-list'>
                    {shuffled.map((game, idx) => (
                        <a key={idx} href={game.href} className='fy-card'>
                            <img src={game.logo} alt={game.name} />
                            <div className='game-info'><h3>{game.name}</h3></div>
                            <span>Oyna</span>
                        </a>
                    ))}
                </div>
            </div>
            <div className='activity-feed'>
                <h2>Aktivite Kaydı</h2>
                {activities.length === 0 ? (
                    <p className='activity-empty'>Henüz aktivite yok. Oynamaya başla!</p>
                ) : (
                    <div className='activity-list'>
                        {activities.map((a, idx) => (
                            <div key={idx} className={`activity-card activity-${a.result}`}>
                                {formatActivity(a)}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </Layout>
    )
}

export default Home