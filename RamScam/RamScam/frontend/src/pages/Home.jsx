import '../styles/layout.css';
import '../styles/Home.css';
import Layout from '../components/layout';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';


function Home() {
    return (
        <Layout>
            <div className="top-games-swiper">
                <h2>Top Games</h2>
                <Swiper 
                    modules={[Navigation]}
                    navigation
                    loop
                    spaceBetween={20}
                    slidesPerView={3}
                >   
                    <SwiperSlide>
                        <div className="game-card">
                            <img src="https://via.placeholder.com/300x150" alt="Game A" />
                            <div className='game-info'>
                                <h3>Game A</h3>
                            </div>
                            <button>Oyna</button>
                        </div>
                    </SwiperSlide>
                    <SwiperSlide>
                        <div className="game-card">
                            <img src="https://via.placeholder.com/300x150" alt="Game B" />
                            <div className='game-info'>
                                <h3>Game B</h3>
                            </div>
                            <button>Oyna</button>
                        </div>
                    </SwiperSlide>
                    <SwiperSlide>
                        <div className="game-card">
                            <img src="https://via.placeholder.com/300x150" alt="Game C" />
                            <div className='game-info'>
                                <h3>Game C</h3>
                            </div>
                            <button>Oyna</button>
                        </div>
                    </SwiperSlide>
                </Swiper>
            </div>
        </Layout>
    )
}

export default Home