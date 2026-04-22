import '../styles/layout.css';
import '../styles/Home.css';
import Layout from '../components/layout';
import useEmblaCarousel from 'embla-carousel-react';
import AutoScroll from 'embla-carousel-auto-scroll';

function Home() {
    const [emblaRef] = useEmblaCarousel({ loop: true }, [
        AutoScroll({ speed: 1, stopOnInteraction: false, stopOnMouseEnter: true })
    ]);

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
                                <img src="https://via.placeholder.com/80x80" alt="Game D" />
                                <div className='game-info'><h3>Game E</h3></div>
                                <a href='/games-e'>Oyna</a>
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
            </div>
        </Layout>
    )
}

export default Home