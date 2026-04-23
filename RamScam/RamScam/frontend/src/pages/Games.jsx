import '../styles/layout.css';
import '../styles/index.css';
import '../styles/Games.css';
import Layout from '../components/layout';

const GAMES = [
    {
        id: 1,
        name: 'Coin Flip',
        description: 'Yazı mı tura mı? Şansını dene.',
        logo: '/images/coinflip-logo.png',
        href: '/games/coinflip',
        active: true,
    },
    {
        id: 2,
        name: 'Blackjack',
        description: '21\'e ulaş, dealer\'ı geç.',
        logo: '/images/blackjack-logo.png',
        href: '/games/blackjack',
        active: true,
    },
    {
        id: 3,
        name: 'Rulet',
        description: 'Çark dönüyor, şans seninle mi?',
        logo: null,
        href: null,
        active: false,
    },
    {
        id: 4,
        name: 'Mayın Tarlası',
        description: 'Her adım bir risk.',
        logo: null,
        href: null,
        active: false,
    },
];

function GameCard({ game }) {
    const card = (
        <div className={`gs-card ${!game.active ? 'gs-card-inactive' : ''}`}>
            <div className='gs-card-logo'>
                {game.logo
                    ? <img src={game.logo} alt={game.name} />
                    : <div className='gs-card-logo-placeholder'>?</div>
                }
            </div>
            <div className='gs-card-info'>
                <h3>{game.name}</h3>
                <p>{game.description}</p>
            </div>
            {!game.active && (
                <div className='gs-card-soon'>Yakında</div>
            )}
        </div>
    );

    if (game.active && game.href) {
        return <a href={game.href} className='gs-card-link'>{card}</a>;
    }
    return card;
}

function Games() {
    return (
        <Layout>
            <div className='games-root'>
                <h1 className='games-title'>Oyunlar</h1>
                <div className='games-active-section'>
                    <h2 className='games-section-label'>Aktif Oyunlar</h2>
                    <div className='games-grid'>
                        {GAMES.filter(g => g.active).map(g => (
                            <GameCard key={g.id} game={g} />
                        ))}
                    </div>
                </div>
                <div className='games-inactive-section'>
                    <h2 className='games-section-label'>Yakında</h2>
                    <div className='games-grid'>
                        {GAMES.filter(g => !g.active).map(g => (
                            <GameCard key={g.id} game={g} />
                        ))}
                    </div>
                </div>
            </div>
        </Layout>
    );
}

export default Games;