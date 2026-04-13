import '../styles/layout.css';
import '../styles/Home.css';
import Layout from '../components/layout';
import useEmblaCarousel from 'embla-carousel-react';
import AutoScroll from 'embla-carousel-auto-scroll';

function Home() {
    const [emblaRef] = useEmblaCarousel({ loop: true }, [
        AutoScroll({ speed: 1, stopOnInteraction: false, stopOnMouseEnter: true })
    ]);

    return (
        <Layout>
            <div className="top-games-swiper">
                <h2>Popüler Oyunlar</h2>
                <div className="embla" ref={emblaRef}>
                    <div className="embla__container">
                        <div className="embla__slide">
                            <div className="game-card">
                                <img src="https://via.placeholder.com/80x80" alt="Game A" />
                                <div className='game-info'><h3>Game A</h3></div>
                                <a href='/games-a'>Oyna</a>
                            </div>
                        </div>
                        <div className="embla__slide">
                            <div className="game-card">
                                <img src="https://via.placeholder.com/80x80" alt="Game B" />
                                <div className='game-info'><h3>Game B</h3></div>
                                <a href='/games-b'>Oyna</a>
                            </div>
                        </div>
                        <div className="embla__slide">
                            <div className="game-card">
                                <img src="https://via.placeholder.com/80x80" alt="Game C" />
                                <div className='game-info'><h3>Game C</h3></div>
                                <a href='/games-c'>Oyna</a>
                            </div>
                        </div>
                        <div className="embla__slide">
                            <div className="game-card">
                                <img src="https://via.placeholder.com/80x80" alt="Game D" />
                                <div className='game-info'><h3>Game D</h3></div>
                                <a href='/games-d'>Oyna</a>
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
                    <div className='game-card'>
                        <div className='side-info-container'>
                            <div className='game-info'><h3>Game A</h3></div>
                        </div>
                        <div className='middle-game-info-container'>
                            <div className='game-info'><h3>Game B</h3></div>
                            <div className='game-info'><h3>Game C</h3></div>
                        </div>
                        <div className='side-info-container'>
                            <div className='game-info'><h3>Game D</h3></div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='activity-feed'>
                <h2>Aktivite Kaydı</h2>
            </div>
        </Layout>
    )
}

export default Home